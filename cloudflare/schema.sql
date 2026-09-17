-- D1 schema. Existing R2 inventory must be registered before enabling media_policy.
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

CREATE TABLE IF NOT EXISTS media_usage (id TEXT PRIMARY KEY, bytes INTEGER NOT NULL CHECK(bytes>=0));
CREATE TABLE IF NOT EXISTS media_policy (id INTEGER PRIMARY KEY CHECK(id=1), initialized INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS public_notice_list ON records(namespace, json_extract(data,'$.status'), COALESCE(json_extract(data,'$.category'),'news'), json_extract(data,'$.pinned') DESC, json_extract(data,'$.publishedAt') DESC, id DESC);
CREATE INDEX IF NOT EXISTS public_notice_slug ON records(namespace, json_extract(data,'$.status'), json_extract(data,'$.slug'));
