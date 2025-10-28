import 'dotenv/config';
import { SetupApplication } from './app';

class Server {
  static start(): void {
    const port = process.env.PORT ? Number(process.env.PORT) : 3000;
    const application = new SetupApplication(port);
    application.init();
    application.start();
  }
}

Server.start();
