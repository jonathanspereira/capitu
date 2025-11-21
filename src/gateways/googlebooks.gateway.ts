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

  public async searchBook(title: string, author?: string): Promise<GoogleBook | null> {
    try {
      let query = encodeURIComponent(title);
      if (author) {
        query += `+inauthor:${encodeURIComponent(author)}`;
      }
      
      const url = `${this.baseUrl}?q=${query}&maxResults=1`;

      const { data } = await axios.get(url);

      if (data.items && data.items.length > 0) {
        const item = data.items[0];
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
      }

      return null;
    } catch (err) {
      console.error("Erro ao buscar livro no Google Books:", err);
      return null;
    }
  }

  public getThumbnailUrl(thumbnail?: string): string | undefined {
    return thumbnail;
  }
}
