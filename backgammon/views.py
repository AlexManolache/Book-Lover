from django.shortcuts import render

# Create your views here.

def playGame(request):

    return render(request, 'backgammon/board.html', {})