import uuid from 'uuid/v4';
import DBManager from '../managers/DBManager';

const empleadoDBSchema = {
  // Esquema del Empleado
  id: {
    type: String,
    hashKey: true
  },
  nombre: String,
  apellidos: String,
  idProyecto: String,
  ocupacion: String,
  correo: String,
  telefono: String
};

export default class Empleado extends DBManager {
  id;

  nombre;

  apellidos;

  idProyecto;

  ocupacion;

  correo;

  telefono;

  constructor(id, nombre, apellidos, idProyecto, ocupacion, correo, telefono) {
    super('victor-empleados', empleadoDBSchema);
    this.id = id;
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.idProyecto = idProyecto;
    this.ocupacion = ocupacion;
    this.correo = correo;
    this.telefono = telefono;
  }

  toDBFormat() {
    return this;
  }

  getKey() {
    return this.id;
  }

  // eslint-disable-next-line class-methods-use-this
  fromDBResponse(empleado) {
    return new Empleado(
      empleado.id,
      empleado.nombre,
      empleado.apellidos,
      empleado.idProyecto,
      empleado.ocupacion,
      empleado.correo,
      empleado.telefono
    );
  }

  static newEmpleado(
    nombre,
    apellidos,
    idProyecto,
    ocupacion,
    correo,
    telefono
  ) {
    const id = uuid();
    return new Empleado(
      id,
      nombre,
      apellidos,
      idProyecto,
      ocupacion,
      correo,
      telefono
    );
  }
}
