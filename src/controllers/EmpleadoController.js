import { BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes';
import { respond } from '../utils/response';
import BaseController from './BaseController';
import Empleado from '../models/Empleado';

export default class EmpleadoController extends BaseController {
  static basePath = '/api/v1/empleado';

  initialize() {
    // GET get posts list
    this.app.get(
      EmpleadoController.basePath,
      EmpleadoController.getAllEmpleados
    );

    // GET get post by id
    this.app.get(
      `${EmpleadoController.basePath}/:id`,
      EmpleadoController.getEmpleadoById
    );

    // POST create a new post
    this.app.post(
      EmpleadoController.basePath,
      EmpleadoController.createEmpleado
    );

    // PUT update existing post
    this.app.put(
      `${EmpleadoController.basePath}/:id`,
      EmpleadoController.updateEmpleado
    );

    // DELETE delete post
    this.app.delete(
      `${EmpleadoController.basePath}/:id`,
      EmpleadoController.deleteEmpleado
    );
  }

  static mount(app) {
    return new EmpleadoController(app);
  }

  // Start: Endpoints

  static async getAllEmpleados(req, res) {
    try {
      const empleados = await new Empleado().get();
      respond(res, OK, empleados);
    } catch (e) {
      EmpleadoController.handleUnknownError(res, e);
    }
  }

  static async getEmpleadoById(req, res) {
    try {
      const { id } = req.params;
      const empleado = await new Empleado(id).getByKey();

      if (!empleado) {
        respond(res, NOT_FOUND);
        return;
      }

      respond(res, OK, empleado);
    } catch (e) {
      EmpleadoController.handleUnknownError(res, e);
    }
  }

  static async createEmpleado(req, res) {
    try {
      const expectedParams = [
        'nombre',
        'apellidos',
        'idProyecto',
        'ocupacion',
        'correo',
        'telefono'
      ];
      const validationErrors = [];

      expectedParams.forEach(p => {
        if (!req.body[p]) {
          validationErrors.push(`${p} parameter was not found in the request`);
        }
      });

      if (validationErrors.length > 0) {
        respond(res, BAD_REQUEST, {
          message: validationErrors.join('\n')
        });
        return;
      }

      const {
        nombre,
        apellidos,
        idProyecto,
        ocupacion,
        correo,
        telefono
      } = req.body;
      const empleado = Empleado.newEmpleado(
        nombre,
        apellidos,
        idProyecto,
        ocupacion,
        correo,
        telefono
      );
      await empleado.create();

      respond(res, OK, empleado);
    } catch (e) {
      EmpleadoController.handleUnknownError(res, e);
    }
  }

  static async updateEmpleado(req, res) {
    try {
      const { id } = req.params;

      const empleado = await new Empleado(id).getByKey();

      if (!empleado) {
        respond(res, NOT_FOUND);
        return;
      }

      const allowedParams = [
        'nombre',
        'apellidos',
        'idProyecto',
        'ocupacion',
        'correo',
        'telefono'
      ];

      Object.keys(req.body).forEach(p => {
        if (allowedParams.includes(p)) {
          empleado[p] = req.body[p];
        }
      });

      await empleado.update();

      respond(res, OK, empleado);
    } catch (e) {
      EmpleadoController.handleUnknownError(e);
    }
  }

  static async deleteEmpleado(req, res) {
    try {
      const { id } = req.params;
      await new Empleado(id).delete();
      respond(res, OK);
    } catch (e) {
      EmpleadoController.handleUnknownError(e);
    }
  }

  // End: Endpoints
}
