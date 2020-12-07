from aiohttp import client
import json
from aiohttp.test_utils import unittest_run_loop
from app.tests_setup import AppTestCore


class CommunicationAuthTest(AppTestCore):

    @unittest_run_loop
    async def test_example(self):
        res = await self.client.ws_connect('/communication/ws')
        assert isinstance(res, client.ClientWebSocketResponse)

    @unittest_run_loop
    async def test_message(self):
        res = await self.client.ws_connect('/communication/ws')
        await res.send_str(json.dumps(dict(command='hi', data='test')))
        assert isinstance(res, client.ClientWebSocketResponse)
