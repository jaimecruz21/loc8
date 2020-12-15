import os
import argparse
import pathlib

from trafaret_config import commandline

from app.utils import TRAFARET


BASE_DIR = pathlib.Path(__file__).parent.parent
DEFAULT_CONFIG_PATH = BASE_DIR / 'config' / 'main.yaml'

ENV_PREFIX = 'LOC8'

DEFAULT_CONFIG = dict(
    postgres=dict(
        database='eserver',
        user='postgres',
        password='assword',
        host='localhost',
        port='5438',
        minsize=1,
        maxsize=5
    )
)


def get_env(key, default=None):
    env_key = '_'.join([ENV_PREFIX, key.upper()])
    return os.environ.get(env_key, default)


def get_env_config(default=None):
    default = default or DEFAULT_CONFIG
    config = dict(
        # getting the database config from env variables or default config
        postgres={
            key: get_env(key, default['postgres'].get(key))
            for key in DEFAULT_CONFIG['postgres'].keys()
        },
        host=get_env('host', default.get('host')),
        port=get_env('port', default.get('port')),
        jwt_secret=get_env('jwt_secret', default.get('jwt_secret'))
    )
    return config


def get_config(argv=None):
    ap = argparse.ArgumentParser()
    commandline.standard_argparse_options(
        ap,
        default_config=DEFAULT_CONFIG_PATH
    )

    # ignore unknown options
    options, unknown = ap.parse_known_args(argv)

    config = commandline.config_from_options(options, TRAFARET)
    return config
