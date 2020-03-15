import { BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes';
import { respond } from '../utils/response';
import BaseController from './BaseController';
import Provedor from '../models/Provedor';

export default class ProveController extends BaseController {
  static basePath = '/api/v1/proveedores';

  initialize() {
    // GET get posts list
    this.app.get(ProveController.basePath, ProveController.getAllProves);

    // GET get post by id
    this.app.get(
      `${ProveController.basePath}/:id`,
      ProveController.getProveById
    );

    // POST create a new post
    this.app.post(ProveController.basePath, ProveController.createProve);

    // PUT update existing post
    this.app.put(
      `${ProveController.basePath}/:id`,
      ProveController.updateProve
    );

    // DELETE delete post
    this.app.delete(
      `${ProveController.basePath}/:id`,
      ProveController.deleteProve
    );
  }

  static mount(app) {
    return new ProveController(app);
  }

  // Endpoints
  static async getAllProves(req, res) {
    try {
      const proves = await new Provedor().get();
      respond(res, OK, proves);
    } catch (e) {
      ProveController.handleUnknownError(res, e);
    }
  }

  static async getProveById(req, res) {
    try {
      const { id } = req.params;
      const prove = await new Provedor(id).getByKey();
      if (!prove) {
        respond(res, NOT_FOUND);
        return;
      }
      respond(res, OK, prove);
    } catch (e) {
      ProveController.handleUnknownError(res, e);
    }
  }

  static async createProve(req, res) {
    try {
      const expectedParams = [
        'Direccion',
        'NombreEmpresa',
        'NombreContacto',
        'Telefono',
        'PagWeb'
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
        Direccion,
        NombreEmpresa,
        NombreContacto,
        Telefono,
        PagWeb
      } = req.body;

      const prove = Provedor.newProvider(
        Direccion,
        NombreEmpresa,
        NombreContacto,
        Telefono,
        PagWeb
      );
      console.log(prove);
      await prove.create();

      respond(res, OK, prove);
    } catch (e) {
      ProveController.handleUnknownError(res, e);
    }
  }

  static async updateProve(req, res) {
    try {
      const { id } = req.params;
      const prove = await new Provedor(id).getByKey();
      if (!prove) {
        respond(res, NOT_FOUND);
        return;
      }

      const allowedParams = [
        'Direccion',
        'NombreEmpresa',
        'NombreContacto',
        'Telefono',
        'PagWeb'
      ];
      Object.keys(req.body).forEach(p => {
        if (allowedParams.includes(p)) {
          prove[p] = req.body[p];
        }
      });

      await prove.update();

      respond(res, OK, prove);
    } catch (e) {
      ProveController.handleUnknownError(res, e);
    }
  }

  static async deleteProve(req, res) {
    try {
      const { id } = req.params;
      await new Provedor(id).delete();
      respond(res, OK);
    } catch (e) {
      ProveController.handleUnknownError(res, e);
    }
  }
}
