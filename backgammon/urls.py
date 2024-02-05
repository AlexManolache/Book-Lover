from django.urls import path

from . import views


urlpatterns = [
    path('', views.showBoard, name='game'),
    path('get-dice-value/', views.getValue, name='getValue'),
]