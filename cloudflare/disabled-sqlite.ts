export class DatabaseSync {
  constructor() {
    throw new Error('Local SQLite is disabled in Workers; use the D1 binding.');
  }
}
