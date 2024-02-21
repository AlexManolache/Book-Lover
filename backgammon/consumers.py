import json
from channels.generic.websocket import WebsocketConsumer
import random

class BackGammonConsumer(WebsocketConsumer):
    connections = set()

    def connect(self):
        self.accept()
        self.connections.add(self)
        self.update_and_send_dice_values()
       
    def disconnect(self, close_code):
        self.connections.remove(self)

    def receive(self, text_data):
        
        pass

    def update_and_send_dice_values(self):
        number_dice_left = random.randint(1, 6)
        number_dice_right = random.randint(1, 6)
        update_msg = json.dumps({
            'type': 'update_dice_values',
            'number': {'valLeftDice': number_dice_left, 'valRightDice': number_dice_right},
        })
        for connection in self.connections:
            connection.send(text_data=update_msg)


class DiceValueConsumer(WebsocketConsumer):
    connections = set()

    def connect(self):
        self.accept()
        self.connections.add(self)
        self.getValue()
       
    def disconnect(self, close_code):
        self.connections.remove(self)
   
    def getValue(self):
        number_dice_left = random.randint(1, 6)
        number_dice_right = random.randint(1, 6)
        update_msg = json.dumps({
            'type': 'update_dice_values',
            'number': {'valLeftDice': number_dice_left, 'valRightDice': number_dice_right},
        })
        for connection in self.connections:
            connection.send(text_data=update_msg)

class RollAnimationConsumer(WebsocketConsumer):
     connections = set()
     cssClass = ['left_dice_roll', 'right_dice_roll', 'not_allowed']
     def connect(self):
        self.accept()
        self.connections.add(self)
        self.add_class()

     def disconnect(self, close_code):
        pass

     def receive(self, text_data):
         pass

     def add_class(self):
        update_msg = json.dumps({
        'type': 'cssClassesDice',
       
        'cssClasses': self.cssClass,
    })
        for connection in self.connections:
            connection.send(text_data=update_msg)


class MovePiecesConsumer(WebsocketConsumer):
    connections = set()

    def connect(self):
        self.accept()
        self.connections.add(self)

    def disconnect(self, close_code):
        self.connections.remove(self)

    def receive(self, text_data):
        piecesData = json.loads(text_data)
        print(piecesData)
        self.addPieces(piecesData)

    def addPieces(self, piecesData):
        update_pieces = json.dumps({
            'content': piecesData,
            'cssCenter': 'centered',
        })
        for connection in self.connections:
            connection.send(text_data=update_pieces)

class MovePieceToBar(WebsocketConsumer):
    connections = set()

    def connect(self):
        self.accept
        self.connections.add(self)

    def disconnect(self):
        self.connections.remove(self)

    def receive(self, text_data):
        barPieces = json.loads(text_data)
        print(barPieces)