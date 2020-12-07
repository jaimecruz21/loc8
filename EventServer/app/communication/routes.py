from aiohttp import web

from .handlers import websocket_handler

routes = [
    web.get('/ws', websocket_handler),
]