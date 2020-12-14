import json
from .handlers_core import ws_handler

TOKEN_KEY = 'token'


@ws_handler(command='auth', authorized=False)
async def authorize(data, conn=None, app=None, **kwargs):
    token = data.get(TOKEN_KEY)
    is_authorized = app['auth_backend'].validate(token)
    conn.authorized = is_authorized
    if is_authorized:
        conn.token = token
    await conn.send_str(json.dumps(dict(
        command='auth',
        payload=dict(authorized=bool(is_authorized))
    )))


@ws_handler(command='subscribe', authorized=False)
async def subscribe(data, app=None, conn=None, **ctx):
    bus = app['event_bus']
    hub_id = data['hubId']
    bus.subscribe(conn, hub_id)
    await conn.send_str(json.dumps(dict(command='subscribe', payload=data)))


@ws_handler(command='unsubscribe', authorized=False)
async def subscribe(data, app=None, conn=None, **ctx):
    bus = app['event_bus']
    hub_id = data['hubId']
    bus.unsubscribe(conn, hub_id)
    await conn.send_str(json.dumps(dict(command='unsubscribe', payload=data)))
