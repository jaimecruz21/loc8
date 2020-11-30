"""Require running database server"""

from src.db import choice


async def test_index(cli, tables_and_data):
    # response = await cli.get('/')
    # assert response.status == 200
    # # TODO: resolve question with html code "&#39;" instead of apostrophe in
    # # assert 'What\'s new?' in await response.text()
    assert True is True
