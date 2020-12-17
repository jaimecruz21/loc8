import asyncio
import random
import aiohttp
import jwt
from molotov import scenario
from aiohttp import FormData


#_API = "http://localhost:8080/api/v1/scanner/detected/"
_API = "http://localhost:8080/api/v1/scanner/detected/"
ALGORITHM = 'HS256'
SECRET = 'secret'

TOKENS = {f'hub{i}': jwt.encode({'hubId': f'hub{i}'}, key=SECRET, algorithm=ALGORITHM).decode() for i in range(1, 10)}


def gen_data(device, distance):
    return {
        'minor': random.randrange(10),
        'major': random.randrange(10),
        'rxpower': random.randrange(-50, -80, -2),
        'uuid': device,
        'rssi': random.randrange(-50, -80, -2),
        'distance': distance
    }


DEVICES = dict(
    uuid1=['hub1', 'hub2', 'hub3'],
    uuid2=['hub4', 'hub5', 'hub6'],
    uuid3=['hub7', 'hub8', 'hub9'],
)


DISTANCE = 63 # meters
HUBS = 3 # not less than 2
HUBS_SPACE = DISTANCE / (HUBS - 1)
HUBS_POSITIONS = []

offset = 0
for _ in range(HUBS):
    HUBS_POSITIONS.append(offset)
    offset += HUBS_SPACE


def get_position(tick, step=4.2):
    left = tick * step
    return list(map(lambda x: abs(x-left), HUBS_POSITIONS))


async def add_detection(data, token, session):

    d = FormData()
    for key, value in data.items():
        d.add_field(key, value)
    async with session.post(_API, data=d, headers=dict(
        Authorization='Bearer {}'.format(token)
    )) as resp:
        assert resp.status == 201


async def main():
    async with aiohttp.ClientSession() as session:
        tick = 0
        while True:
            calls = []
            try:
                for i, dev in enumerate(DEVICES.items()):
                    device, hubs = dev
                    backward = (tick + i * 5) // 10 % 2
                    tick_index = 10 - tick % 10 if backward else tick % 10
                    positions = get_position(tick_index)
                    for i, hub in enumerate(hubs):
                        data = gen_data(device, positions[i])
                        token = TOKENS[hub]
                        calls.append(add_detection(data, token, session))
                await asyncio.gather(*calls)
            except Exception as e:
                print(e)
            tick += 1
            await asyncio.sleep(3)

if __name__ == '__main__':
    asyncio.run(main())