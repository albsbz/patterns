import { Database } from './database';
import { List } from './models/list';
import { Snapshot } from './models/snapshot';

type ISnapshot = Array<Snapshot>;

// PATTERN: MEMENTO
export class SnapshotStorage {
  private snapshots: ISnapshot;
  private iterator: number = 0;
  private database: Database;

  constructor(database: Database) {
    this.database = database;
    this.snapshots = [];
  }

  prepare() {
    const snapshot = this.database.createSnapshot();
    this.snapshots = [snapshot];
    this.iterator = 0;
  }

  setData(data: List[]): void {
    if (this.snapshots.length) {
      const snapshot = this.database.createSnapshot();
      this.snapshots.length = this.iterator + 1;
      this.snapshots.push(snapshot);
      this.iterator = this.iterator + 1;
    }
    this.database.setData(data);
  }

  getData(): List[] {
    return this.database.getData();
  }

  getPrevious() {
    this.iterator = this.iterator > 0 ? this.iterator - 1 : 0;
    this.database.restore(this.snapshots[this.iterator]);
  }

  getNext() {
    this.iterator = this.iterator + 1 < this.snapshots.length ? this.iterator + 1 : this.iterator;
    this.database.restore(this.snapshots[this.iterator]);
  }
}
