-- Planned D1 schema. Apply to an empty database when Cloudflare is connected.
CREATE TABLE IF NOT EXISTS records (
  namespace TEXT NOT NULL,
  id TEXT NOT NULL,
  data TEXT NOT NULL CHECK(json_valid(data)),
  PRIMARY KEY(namespace, id)
);
CREATE TABLE IF NOT EXISTS login_limits (
  id TEXT PRIMARY KEY,
  count INTEGER NOT NULL
);
