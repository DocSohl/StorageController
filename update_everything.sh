#!/usr/bin/env bash

set -x

sudo systemctl stop metrics_collector.service
git pull
cd sql || exit
./apply_db.py ./*.sql
cd ..
sudo systemctl start metrics_collector.service
