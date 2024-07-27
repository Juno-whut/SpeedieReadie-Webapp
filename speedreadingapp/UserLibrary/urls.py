from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookViewSet, ImportFromURLView, SaveImportedTextView, ImportFromFileView, SpeedReadView, DeleteBookView, EditBookView

router = DefaultRouter()
router.register(r'books', BookViewSet, basename='books')

urlpatterns = [
    path('', include(router.urls)),
    path('import_from_url/', ImportFromURLView.as_view(), name='import_from_url'),
    path('save_imported_text/', SaveImportedTextView.as_view(), name='save_imported_text'),
    path('import_from_file/', ImportFromFileView.as_view(), name='import_from_file'),
    path('speed_read/<str:text_id>/', SpeedReadView.as_view(), name='speed_read'),
    path('delete_book/<str:book_id>/', DeleteBookView.as_view(), name='delete_book'),
    path('edit_book/<str:book_id>/', EditBookView.as_view(), name='edit_book'),
]
