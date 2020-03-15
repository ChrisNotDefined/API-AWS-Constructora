import uuid from 'uuid/v4';
import DBManager from '../managers/DBManager';

const projectDBSchema = {
  id: {
    type: String,
    hashKey: true
  },
  name: String,
  description: String,
  location: String,
  startedAt: String,
  finishAt: String,
  customer: String,
  inCharge: String
};

export default class Proyect extends DBManager {
  id;

  name;

  description;

  location;

  startedAt;

  finishAt;

  customer;

  inCharge;

  constructor(
    id,
    name,
    description,
    location,
    customer,
    inCharge,
    finishAt,
    startedAt = new Date()
  ) {
    super('Projects', projectDBSchema);
    this.id = id;
    this.name = name;
    this.description = description;
    this.location = location;
    this.customer = customer;
    this.inCharge = inCharge;
    this.finishAt = finishAt;
    this.startedAt = startedAt;
  }

  toDBFormat() {
    return {
      ...this,
      startedAt: this.startedAt.toString()
    };
  }

  getKey() {
    return this.id;
  }

  // eslint-disable-next-line class-methods-use-this
  fromDBResponse(project) {
    return new Proyect(
      project.id,
      project.name,
      project.description,
      project.location,
      project.customer,
      project.inCharge,
      project.finishAt,
      new Date(project.startedAt)
    );
  }

  static newProject(name, description, location, customer, inCharge, finishAt) {
    const id = uuid();
    return new Proyect(
      id,
      name,
      description,
      location,
      customer,
      inCharge,
      finishAt
    );
  }
}
