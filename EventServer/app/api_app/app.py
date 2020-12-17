from aiohttp import web
from app.settings import get_config
from .middlewares import setup_middlewares
from app.auth.jwt_backend import JWTClientBackend
from aiohttp_apispec import setup_aiohttp_apispec


async def cors_handler(request):
    return web.Response(headers={
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
    }, status=200)

async def on_prepare(request, response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = '*'


def setup_routes(app):
    from app.detection.routes import routes as detection_routes
    setup_aiohttp_apispec(app=app, title="Docs", version="v1")
    app.router.add_route('options', '/{tail:.*}', cors_handler)
    app.router.add_routes(detection_routes)


def build_app():
    app = web.Application()
    config = get_config()
    app['config'] = config
    app['auth_backend'] = JWTClientBackend(config['jwt_secret'])
    setup_middlewares(app)
    setup_routes(app)
    app.on_response_prepare.append(on_prepare)
    return app

app = build_app()
