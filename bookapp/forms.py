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

    topic = forms.ModelChoiceField(queryset=Topic.objects.all(), widget=forms.Select(attrs={'class': 'form-control'}), label= 'Choose a topic')
    name = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control'}))
    description = forms.CharField(widget=forms.Textarea(attrs={'class': 'form-control'}))



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