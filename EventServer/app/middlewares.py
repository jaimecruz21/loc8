# middlewares.py
from aiohttp import web


def credentials_middleware():
    @web.middleware
    async def error_middleware(request, handler):
        authenticated = True
        if authenticated:
            return await handler(request)
        raise web.HTTPNotFound()

    return error_middleware


def setup_middlewares(app):
    error_middleware = credentials_middleware()
    app.middlewares.append(error_middleware)
