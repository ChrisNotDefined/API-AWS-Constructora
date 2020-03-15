import uuid from 'uuid/v4';
import DBManager from '../managers/DBManager';

const provsDBSchema = {
  id: {
    type: String,
    hashKey: true
  },
  Direccion: String,
  NombreEmpresa: String,
  NombreContacto: String,
  Telefono: String,
  PagWeb: String
};

export default class Provedor extends DBManager {
  id;

  Direccion;

  NombreEmpresa;

  NombreContacto;

  Telefono;

  PagWeb;

  constructor(id, Direccion, NombreEmpresa, NombreContacto, Telefono, PagWeb) {
    super('provedores', provsDBSchema);
    this.id = id;
    this.Direccion = Direccion;
    this.NombreEmpresa = NombreEmpresa;
    this.NombreContacto = NombreContacto;
    this.Telefono = Telefono;
    this.PagWeb = PagWeb;
  }

  toDBFormat() {
    return {
      ...this
    };
  }

  getKey() {
    return this.id;
  }

  // eslint-disable-next-line class-methods-use-this
  fromDBResponse(prov) {
    return new Provedor(
      prov.id,
      prov.Direccion,
      prov.NombreEmpresa,
      prov.NombreContacto,
      prov.Telefono,
      prov.PagWeb
    );
  }

  static newProvider(
    Direccion,
    NombreEmpresa,
    NombreContacto,
    Telefono,
    PagWeb
  ) {
    const id = uuid();
    return new Provedor(
      id,
      Direccion,
      NombreEmpresa,
      NombreContacto,
      Telefono,
      PagWeb
    );
  }
}
