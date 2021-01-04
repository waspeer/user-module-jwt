import { Server } from './infrastructure/types';
import { UserDIContainer } from './infrastructure/user-di-container';

const container = new UserDIContainer();
const server = container.get<Server>('server');

server.start();
