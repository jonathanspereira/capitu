import prisma from '../libs/prisma.lib';
import { BookDto } from "../view/dto/book.dto";
import { ReadingStatus } from "@prisma/client";
import { OpenLibraryGateway, OpenLibraryBook } from "../gateways/openlibrary.gateway";

export class BookService {
  private readonly openLibraryGateway = new OpenLibraryGateway();

  // Busca livros na OpenLibrary
  public async searchBooks(
    query: string,
    limit = 10
  ): Promise<Array<OpenLibraryBook & { coverUrl?: string }>> {
    try {
      // Cria um array de promessas para buscas em paralelo
      const promises = Array.from({ length: limit }).map(() =>
        this.openLibraryGateway.searchBook(query)
      );

      // Aguarda todas as requisições terminarem
      const results = await Promise.all(promises);

      // Filtra resultados válidos e apenas em português
      const books = results
        .filter(
          (book): book is OpenLibraryBook =>
            book !== null && !!book.language?.includes("por")
        )
        .map((book) => ({
          ...book,
          coverUrl: book.cover_i
            ? this.openLibraryGateway.getCoverUrl(book.cover_i, "L")
            : undefined,
        }));

      return books;
    } catch (err) {
      console.error("Erro ao buscar livros na OpenLibrary:", err);
      return [];
    }
  }
  
  // Adiciona livro à lista do usuário
  public async addBookToUser(
    userId: number,
    bookData: { title: string; author: string; thumbnail?: string; readingStatus: ReadingStatus }
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

  // Marca ou desmarca livro como favorito
  public async toggleFavorite(bookId: number, userId: number): Promise<BookDto> {
    const book = await prisma.book.findFirst({ where: { id: bookId, userId } });
    if (!book) throw new Error("Livro não encontrado");

    const updated = await prisma.book.update({
      where: { id: book.id },
      data: { isFavorite: !book.isFavorite },
    });

    return BookDto.fromEntity(updated);
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
