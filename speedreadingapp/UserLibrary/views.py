import requests
import json

from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required 
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.http import JsonResponse, Http404
from django.conf import settings
from django.contrib import messages
from django.shortcuts import render, redirect

from django.contrib.auth import authenticate, login, logout

from users.models import UserProfile

import re
import chardet
from PyPDF2 import PdfReader
import ebooklib
from ebooklib import epub
from bs4 import BeautifulSoup
import tempfile
import os

db = settings.FIRESTORE_DB

from rest_framework import viewsets, permissions
from UserLibrary.models import Book
from UserLibrary.serializers import BookSerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@login_required
def library(request):
    user_id = request.user.id
    texts_ref = db.collection('users').document(str(user_id)).collection('library')
    
    texts = [{'id': doc.id, **doc.to_dict()} for doc in texts_ref.stream()]
    
    return render(request, 'library.html', {'texts': texts})

@login_required
@csrf_protect
def add_text(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        text = request.POST.get('text')
        
        if not title or not text:
            return render(request, 'add_text.html', {'error': 'Title and text are required.'})

        user_id = request.user.id
        try:
            new_text_ref = db.collection('users').document(str(user_id)).collection('library').add({'title': title, 'text': text})
            new_text_id = new_text_ref[1].id
            return redirect('speed_read', text_id=new_text_id)
        except Exception as e:
            return render(request, 'add_text.html', {'error': str(e)})
    return render(request, 'add_text.html')


@login_required
@csrf_protect
def import_from_url(request):
    if request.method == 'POST':
        url = request.POST.get('url')
        title = request.POST.get('title')
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()  # Raise HTTPError for bad responses
            soup = BeautifulSoup(response.content, 'html.parser')

            # Remove unwanted elements
            for script in soup(["script", "style", "img", "video", "audio"]):
                script.decompose()

            text_content = soup.get_text(separator='\n')

            # Apply filters
            text_content = filter_text(text_content)

            return render(request, 'edit_imported_text.html', {'title': title, 'text_content': text_content})
        except requests.exceptions.RequestException as e:
            messages.error(request, f'Error importing text: {e}')
    return render(request, 'import_from_url.html')

def filter_text(text):
    # Remove anything in []
    text = re.sub(r'\[.*?\]', '', text)
    # Remove anything that starts with @
    text = re.sub(r'@\w+', '', text)
    # Remove anything that has a /
    text = re.sub(r'/\S*', '', text)
    # Replace multiple spaces with a single space
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

@login_required
@csrf_protect
def save_imported_text(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        text_content = request.POST.get('text_content')
        user_id = request.user.id
        if not title or not text_content:
            messages.error(request, 'Title and text content are required')
            return redirect('edit_imported_text')
            
        try:
            # Split text_content into chunks
            chunks = [text_content[i:i + 1024 * 512] for i in range(0, len(text_content), 1024 * 512)]  # Reduced chunk size to 512 KiB

            book_ref = db.collection('users').document(str(user_id)).collection('library').document()
            book_id = book_ref.id

            # Save chunks in subcollection
            for index, chunk in enumerate(chunks):
                book_ref.collection('chunks').document(str(index)).set({'content': chunk})

            # Save metadata
            book_ref.set({
                'title': title,
                'current_block': 0,
                'current_position': 0,
                'total_blocks': len(chunks)
            })

            messages.success(request, 'Text saved successfully!')
            return redirect('library')
        except Exception as e:
            messages.error(request, f'Error saving text:{e}')
            return redirect('edit_imported_text', {"title": title, 'text_content': text_content})
    return redirect('import_from_url')


@login_required
@csrf_protect
def import_from_file(request):
    if request.method == 'POST':
        try:
            title = request.POST.get('title')
            file = request.FILES.get('file')

            if not file:
                return JsonResponse({'message': 'No file uploaded.'}, status=400)

            user_id = request.user.id
            book_ref = db.collection('users').document(str(user_id)).collection('library').document()
            book_id = book_ref.id

            MAX_UPLOAD_SIZE = 5 * 1024 * 1024 * 1024  # 5 GiB

            # Process file based on type and chunk it
            file_chunks = []
            if file.name.endswith('.txt'):
                file_chunks = chunk_text_file(file)
            elif file.name.endswith('.pdf'):
                file_chunks = chunk_pdf_file(file)
            elif file.name.endswith('.epub'):
                file_chunks = chunk_epub_file(file)
            else:
                return JsonResponse({'message': 'Unsupported file type.'}, status=400)

            total_size = sum(len(chunk) for chunk in file_chunks)
            if total_size > MAX_UPLOAD_SIZE:
                return JsonResponse({'message': 'File exceeds the maximum allowed size of 5 GiB.'}, status=400)
            
            # Save chunks in subcollection
            for index, chunk in enumerate(file_chunks):
                chunk_data = {
                    'content': chunk,
                    'chunk_index': index,
                }
                book_ref.collection('chunks').document(str(index)).set(chunk_data)

            # Save metadata
            book_ref.set({
                'title': title,
                'current_block': 0,
                'current_position': 0,
                'total_blocks': len(file_chunks)
            })

            return JsonResponse({'text': file_chunks[0], 'title': title}, status=200)
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=500)

    return render(request, 'import_from_file.html')

def chunk_text_file(file):
    raw_data = file.read()
    result = chardet.detect(raw_data)
    encoding = result['encoding']
    text = raw_data.decode(encoding)
    return [text[i:i + 1024 * 512] for i in range(0, len(text), 1024 * 512)]  # Reduced chunk size to 512 KiB

def chunk_pdf_file(file):
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
        temp_file.write(file.read())
        temp_file.flush()
        reader = PdfReader(temp_file.name)
        text_content = ''
        for page in reader.pages:
            text_content += page.extract_text()
    return [text_content[i:i + 1024 * 512] for i in range(0, len(text_content), 1024 * 512)]  # Reduced chunk size to 512 KiB

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
    return [text_content[i:i + 1024 * 512] for i in range(0, len(text_content), 1024 * 512)]  # Reduced chunk size to 512 KiB


@login_required
def speed_read(request, text_id):
    try:
        user_id = request.user.id
        user_ref = db.collection('users').document(str(user_id))
        text_ref = user_ref.collection('library').document(text_id)

        text_snapshot = text_ref.get()
        if not text_snapshot.exists:
            raise Http404("Text not found")

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

        return render(request, 'speed_read.html', {
            'text': content,
            'title': title,
            'current_block': current_block,
            'total_blocks': len(chunks),
            'current_position': text_data.get('current_position', 0)
        })
    except Exception as e:
        return render(request, 'error.html', {'message': str(e)})

@login_required
def save_user_settings(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = request.user.id
            user_ref = db.collection('users').document(str(user_id))

            user_doc = user_ref.get()
            if not user_doc.exists:
                # If the user profile does not exist, create it
                user_ref.set({'settings': data})
            else:
                user_ref.update({'settings': data})

            # Logging for debugging
            print(f"Settings saved for user {user_id}: {data}")
            return JsonResponse({'success': True, 'message': 'Settings saved successfully!'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
    return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=405)


@login_required
def user_settings(request):
    try:
        user_id = request.user.id
        user_ref = db.collection('users').document(str(user_id))
        user_doc = user_ref.get()

        if not user_doc.exists:
            # If the user profile does not exist, create it with default settings
            default_settings = {
                'wpm': 300,
                'chunk_size': 1,
                'font_size': 30,
                'text_color': '#000000',
                'background_color': '#ffffff'
            }
            user_ref.set({'settings': default_settings})
            return JsonResponse({'success': True, 'settings': default_settings})
        
        user_data = user_doc.to_dict()
        settings = user_data.get('settings', {
            'wpm': 300,
            'chunk_size': 1,
            'font_size': 30,
            'text_color': '#000000',
            'background_color': '#ffffff'
        })
        
        return JsonResponse({'success': True, 'settings': settings})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)



@login_required
@require_http_methods(["DELETE"])
def delete_book(request, book_id):
    user_id = request.user.id
    book_ref = settings.FIRESTORE_DB.collection('users').document(str(user_id)).collection('library').document(book_id)
    try:
        # Delete all chunks first
        chunks_ref = book_ref.collection('chunks')
        chunks = chunks_ref.get()
        for chunk in chunks:
            chunks_ref.document(chunk.id).delete()
        
        # Delete the book document
        book_ref.delete()
        return JsonResponse({'status': 'success'})
    except Exception as e:
        return JsonResponse({'status': 'failed', 'message': str(e)})

@login_required
def edit_book(request, book_id):
    user_id = request.user.id
    book_ref = settings.FIRESTORE_DB.collection('users').document(str(user_id)).collection('library').document(book_id)
    
    if request.method == 'GET':
        try:
            # Fetch metadata to get current_block and total_blocks
            book_data = book_ref.get().to_dict()
            current_block = book_data.get('current_block', 0)
            total_blocks = book_data.get('total_blocks', 1)

            # Fetch chunks (current, previous, and next if they exist)
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

            return JsonResponse({'status': 'success', 'content': content})
        except Exception as e:
            return JsonResponse({'status': 'failed', 'message': str(e)})

    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            new_content = data['content']

            # Delete existing chunks
            chunks_ref = book_ref.collection('chunks')
            chunks = chunks_ref.get()
            for chunk in chunks:
                chunks_ref.document(chunk.id).delete()

            # Split the new content into chunks and save
            new_chunks = [new_content[i:i + 1024 * 1024] for i in range(0, len(new_content), 1024 * 1024)]
            for index, chunk in enumerate(new_chunks):
                chunks_ref.document(str(index)).set({'content': chunk})

            # Update metadata
            book_ref.update({'total_blocks': len(new_chunks)})

            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'failed', 'message': str(e)})
