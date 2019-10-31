import express from 'express';
import routes from './routes';

import './database';

class App {
  // constructor to initiate aplication
  constructor() {
    this.server = express(); // define aplication's server

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server; // exports a new route
