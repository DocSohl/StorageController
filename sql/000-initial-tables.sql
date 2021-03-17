
CREATE TABLE IF NOT EXISTS backups (
    id INTEGER PRIMARY KEY,
    start_s INTEGER,
    end_s INTEGER,
    volume_size_bytes BIGINT,
    status TEXT
);

CREATE TABLE IF NOT EXISTS metrics (
    metric_s INTEGER NOT NULL,
    metric_type TEXT NOT NULL,
    metric_value FLOAT NOT NULL,
    metric_subtype TEXT
);

CREATE INDEX IF NOT EXISTS metrics_metric_type ON metrics (metric_type);
CREATE INDEX IF NOT EXISTS metrics_metric_s ON metrics (metric_s);
CREATE INDEX IF NOT EXISTS metrics_metric_s_metric_type ON metrics (metric_s, metric_type);
