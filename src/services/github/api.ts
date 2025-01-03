export interface GithubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  updated_at: string;
  language: string | null;
  default_branch: string;
}

export class GithubAPI {
  private static BASE_URL = 'https://api.github.com';

  static async getUserRepositories(token: string): Promise<GithubRepository[]> {
    const response = await fetch(`${this.BASE_URL}/user/repos?sort=updated`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return response.json();
  }

  static async createRepository(token: string, name: string, isPrivate: boolean = false): Promise<GithubRepository> {
    const response = await fetch(`${this.BASE_URL}/user/repos`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        private: isPrivate,
        auto_init: true
      })
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return response.json();
  }
}