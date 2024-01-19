from django.shortcuts import render, redirect
from django.db.models import Q
from .models import Book, Topic, Message
from .forms import BookForm


from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from django.http import HttpResponse
from django.contrib.auth.forms import UserCreationForm


def home(request):
    q= request.GET.get('q') if request.GET.get('q') != None else ''

    messagesBook = Message.objects.filter(Q(book__topic__name__icontains=q))
    books = Book.objects.filter(Q(topic__name__icontains=q) | Q(name__icontains=q) | Q(description__icontains=q) | Q(host__username__icontains=q))
    topics = Topic.objects.all()
    filteredBooks = sorted(books, key=lambda book: book.name.upper())
    totalBooks = books.count()
    context = {'books': filteredBooks, 'topics': topics, 'totalBooks': totalBooks, 'messagesBook': messagesBook}
    return render(request, 'bookapp/home.html', context)

@login_required(login_url='login')
def dataBook(request, pk):
    book = Book.objects.get(id=pk)
    messagesBook = book.message_set.all()
    members = book.members.all()
    if request.method == 'POST':
       commentUser = Message(user=request.user, book=book, body=request.POST.get('body'))
       if commentUser is not None:
           commentUser.save()
           book.members.add(request.user)
           return redirect('books', pk=book.id)
    context = {'book' : book, 'messagesBook': messagesBook, 'members': members}
    return render(request, 'bookapp/book.html', context)

@login_required(login_url='login')
def deleteComments(request, pk):
    comment = Message.objects.get(id=pk)
    if request.user.is_superuser or request.user == comment.user:
        if request.method == 'POST':
            comment.delete()
            return redirect('home')
        context ={'obj': 'this comment'}
        return render(request, 'bookapp/delete.html', context)
    else:
        return HttpResponse('Not allowed to delete other\'s comments')


@login_required(login_url='login')
def createBook(request):
    form = BookForm()
    if request.method == 'POST':
        form = BookForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('home')
    context = {'form': form}
    return render(request, 'bookapp/book_form.html', context)

@login_required(login_url='login')
def updateBook(request, pk):
    book = Book.objects.get(id=pk)
    form =BookForm(instance=book)

    if request.user.is_superuser or request.user == book.host:
         if request.method == 'POST':
            form = BookForm(request.POST, instance=book)
            if form.is_valid():
                form.save()
                return redirect('home')
    else:
        return HttpResponse('You are not allowed to update this book!')

    context = {'form': form}
    return render(request, 'bookapp/book_form.html', context)

@login_required(login_url='login')
def deleteBook(request, pk):
    book = Book.objects.get(id=pk)
    if request.user.is_superuser or request.user == book.host:
        if request.method == 'POST':
            book.delete()
            return redirect('home')
    else:
        return HttpResponse('You are not allowed to delete this book!')
    context = {'obj' : book}
    return render(request, 'bookapp/delete.html', context)

def userProfile(request, pk):
    user = User.objects.get(id=pk)
    books = user.book_set.all()
    topics = Topic.objects.all()
    messagesBook = user.message_set.all()
    context = {'user': user, 'books': books, 'topics': topics, 'messagesBook': messagesBook}
    return render(request, 'bookapp/profile.html', context)

def loginPage(request):
    page ='loginPage'

    if request.user.is_authenticated:
        return redirect('home')
    
    if request.method == 'POST':
        username = request.POST.get('username').lower()
        password = request.POST.get('password')
        try:
            user = User.objects.get(username=username)
        except: 
            messages.error(request, 'User does not exist!')
        
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'Username or password incorrect!')

    context = {'page': page}
    return render(request, 'bookapp/login_and_register.html', context)


def logoutUser(request):
    logout(request)
    return redirect('login')


def registerUser(request):
    page = 'registerPage'
    userRegForm = UserCreationForm()

    if request.method == 'POST':
        userRegForm = UserCreationForm(request.POST)
        alreadyUser = User.objects.filter(Q(username__icontains = request.POST.get('username')))
      
        if userRegForm.is_valid and alreadyUser.count() == 0:
            user = userRegForm.save(commit=False)
            user.username = user.username.lower()
            user.save()
            return redirect('login')
        else:
            messages.error(request, 'An error occurred!')
    context = {'page': page, 'userRegForm': userRegForm}
    return render(request, 'bookapp/login_and_register.html', context )