from typing import Any
from django import forms
from .models import Book, Topic
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class BookForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = ['topic', 'name', 'description']
        exclude = ['host', 'members']

    def __init__(self, *args, **kwargs):
        super(BookForm, self).__init__(*args, **kwargs)

        self.fields['topic'].widget.attrs['class']= 'form-control'
        self.fields['name'].widget.attrs['class']= 'form-control'
        self.fields['description'].widget.attrs['class']= 'form-control'

        self.fields['topic'].label = 'Choose a topic'

class UserRegisterForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'password1', 'password2']

    def __init__(self, *args, **kwargs):
        super(UserRegisterForm, self).__init__(*args, **kwargs)

        self.fields['username'].widget.attrs['class']= 'form-control'
        self.fields['password1'].widget.attrs['class']= 'form-control'
        self.fields['password2'].widget.attrs['class']= 'form-control'
        
        self.fields['username'].help_text = '<small class="mt-1 text-warning">Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.</small>'
        self.fields['password1'].help_text = '<small class="mt-1 text-warning">Your password must contain at least 8 characters(Letters, digits and symbols).</small>'
        self.fields['password2'].help_text = '<small class="mt-1 text-warning">Enter the same password as before, for verification.</small>'