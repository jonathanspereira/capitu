import prisma from '../libs/prisma.lib';
import { FavoriteBookDto } from '../view/dto/favorite-book.dto';
import { GoogleBook } from '../gateways/googlebooks.gateway';

export interface CreateFavoriteBookData {
  title: string;
  author: string;
  thumbnail?: string;
  googleBookId?: string;
  description?: string;
  publishedDate?: string;
}

export class FavoriteBookService {
  // Serviços habilitados - banco sincronizado
  
  public async addToFavorites(userId: number, bookData: CreateFavoriteBookData): Promise<FavoriteBookDto> {
    const favoriteBook = await (prisma as any).favoriteBook.create({
      data: {
        ...bookData,
        userId,
      },
    });

    return FavoriteBookDto.fromEntity(favoriteBook);
  }

  public async removeFromFavorites(userId: number, favoriteBookId: number): Promise<void> {
    await (prisma as any).favoriteBook.deleteMany({
      where: { id: favoriteBookId, userId },
    });
  }

  public async listUserFavorites(userId: number): Promise<FavoriteBookDto[]> {
    const favoriteBooks = await (prisma as any).favoriteBook.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    
    return favoriteBooks.map(FavoriteBookDto.fromEntity);
  }

  public async isFavorite(userId: number, googleBookId?: string, title?: string, author?: string): Promise<boolean> {
    if (googleBookId) {
      const favorite = await (prisma as any).favoriteBook.findFirst({
        where: { userId, googleBookId },
      });
      return !!favorite;
    }

    if (title && author) {
      const favorite = await (prisma as any).favoriteBook.findFirst({
        where: { userId, title, author },
      });
      return !!favorite;
    }

    return false;
  }

  public async removeFromFavoritesByGoogleId(userId: number, googleBookId: string): Promise<void> {
    await (prisma as any).favoriteBook.deleteMany({
      where: { userId, googleBookId },
    });
  }

  public async removeFromFavoritesByTitleAuthor(userId: number, title: string, author: string): Promise<void> {
    await (prisma as any).favoriteBook.deleteMany({
      where: { userId, title, author },
    });
  }

  public static createFromGoogleBook(googleBook: GoogleBook): CreateFavoriteBookData {
    return {
      title: googleBook.title,
      author: googleBook.authors?.join(', ') || 'Autor desconhecido',
      thumbnail: googleBook.thumbnail,
      googleBookId: googleBook.id,
      description: googleBook.description,
      publishedDate: googleBook.publishedDate,
    };
  }
}
