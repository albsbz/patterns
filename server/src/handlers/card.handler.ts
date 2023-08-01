import type { Socket } from "socket.io";

import { CardEvent } from "../common/enums";
import { Card } from "../data/models/card";
import { SocketHandler } from "./socket.handler";

export class CardHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(CardEvent.CREATE, this.createCard.bind(this));
    socket.on(CardEvent.REORDER, this.reorderCards.bind(this));
    socket.on(CardEvent.DELETE, this.deleteCard.bind(this));
    socket.on(CardEvent.RENAME, this.renameCard.bind(this));
    socket.on(
      CardEvent.CHANGE_DESCRIPTION,
      this.changeDescriptionCard.bind(this)
    );
    socket.on(CardEvent.COPY, this.copyCard.bind(this));
  }

  public createCard(listId: string, cardName: string): void {
    const newCard = new Card(cardName, "");
    const lists = this.db.getData();

    const updatedLists = lists.map((list) =>
      list.id === listId ? list.setCards(list.cards.concat(newCard)) : list
    );

    this.db.setData(updatedLists);
    this.updateLists();
  }

  private reorderCards({
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId,
  }: {
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): void {
    const lists = this.db.getData();
    const reordered = this.reorderService.reorderCards({
      lists,
      sourceIndex,
      destinationIndex,
      sourceListId,
      destinationListId,
    });
    this.db.setData(reordered);
    this.updateLists();
  }

  private deleteCard(cardId: string): void {
    console.log("Deleting card", cardId);
    const lists = this.db.getData();
    const updatedLists = lists.map((list) => {
      list.cards = list.cards.filter((c) => c.id !== cardId);
      return list;
    });

    this.db.setData(updatedLists);
    this.updateLists();
  }

  private renameCard(cardId: string, name: string): void {
    const lists = this.db.getData();
    const updatedLists = lists.map((list) => {
      list.cards = list.cards.map((c) => {
        if (c.id === cardId) c.name = name;
        return c;
      });
      return list;
    });

    this.db.setData(updatedLists);
    this.updateLists();
  }

  private changeDescriptionCard(cardId: string, description: string): void {
    const lists = this.db.getData();
    const updatedLists = lists.map((list) => {
      list.cards = list.cards.map((c) => {
        if (c.id === cardId) c.description = description;
        return c;
      });
      return list;
    });

    this.db.setData(updatedLists);
    this.updateLists();
  }

  private copyCard(cardId: string): void {
    console.log("Copying card", cardId);
    const lists = this.db.getData();
    const updatedLists = lists.map((list) => {
      list.cards.forEach((c) => {
        if (c.id === cardId) list.cards.push(new Card(c.name, c.description));
      });
      return list;
    });

    this.db.setData(updatedLists);
    this.updateLists();
  }
}
