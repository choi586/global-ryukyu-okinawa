// One conditional INSERT reserves bytes atomically, even across Worker instances.
export const mediaSchema = `
CREATE TABLE IF NOT EXISTS media_usage (id TEXT PRIMARY KEY, bytes INTEGER NOT NULL CHECK(bytes>=0));
CREATE TABLE IF NOT EXISTS media_policy (id INTEGER PRIMARY KEY CHECK(id=1), initialized INTEGER NOT NULL);
`;
export const reserveMediaSql = `INSERT INTO media_usage(id,bytes)
SELECT ?,? WHERE (SELECT initialized FROM media_policy WHERE id=1)=1
AND COALESCE((SELECT SUM(bytes) FROM media_usage),0)+?<=?
RETURNING id`;
