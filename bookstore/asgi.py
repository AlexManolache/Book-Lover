import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import backgammon.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bookstore.settings')

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    'http':get_asgi_application(),
    'websocket':AuthMiddlewareStack(
        URLRouter(
            backgammon.routing.websocket_urlpatterns
        )
    )
})
