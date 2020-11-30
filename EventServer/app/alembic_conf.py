from app.settings import get_config
from app import db


def db_uri():
    cfg = get_config().get('postgres')
    driver = 'postgresql'
    user = cfg.get('user')
    password = cfg.get('password')
    host = cfg['host']
    port = cfg['port']
    database = cfg['database']
    return f'{driver}://{user}:{password}@{host}:{port}/{database}'