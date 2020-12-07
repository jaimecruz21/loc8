from aiohttp import web

from .handlers_core import websocket_handler

routes = [
    web.get('/ws', websocket_handler),
]