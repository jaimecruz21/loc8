import aiohttp
import json
from functools import wraps
from collections import defaultdict
from aiohttp import web

msg_type = defaultdict(list)
handlers_registry = defaultdict(msg_type)


def extract_str_msg(msg):
    return json.loads(msg)


extractors = {
    aiohttp.WSMsgType.TEXT: extract_str_msg
}


def ws_handler(fn, msg_type=aiohttp.WSMsgType.TEXT, command=''):
    handlers_registry[msg_type][command].append(fn)


async def handle_msg(msg):
    msg_type = msg.type
    data = extractors[msg_type]
    command = data.get('command', '') or ''
    if msg_type in handlers_registry and command in handlers_registry[msg_type]:
        handler = handlers_registry[msg_type][command]
        await handler(data, msg=msg)
    pass


async def websocket_handler(request):
    ws = web.WebSocketResponse()
    await ws.prepare(request)

    async for msg in ws:
        await handle_msg(msg)

    return ws