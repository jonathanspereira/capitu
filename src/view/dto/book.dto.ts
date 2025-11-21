import { Book, ReadingStatus } from '@prisma/client';

export class BookDto {
  id!: number;
  title!: string;
  author!: string;
  readingStatus!: ReadingStatus;
  createdAt!: Date;
  updatedAt!: Date;
  userId!: number;
  thumbnail?: string;
  // googleBookId?: string; // Temporariamente comentado

  public static fromEntity(book: Book): BookDto {
    const dto = new BookDto();
    dto.id = book.id;
    dto.title = book.title;
    dto.author = book.author;
    dto.readingStatus = book.readingStatus;
    dto.createdAt = book.createdAt;
    dto.updatedAt = book.updatedAt;
    dto.userId = book.userId;
    dto.thumbnail = book.thumbnail || undefined;
    // dto.googleBookId = book.googleBookId || undefined; // Temporariamente comentado
    return dto;
  }
}
