import logging
import sys

from aiohttp import web
from .event_bus import EventBus
from app.init_db import setup_db

from app.db import close_pg, init_pg
from app.routes import setup_routes
from app.settings import get_config

from app.api_app.app import app as api_app
from app.communication.app import app as communication_app


def plugin_app(app, prefix, nested):
    async def set_db(a):
        nested['db'] = a['db']
        nested['event_bus'] = a['event_bus']

    app.on_startup.append(set_db)
    app.add_subapp(prefix, nested)


def setup_subapps(app):
    plugin_app(app, '/api/v1', api_app)
    plugin_app(app, '/communication', communication_app)


async def init_app(argv=None):

    app = web.Application()
    config = get_config(argv)
    app['config'] = config
    # create db connection on startup, shutdown on exit
    app.on_startup.append(init_pg)
    app.on_cleanup.append(close_pg)

    app['event_bus'] = EventBus()

    # setup views and routes
    setup_routes(app)
    setup_subapps(app)

    return app


def main(argv):
    logging.basicConfig(level=logging.DEBUG)


    app = init_app(argv)

    config = get_config(argv)
    web.run_app(app,
                host=config['host'],
                port=config['port'])


if __name__ == '__main__':
    main(sys.argv[1:])
