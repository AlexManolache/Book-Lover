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
