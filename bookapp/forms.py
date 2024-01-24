from django import forms
from .models import Book, Topic

class BookForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = ['topic', 'name', 'description']
        exclude = ['host', 'members']

    topic = forms.ModelChoiceField(queryset=Topic.objects.all(), widget=forms.Select(attrs={'class': 'form-control'}), label= 'Choose a topic')
    name = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control'}))
    description = forms.CharField(widget=forms.Textarea(attrs={'class': 'form-control'}))