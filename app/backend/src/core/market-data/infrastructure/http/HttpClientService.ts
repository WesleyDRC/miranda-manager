export class HttpClientService {
  private baseURL?: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL;
  }

  async get<T>(url: string, config?: RequestInit): Promise<T> {
    const fullUrl = this.baseURL ? `${this.baseURL}${url}` : url;
    
    const response = await fetch(fullUrl, {
      method: "GET",
      ...config,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json() as T;
  }
}
