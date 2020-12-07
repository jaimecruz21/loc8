from sqlalchemy import create_engine, MetaData

from app.settings import BASE_DIR, get_config
from app.db_meta import meta


DSN = "postgresql://{user}:{password}@{host}:{port}/{database}"

USER_CONFIG_PATH = BASE_DIR / 'config' / 'main.yaml'
USER_CONFIG = get_config(['-c', USER_CONFIG_PATH.as_posix()])
USER_DB_URL = DSN.format(**USER_CONFIG['postgres'])
user_engine = create_engine(USER_DB_URL)

TEST_CONFIG_PATH = BASE_DIR / 'config' / 'test.yaml'
TEST_CONFIG = get_config(['-c', TEST_CONFIG_PATH.as_posix()])
TEST_DB_URL = DSN.format(**TEST_CONFIG['postgres'])
test_engine = create_engine(TEST_DB_URL)


def admin_db_url(config):
    cfg = config.copy()
    cfg.update(database='postgres')
    return DSN.format(
        **cfg
    )


def setup_db(config):

    db_name = config['database']
    db_user = config['user']
    db_pass = config['password']
    ADMIN_DB_URL = admin_db_url(config)
    admin_engine = create_engine(ADMIN_DB_URL, isolation_level='AUTOCOMMIT')

    conn = admin_engine.connect()
    conn.execute("DROP DATABASE IF EXISTS %s" % db_name)
    #conn.execute("DROP ROLE IF EXISTS %s" % db_user)
    #conn.execute("CREATE USER %s WITH PASSWORD '%s'" % (db_user, db_pass))
    conn.execute("CREATE DATABASE %s ENCODING 'UTF8'" % db_name)
    conn.execute("GRANT ALL PRIVILEGES ON DATABASE %s TO %s" %
                 (db_name, db_user))
    conn.close()


def teardown_db(config):

    db_name = config['database']
    ADMIN_DB_URL = admin_db_url(config)
    admin_engine = create_engine(ADMIN_DB_URL, isolation_level='AUTOCOMMIT')
    conn = admin_engine.connect()
    conn.execute("""
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = '%s'
        AND pid <> pg_backend_pid();""" % db_name)
    conn.execute("DROP DATABASE IF EXISTS %s" % db_name)
    #conn.execute("DROP ROLE IF EXISTS %s" % db_user)
    conn.close()


def create_tables(engine=test_engine):
    meta.create_all(bind=engine)


def drop_tables(engine=test_engine):
    meta.drop_all(bind=engine)


