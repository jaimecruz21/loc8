from molotov import scenario
from aiohttp import FormData


_API = "http://localhost:8080/scanner/v1/detected/"

data = {'minor': 2, 'major': 1, 'rxpower': -69, 'uuid': 'uuid', 'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodWJJZCI6Imh1YjEifQ.ppV1VeG6VWOLViIJgsZN3ioF65O1c7MRVokB-nH3Fwo', 'rssi': -69}

@scenario(weight=40)
async def scenario_one(session):
    d = FormData()
    for key, value in data.items():
        d.add_field(key, value)
    async with session.post(_API) as resp:
        res = await resp.json()
        assert res["result"] == "OK"
        assert resp.status == 200
