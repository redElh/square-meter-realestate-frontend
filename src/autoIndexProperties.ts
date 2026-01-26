// Auto-index properties into ChromaDB on startup
import { vectorStoreService } from './services/vectorStoreService';
import { apimoService } from './services/apimoService';

let isIndexing = false;

export async function autoIndexProperties() {
  if (isIndexing) {
    console.log('⏳ Indexing already in progress...');
    return;
  }

  isIndexing = true;
  
  try {
    console.log('🔄 Auto-indexing properties into ChromaDB...');
    
    // Initialize vector store
    const initialized = await vectorStoreService.initialize();
    if (!initialized) {
      console.warn('⚠️ ChromaDB not available, skipping indexing');
      isIndexing = false;
      return;
    }

    // Fetch all properties
    const response = await apimoService.getProperties();
    const properties = response.properties || [];
    
    if (properties.length === 0) {
      console.warn('⚠️ No properties found to index');
      isIndexing = false;
      return;
    }

    console.log(`📊 Found ${properties.length} properties from APIMO`);
    
    // Index properties
    const success = await vectorStoreService.indexProperties(properties);
    
    if (success) {
      console.log(`✅ Successfully indexed ${properties.length} properties into ChromaDB!`);
      console.log('🎯 AI Assistant can now search Essaouira properties!');
    } else {
      console.error('❌ Failed to index properties');
    }
    
  } catch (error) {
    console.error('❌ Auto-indexing failed:', error);
  } finally {
    isIndexing = false;
  }
}

// Auto-run on import
if (typeof window !== 'undefined') {
  // Wait for app to be ready
  setTimeout(() => {
    autoIndexProperties();
  }, 2000);
}
