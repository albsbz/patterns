import { Server, Socket } from 'socket.io';

import { ListEvent } from '../common/enums';
import { Database } from '../data/database';
import { ReorderService } from '../services/reorder.service';
import ProxifyClassWithLogger from '../helpers';
import { SnapshotStorage } from '../data/snapshotStorage';

abstract class SocketHandler {
  protected db: SnapshotStorage;

  protected reorderService: ReorderService;

  protected io: Server;

  public constructor(io: Server, snapshotStorage: SnapshotStorage, reorderService: ReorderService) {
    this.io = io;
    this.db = snapshotStorage;

    this.reorderService = ProxifyClassWithLogger(reorderService);
  }

  public abstract handleConnection(socket: Socket): void;

  protected updateLists(): void {
    this.io.emit(ListEvent.UPDATE, this.db.getData());
  }
}

export { SocketHandler };
