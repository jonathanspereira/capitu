import { Request, Response } from "express";
import { BookService } from "../services/book.service";
import { ReadingStatus } from "@prisma/client";

const bookService = new BookService();

export class BookController {

    // Busca livros
    async search(req: Request, res: Response) {
        try {
        const query = req.query.q as string;
        const limit = Number(req.query.limit) || 10;

        if (!query) {
            return res.status(400).json({ error: "Parâmetro q é obrigatório" });
        }

        const books = await bookService.searchBooks(query, limit);
        return res.json(books);
        } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao buscar livros" });
        }
    }

    // Adiciona livro à lista do usuário
    async addBook(req: Request, res: Response) {
        try {
        const { userId, title, author } = req.body;

        if (!userId || !title || !author) {
            return res.status(400).json({ error: "Campos obrigatórios ausentes" });
        }

        const book = await bookService.addBookToUser(userId, { title, author });
        return res.status(201).json(book);
        } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao adicionar livro" });
        }
    }

    // Atualiza status de leitura do livro
    async updateStatus(req: Request, res: Response) {
        try {
        const { bookId, userId, status } = req.body;

        if (!bookId || !userId || !status) {
            return res.status(400).json({ error: "Campos obrigatórios ausentes" });
        }

        const updated = await bookService.updateReadingStatus(
            bookId,
            userId,
            status as ReadingStatus
        );

        if (!updated) return res.status(404).json({ error: "Livro não encontrado" });

        return res.json(updated);
        } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao atualizar status" });
        }
    }

    // Marca ou desmarca livro como favorito
    async toggleFavorite(req: Request, res: Response) {
        try {
        const { bookId, userId } = req.body;

        if (!bookId || !userId) {
            return res.status(400).json({ error: "Campos obrigatórios ausentes" });
        }

        const updated = await bookService.toggleFavorite(bookId, userId);
        return res.json(updated);
        } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao marcar favorito" });
        }
    }

    // Lista livros do usuário
    async listUserBooks(req: Request, res: Response) {
        try {
            const userId = Number(req.params.userId);
            const books = await bookService.listUserBooks(userId);
            return res.json(books);
        } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao listar livros" });
        }
    }

    //  Remove livro da lista do usuário
    async removeBookFromUser(req: Request, res: Response) {
        try {
            const { bookId, userId } = req.body;

            if (!bookId || !userId) {
            return res.status(400).json({ error: "Campos obrigatórios ausentes" });
            }

            const result = await bookService.removeBookFromUser(Number(bookId), Number(userId));

            return res.status(200).json(result);
        } catch (error: any) {
            console.error(error.message);
            if (error.message.includes("Livro não encontrado ou não pertence ao usuário")) {
            return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: "Erro ao remover livro" });
        }

    }
}
