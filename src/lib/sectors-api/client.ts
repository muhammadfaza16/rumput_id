const SECTORS_API_URL = 'https://api.sectors.app/v1';

export class SectorsApiClient {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.SECTORS_API_KEY || '';
  }

  private async fetchApi(endpoint: string, options: RequestInit = {}) {
    if (!this.apiKey) {
      console.warn('SECTORS_API_KEY is not set');
    }

    const response = await fetch(`${SECTORS_API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Sectors API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getCompany(ticker: string) {
    return this.fetchApi(`/company/report/${ticker}/?sections=overview,valuation`);
  }
}

export const sectorsApi = new SectorsApiClient();
