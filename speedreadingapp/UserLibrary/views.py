from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, action
from firebase_admin import firestore
from django.conf import settings
from users.models import UserProfile
from .models import Book
from .serializers import BookSerializer
from django.shortcuts import redirect
from rest_framework_simplejwt.authentication import JWTAuthentication

from bs4 import BeautifulSoup
from ebooklib import epub
from PyPDF2 import PdfReader

import requests
import json
import re
import chardet
import ebooklib
import tempfile

MAX_UPLOAD_SIZE = 5 * 1024 * 1024 * 1024
CHUNK_SIZE = 1024 * 512

db = settings.FIRESTORE_DB

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    @action(detail=False, methods=['get'])
    def library(self, request):
        user_id = request.user.id
        books_ref = db.collection('users').document(str(user_id)).collection('library')
        books = [{'id': doc.id, **doc.to_dict()} for doc in books_ref.stream()]
        return Response(books)

    @action(detail=False, methods=['post'])
    def add_text(self, request):
        try:
            title = request.data.get('title')
            text = request.data.get('text')

            if not title or not text:
                return Response({"error": "Title and text are required."}, status=status.HTTP_400_BAD_REQUEST)

            user_id = request.user.id
            new_text_ref = db.collection('users').document(str(user_id)).collection('library').add({
                'title': title,
                'text': text
            })

            return Response({"message": "Text added successfully.", "id": new_text_ref.id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ImportFromURLView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        url = request.data.get('url')
        title = request.data.get('title')
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')

            for script in soup(["script", "style", "img", "video", "audio"]):
                script.decompose()

            text_content = soup.get_text(separator='\n')
            text_content = filter_text(text_content)

            return Response({'title': title, 'text_content': text_content})
        except requests.exceptions.RequestException as e:
            return Response({"error": f'Error importing text: {e}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SaveImportedTextView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        title = request.data.get('title')
        text_content = request.data.get('text_content')
        user_id = request.user.id
        if not title or not text_content:
            return Response({'error': 'Title and text content are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            chunks = [text_content[i:i + CHUNK_SIZE] for i in range(0, len(text_content), CHUNK_SIZE)]
            book_ref = db.collection('users').document(str(user_id)).collection('library').document()
            book_id = book_ref.id

            for index, chunk in enumerate(chunks):
                book_ref.collection('chunks').document(str(index)).set({'content': chunk})

            book_ref.set({
                'title': title,
                'current_block': 0,
                'current_position': 0,
                'total_blocks': len(chunks)
            })

            return Response({'message': 'Text saved successfully!'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': f'Error saving text: {e}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ImportFromFileView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        try:
            title = request.data.get('title')
            file = request.FILES.get('file')

            if not file:
                return Response({'error': 'No file uploaded.'}, status=status.HTTP_400_BAD_REQUEST)

            user_id = request.user.id
            book_ref = db.collection('users').document(str(user_id)).collection('library').document()
            book_id = book_ref.id


            file_chunks = []
            if file.name.endswith('.txt'):
                file_chunks = chunk_text_file(file)
            elif file.name.endswith('.pdf'):
                file_chunks = chunk_pdf_file(file)
            elif file.name.endswith('.epub'):
                file_chunks = chunk_epub_file(file)
            else:
                return Response({'error': 'Unsupported file type.'}, status=status.HTTP_400_BAD_REQUEST)

            total_size = sum(len(chunk) for chunk in file_chunks)
            if total_size > MAX_UPLOAD_SIZE:
                return Response({'error': 'File exceeds the maximum allowed size of 5 GiB.'}, status=status.HTTP_400_BAD_REQUEST)

            for index, chunk in enumerate(file_chunks):
                chunk_data = {
                    'content': chunk,
                    'chunk_index': index,
                }
                book_ref.collection('chunks').document(str(index)).set(chunk_data)

            book_ref.set({
                'title': title,
                'current_block': 0,
                'current_position': 0,
                'total_blocks': len(file_chunks)
            })

            return Response({'text': file_chunks[0], 'title': title}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SpeedReadView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, text_id):
        try:
            user_id = request.user.id
            user_ref = db.collection('users').document(str(user_id))
            text_ref = user_ref.collection('library').document(text_id)

            text_snapshot = text_ref.get()
            if not text_snapshot.exists:
                return Response({"error": "Text not found"}, status=status.HTTP_404_NOT_FOUND)

            text_data = text_snapshot.to_dict()
            current_block = text_data.get('current_block', 0)
            chunks_ref = text_ref.collection('chunks')
            chunks_snapshot = chunks_ref.get()

            chunks = [chunk.to_dict()['content'] for chunk in chunks_snapshot]
            content = chunks[current_block]

            if current_block > 0:
                content = chunks[current_block - 1] + content
            if current_block < len(chunks) - 1:
                content += chunks[current_block + 1]

            title = text_data.get('title', 'Speed Reading')

            user_profile = UserProfile.objects.get(user=request.user)
            settings = {
                'wpm': user_profile.wpm,
                'chunk_size': user_profile.chunk_size,
                'font_size': user_profile.font_size,
                'text_color': user_profile.text_color,
                'background_color': user_profile.background_color
            }

            return Response({
                'text': content,
                'title': title,
                'current_block': current_block,
                'total_blocks': len(chunks),
                'current_position': text_data.get('current_position', 0)
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DeleteBookView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def delete(self, request, book_id):
        user_id = request.user.id
        book_ref = db.collection('users').document(str(user_id)).collection('library').document(book_id)
        try:
            chunks_ref = book_ref.collection('chunks')
            chunks = chunks_ref.get()
            for chunk in chunks:
                chunks_ref.document(chunk.id).delete()

            book_ref.delete()
            return Response({'status': 'success'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'status': 'failed', 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class EditBookView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, book_id):
        user_id = request.user.id
        book_ref = db.collection('users').document(str(user_id)).collection('library').document(book_id)

        try:
            book_data = book_ref.get().to_dict()
            current_block = book_data.get('current_block', 0)
            total_blocks = book_data.get('total_blocks', 1)

            chunks_ref = book_ref.collection('chunks')
            content = ''

            if current_block > 0:
                previous_chunk = chunks_ref.document(str(current_block - 1)).get().to_dict()
                content += previous_chunk['content']

            current_chunk = chunks_ref.document(str(current_block)).get().to_dict()
            content += current_chunk['content']

            if current_block < total_blocks - 1:
                next_chunk = chunks_ref.document(str(current_block + 1)).get().to_dict()
                content += next_chunk['content']

            return Response({'status': 'success', 'content': content})
        except Exception as e:
            return Response({'status': 'failed', 'message': str(e)})

    def post(self, request, book_id):
        user_id = request.user.id
        book_ref = db.collection('users').document(str(user_id)).collection('library').document(book_id)

        try:
            data = request.data
            new_content = data['content']

            chunks_ref = book_ref.collection('chunks')
            chunks = chunks_ref.get()
            for chunk in chunks:
                chunks_ref.document(chunk.id).delete()

            new_chunks = [new_content[i:i + 1024 * 1024] for i in range(0, len(new_content), 1024 * 1024)]
            for index, chunk in enumerate(new_chunks):
                chunks_ref.document(str(index)).set({'content': chunk})

            book_ref.update({'total_blocks': len(new_chunks)})

            return Response({'status': 'success'})
        except Exception as e:
            return Response({'status': 'failed', 'message': str(e)})

def filter_text(text):
    text = re.sub(r'\[.*?\]', '', text)
    text = re.sub(r'@\w+', '', text)
    text = re.sub(r'/\S*', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def chunk_text_file(file):
    raw_data = file.read()
    result = chardet.detect(raw_data)
    encoding = result['encoding']
    text = raw_data.decode(encoding)
    return [text[i:i + CHUNK_SIZE] for i in range(0, len(text), CHUNK_SIZE)]

def chunk_pdf_file(file):
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
        temp_file.write(file.read())
        temp_file.flush()
        reader = PdfReader(temp_file.name)
        text_content = ''
        for page in reader.pages:
            text_content += page.extract_text()
    return [text_content[i:i + CHUNK_SIZE] for i in range(0, len(text_content), CHUNK_SIZE)]

def chunk_epub_file(file):
    with tempfile.NamedTemporaryFile(delete=False, suffix='.epub') as temp_file:
        temp_file.write(file.read())
        temp_file.flush()
        book = epub.read_epub(temp_file.name)

    text_content = ''
    for item in book.get_items():
        if item.get_type() == ebooklib.ITEM_DOCUMENT:
            soup = BeautifulSoup(item.get_content(), 'html.parser')
            text_content += soup.get_text()
    return [text_content[i:i + CHUNK_SIZE] for i in range(0, len(text_content), CHUNK_SIZE)]

