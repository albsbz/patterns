import { randomUUID } from "crypto";

class Card {
  public id: string;

  public name: string;

  public description: string;

  public createdAt: Date;

  public constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
    this.createdAt = new Date();
    this.id = randomUUID();
  }

  public clone() {
    const newCard = { ...this, createdAt: new Date(), id: randomUUID() };
    return newCard;
  }
}

export { Card };
