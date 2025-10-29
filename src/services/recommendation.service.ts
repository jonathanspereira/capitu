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
    // 1️⃣ Pega livros do usuário
    const userBooks = await this.bookService.listUserBooks(userId);
    if (userBooks.length === 0) return [];

    // 2️⃣ Monta prompt para Groq
    const prompt = `
Sugira 5 livros semelhantes aos seguintes, considerando gênero, estilo e público-alvo:
${userBooks.map((b, i) => `${i + 1}. ${b.title}, ${b.author}`).join("\n")}
Retorne apenas JSON no seguinte formato:
[
  { "title": "...", "author": "..." }
]
`;

    // 3️⃣ Chama Groq AI
    const groqResponse = await this.groqGateway.gerarSugestoes(prompt);

    const jsonMatch = groqResponse.match(/\[.*\]/s);
    if (!jsonMatch) return [];

    const suggestions: { title: string; author: string }[] = JSON.parse(jsonMatch[0]);

    // 4️⃣ Buscar dados da OpenLibrary em paralelo
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

    // Filtra apenas resultados bem-sucedidos
    return enrichedSuggestions
      .filter((r) => r.status === "fulfilled")
      .map((r: PromiseFulfilledResult<BookSuggestion>) => r.value);
  }
}
