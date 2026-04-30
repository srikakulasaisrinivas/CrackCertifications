---
description: 'Guidelines for building an AI-powered insurance policy chatbot that simplifies complex policy documents and answers customer coverage questions in plain language'
applyTo: '**'
---

# Insurance Policy Chatbot

An AI chatbot that parses complex insurance policy documents and answers customer questions about coverage, claims, exclusions, and benefits in simple, clear language — reducing call center volume and improving customer satisfaction.

## Project Context

- **Domain**: BFSI — Insurance
- **Problem**: Policy documents contain dense legal language that customers struggle to understand, leading to high call center traffic, coverage misunderstandings, and claim disputes
- **Solution**: A conversational AI chatbot that ingests policy documents and provides accurate, plain-language answers grounded in the policy text
- **Users**: Insurance policyholders, prospective customers, call center agents

## Architecture

### High-Level Design

```
┌──────────────┐    ┌──────────────┐    ┌───────────────────┐
│   Frontend   │───▶│   Backend    │───▶│  LLM / AI Engine  │
│  (Chat UI)   │◀───│   (API)      │◀───│  (RAG Pipeline)   │
└──────────────┘    └──────────────┘    └───────────────────┘
                           │                      │
                           ▼                      ▼
                    ┌──────────────┐    ┌───────────────────┐
                    │   Database   │    │  Vector Store      │
                    │ (Sessions,   │    │  (Policy Chunks +  │
                    │  Feedback)   │    │   Embeddings)      │
                    └──────────────┘    └───────────────────┘
```

### Core Components

| Component | Responsibility |
|---|---|
| **Document Ingestion Pipeline** | Parse PDFs/DOCX, chunk text, generate embeddings, store in vector DB |
| **RAG Pipeline** | Retrieve relevant policy chunks, build prompt context, call LLM |
| **Chat API** | Handle user sessions, route queries, return responses |
| **Chat UI** | Conversational interface with message history and feedback buttons |
| **Admin Panel** | Upload policies, monitor usage, review flagged responses |

## Document Ingestion

- Support PDF, DOCX, and plain text policy documents
- Extract text preserving section hierarchy (headings, clauses, sub-clauses)
- Chunk documents by logical sections (e.g., per clause or coverage area), not arbitrary token counts
- Preserve metadata per chunk: policy name, section title, page number, effective date
- Generate embeddings using a consistent model (e.g., `text-embedding-ada-002` or open-source alternative)
- Store chunks and embeddings in a vector database (e.g., ChromaDB, Pinecone, Weaviate, pgvector)
- Re-ingest when a policy document is updated; version old embeddings

### Chunking Strategy

```
Policy Document
├── Section: Definitions
│   └── Chunk per defined term
├── Section: Coverage Details
│   └── Chunk per coverage type (e.g., hospitalization, outpatient)
├── Section: Exclusions
│   └── Chunk per exclusion clause
├── Section: Claim Process
│   └── Chunk per step
└── Section: Riders / Add-ons
    └── Chunk per rider
```

## LLM Selection

### Recommended Free & Open-Source LLMs

| Model | Parameters | Best For | License | Free API Provider |
|---|---|---|---|---|
| **Meta Llama 3.1 8B** | 8B | Fast responses, low latency | Llama 3.1 Community | Groq, Together AI, HuggingFace |
| **Meta Llama 3.1 70B** | 70B | High accuracy, complex queries | Llama 3.1 Community | Groq (free tier), Together AI |
| **Mistral 7B Instruct** | 7B | Lightweight, efficient | Apache 2.0 | HuggingFace, Groq |
| **Mixtral 8x7B** | 46.7B (MoE) | Best open-source quality/speed balance | Apache 2.0 | Groq, Together AI |
| **Google Gemma 2 9B** | 9B | Strong reasoning, small footprint | Gemma License | Groq, HuggingFace |
| **Microsoft Phi-3 Mini** | 3.8B | Ultra-lightweight, edge deployment | MIT | HuggingFace, Ollama (local) |
| **Qwen 2.5 7B** | 7B | Multilingual support | Apache 2.0 | Together AI, HuggingFace |

### Chosen Provider for This Project

**Provider**: **Groq** (free tier: ~30 req/min)
**Model**: `llama-3.1-8b-instant` (primary) or `llama-3.3-70b-versatile` (for complex queries)
**API Key**: Stored in `/.env` file — never hardcode in source code
**Fallback / Local**: `Llama 3.1 8B` or `Mistral 7B` via **Ollama** (runs fully offline)

### Embedding Model (for Vector Search)

| Model | Dimensions | License | Free API |
|---|---|---|---|
| **`all-MiniLM-L6-v2`** | 384 | Apache 2.0 | HuggingFace / local via `sentence-transformers` |
| **`nomic-embed-text`** | 768 | Apache 2.0 | Ollama (local) |
| **`BAAI/bge-small-en-v1.5`** | 384 | MIT | HuggingFace / local |

### Groq API Connection

- **Free tier**: ~30 requests/minute, supports Llama 3.1, Mixtral, Gemma
- **Sign up**: https://console.groq.com → Get API key
- **Base URL**: `https://api.groq.com/openai/v1`
- **Compatible with**: OpenAI SDK (drop-in replacement)

```python
# Python — using OpenAI SDK with Groq
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()  # loads from .env file

client = OpenAI(
    api_key=os.getenv("LLM_API_KEY"),  # loaded from .env file
    base_url=os.getenv("LLM_BASE_URL")
)

response = client.chat.completions.create(
    model="llama-3.1-8b-instant",       # or "llama-3.3-70b-versatile"
    messages=[{"role": "user", "content": "What does waiting period mean?"}],
    temperature=0.3
)
print(response.choices[0].message.content)
```

```javascript
// Node.js — using OpenAI SDK with Groq
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.LLM_API_KEY,         // loaded from .env file
  baseURL: process.env.LLM_BASE_URL,
});

const response = await client.chat.completions.create({
  model: "llama-3.1-8b-instant",
  messages: [{ role: "user", content: "What does waiting period mean?" }],
  temperature: 0.3,
});
```

### Environment Configuration

The project `.env` file is already created at the project root with Groq configured:

```env
# .env file (already created — DO NOT commit to git)
LLM_PROVIDER=groq
LLM_API_KEY=<stored in .env>            # Groq API key
LLM_BASE_URL=https://api.groq.com/openai/v1
LLM_MODEL=llama-3.1-8b-instant

# Embedding model (local recommended):
EMBEDDING_MODEL=all-MiniLM-L6-v2           # runs locally via sentence-transformers

# Vector store:
VECTOR_STORE=chromadb                       # chromadb | pinecone | pgvector
CHROMA_PERSIST_DIR=./data/vectorstore
```

## RAG Pipeline

- Use retrieval-augmented generation — never rely on LLM memory alone for policy facts
- Retrieve top-k relevant chunks (k=3 to 5) based on cosine similarity to the user query
- Include chunk metadata (section title, page number) in the LLM prompt for citation
- Apply a relevance threshold; if no chunk scores above it, respond with "I couldn't find specific information about that in your policy"
- Never hallucinate policy details — every factual claim must be traceable to a retrieved chunk

### Prompt Template

```
You are an insurance policy assistant. Answer the customer's question using ONLY the policy excerpts provided below. Follow these rules:

1. Use simple, everyday language — avoid legal jargon
2. If the excerpts do not contain enough information, say so honestly
3. Cite the section name and page number for every fact you reference
4. If a question is about a claim or dispute, advise the customer to contact their insurer and provide the relevant clause
5. Never provide medical, legal, or financial advice
6. Be empathetic and professional

**Policy Excerpts:**
{retrieved_chunks}

**Customer Question:**
{user_question}
```

## Chat Behavior

### Response Guidelines

- Answer in **plain language** — translate legal/insurance terms into simple explanations
- Keep responses concise: aim for 2–4 sentences for simple questions, structured bullet points for complex ones
- Always cite the source section (e.g., "According to Section 4.2 — Exclusions, page 12...")
- When a question is ambiguous, ask one clarifying question before answering
- For yes/no questions, lead with the direct answer, then explain
- If the user asks about something outside their policy, clearly state it is not covered and suggest contacting their insurer

### Tone and Language

- Professional, friendly, and empathetic
- Avoid: "as per the aforementioned clause", "hereinbefore", "notwithstanding"
- Prefer: "based on your policy", "this means", "in simple terms"
- Acknowledge customer frustration when relevant ("I understand this can be confusing")

### Topics the Chatbot Must Handle

| Category | Example Questions |
|---|---|
| **Coverage** | "Am I covered for dental surgery?", "What's my sum insured?" |
| **Exclusions** | "Is cosmetic surgery excluded?", "Are pre-existing conditions covered?" |
| **Claims** | "How do I file a claim?", "What documents do I need for a claim?" |
| **Definitions** | "What does 'waiting period' mean?", "What is a co-pay?" |
| **Premiums & Payments** | "When is my premium due?", "What happens if I miss a payment?" |
| **Riders & Add-ons** | "What riders are included in my policy?", "Can I add maternity cover?" |
| **Policy Management** | "How do I renew my policy?", "Can I cancel and get a refund?" |

### Guardrails

- Never provide specific medical, legal, or financial advice
- Never guarantee claim approval or denial
- Never share or ask for sensitive PII (Aadhaar, SSN, bank account numbers) in chat
- If the user expresses intent to harm themselves, provide emergency helpline numbers
- Redirect out-of-scope questions (e.g., investment advice) to appropriate channels
- Log and flag any response where confidence is below threshold for human review

## API Design

### Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/chat` | Send a message and receive a response |
| GET | `/api/chat/history/{sessionId}` | Retrieve conversation history |
| POST | `/api/documents/upload` | Upload a policy document (admin) |
| POST | `/api/feedback` | Submit feedback on a response |
| GET | `/api/health` | Health check |

### Chat Request/Response

```json
// POST /api/chat
// Request
{
  "sessionId": "uuid",
  "policyId": "POL-12345",
  "message": "Am I covered for physiotherapy?"
}

// Response
{
  "sessionId": "uuid",
  "response": "Yes, physiotherapy is covered under your policy's outpatient benefits (Section 3.4, page 8). You are eligible for up to 20 sessions per policy year with a co-pay of 10%.",
  "sources": [
    { "section": "3.4 — Outpatient Benefits", "page": 8, "snippet": "..." }
  ],
  "confidence": 0.92,
  "timestamp": "2026-04-22T10:30:00Z"
}
```

## Frontend (Chat UI)

- Clean, accessible chat interface with message bubbles
- Show source citations as expandable references below each bot message
- Provide thumbs-up / thumbs-down feedback buttons on each response
- Support conversation history within a session
- Show typing indicator while waiting for response
- Mobile-responsive design
- Accessibility: ARIA labels, keyboard navigation, screen reader support
- Optional: language selector for multi-language support

## Data & Security

- Encrypt all data in transit (TLS) and at rest
- Do not store raw user messages longer than the session retention policy
- Anonymize conversation logs used for analytics
- Role-based access for admin panel (document upload, analytics)
- Comply with relevant data protection regulations (GDPR, DPDP Act, etc.)
- Audit log all document uploads and admin actions
- Sanitize all user inputs before processing

## Testing

### Unit Tests
- Test chunking logic with sample policy documents
- Test prompt construction with various query types
- Test citation extraction and formatting
- Test guardrail triggers (PII detection, out-of-scope detection)

### Integration Tests
- Test end-to-end RAG pipeline: query → retrieval → LLM → response
- Test document upload and ingestion pipeline
- Test session management and conversation history

### Evaluation Tests
- Maintain a golden Q&A dataset (50+ question-answer pairs from real policies)
- Measure retrieval accuracy (correct chunks retrieved)
- Measure answer correctness against ground truth
- Measure hallucination rate (facts not in source chunks)
- Track response latency (target: < 3 seconds for 95th percentile)

## Metrics & Monitoring

| Metric | Target |
|---|---|
| Response accuracy (vs golden dataset) | ≥ 90% |
| Hallucination rate | < 2% |
| Average response time | < 3s |
| User satisfaction (thumbs up %) | ≥ 80% |
| Escalation rate to human agent | < 15% |
| Uptime | 99.5% |

## Project Structure

```
insurance-chatbot/
├── backend/
│   ├── src/
│   │   ├── api/            # REST endpoints
│   │   ├── ingestion/      # Document parsing, chunking, embedding
│   │   ├── rag/            # Retrieval and prompt construction
│   │   ├── models/         # Data models / schemas
│   │   ├── services/       # Business logic
│   │   ├── guardrails/     # Safety checks, PII detection
│   │   └── config/         # Configuration and environment
│   └── tests/
├── frontend/
│   ├── src/
│   │   ├── components/     # Chat UI components
│   │   ├── services/       # API client
│   │   └── assets/         # Styles, images
│   └── tests/
├── data/
│   ├── sample-policies/    # Sample policy documents for testing
│   └── golden-qa/          # Ground truth Q&A pairs for evaluation
├── docs/                   # Architecture diagrams, API docs
├── scripts/                # Ingestion scripts, evaluation scripts
└── README.md
```

## Validation

- Build: verify all services start and health checks pass
- Lint: run linters for all source code
- Test: `npm test` / `pytest` / `mvn test` (depending on stack chosen)
- Evaluate: run golden Q&A dataset and assert accuracy ≥ 90%
- Security: run dependency vulnerability scan before each release
