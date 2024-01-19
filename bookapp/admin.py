from django.contrib import admin

# Register your models here.
from .models import Book, Topic, Message

admin.site.register(Book)
admin.site.register(Topic)
admin.site.register(Message)

