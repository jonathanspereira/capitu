import { FavoriteBook } from '@prisma/client';

export class FavoriteBookDto {
  id!: number;
  title!: string;
  author!: string;
  thumbnail?: string;
  googleBookId?: string;
  description?: string;
  publishedDate?: string;
  userId!: number;
  createdAt!: Date;

  public static fromEntity(favoriteBook: FavoriteBook): FavoriteBookDto {
    const dto = new FavoriteBookDto();
    dto.id = favoriteBook.id;
    dto.title = favoriteBook.title;
    dto.author = favoriteBook.author;
    dto.thumbnail = favoriteBook.thumbnail || undefined;
    dto.googleBookId = favoriteBook.googleBookId || undefined;
    dto.description = favoriteBook.description || undefined;
    dto.publishedDate = favoriteBook.publishedDate || undefined;
    dto.userId = favoriteBook.userId;
    dto.createdAt = favoriteBook.createdAt;
    return dto;
  }
}
