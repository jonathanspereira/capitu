import axios from "axios";

export interface OpenLibraryBook {
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  key: string;
  language?: string[];
}

export class OpenLibraryGateway {
  private readonly baseUrl = "https://openlibrary.org/search.json";

  public async searchBook(title: string, author?: string): Promise<OpenLibraryBook | null> {
  try {
    const query = encodeURIComponent(`${title}${author ? " " + author : ""}`);
    const url = `${this.baseUrl}?q=${query}&limit=1`;

    const { data } = await axios.get(url);

    if (data.docs && data.docs.length > 0) {
      const doc = data.docs[0];
      return {
        title: doc.title,
        author_name: doc.author_name,
        first_publish_year: doc.first_publish_year,
        cover_i: doc.cover_i,
        key: doc.key,
        language: doc.language,
      };
    }

    return null;
  } catch (err) {
    console.error("Erro ao buscar livro na OpenLibrary:", err);
    return null;
  }
}


  public getCoverUrl(coverId: number, size: "S" | "M" | "L" = "M"): string {
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
  }
}
