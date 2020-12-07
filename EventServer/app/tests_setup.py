from aiohttp.test_utils import AioHTTPTestCase
from .main import init_app


class AppTestCore(AioHTTPTestCase):

    async def get_application(self):
        """
        Override the get_app method to return your application.
        """
        return await init_app()
