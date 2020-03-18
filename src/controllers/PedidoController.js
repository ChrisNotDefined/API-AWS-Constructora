/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { OK, BAD_REQUEST, NOT_FOUND } from 'http-status-codes';
import { respond } from '../utils/response';
import BaseController from './BaseController';
import Pedido from '../models/Pedido';

export default class PedidoController extends BaseController {
  static basePath = '/api/v1/pedido';

  // eslint-disable-next-line class-methods-use-this
  initialize() {
    // GET get posts list
    this.app.get(PedidoController.basePath, PedidoController.getAllPedidos);

    // GET get post by id
    this.app.get(
      `${PedidoController.basePath}/:Id`,
      PedidoController.getPedidoById
    );

    // POST create a new post
    this.app.post(PedidoController.basePath, PedidoController.createPedido);

    // PUT update existing post
    this.app.put(
      `${PedidoController.basePath}/:Id`,
      PedidoController.updatePedido
    );

    // DELETE delete
    this.app.delete(
      `${PedidoController.basePath}/:Id`,
      PedidoController.deletePedido
    );
  }

  static mount(app) {
    return new PedidoController(app);
  }

  // Start: Endpoints

  static async getAllPedidos(req, res) {
    try {
      const pedidos = await new Pedido().get();
      // eslint-disable-next-line no-undef
      respond(res, OK, pedidos);
    } catch (e) {
      PedidoController.handleUnknownError(res, e);
    }
  }

  static async getPedidoById(req, res) {
    try {
      const { Id } = req.params;
      const pedido = await new Pedido(Id).getByKey();

      if (!pedido) {
        respond(res, NOT_FOUND);
        return;
      }

      respond(res, OK, pedido);
    } catch (e) {
      PedidoController.handleUnknownError(res, e);
    }
  }

  static async createPedido(req, res) {
    try {
      const expectedParams = [
        'Descripcion',
        'Cantidad',
        'IDProveedor',
        'IDProyecto',
        'FechaLlegada'
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
        Descripcion,
        Cantidad,
        IDProveedor,
        IDProyecto,
        FechaLlegada
      } = req.body;

      const pedido = Pedido.newPedido(
        Descripcion,
        Cantidad,
        IDProveedor,
        IDProyecto,
        FechaLlegada
      );
      await pedido.create();

      respond(res, OK, pedido);
    } catch (e) {
      PedidoController.handleUnknownError(res, e);
    }
  }

  static async updatePedido(req, res) {
    try {
      const { Id } = req.params;
      // const { user, content } = req.body;
      const pedido = await new Pedido(Id).getByKey();

      if (!pedido) {
        respond(res, NOT_FOUND);
        return;
      }

      const allowedParams = [
        'Descripcion',
        'Cantidad',
        'IDProveedor',
        'IDProyecto',
        'FechaLlegada'
      ];
      Object.keys(req.body).forEach(p => {
        if (allowedParams.includes(p)) {
          pedido[p] = req.body[p];
        }
      });
      pedido.FechaSolicitud = new Date();

      await pedido.update();
      respond(res, OK, pedido);
    } catch (e) {
      PedidoController.handleUnknownError(res, e);
    }
  }

  static async deletePedido(req, res) {
    try {
      const { Id } = req.params;
      await new Pedido(Id).delete();
      respond(res, OK);
    } catch (e) {
      PedidoController.handleUnknownError(e);
    }
  }

  // End: Endpoints
}
