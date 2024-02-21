from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
import random


@login_required(login_url='login')
def showBoard(request):
    return render(request, 'backgammon/board.html')