import axios from "axios";

export interface GoogleBook {
  title: string;
  authors?: string[];
  publishedDate?: string;
  thumbnail?: string;
  id: string;
  language?: string;
  description?: string;
  pageCount?: number;
  publisher?: string;
}

export class GoogleBooksGateway {
  private readonly baseUrl = "https://www.googleapis.com/books/v1/volumes";

  public async searchBook(title: string, maxResults = 10): Promise<GoogleBook[]> {
  try {
    const query = encodeURIComponent(title) + "*"; // coringa para busca parcial
    const url = `${this.baseUrl}?q=${query}&maxResults=${maxResults}&langRestrict=pt`;

    const { data } = await axios.get(url);
    if (!data.items) return [];

    return data.items.map((item: any) => {
      const volumeInfo = item.volumeInfo;
      return {
        id: item.id,
        title: volumeInfo.title,
        authors: volumeInfo.authors,
        publishedDate: volumeInfo.publishedDate,
        thumbnail: volumeInfo.imageLinks?.thumbnail,
        language: volumeInfo.language,
        description: volumeInfo.description,
        pageCount: volumeInfo.pageCount,
        publisher: volumeInfo.publisher,
      };
    });
  } catch (err) {
    console.error("Erro ao buscar livros no Google Books:", err);
    return [];
  }
}


  public getThumbnailUrl(thumbnail?: string): string | undefined {
    return thumbnail;
  }
}
