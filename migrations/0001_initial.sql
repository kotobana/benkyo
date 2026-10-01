CREATE TABLE IF NOT EXISTS app_data (
  id INTEGER PRIMARY KEY,
  payload TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 0
);

INSERT OR IGNORE INTO app_data (id, payload, revision) VALUES (1, '[]', 0);
