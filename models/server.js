const express = require('express');
const cors = require('cors');
const { db } = require('../database/db');
const { UsersRouter } = require('../routes/users.routes');
const { RepairsRouter } = require('../routes/repairs.routes');
const globalErrorHandler = require('../controllers/error.controller');
const AppError = require('../utils/appError');
const { authRouter } = require('../routes/auth.routes');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.paths = {
      users: '/api/v1/users',
      repairs: '/api/v1/repairs',
      auth: '/api/v1/auth',
    };

    this.database();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  routes() {
    this.app.use(this.paths.users, UsersRouter);
    this.app.use(this.paths.repairs, RepairsRouter);
    this.app.use(this.paths.auth, authRouter);

    this.app.all('*', (req, res, next) => {
      return next(
        new AppError(`Can't find ${req.originalUrl} on this server`, 404)
      );
    });

    this.app.use(globalErrorHandler);
  }

  database() {
    db.authenticate()
      .then(() => console.log('Database authenticated'))
      .catch(error => console.log(error));

    db.sync(/*{ force: true }*/)
      .then(() => console.log('Database synced'))
      .catch(error => console.log(error));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
  }
}

module.exports = Server;
