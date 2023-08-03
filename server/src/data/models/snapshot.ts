import { List } from './list';

export class Snapshot {
  snapshot: List[];
  constructor(snapshot: List[]) {
    this.snapshot = snapshot;
  }

  getState() {
    return this.snapshot;
  }
}
