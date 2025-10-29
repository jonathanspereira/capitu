import { Book, ReadingStatus } from '@prisma/client';

export class BookDto {
  id!: number;
  title!: string;
  author!: string;
  readingStatus!: ReadingStatus;
  isFavorite!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
  userId!: number;

  public static fromEntity(book: Book): BookDto {
    const dto = new BookDto();
    dto.id = book.id;
    dto.title = book.title;
    dto.author = book.author;
    dto.readingStatus = book.readingStatus;
    dto.isFavorite = book.isFavorite;
    dto.createdAt = book.createdAt;
    dto.updatedAt = book.updatedAt;
    dto.userId = book.userId;
    return dto;
  }
}
