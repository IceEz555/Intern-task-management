# Task Management AI Service (RAG)

This service provides AI capabilities to the Task Management System, specifically a **Retrieval-Augmented Generation (RAG)** system for answering project-related questions.

## 🛠 Tech Stack

- **Language**: Python 3.10+
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **LLM Integration**: [LangChain](https://www.langchain.com/) / [LangGraph](https://langchain-ai.github.io/langgraph/)
- **Vector Store**: [FAISS](https://github.com/facebookresearch/faiss) (Local)
- **Model**: Google Gemini (`google-genai`)

## 📂 Project Structure

```
task-ai/
├── src/
│   ├── server.py           # FastAPI Entry Point (Port 8001)
│   ├── app.py              # Logic & RAG implementation
│   ├── main_logic.py       # (Legacy) Core Logic
│   └── ...
├── knowledge/              # Source documents for RAG
├── Vector_Store_RAG/       # FAISS Index storage
├── Dockerfile              # Container config
└── requirements.txt        # Python dependencies
```

## 🚀 Getting Started

1.  **Install Dependencies**

    ```bash
    pip install -r requirements.txt
    ```

2.  **Configure Environment**

    - Copy `.env.example` to `.env`:
      ```bash
      cp .env.example .env
      ```
    - Add your **Google API Key**:
      ```env
      GOOGLE_API_KEY=your_api_key_here
      ```

3.  **Run Server**

    ```bash
    # Run with Uvicorn (Port 8001)
    python -m uvicorn src.server:app --host 0.0.0.0 --port 8001 --reload
    ```

    API Documentation (Swagger UI) will be available at: `http://localhost:8001/docs`

## 📡 API Endpoints

### 1. Chat with RAG

- **Endpoint**: `POST /ask`
- **Body**:
  ```json
  { "query": "How do I create a new project?" }
  ```
- **Response**:
  ```json
  { "answer": "To create a project...", "sources": [...] }
  ```
