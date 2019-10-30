import { Router } from 'express';

const routes = new Router();

// test route
routes.get('/', (req, res) => res.json({ hello: 'world' }));

export default routes;
