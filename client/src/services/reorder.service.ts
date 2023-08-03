import type { DraggableLocation } from '@hello-pangea/dnd';

import { Card, List } from '../common/types';

export const reorderService = {
  getCards(lists: List[], source: DraggableLocation) {
    return lists.find((list) => list.id === source.droppableId)?.cards || [];
  },
  // PATTERN: HOF
  reorderItems<T>(items: T[], startIndex: number, endIndex: number) {
    const [removed] = items.splice(startIndex, 1);
    items.splice(endIndex, 0, removed);
    return items;
  },

  reorderLists(items: List[], startIndex: number, endIndex: number): List[] {
    return this.reorderItems<List>(items, startIndex, endIndex);
  },

  reorderCards(lists: List[], source: DraggableLocation, destination: DraggableLocation): List[] {
    const current: Card[] = this.getCards(lists, source);
    const next: Card[] = this.getCards(lists, destination);
    const target: Card = current[source.index];

    const isMovingInSameList = source.droppableId === destination.droppableId;

    if (isMovingInSameList) {
      const reordered: Card[] = this.reorderItems<Card>(current, source.index, destination.index);

      return lists.map((list) => (list.id === source.droppableId ? { ...list, cards: reordered } : list));
    }

    const newLists = lists.map((list) => {
      let updatedList = { ...list };

      if (list.id === source.droppableId) {
        updatedList.cards = this.removeCardFromList(current, source.index);
        return updatedList;
      }

      if (list.id === destination.droppableId) {
        updatedList.cards = this.addCardToList(next, destination.index, target);
        return updatedList;
      }

      return list;
    });

    return newLists;
  },

  removeCardFromList(cards: Card[], index: number): Card[] {
    return cards.slice(0, index).concat(cards.slice(index + 1));
  },

  addCardToList(cards: Card[], index: number, card: Card): Card[] {
    return cards.slice(0, index).concat(card).concat(cards.slice(index));
  },
};
