from aiohttp import web
from app.settings import get_config
from app.auth.jwt_backend import JWTClientBackend


def setup_routes(app):
    from .routes import routes
    app.router.add_routes(routes)


def build_app():
    app = web.Application()
    config = get_config()
    app['config'] = config
    app['auth_backend'] = JWTClientBackend(config['jwt_secret'])
    setup_routes(app)
    return app

app = build_app()
