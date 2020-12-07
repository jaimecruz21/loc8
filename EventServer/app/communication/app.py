from aiohttp import web
from app.settings import get_config


def setup_routes(app):
    from .routes import routes
    app.router.add_routes(routes)


def build_app():
    app = web.Application()
    config = get_config()
    app['config'] = config
    setup_routes(app)
    return app

app = build_app()
