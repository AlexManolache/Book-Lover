import json
from channels.generic.websocket import WebsocketConsumer

class BackGammonConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

        self.send(text_data=json.dumps({
            'type': 'connection established',
            'message': 'Now you are connected!',
        }))

   
