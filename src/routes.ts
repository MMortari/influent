import { Router } from 'express';
import shelljs from 'shelljs';

import AuthControllers from './controllers/AuthControllers';
import UserControllers from './controllers/UserControllers';
import ProposalControllers from './controllers/ProposalControllers';

const routes = Router();

routes.get('/', (req, res) => {
  return res.send('Hello from influent API.');
});

routes.get('/migrate', (req, res) => {
  console.log('Running migration');
  shelljs.exec('npx prisma migrate dev');

  return res.send('Migrate run successfully');
});
routes.get('/migrate/reset', (req, res) => {
  console.log('Reseting database');
  shelljs.exec('npx prisma migrate reset -f');
  console.log('Running migration');
  shelljs.exec('npx prisma migrate dev');

  return res.send('Migrate run successfully');
});

routes.post('/auth', AuthControllers.auth);

routes.get('/user', UserControllers.list);
routes.get('/user/:id', UserControllers.findById);
routes.post('/user', UserControllers.createUser);
routes.post('/user/:type/search', UserControllers.searchUser);
routes.get('/user/:id/proposal', UserControllers.findAllProposal);
routes.get('/user/:id/job', UserControllers.findAllJob);

routes.get('/proposal', ProposalControllers.list);
routes.get('/proposal/:id_proposal', ProposalControllers.info);
routes.post('/proposal', ProposalControllers.createNew);
routes.post('/proposal/negotiation/:id_negotiation/aproval', ProposalControllers.aprovalProposal);
routes.post('/proposal/negotiation/:id_negotiation/refuse', ProposalControllers.refuseProposal);
routes.post('/proposal/:id_proposal/negociation', ProposalControllers.negociationProposal);
routes.post('/proposal/negotiation/:id_negotiation/finish', ProposalControllers.finishProposal);

export default routes;
