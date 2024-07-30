# api/urls.py
from django.urls import path
from users.views import RegisterView, LoginView, ProfileView
from UserLibrary.views import AddTextView, LibraryView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('add_text/', AddTextView.as_view(), name='add_text'),
    path('library/', LibraryView.as_view(), name='library'),
]
