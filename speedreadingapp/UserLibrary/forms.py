from django import forms
from .models import UserText

class UserTextForm(forms.ModelForm):
    class Meta:
        model = UserText
        fields = ['title', 'content']
