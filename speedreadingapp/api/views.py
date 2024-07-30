from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from firebase_admin import firestore
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt

db = settings.FIRESTORE_DB

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_text(request):
    try:
        title = request.data.get('title')
        content = request.data.get('content')
        user = request.user
        
        if not title or not content:
            return Response({'error': 'Title and content are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Save to Firestore
        doc_ref = db.collection('users').document(user.username).collection('library').document()
        doc_ref.set({
            'title': title,
            'content': content
        })
        
        return Response({'message': 'Text added successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

