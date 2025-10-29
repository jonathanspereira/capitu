import { Request, Response } from 'express';
import { RecommendationService } from '../services/recommendation.service';
import { GroqGateway } from '../gateways/groq.gateway';
import { OpenLibraryGateway } from '../gateways/openlibrary.gateway';
import { BookService } from '../services/book.service';

const bookService = new BookService();
const groqGateway = new GroqGateway();
const openLibraryGateway = new OpenLibraryGateway();
const recommendationService = new RecommendationService(bookService, groqGateway, openLibraryGateway);

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