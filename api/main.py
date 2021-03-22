import os

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from glustercli.cli import volume, peer

import utils

VOLUME = 'gv0'

app = FastAPI()


@app.get('/dashboard/health/controller')
def get_health_controller():
    try:
        conn = utils.get_conn()
        cur = conn.cursor()
        cur.execute("SELECT 1;")
        cur.fetchone()
        return {'status': 'success', 'text': 'Operational'}
    except:
        return {'status': 'warning', 'text': 'Database Error'}


@app.get('/dashboard/health/storage')
def get_health_storage():
    try:
        volume_status = volume.status_detail(VOLUME)[0]
    except FileNotFoundError:
        return {'status': 'error', 'text': "Couldn't contact filesystem"}
    if volume_status['status'] != 'Started':
        return {'status': 'error', 'text': f"Bad state {volume_status['status']}"}
    num_bricks = volume_status['num_bricks']
    distribution = volume_status['distribute']
    redundancy = volume_status['disperse_redundancy']
    if num_bricks < (distribution - redundancy):
        return {'status': 'error', 'text': "Critical disk failure"}
    if num_bricks < distribution:
        return {'status': 'warning', 'text': "Some disk failure"}
    if len(volume_status['bricks']) != num_bricks:
        return {'status': 'warning', 'text': "Unaccounted disks"}
    return {'status': 'success', 'text': 'Operational'}


@app.get('/dashboard/health/disks')
def get_health_disks():
    try:
        volume_status = volume.status_detail(VOLUME)[0]
    except FileNotFoundError:
        return {'healthy': 0, 'total': 0}
    total_volumes = 0
    online_volumes = 0
    for brick in volume_status['bricks']:
        total_volumes += 1
        if brick['online']:
            online_volumes += 1
    return {'healthy': online_volumes, 'total': total_volumes}


@app.get('/dashboard/health/nodes')
def get_health_nodes():
    try:
        peer_pool = peer.pool()
    except FileNotFoundError:
        return {'healthy': 0, 'total': 0}
    total_peers = 0
    online_peers = 0
    for p in peer_pool:
        total_peers += 1
        if p['connected'] == 'Connected':
            online_peers += 1
    return {'healthy': online_peers, 'total': total_peers}


@app.get('/dashboard/backup/status')
def get_backup_status():
    return {'status': 'info', 'text': 'Backups not yet available'}


@app.get('/dashboard/backup/next')
def get_backup_next():
    return {'value': 'Not Scheduled'}


@app.get('/dashboard/backup/speed')
def get_backup_speed():
    return {'value': '0 MB/s'}


@app.get('/dashboard/backup/progress')
def get_backup_progress():
    return {'completed': 0, 'total': 0, 'unit': 'MB'}


@app.get('/dashboard/storage/total')
def get_backup_progress():
    conn = utils.get_conn()
    cur = conn.cursor()
    cur.execute("""
        SELECT id
        FROM metric_groups
        WHERE metric_type = 'VOLUME_SIZE'
        ORDER BY metric_s DESC
        LIMIT 1
    """)
    group_id = cur.fetchone()[0]
    cur.execute("""
        SELECT metric_value
        FROM metrics
        WHERE group_id = ?
          AND metric_subtype = 'TOTAL_SIZE'
    """, (group_id,))
    total_size = cur.fetchone()[0]
    cur.execute("""
        SELECT metric_value
        FROM metrics
        WHERE group_id = ?
          AND metric_subtype = 'TOTAL_USED'
    """, (group_id,))
    total_used = cur.fetchone()[0]
    return {'used': round(total_used / 1e12, 2), 'total': round(total_size / 1e12, 2), 'unit': 'TB'}


def _get_metric_generic(metric_type: str):
    conn = utils.get_conn()
    cur = conn.cursor()
    cur.execute("""
            SELECT id
            FROM metric_groups
            WHERE metric_type = ?
            ORDER BY metric_s DESC
            LIMIT 1
        """, (metric_type,))
    group_id = cur.fetchone()[0]
    cur.execute("""
            SELECT metric_subtype, metric_value
            FROM metrics
            WHERE group_id = ?
            ORDER BY metric_value DESC
        """, (group_id,))
    results = []
    for i, row in enumerate(cur):
        if i > 10:
            results[-1]['subtype'] = 'Other'
            results[-1]['value'] += row[1]
        else:
            results.append({
                'subtype': row[0],
                'value': row[1],
            })
    return results


@app.get('/dashboard/storage/usage')
def get_storage_usage(group: str = 'tld'):
    if group == 'tld':
        metric_type = 'SIZE_BY_TLD'
    elif group == 'type':
        metric_type = 'SIZE_BY_TYPE'
    else:
        raise HTTPException(status_code=400, detail="Invalid Group")
    return _get_metric_generic(metric_type)


@app.get('/dashboard/storage/counts')
def get_storage_file_types(group: str = 'tld'):
    if group == 'tld':
        metric_type = 'COUNT_BY_TLD'
    elif group == 'type':
        metric_type = 'COUNT_BY_TYPE'
    else:
        raise HTTPException(status_code=400, detail="Invalid Group")
    return _get_metric_generic(metric_type)


if os.path.exists('../web/build'):
    app.mount("/", StaticFiles(directory="../web/build", html=True), name="static")
    app.mount("/css", StaticFiles(directory="../web/build/static/css", html=True), name="static/css")
    app.mount("/js", StaticFiles(directory="../web/build/static/js", html=True), name="static/js")
    app.mount("/media", StaticFiles(directory="../web/build/static/media", html=True), name="static/media")
