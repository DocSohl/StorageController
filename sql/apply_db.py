#!/usr/bin/env python3

import argparse
import os
import sqlite3


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('sql', nargs='+')
    args = parser.parse_args()
    if not args.sql:
        parser.print_usage()
    else:
        db_conn = sqlite3.connect('../storage.db')
        cur = db_conn.cursor()
        for sql_file in args.sql:
            if not os.path.exists(sql_file) or not sql_file.endswith('.sql'):
                print(f"Unknown file {sql_file}")
                continue
            with open(sql_file, 'r') as f:
                for row in cur.executescript(f.read()):
                    print(row)
        db_conn.commit()
        print("Done")
