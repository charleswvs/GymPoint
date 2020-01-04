import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckingController from './app/controllers/CheckingController';
import StudentHelpOrderController from './app/controllers/StudentHelpOrderController';
import AcademyHelpOrderController from './app/controllers/AcademyHelpOrderController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// test route
// routes.get('/', (req, res) => res.json({ hello: 'world' }));
routes.post('/sessions', SessionController.store);

routes.get('/students/:id/checkins', CheckingController.index);
routes.post('/students/:id/checkins', CheckingController.store);

routes.get('/students/:id/help-orders', StudentHelpOrderController.index);
routes.post('/students/:id/help-orders', StudentHelpOrderController.store);

routes.use(authMiddleware);

routes.get('/students', StudentController.index);
routes.post('/students', StudentController.store);
routes.put('/students', StudentController.update);

routes.get('/help-orders', AcademyHelpOrderController.index);
routes.put('/help-orders/:id/answer', AcademyHelpOrderController.update);

routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/', PlanController.update);
routes.delete('/plans/', PlanController.delete);

routes.get('/registration', RegistrationController.index);
routes.post('/registration', RegistrationController.store);
routes.put('/registration/', RegistrationController.update);
routes.delete('/registration/', RegistrationController.delete);

export default routes;
