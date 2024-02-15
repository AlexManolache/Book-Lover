from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
import random


@login_required(login_url='login')
def showBoard(request):
    return render(request, 'backgammon/board.html')

@login_required(login_url='login')
def getValue(request):
    number_dice_left = random.randint(1, 6)
    number_dice_right = random.randint(1, 6)
       
    context = {'valLeftDice': number_dice_left, 'valRightDice': number_dice_right}

    return JsonResponse(context)