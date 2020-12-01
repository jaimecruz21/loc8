# routes.py
from aiohttp_apispec import setup_aiohttp_apispec
from .detection.routes import routes


def setup_routes(app):
    app.router.add_routes(routes)
    setup_aiohttp_apispec(app=app, title="Docs", version="v1")

