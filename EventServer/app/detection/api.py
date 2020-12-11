import jwt
import datetime as dt
import asyncio
from aiohttp import web
from aiohttp_apispec import (docs, request_schema)
from marshmallow import Schema, fields

from app.devices.models import get_device_env
from .models import create_detection


class DetectionRequestSchema(Schema):
    uuid = fields.String(required=True)
    distance = fields.Float(required=False)
    major = fields.Integer(required=True)
    minor = fields.Integer(required=True)
    rssi = fields.Integer(required=False)
    rxpower = fields.Integer(required=True)


class DetectionView(web.View):
    """
    Storing new detection
    """
    @docs(
        tags=['detection'],
        summary='View to create detection'
    )
    @request_schema(DetectionRequestSchema())
    async def post(self):
        """
        There we do need to create detection entity in database
        """
        async with self.request.app['db'].acquire() as conn:
            data = await self.process_detection_data(
                self.request.get('data'), conn)
            await asyncio.wait([
                self.request.app['event_bus'].new_detection(data),
                create_detection(data, conn)
            ])
        return web.json_response(status=201)

    async def process_detection_data(self, data, conn):
        """
        Convert api data to database structure
        Extracting hub info from jwt token
        Calculating distance

        :param data:
        :return:
        """
        token_data = self.request['jwt_data']
        detection = dict(
            hubId=token_data['hubId'],
            objectId=data['uuid'],
            distance=await self.get_distance(data, conn),
            major=data['major'],
            minor=data['minor'],
            rxpower=data['rxpower'],
        )
        rssi = data.get('rssi')
        if rssi:
            detection['rssi'] = rssi
        return detection

    async def get_distance(self, data, conn):
        providen_distance = data.get('distance')
        if providen_distance:
            return providen_distance
        env = await get_device_env(data['uuid'], conn)
        return 10**((data['rxpower']-data['rssi'])/10/env)


