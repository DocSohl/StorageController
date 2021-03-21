#!/usr/bin/env python3

import argparse
import os
import sqlite3


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('sql')
    args = parser.parse_args()
    if not args.sql:
        parser.print_usage()
    elif not os.path.exists(args.sql):
        print(f"Unknown file {args.sql}")
    else:
        db_conn = sqlite3.connect('../storage.db')
        cur = db_conn.cursor()
        with open(args.sql, 'r') as f:
            for row in cur.executescript(f.read()):
                print(row)
        db_conn.commit()
        print("Done")
