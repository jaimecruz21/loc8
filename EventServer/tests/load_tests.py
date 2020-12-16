import random
import jwt
from molotov import scenario
from aiohttp import FormData


_API = "http://localhost:8080/api/v1/scanner/detected/"
ALGORITHM = 'HS256'
SECRET = 'secret'

TOKENS = [jwt.encode({'hubId': f'hub{i}'}, key=SECRET, algorithm=ALGORITHM).decode() for i in range(1, 3)]

print(TOKENS)
def gen_data():
    return {
        'minor': random.randrange(10),
        'major': random.randrange(10),
        'rxpower': random.randrange(-50, -80, -2),
        'uuid': 'uuid{}'.format(random.randrange(1, 3)),
        'rssi': random.randrange(-50, -80, -2)
    }

@scenario(weight=40)
async def scenario_one(session):
    d = FormData()
    for key, value in gen_data().items():
        d.add_field(key, value)
    async with session.post(_API, data=d, headers=dict(
        Authorization='Bearer {}'.format(random.choice(TOKENS))
    )) as resp:
        assert resp.status == 201
