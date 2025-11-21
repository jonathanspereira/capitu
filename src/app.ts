import './utils/module-alias.util';
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Server } from 'node:http';
import router from './routes/routes';
import { BadRequestError, UnauthorizedError } from './helpers/api-errors';
import { setupSwagger } from './config/swagger.config';

export class SetupApplication {
  private server?: Server;

  constructor(private readonly port = 3000, public app = express()) {}

  public init(): void {
    this.setupExpress();
    this.setupSwagger();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupExpress(): void {
    this.app.use(
      cors({
        origin: "*",
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      })
    );

    this.app.use(cors());

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    this.app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
      next();
    });
  }

  private setupSwagger(): void {
    setupSwagger(this.app);
  }

  private setupRoutes(): void {
    this.app.use('/v1/api', router);
  }

  private setupErrorHandling(): void {
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.error(err);

      if (err instanceof BadRequestError || err instanceof UnauthorizedError) {
        return res.status(err.statusCode).json({ message: err.message });
      }

      res.status(500).json({ message: 'Internal Server Error' });
    });
  }

  public start(): void {
    this.server = this.app.listen(this.port, () => {
      console.log(`🚀 Server running on port ${this.port}`);
      console.log(`📘 Swagger Docs available at http://localhost:${this.port}/docs`);
    });
  }
}
