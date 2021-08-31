import { Router } from 'express';

import UserControllers from './controllers/UserControllers';

const routes = Router();

routes.get('/user', UserControllers.list);
routes.get('/user/:id', UserControllers.findById);
routes.post('/user', UserControllers.createUser);

export default routes;
