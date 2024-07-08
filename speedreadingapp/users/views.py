import requests
from django.shortcuts import render, redirect
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.contrib import messages
from .forms import UserRegistrationForm
from .models import UserProfile
import firebase_admin
from firebase_admin import auth as firebase_auth
from django.conf import settings
from django.http import JsonResponse
import json

db = settings.FIRESTORE_DB


def register(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            email = form.cleaned_data.get('email')
            password = form.cleaned_data.get('password1')
            try:
                user_record = firebase_auth.create_user(
                    username=email,
                    password=password,
                    display_name=username
                )
                messages.success(request, f'Account created for {username}!')
                return redirect('login')
            except Exception as e:
                messages.error(request, f'Error creating account: {e}')
    else:
        form = UserRegistrationForm()
    return render(request, 'register.html', {'form': form})

def user_login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        try:
            user = firebase_auth.get_user_by_email(email)
            # Further validation of the password can be done using Firebase's client-side SDK
            messages.success(request, f'Welcome back, {user.display_name}!')
            return redirect('profile')
        except Exception as e:
            messages.error(request, f'Invalid login credentials: {e}')
    return render(request, 'login.html')


@login_required
@require_POST
def user_logout(request):
    if request.method == 'POST':
        logout(request)
    return redirect('login')

@login_required
def profile(request):
    user_ref = db.collection('users').document(request.user.username)
    user_data = user_ref.get()
    if user_data.exists:
        user_info = user_data.to_dict()
    else:
        user_info = {}
    return render(request, 'profile.html', {'user_info': user_info})

@login_required
def update_profile(request):
    if request.method == 'POST':
        new_data = {
            'email': request.POST.get('email', request.user.email),
        }
        user_ref = db.collection('users').document(request.user.username)
        user_ref.update(new_data)
        messages.success(request, 'Profile updated successfully!')
        return redirect('profile')
    else:
        return render(request, 'update_profile.html')

