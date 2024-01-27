from django.urls import path

from . import views

urlpatterns = [
    path('login/', views.loginPage, name='login'),
    path('logout/', views.logoutUser, name='logout'),
    path('', views.home, name='home'),
    path('books/<str:pk>/', views.dataBook, name='books'),
    path('create-book/', views.createBook, name='create-book'),
    path('update-book/<str:pk>/', views.updateBook, name='update-book'),
    path('delete-book/<str:pk>/', views.deleteBook, name='delete-book'),
    path('delete-comment/<str:pk>/', views.deleteComments, name='delete-comment'),
    path('register/', views.registerUser, name='register'),
    path('user-profile/<str:pk>', views.userProfile, name='user-profile'),
    path('create-topic/', views.createTopic, name='create-topic'),
    path('delete-topic/', views.deleteTopic, name='delete-topic'),
]
