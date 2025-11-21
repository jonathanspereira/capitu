import prisma from '../libs/prisma.lib';
import { BookDto } from "../view/dto/book.dto";
import { ReadingStatus } from "@prisma/client";
import { GoogleBooksGateway, GoogleBook } from "../gateways/googlebooks.gateway";
import { BookSearchResultDto } from "../view/dto/book-search-result.dto";
import { FavoriteBookService } from "./favorite-book.service";

export class BookService {
  private readonly googleBooksGateway = new GoogleBooksGateway();
  private readonly favoriteBookService = new FavoriteBookService();

  // Busca livros no Google Books com informação de favoritos
  public async searchBooks(query: string, userId?: number, limit = 10): Promise<BookSearchResultDto[]> {
  try {
    const books: GoogleBook[] = [];
    
    const book = await this.googleBooksGateway.searchBook(query, limit);
    if (book) books.push(...book);

    if (userId) {
      return await Promise.all(
        books.map(async (book) => {
          const isFavorite = await this.favoriteBookService.isFavorite(
            userId,
            book.id,
            book.title,
            book.authors?.join(', ')
          );
          return BookSearchResultDto.fromGoogleBook(book, isFavorite);
        })
      );
    }

    return books.map(book => BookSearchResultDto.fromGoogleBook(book));
  } catch (err) {
    console.error("Erro ao buscar livros no Google Books:", err);
    return [];
  }
}

  
  // Adiciona livro à lista do usuário
  public async addBookToUser(
    userId: number,
    bookData: { title: string; author: string; thumbnail?: string; readingStatus: ReadingStatus; googleBookId?: string }
  ): Promise<BookDto> {
    const existing = await prisma.book.findFirst({
      where: {
        title: bookData.title,
        author: bookData.author,
        userId,
      },
    });

    if (existing) return BookDto.fromEntity(existing);

    const book = await prisma.book.create({
      data: {
        title: bookData.title,
        author: bookData.author,
        userId,
        readingStatus: bookData.readingStatus,
        thumbnail: bookData.thumbnail ?? null,
        // googleBookId: bookData.googleBookId ?? null, // Temporariamente comentado
      },
    });

    return BookDto.fromEntity(book);
  }

  // Atualiza status de leitura do livro
  public async updateReadingStatus(
    bookId: number,
    userId: number,
    status: ReadingStatus
  ): Promise<BookDto | null> {
    await prisma.book.updateMany({
      where: { id: bookId, userId },
      data: { readingStatus: status },
    });

    const updated = await prisma.book.findUnique({ where: { id: bookId } });
    return updated ? BookDto.fromEntity(updated) : null;
  }

  // Lista livros do usuário
  public async listUserBooks(userId: number): Promise<BookDto[]> {
    const books = await prisma.book.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return books.map(BookDto.fromEntity);
  }

  // Remove livro da lista do usuário
  public async removeBookFromUser(bookId: number, userId: number): Promise<{ message: string }> {
    const book = await prisma.book.findFirst({
    where: { id: bookId, userId },
  });

  if (!book) {
    throw new Error('Livro não encontrado ou não pertence ao usuário');
  }

  await prisma.book.delete({
    where: { id: bookId },
  });

  return { message: 'Livro removido com sucesso!' };
}


}
