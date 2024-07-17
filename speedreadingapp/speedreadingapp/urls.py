from django.contrib import admin
from django.urls import path, include
from users import views as user_views
from django.contrib.auth import views as auth_views
from . import views
from .views import index
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index, name='index'),
    path('', views.home, name='home'),
    path('home_speed_read/', views.speed_read_home, name='home-speed-read'),
    path('profile/', index, name='profile'),
    path('login/', index, name='login'),
    path('register/', index, name='register'),
    path('logout/', auth_views.LogoutView.as_view(template_name='users/logout.html'), name='logout'),
    path('', include('django.contrib.auth.urls')),
    path('library/', index, name='library'),
    path('api/', include('users.urls')),
    path('api/', include('UserLibrary.urls')),
    path('api/home/', views.api_home, name='api-home'),
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
]

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/', include('UserLibrary.urls')),
]
