from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from firebase_admin import firestore
from django.conf import settings

db = settings.FIRESTORE_DB

@method_decorator(csrf_exempt, name='dispatch')
class AddTextView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        try:
            data = request.data
            title = data.get('title')
            text = data.get('text')
            user = request.user

            if not title or not text:
                return Response({'error': 'Title and text are required.'}, status=status.HTTP_400_BAD_REQUEST)

            book_ref = db.collection('users').document(user.username).collection('library').document()
            book_ref.set({
                'title': title,
                'text': text
            })

            return Response({'message': 'Book added successfully.'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
