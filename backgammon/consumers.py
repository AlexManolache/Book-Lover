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
    
    def add_class(self, class_name):
        print(f"{class_name} added")

    def remove_class(self, class_name):
        print(f"{class_name} removed")

    def getValue(self):
        number_dice_left = random.randint(1, 6)
        number_dice_right = random.randint(1, 6)
        update_msg = json.dumps({
            'type': 'update_dice_values',
            'number': {'valLeftDice': number_dice_left, 'valRightDice': number_dice_right},
        })
        for connection in self.connections:
            connection.send(text_data=update_msg)

class RollAnimation(WebsocketConsumer):
     connections = set()

     def connect(self):
        self.accept()
        self.connections.add(self)
        self.add_class()
        self.remove_class()

     def disconnect(self, close_code):
        pass

     def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')
        class_name = data.get('class')

        if action == 'addClass':
            self.addClass(class_name)
        elif action == 'removeClass':
            self.removeClass(class_name)
        else:
            pass
    
     def addClass(self, class_name):
         pass
     
     def removeClass(self, class_name):
         pass
     

     def add_class(self):
        update_msg = json.dumps({
        'type': 'added_css_classes',
        'cssClasses': ['left_dice_roll', 'right_dice_roll', 'not_allowed']
    })
        for connection in self.connections:
            connection.send(text_data=update_msg)

     def remove_class(self):
        update_msg = json.dumps({
            'type': 'removed_css_classes',
            'cssClasses': ['left_dice_roll', 'right_dice_roll', 'not_allowed']
        })
        for connection in self.connections:
            connection.send(text_data=update_msg)