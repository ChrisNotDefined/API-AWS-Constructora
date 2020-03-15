import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import ProveController from './controllers/ProveController';

const app = express();
app.use(cors());
app.use(bodyParser.json());
ProveController.mount(app);

export default app;
