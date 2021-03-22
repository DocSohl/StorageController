import pysqlite3


def get_conn():
    return pysqlite3.connect('../storage.db')
