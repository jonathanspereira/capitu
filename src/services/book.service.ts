import axios from "axios";
import prisma from '../libs/prisma.lib';
import { BookDto } from "../view/dto/book.dto";
import { ReadingStatus } from "@prisma/client";

interface BookSearchResult {
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  key: string;
}

export class BookService {
    private baseUrl = "https://openlibrary.org/search.json";

    // Busca livros
    public async searchBooks(query: string, limit = 10) {
        const url = `${this.baseUrl}?q=${encodeURIComponent(query)}&limit=${limit}`;
        const response = await axios.get(url);
        const data = response.data;

        const books = data.docs.map((doc: BookSearchResult) => ({
        title: doc.title,
        author: doc.author_name?.join(", ") || "Autor desconhecido",
        coverUrl: doc.cover_i
            ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
            : null,
        openLibraryWorkKey: doc.key,
        }));

        return books;
    }

    // Adiciona livro à lista do usuário
    public async addBookToUser(
        userId: number,
        bookData: { title: string; author: string }
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
            readingStatus: "TO_READ",
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
        const book = await prisma.book.updateMany({
        where: { id: bookId, userId },
        data: { readingStatus: status },
        });

        const updated = await prisma.book.findUnique({ where: { id: bookId } });
        return updated ? BookDto.fromEntity(updated) : null;
    }

    // Marca ou desmarca livro como favorito
    public async toggleFavorite(bookId: number, userId: number): Promise<BookDto> {
        const book = await prisma.book.findFirst({
        where: { id: bookId, userId },
        });

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
}
