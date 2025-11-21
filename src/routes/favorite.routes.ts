import { Router } from 'express';
import { FavoriteBookController } from '../controllers/favorite-book.controller';
import { authMiddleware } from '../middlewares/isAuthenticated';

const favoriteRoutes = Router();

// Listar favoritos do usuário
favoriteRoutes.get('/favorites/:userId', authMiddleware, FavoriteBookController.getUserFavorites);

// Adicionar livro aos favoritos
favoriteRoutes.post('/favorites/:userId', authMiddleware, FavoriteBookController.addToFavorites);

// Remover livro dos favoritos
favoriteRoutes.delete('/favorites/:userId/:favoriteId', authMiddleware, FavoriteBookController.removeFromFavorites);

// Verificar se livro é favorito
favoriteRoutes.post('/favorites/:userId/check', authMiddleware, FavoriteBookController.checkIsFavorite);

// Remover livro dos favoritos por Google Book ID
favoriteRoutes.delete('/favorites/:userId/by-google-id', authMiddleware, FavoriteBookController.removeFromFavoritesByGoogleId);

export default favoriteRoutes;
