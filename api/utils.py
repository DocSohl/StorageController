import sqlite3

_db_conn = None

def get_conn():
    global _db_conn
    if not _db_conn:
        _db_conn = sqlite3.connect('storage.db')
    return _db_conn
