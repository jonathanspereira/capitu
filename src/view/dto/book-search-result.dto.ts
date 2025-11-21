import { GoogleBook } from '../../gateways/googlebooks.gateway';

export class BookSearchResultDto {
  id!: string;
  title!: string;
  authors!: string[];
  publishedDate?: string;
  thumbnail?: string;
  description?: string;
  pageCount?: number;
  publisher?: string;
  language?: string;
  coverUrl?: string;
  isFavorite?: boolean;

  public static fromGoogleBook(googleBook: GoogleBook, isFavorite = false): BookSearchResultDto {
    const dto = new BookSearchResultDto();
    dto.id = googleBook.id;
    dto.title = googleBook.title;
    dto.authors = googleBook.authors || [];
    dto.publishedDate = googleBook.publishedDate;
    dto.thumbnail = googleBook.thumbnail;
    dto.description = googleBook.description;
    dto.pageCount = googleBook.pageCount;
    dto.publisher = googleBook.publisher;
    dto.language = googleBook.language;
    dto.coverUrl = googleBook.thumbnail;
    dto.isFavorite = isFavorite;
    return dto;
  }
}
