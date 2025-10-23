import { SetupApplication } from './app/app';

class Server {
    static start(): void {
        const application = new SetupApplication(3000);
        application.init();
        application.start();
    }
}

Server.start();