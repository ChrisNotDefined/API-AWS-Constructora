import uuid from 'uuid/v4';
import DBManager from '../managers/DBManager';

const pedidoDBSchema = {
  Id: {
    type: String,
    hashkey: true
  },
  Descripcion: String,
  Cantidad: Number,
  IDProveedor: String,
  IDProyecto: String,
  FechaLlegada: String,
  FechaSolicitud: String
};

export default class Pedido extends DBManager {
  Id;

  Descripcion;

  Cantidad;

  IDProveedor;

  IDProyecto;

  FechaLlegada;

  FechaSolicitud;

  constructor(
    Id,
    Descripcion,
    Cantidad,
    IDProveedor,
    IDProyecto,
    FechaLlegada,
    FechaSolicitud = new Date()
  ) {
    super('Pedidos', pedidoDBSchema);
    this.Id = Id;
    this.Descripcion = Descripcion;
    this.Cantidad = Cantidad;
    this.IDProveedor = IDProveedor;
    this.IDProyecto = IDProyecto;
    this.FechaLlegada = FechaLlegada;
    this.FechaSolicitud = FechaSolicitud;
  }

  toDBFormat() {
    return {
      ...this,
      FechaSolicitud: this.FechaSolicitud.toString()
    };
  }

  getKey() {
    return this.Id;
  }

  // eslint-disable-next-line class-methods-use-this
  fromDBResponse(pedido) {
    return new Pedido(
      pedido.Id,
      pedido.Descripcion,
      pedido.Cantidad,
      pedido.IDProveedor,
      pedido.IDProyecto,
      pedido.FechaLlegada,
      new Date(pedido.FechaSolicitud)
    );
  }

  static newPedido(
    Descripcion,
    Cantidad,
    IDProveedor,
    IDProyecto,
    FechaLlegada = 0
  ) {
    const Id = uuid();
    return new Pedido(
      Id,
      Descripcion,
      Cantidad,
      IDProveedor,
      IDProyecto,
      FechaLlegada
    );
  }
}
