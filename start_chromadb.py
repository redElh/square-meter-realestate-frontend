import chromadb
from chromadb.config import Settings

# Start ChromaDB server with CORS enabled
if __name__ == "__main__":
    import uvicorn
    from chromadb.server.fastapi import FastAPI
    
    settings = Settings(
        chroma_server_cors_allow_origins=["*"],  # Allow all origins for development
        chroma_server_host="localhost",
        chroma_server_http_port=8000,
        allow_reset=True,
        is_persistent=True,
        persist_directory="./chroma"
    )
    
    server = FastAPI(settings)
    
    print("🚀 Starting ChromaDB with CORS enabled...")
    print(f"   Host: localhost:8000")
    print(f"   Allowed origins: http://localhost:3000")
    
    uvicorn.run(
        server.app(),
        host="localhost",
        port=8000,
        log_level="info"
    )
