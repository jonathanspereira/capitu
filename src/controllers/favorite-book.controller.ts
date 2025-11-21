import { Request, Response } from 'express';
import { FavoriteBookService } from '../services/favorite-book.service';
import { GoogleBooksGateway } from '../gateways/googlebooks.gateway';

const favoriteBookService = new FavoriteBookService();
const googleBooksGateway = new GoogleBooksGateway();

export class FavoriteBookController {
  // GET /favorites/:userId - Lista favoritos do usuário
  public static async getUserFavorites(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      if (!userId) {
        return res.status(400).json({ error: 'UserId inválido' });
      }

      const favorites = await favoriteBookService.listUserFavorites(userId);
      return res.json(favorites);
    } catch (error) {
      console.error('Erro ao listar favoritos:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // POST /favorites/:userId - Adiciona livro aos favoritos
  public static async addToFavorites(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      if (!userId) {
        return res.status(400).json({ error: 'UserId inválido' });
      }

      const { googleBookId, title, author } = req.body;

      // Se tem googleBookId, busca dados completos do Google Books
      if (googleBookId) {
        const googleBook = await googleBooksGateway.searchBook(title, author);
        if (!googleBook) {
          return res.status(404).json({ error: 'Livro não encontrado no Google Books' });
        }

        const bookData = FavoriteBookService.createFromGoogleBook(googleBook);
        const favorite = await favoriteBookService.addToFavorites(userId, bookData);
        return res.status(201).json(favorite);
      }

      // Caso contrário, usa dados fornecidos manualmente
      if (!title || !author) {
        return res.status(400).json({ error: 'Título e autor são obrigatórios' });
      }

      const bookData = {
        title,
        author,
        thumbnail: req.body.thumbnail,
        description: req.body.description,
        publishedDate: req.body.publishedDate,
      };

      const favorite = await favoriteBookService.addToFavorites(userId, bookData);
      return res.status(201).json(favorite);
    } catch (error) {
      console.error('Erro ao adicionar aos favoritos:', error);
      
      if (error instanceof Error && error.message.includes('Unique constraint')) {
        return res.status(409).json({ error: 'Livro já está nos favoritos' });
      }
      
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // DELETE /favorites/:userId/:favoriteId - Remove livro dos favoritos
  public static async removeFromFavorites(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const favoriteId = Number(req.params.favoriteId);
      
      if (!userId || !favoriteId) {
        return res.status(400).json({ error: 'UserId e FavoriteId são obrigatórios' });
      }

      await favoriteBookService.removeFromFavorites(userId, favoriteId);
      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao remover dos favoritos:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // POST /favorites/:userId/check - Verifica se um livro é favorito
  public static async checkIsFavorite(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      if (!userId) {
        return res.status(400).json({ error: 'UserId inválido' });
      }

      const { googleBookId, title, author } = req.body;
      const isFavorite = await favoriteBookService.isFavorite(userId, googleBookId, title, author);
      
      return res.json({ isFavorite });
    } catch (error) {
      console.error('Erro ao verificar favorito:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // DELETE /favorites/:userId/by-google-id - Remove livro dos favoritos por Google Book ID
  public static async removeFromFavoritesByGoogleId(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const { googleBookId } = req.body;
      
      if (!userId || !googleBookId) {
        return res.status(400).json({ error: 'UserId e googleBookId são obrigatórios' });
      }

      await favoriteBookService.removeFromFavoritesByGoogleId(userId, googleBookId);
      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao remover dos favoritos:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
