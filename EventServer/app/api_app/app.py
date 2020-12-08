from aiohttp import web
from app.settings import get_config
from .middlewares import setup_middlewares
from app.auth.jwt_backend import JWTClientBackend
from aiohttp_apispec import setup_aiohttp_apispec


def setup_routes(app):
    from app.detection.routes import routes as detection_routes
    setup_aiohttp_apispec(app=app, title="Docs", version="v1")
    app.router.add_routes(detection_routes)


def build_app():
    app = web.Application()
    config = get_config()
    app['config'] = config
    app['auth_backend'] = JWTClientBackend(config['jwt_secret'])
    setup_middlewares(app)
    setup_routes(app)

    return app

app = build_app()
