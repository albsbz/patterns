import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

import { lists } from './assets/mockData';
import { Database } from './data/database';
import { CardHandler } from './handlers/card.handler';
import { ListHandler } from './handlers/list.handler';
import { ReorderService } from './services/reorder.service';
import { SnapshotStorage } from './data/snapshotStorage';

const PORT = 3001;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const db = Database.Instance;
const snapshotStorage = new SnapshotStorage(db);
const reorderService = new ReorderService();

if (process.env.NODE_ENV !== 'production') {
  snapshotStorage.setData(lists);
  snapshotStorage.prepare();
}

const onConnection = (socket: Socket): void => {
  new ListHandler(io, snapshotStorage, reorderService).handleConnection(socket);
  new CardHandler(io, snapshotStorage, reorderService).handleConnection(socket);
};

io.on('connection', onConnection);

// eslint-disable-next-line no-console
httpServer.listen(PORT, () => console.log('listening on port: ' + PORT));

export { httpServer };
