import type { Socket } from "socket.io";

import { ListEvent } from "../common/enums";
import { List } from "../data/models/list";
import { SocketHandler } from "./socket.handler";
import { eventHandlerConnector } from "../services/eventHandlerConnector";

export class ListHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    eventHandlerConnector({
      handlers: [
        [ListEvent.CREATE, this.createList],
        [ListEvent.GET, this.getLists],
        [ListEvent.REORDER, this.reorderLists],
        [ListEvent.DELETE, this.deleteList],
        [ListEvent.RENAME, this.renameList],
      ],
      socket: socket,
      context: this,
    });
  }

  private getLists(callback: (cards: List[]) => void): void {
    callback(this.db.getData());
  }

  private reorderLists(sourceIndex: number, destinationIndex: number): void {
    const lists = this.db.getData();
    const reorderedLists = this.reorderService.reorder(
      lists,
      sourceIndex,
      destinationIndex
    );
    this.db.setData(reorderedLists);
    this.updateLists();
  }

  private createList(name: string): void {
    const lists = this.db.getData();
    const newList = new List(name);
    this.db.setData(lists.concat(newList));
    this.updateLists();
  }

  private deleteList(id: string): void {
    const lists = this.db.getData();
    const updatedLists = lists.filter((list) => list.id !== id);
    this.db.setData(updatedLists);
    this.updateLists();
  }

  private renameList({ id, name }: { id: string; name: string }): void {
    const lists = this.db.getData();
    const updatedLists = lists.map((list) => {
      if (list.id === id) list.name = name;
      return list;
    });
    this.db.setData(updatedLists);
    this.updateLists();
  }
}
