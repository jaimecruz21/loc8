import asyncio
import aiohttp
import json
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


def ws_handler(msg_type=aiohttp.WSMsgType.TEXT, command=''):
    def wrapper(fn):
        handlers_registry[msg_type][command].append(fn)
        return fn
    return wrapper


async def handle_msg(msg, conn):
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
    if msg_type in handlers_registry and command in handlers_registry[msg_type]:
        handlers = handlers_registry[msg_type][command]
        try:
            await asyncio.wait(
                list(map(lambda h: h(data, msg=msg, conn=conn), handlers))
            )
        except Exception as e:
            # TODO: errors handling and logging
            pass


async def websocket_handler(request):
    from . import handlers
    ws = web.WebSocketResponse()
    await ws.prepare(request)

    async for msg in ws:
        await handle_msg(msg, ws)

    return ws