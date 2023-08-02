import { CardEvent, ListEvent } from '../common/enums';
import { Socket } from 'socket.io-client';

interface Emitter {
  [key: string]: (...args: any[]) => void;
}

let instance: Emitter;
let socketInstance: Socket;
// PATTERN: Singleton
const eventEmmitter = (socket?: Socket) => {
  if (socket) socketInstance = socket;
  if (!instance) {
    instance = {
      onCreateList: (name: string) => {
        socketInstance.emit(ListEvent.CREATE, name);
      },

      onDeleteList: (id: string) => {
        socketInstance.emit(ListEvent.DELETE, id);
      },

      onRenameList: (id: string, name: string) => {
        socketInstance.emit(ListEvent.RENAME, { id, name });
      },

      onCreateCard: (listId: string, cardName: string) => {
        socketInstance.emit(CardEvent.CREATE, listId, cardName);
      },

      onDeleteCard: (cardId: string) => {
        socketInstance.emit(CardEvent.DELETE, cardId);
      },

      onRenameCard: (cardId: string, name: string) => {
        socketInstance.emit(CardEvent.RENAME, cardId, name);
      },

      onChangeDescriptionCard: (cardId: string, description: string) => {
        socketInstance.emit(CardEvent.CHANGE_DESCRIPTION, cardId, description);
      },

      onCopyCard: (cardId: string) => {
        socketInstance.emit(CardEvent.COPY, cardId);
      },
    };
  }
  return instance;
};

export default eventEmmitter;
