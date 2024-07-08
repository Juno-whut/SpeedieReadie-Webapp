from django.urls import path
from . import views

urlpatterns = [
    path('', views.library, name='library'),
    path('add_text/', views.add_text, name='add_text'),
    path('import_from_url/', views.import_from_url, name='import_from_url'),
    path('save_imported_text/', views.save_imported_text, name='save_imported_text'),
    path('import_from_file/', views.import_from_file, name='import_from_file'),
    path('speed_read/<str:text_id>/', views.speed_read, name='speed_read'),
    path('delete_book/<str:book_id>/', views.delete_book, name='delete_book'),
    path('edit_book/<str:book_id>/', views.edit_book, name='edit_book'),
    path('save_user_settings/', views.save_user_settings, name='save_user_settings'),
    path('user_settings/', views.user_settings, name='user_settings')
]
