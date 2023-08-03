import logger from '../services/errorBoundary.service';
import { List } from './models/list';
import { Snapshot } from './models/snapshot';
import { cloneDeep } from 'lodash';

class Database {
  private static instance: Database | null = null;

  private data: List[];

  private constructor() {
    this.data = [];
  }

  public static get Instance(): Database {
    if (!this.instance) {
      this.instance = new Database();
    }

    return this.instance;
  }

  public setData(data: List[]): void {
    logger.log({ message: 'Database updated', payload: data });
    this.data = data;
  }

  public getData(): List[] {
    return this.data;
  }

  public createSnapshot() {
    return new Snapshot(cloneDeep(this.data));
  }

  public restore(snapshot: Snapshot): void {
    this.data = cloneDeep(snapshot.getState());
  }
}

export { Database };
