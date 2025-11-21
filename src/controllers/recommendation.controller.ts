import { Request, Response } from 'express';
import { RecommendationService } from '../services/recommendation.service';
import { GroqGateway } from '../gateways/groq.gateway';
import { GoogleBooksGateway } from '../gateways/googlebooks.gateway';
import { BookService } from '../services/book.service';

const bookService = new BookService();
const groqGateway = new GroqGateway();
const googleBooksGateway = new GoogleBooksGateway();
const recommendationService = new RecommendationService(bookService, groqGateway, googleBooksGateway);

export class RecommendationController {
  public static async getSuggestions(req: Request, res: Response) {
    const userId = Number(req.params.userId);
    if (!userId) return res.status(400).json({ error: "UserId inválido" });

    try {
      const suggestions = await recommendationService.generateRecommendations(userId);
      return res.json({ suggestions });
    } catch (err) {
      console.error("Erro ao gerar recomendações:", err);
      return res.status(500).json({ error: "Erro ao gerar sugestões" });
    }
  }
}