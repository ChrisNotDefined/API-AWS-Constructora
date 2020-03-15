import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import ProveController from './controllers/ProveController';
import ProjectsController from './controllers/ProjectsController';

const app = express();
app.use(cors());
app.use(bodyParser.json());
ProveController.mount(app);
ProjectsController.mount(app);

export default app;
