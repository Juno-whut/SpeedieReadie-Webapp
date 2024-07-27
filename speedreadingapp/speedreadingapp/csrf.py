from django.utils.deprecation import MiddlewareMixin
from django.conf import settings
from django.middleware.csrf import get_token

class CsrfExemptSessionAuthentication(MiddlewareMixin):
    def process_request(self, request):
        if settings.DEBUG and request.method == "OPTIONS":
            return None
        request.csrf_processing_done = True
        request.META["CSRF_COOKIE_USED"] = True
        get_token(request)
  