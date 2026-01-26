// Simple HTTP-based ChromaDB Client for Browser
// Works with ChromaDB API v2

export class SimpleChromatClient {
  private baseUrl: string;
  private tenant: string = 'default_tenant';
  private database: string = 'default_database';

  constructor(config: { path: string }) {
    this.baseUrl = config.path;
  }

  private getApiBase(): string {
    return `${this.baseUrl}/api/v2/tenants/${this.tenant}/databases/${this.database}`;
  }

  async heartbeat(): Promise<number> {
    // ChromaDB v1.3+ doesn't have a v2 heartbeat endpoint
    // Just return timestamp to indicate client is ready
    return Date.now();
  }

  async listCollections(): Promise<any[]> {
    const response = await fetch(`${this.getApiBase()}/collections`);
    if (!response.ok) {
      throw new Error(`List collections failed: ${response.statusText}`);
    }
    return response.json();
  }

  async getOrCreateCollection(config: { name: string; metadata?: any }): Promise<any> {
    try {
      // Try to get existing collection
      const response = await fetch(`${this.getApiBase()}/collections/${config.name}`);
      if (response.ok) {
        const data = await response.json();
        // Return a collection object with methods
        return this.createCollectionObject(config.name, data.id);
      }
    } catch (e) {
      // Collection doesn't exist, create it
    }

    // Create new collection
    return this.createCollection(config);
  }

  async createCollection(config: { name: string; metadata?: any }): Promise<any> {
    const response = await fetch(`${this.getApiBase()}/collections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: config.name,
        metadata: config.metadata || {},
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Create collection failed: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return this.createCollectionObject(config.name, data.id);
  }

  private createCollectionObject(name: string, id: string): any {
    const self = this;
    return {
      name,
      id,
      // Add documents to collection
      add: async function(params: { ids: string[]; documents: string[]; embeddings: number[][]; metadatas: any[] }) {
        const response = await fetch(`${self.getApiBase()}/collections/${id}/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ids: params.ids,
            documents: params.documents,
            embeddings: params.embeddings,
            metadatas: params.metadatas,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Add documents failed: ${response.statusText} - ${errorText}`);
        }

        return response.json();
      },
      // Query collection
      query: async function(params: { queryTexts?: string[]; queryEmbeddings?: number[][]; nResults: number; where?: any }) {
        console.log('      📤 ChromaDB query request:', {
          nResults: params.nResults,
          hasEmbeddings: !!params.queryEmbeddings,
          embeddingDim: params.queryEmbeddings?.[0]?.length,
          hasWhere: !!params.where,
          where: params.where
        });

        const body: any = {
          n_results: params.nResults,
        };
        
        if (params.queryEmbeddings) {
          body.query_embeddings = params.queryEmbeddings;
        } else if (params.queryTexts) {
          // For text queries, we'll need embeddings - this should be handled by the service
          throw new Error('Text queries require embeddings. Use queryEmbeddings instead.');
        }
        
        if (params.where) {
          body.where = params.where;
        }

        console.log('      🌐 Sending request to:', `${self.getApiBase()}/collections/${id}/query`);
        
        const response = await fetch(`${self.getApiBase()}/collections/${id}/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        console.log('      📥 Response status:', response.status, response.statusText);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('      ❌ Query error:', errorText);
          throw new Error(`Query failed: ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        console.log('      ✅ Query result:', {
          ids: result.ids?.[0]?.length,
          distances: result.distances?.[0]?.length,
          metadatas: result.metadatas?.[0]?.length
        });
        
        return result;
      },
      // Count documents
      count: async function() {
        const response = await fetch(`${self.getApiBase()}/collections/${id}/count`);
        if (!response.ok) {
          return 0;
        }
        return response.json();
      },
    };
  }
}
