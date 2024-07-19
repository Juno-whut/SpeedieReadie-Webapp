from django.shortcuts import render, redirect
from django.http import JsonResponse
from .forms import TextForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response

db = settings.FIRESTORE_DB


#view to serve index.html
def index(request):
    return render(request, 'index.html')

# Sample API endpoint for testing react setup
@api_view(['GET'])
def api_home(request):
    data = {
        "message": "Hello, world!"
    }
    return Response(data)

def home(request):
    if request.method == 'POST':
        form = TextForm(request.POST)
        if form.is_valid():
            user_id = request.user.id
            text = form.cleaned_data['text']
            # Store text in Firestore
            db.collection('users').document(str(user_id)).collection('texts').add({'text': text})
            messages.success(request, 'Text saved successfully!')
            return redirect('home_speed_read')
    else:
        form = TextForm()
    return render(request, 'home.html', {'form': form})


def speed_read_home(request):
    if request.method == 'POST':
        text = request.POST.get('text', '')
        return render(request, 'speed_read_home.html', {'text': text, 'title': 'Speed Reading'})
    user_id = request.user.id
    texts_ref = db.collection('users').document(str(user_id)).collection('texts')
    texts = [doc.to_dict() for doc in texts_ref.stream()]
    return render(request, 'speed_read_home.html', {'texts': texts})
