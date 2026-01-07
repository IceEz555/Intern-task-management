# 🧠 AI Service Technical Documentation

## 1. 🏗️ Architecture Overview

The AI Service is built as a microservice using **FastAPI** to enable easy integration with the Frontend (React) and Backend (Node.js). It uses **LangGraph** to manage the conversational flow and **FAISS** for efficient similarity search.

### RAG Workflow (Retrieval-Augmented Generation)

1.  **Ingestion**: Documents in `knowledge/` are loaded, chunked, and embedded using `GoogleGenerativeAIEmbeddings`.
2.  **Storage**: Embeddings are stored in a local FAISS index (`Vector_Store_RAG/`).
3.  **Retrieval**: When a user asks a question, the system searches the vector store for relevant context.
4.  **Generation**: The context + user question are sent to the LLM (Gemini 1.5 Flash) to generate a helpful answer.

---

## 2. 🧩 Key Components

### 2.1 API Layer (`src/server.py`)

- Defines the FastAPI app.
- Exposes `POST /ask` endpoint.
- Handles CORS to allow requests from Frontend (Port 5173).

### 2.2 RAG Logic (`src/app.py`)

- **LangGraph**: Defines the state machine (StateGraph) for the conversation.
- **Workflow**:
  - `retrieve`: Fetches documents.
  - `generate`: calls the LLM.
- **Model**: Uses `ChatGoogleGenerativeAI` (Gemini).

---

## 3. 📝 Configuration

### Environment Variables (.env)

- `GOOGLE_API_KEY`: Required for accessing Gemini API.

### Vector Store

- The vector store is persisted locally. If you add new documents to `knowledge/`, you verify if the system auto-reindexes or if you need to run an ingestion script (custom logic).

---

## 4. 🐳 Docker Support

The service is containerized for easy deployment.

```dockerfile
# Builds on Python 3.10
FROM python:3.10-slim

# Exposes Port 8001
EXPOSE 8001

# Command
CMD ["python", "-m", "uvicorn", "src.server:app", "--host", "0.0.0.0", "--port", "8001"]
```

---
