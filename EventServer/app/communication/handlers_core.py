import asyncio
import aiohttp
import json
from functools import wraps
from collections import defaultdict
from aiohttp import web

msg_type = defaultdict(list)
handlers_registry = defaultdict(lambda: msg_type)


def extract_str_msg(msg):
    return json.loads(msg.data)


extractors = {
    aiohttp.WSMsgType.TEXT: extract_str_msg,
    # TODO: add new handlers
}


def check_auth(ws):
    return getattr(ws, 'authorized')


def ws_handler(msg_type=aiohttp.WSMsgType.TEXT, command='', authorized=True):
    def wrapper(fn):
        handlers_registry[msg_type][command].append(fn)
        @wraps
        async def wrapped(*args, ws=None, **kwargs):
            if authorized and check_auth(ws) or not authorized:
                return await fn(*args, **kwargs)
            else:
                # TODO: unauthorized request
                pass
        return wrapped
    return wrapper


async def handle_msg(msg, conn, app):
    msg_type = msg.type
    extractor = extractors[msg_type]
    if not extractor:
        # TODO: handle the missed extractor
        return
    try:
        data = extractor(msg)
    except Exception:
        # TODO: improve the errors handling and logic
        return

    command = data.get('command', '') or ''
    payload = data.get('payload') or {}
    if msg_type in handlers_registry and command in handlers_registry[msg_type]:
        handlers = handlers_registry[msg_type][command]
        try:
            await asyncio.wait(list(map(
                lambda h: h(payload, msg=msg, conn=conn, app=app), handlers
            )))
        except Exception as e:
            # TODO: errors handling and logging
            pass


async def websocket_handler(request):
    from . import handlers
    ws = web.WebSocketResponse()
    await ws.prepare(request)

    async for msg in ws:
        await handle_msg(msg, ws, request.app)

    return ws