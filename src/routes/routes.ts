import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import bookRoutes from './book.routes';
import recommendationRoutes from './recommendation.routes';
import favoriteRoutes from './favorite.routes';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/user', userRoutes);
routes.use('/books', bookRoutes);
routes.use('/recommendations', recommendationRoutes);
routes.use('/', favoriteRoutes);

export default routes;
