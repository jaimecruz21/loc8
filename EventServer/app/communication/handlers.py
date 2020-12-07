from .handlers_core import ws_handler


@ws_handler(command='hi')
async def hi(data, **kwargs):
    pass