import { BookService } from "./book.service";
import { GroqGateway } from "../gateways/groq.gateway";
import { OpenLibraryGateway, OpenLibraryBook } from "../gateways/openlibrary.gateway";

export interface BookSuggestion {
  title: string;
  author: string;
  openLibraryData?: OpenLibraryBook;
  coverUrl?: string | null;
}

export class RecommendationService {
  constructor(
    private readonly bookService: BookService,
    private readonly groqGateway: GroqGateway,
    private readonly openLibraryGateway: OpenLibraryGateway
  ) {}

  public async generateRecommendations(userId: number): Promise<BookSuggestion[]> {

    const userBooks = await this.bookService.listUserBooks(userId);
    if (userBooks.length === 0) return [];

    const prompt = `
      Sugira 5 livros semelhantes aos seguintes, considerando gênero, estilo e público-alvo:
      ${userBooks.map((b, i) => `${i + 1}. ${b.title}, ${b.author}`).join("\n")}
      Retorne apenas JSON no seguinte formato:
      [
        { "title": "...", "author": "..." }
      ]
      `;

    const groqResponse = await this.groqGateway.gerarSugestoes(prompt);

    const startIdx = groqResponse.indexOf("[");
    const endIdx = groqResponse.lastIndexOf("]") + 1;

    if (startIdx === -1 || endIdx === 0 || startIdx >= endIdx) {
      return [];
    }

    const jsonText = groqResponse.slice(startIdx, endIdx);

    let suggestions: { title: string; author: string }[] = [];

    try {
      suggestions = JSON.parse(jsonText);
    } catch (err) {
      console.error("Erro ao parsear JSON do Groq:", err);
      return [];
    }

    const enrichedSuggestions = await Promise.allSettled(
      suggestions.map(async (sugg) => {
        try {
          const olData = await this.openLibraryGateway.searchBook(sugg.title, sugg.author);
          return {
            title: sugg.title,
            author: sugg.author,
            openLibraryData: olData || undefined,
            coverUrl: olData?.cover_i
              ? this.openLibraryGateway.getCoverUrl(olData.cover_i, "L")
    : undefined,
          };
        } catch (err) {
          console.warn("Erro ao buscar dados na OpenLibrary:", err);
          return { title: sugg.title, author: sugg.author };
        }
      })
    );

    return enrichedSuggestions
      .filter((r) => r.status === "fulfilled")
      .map((r: PromiseFulfilledResult<BookSuggestion>) => r.value);
  }
}
