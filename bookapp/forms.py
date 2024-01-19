from django.forms import ModelForm

from .models import Book, Message

class BookForm(ModelForm):
    class Meta:
        model = Book
        fields = '__all__'
