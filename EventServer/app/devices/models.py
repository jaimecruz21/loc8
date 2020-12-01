import enum
from sqlalchemy import (
    Table, Column, ForeignKey,
    Integer, String, DateTime, Numeric, select
)
from sqlalchemy.dialects.postgresql import JSONB

from app.db_meta import meta

DEFAULT_ENV = 1.4


class DeviceTypes(enum.Enum):
    scanner = 1
    beacon = 2


devices = Table(
    'devices', meta,
    Column('id', Integer, primary_key=True),
    Column('deviceId', String(80), nullable=False),
    Column('name', String(100), nullable=True),
    Column('model', String(100), nullable=True),
    Column('firmware', String(100), nullable=True),
    #Column('type', Enum(DeviceTypes)),
    Column('ts', DateTime, nullable=True),
    Column('env', Numeric, default=DEFAULT_ENV)
)

objects = Table(
    'objects', meta,
    Column('id', Integer, primary_key=True),
    Column('objectId', String(80), nullable=False),
    Column('deviceId', ForeignKey('devices.id'), nullable=False),
    Column('name', String(100), nullable=True),
    Column('metadata', JSONB, nullable=True)
)

hubs = Table(
    'hubs', meta,
    Column('id', Integer, primary_key=True),
    Column('hubId', String(80), nullable=False),
    Column('deviceId', ForeignKey('devices.id'), nullable=False),
    Column('name', String(100), nullable=True),
    #Column('mapId', ForeignKey('maps.id'), nullable=False),
    Column('metadata', JSONB, nullable=True)
)


async def get_device_env(deviceId, conn):
    q = select([devices.c.env]).where(devices.c.deviceId==deviceId).limit(1)
    res = await conn.execute(q)
    return res.rowcount and res[0][0] or DEFAULT_ENV


tables = [objects, hubs, devices]
