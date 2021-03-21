
CREATE TABLE IF NOT EXISTS backups (
    id INTEGER PRIMARY KEY,
    start_s INTEGER,
    end_s INTEGER,
    volume_size_bytes BIGINT,
    uploaded_bytes BIGINT,
    status TEXT
);

CREATE TABLE IF NOT EXISTS metric_groups (
    id INTEGER PRIMARY KEY,
    metric_s INTEGER NOT NULL,
    metric_type TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS metric_groups_metric_s ON metric_groups (metric_s);
CREATE INDEX IF NOT EXISTS metric_groups_metric_type ON metric_groups (metric_type);
CREATE UNIQUE INDEX IF NOT EXISTS metric_groups_metric_s_metric_type ON metric_groups (metric_s, metric_type);


CREATE TABLE IF NOT EXISTS metrics (
    group_id INTEGER NOT NULL REFERENCES metric_groups(id),
    metric_value INTEGER NOT NULL,
    metric_subtype TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS metrics_group_id_metric_subtype ON metrics (group_id, metric_subtype);
CREATE INDEX IF NOT EXISTS metrics_group_id ON metrics (group_id);
