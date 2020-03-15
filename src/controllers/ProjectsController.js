import { BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes';
import { respond } from '../utils/response';
import BaseController from './BaseController';
import Project from '../models/Project';

export default class ProjectsController extends BaseController {
  static basePath = '/api/v1/projects';

  initialize() {
    // GET get posts list
    this.app.get(
      ProjectsController.basePath,
      ProjectsController.getAllProjects
    );

    // Get get posts by id
    this.app.get(
      `${ProjectsController.basePath}/:id`,
      ProjectsController.getProjectById
    );

    // POST create new post
    this.app.post(
      ProjectsController.basePath,
      ProjectsController.createProject
    );

    // PUT create new put
    this.app.put(
      `${ProjectsController.basePath}/:id`,
      ProjectsController.updateProject
    );

    // DELETE create new delete
    this.app.delete(
      `${ProjectsController.basePath}/:id`,
      ProjectsController.deleteProject
    );
  }

  static mount(app) {
    return new ProjectsController(app);
  }

  // Start: Endpoints

  static async getAllProjects(req, res) {
    try {
      const posts = await new Project().get();
      respond(res, OK, posts);
    } catch (e) {
      ProjectsController.handleUnknownError(res, e);
    }
  }

  static async getProjectById(req, res) {
    try {
      const { id } = req.params;
      const post = await new Project(id).getByKey();
      if (!post) {
        respond(res, NOT_FOUND);
        return;
      }

      respond(res, OK, post);
    } catch (e) {
      ProjectsController.handleUnknownError(res, e);
    }
  }

  static async createProject(req, res) {
    try {
      const expectedParams = [
        'name',
        'description',
        'location',
        'customer',
        'inCharge',
        'finishAt'
      ];
      const validationErrors = [];

      expectedParams.forEach(p => {
        if (!req.body[p]) {
          validationErrors.push(
            validationErrors.push(`${p} parameter was not found in the request`)
          );
        }
      });

      if (validationErrors.length > 0) {
        respond(res, BAD_REQUEST, {
          message: validationErrors.join('\n')
        });
        return;
      }
      const {
        name,
        description,
        location,
        customer,
        inCharge,
        finishAt
      } = req.body;

      const project = Project.newProject(
        name,
        description,
        location,
        customer,
        inCharge,
        finishAt
      );
      await project.create();
      respond(res, OK, project);
    } catch (e) {
      ProjectsController.handleUnknownError(res, e);
    }
  }

  static async updateProject(req, res) {
    try {
      const { id } = req.params;
      const project = await new Project(id).getByKey();

      if (!project) {
        respond(res, NOT_FOUND);
        return;
      }

      const allowedParams = [
        'name',
        'description',
        'location',
        'customer',
        'inCharge',
        'finishAt'
      ];

      Object.keys(req.body).forEach(p => {
        if (allowedParams.includes(p)) {
          project[p] = req.body[p];
        }
      });

      await project.update();

      respond(res, OK, project);
    } catch (e) {
      ProjectsController.handleUnknownError(res, e);
    }
  }

  static async deleteProject(req, res) {
    try {
      const { id } = req.params;
      await new Project(id).delete();
      respond(res, OK);
    } catch (e) {
      ProjectsController.handleUnknownError(res, e);
    }
  }
  // End: Endpoints
}
