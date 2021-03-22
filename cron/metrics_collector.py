#!/usr/bin/env python3

import time
import os
from multiprocessing import Process, Pool
from typing import Optional, Type, Dict
from collections import defaultdict
from glob import glob
import logging

import croniter

import utils


VOLUME_LOCATION: str = '/gv0'


def _walk_tld(tld_path: str) -> (str, Dict[str, int], Dict[str, int]):
    file_size_by_type = defaultdict(int)
    file_count_by_type = defaultdict(int)
    for root, _, files in os.walk(tld_path):
        for filename in files:
            try:
                file_size = os.path.getsize(os.path.join(root, filename))
                _, file_type = os.path.splitext(filename)
                file_size_by_type[file_type] += file_size
                file_count_by_type[file_type] += 1
            except OSError:
                pass
    return tld_path, file_size_by_type, file_count_by_type


class RecordSizes(Process):
    def run(self) -> None:
        file_size_by_type = defaultdict(int)
        file_count_by_type = defaultdict(int)
        file_size_by_tld = defaultdict(int)
        file_count_by_tld = defaultdict(int)

        top_level_directories = glob(f"{VOLUME_LOCATION}/*/")
        logging.info("Starting pool to walk %s directories", len(top_level_directories))

        pool = Pool(20)
        results = pool.imap_unordered(_walk_tld, top_level_directories)
        pool.close()
        for tld_path, tld_sizes, tld_counts in results:
            tld_name = os.path.basename(os.path.dirname(tld_path))
            file_size_by_tld[tld_name] = sum(tld_sizes.values())
            file_count_by_tld[tld_name] = sum(tld_counts.values())
            for file_type, size in tld_sizes.items():
                file_size_by_type[file_type] += size
            for file_type, count in tld_counts.items():
                file_count_by_type[file_type] += count
        pool.terminate()

        logging.info("Finished walking directories, recording results")
        recording_time = time.time()

        metric_map = {
            'SIZE_BY_TYPE': file_size_by_type,
            'COUNT_BY_TYPE': file_count_by_type,
            'SIZE_BY_TLD': file_size_by_tld,
            'COUNT_BY_TLD': file_count_by_tld,
        }

        db_conn = utils.get_conn()
        cur = db_conn.cursor()
        for metric_type, metric_values in metric_map.items():
            cur.execute("""
                INSERT INTO metric_groups (metric_s, metric_type)
                VALUES (?, ?)
                ON CONFLICT DO NOTHING
            """, (recording_time, metric_type))
            group_id = cur.lastrowid
            for category, value in metric_values.items():
                try:
                    cur.execute("""
                        INSERT INTO metrics (group_id, metric_subtype, metric_value)
                        VALUES (?, ?, ?)
                        ON CONFLICT DO NOTHING
                    """, (group_id, category, value))
                except:
                    logging.error("%s, %s, %s", group_id, category, value)
                    raise
            db_conn.commit()
            logging.info("Successfully recorded %s", metric_type)
        db_conn.close()


class RecordDiskSizes(Process):
    def run(self) -> None:
        logging.info("Checking volume block details")
        size_info = os.statvfs(VOLUME_LOCATION)
        total_size = int(size_info.f_blocks * size_info.f_bsize)
        total_free = int(size_info.f_bfree * size_info.f_bsize)
        total_used = total_size - total_free
        db_conn = utils.get_conn()
        cur = db_conn.cursor()
        cur.execute("""
            INSERT INTO metric_groups (metric_s, metric_type)
            VALUES (?, 'VOLUME_SIZE')
            ON CONFLICT DO NOTHING
        """, (time.time(),))
        group_id = cur.lastrowid
        cur.execute("""
            INSERT INTO metrics (group_id, metric_subtype, metric_value)
            VALUES (?, 'TOTAL_SIZE', ?), (?, 'TOTAL_FREE', ?), (?, 'TOTAL_USED', ?)
            ON CONFLICT DO NOTHING
        """, (group_id, total_size, group_id, total_free, group_id, total_used))
        db_conn.commit()
        db_conn.close()
        logging.info("Recorded volume block details")


class Cron:
    def __init__(self, cron_expression: str, job_class: Type[Process]) -> None:
        self._cron_expression = cron_expression
        self._job_class = job_class
        self._cron = croniter.croniter(cron_expression)
        self._next_execution: float = 0
        self._current_execution: Optional[Type[Process]] = None

    def evaluate(self) -> None:
        if self._current_execution:
            if self._current_execution.is_alive():
                return
            self._current_execution.join()
            self._current_execution = None
        if time.time() > self._next_execution:
            logging.info("Starting job: %s", self._job_class.__name__)
            self._current_execution = self._job_class()
            self._current_execution.start()
            self._next_execution = self._cron.get_next(float)


JOBS = [
    ('*/10 * * * *', RecordSizes),
    ('*/10 * * * *', RecordDiskSizes),
]


def main() -> None:
    logging.info("Building cron jobs")
    current_jobs = []
    for job_cron, job_class in JOBS:
        current_jobs.append(Cron(job_cron, job_class))
    logging.info("Starting cron cycle")
    while True:
        for job in current_jobs:
            job.evaluate()
        time.sleep(10)


if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG, format="[%(asctime)s] %(levelname)s - %(message)s")
    main()
