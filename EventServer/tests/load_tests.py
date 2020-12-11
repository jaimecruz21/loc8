from molotov import scenario
from aiohttp import FormData


_API = "http://localhost:8080/api/v1/scanner/detected/"
TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodWJJZCI6Imh1YjEifQ.ppV1VeG6VWOLViIJgsZN3ioF65O1c7MRVokB-nH3Fwo'

data = {'minor': 2, 'major': 1, 'rxpower': -69, 'uuid': 'uuid', 'rssi': -69}

@scenario(weight=40)
async def scenario_one(session):
    d = FormData()
    for key, value in data.items():
        d.add_field(key, value)
    async with session.post(_API, data=d, headers=dict(
        Authorization='Bearer {}'.format(TOKEN)
    )) as resp:
        assert resp.status == 201
