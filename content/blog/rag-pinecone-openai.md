---
title: "Building a RAG Pipeline with Pinecone + OpenAI: A Practical Guide"
excerpt: "Step-by-step walkthrough of building a production-ready Retrieval-Augmented Generation system — from chunking your docs to serving answers in real time."
date: "2024-08-15"
author: "Phaneendra Gavara"
tags: ["rag", "pinecone", "openai", "llm", "vector-database", "python"]
category: "AI Engineering"
published: true
coverImage: "/images/blog/rag-cover.png"
---

# Building a RAG Pipeline with Pinecone + OpenAI

RAG (Retrieval-Augmented Generation) is one of the most practical patterns in modern AI engineering. Instead of relying solely on an LLM's training data, you give it access to your own documents at query time — making answers far more accurate, up-to-date, and grounded.

This is exactly how the AI assistant on this portfolio works. Let me walk through how I built it.

## The Core Idea

```
Query → Embed Query → Search Pinecone → Retrieve Top-K Docs → Prompt LLM → Answer
```

1. At **indexing time**: chunk your docs → embed with OpenAI → store in Pinecone
2. At **query time**: embed the question → find similar chunks → inject into prompt → generate answer

## Step 1: Chunking Your Documents

The most overlooked part of RAG. Bad chunking = bad retrieval.

```python
def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    words = text.split()
    chunks = []
    
    for i in range(0, len(words), chunk_size - overlap):
        chunk = ' '.join(words[i:i + chunk_size])
        if chunk:
            chunks.append(chunk)
    
    return chunks
```

For this portfolio, I chunk:
- Project descriptions
- Resume bullet points (each section as a chunk)
- Blog post paragraphs
- Skills and experience entries

## Step 2: Generating Embeddings

```python
from openai import OpenAI

client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])

def embed_text(text: str) -> list[float]:
    response = client.embeddings.create(
        input=text,
        model="text-embedding-3-small"  # 1536 dimensions, cost-effective
    )
    return response.data[0].embedding
```

`text-embedding-3-small` is my go-to: fast, cheap, and 1536-dim vectors work great for semantic search.

## Step 3: Storing in Pinecone

```python
from pinecone import Pinecone, ServerlessSpec

pc = Pinecone(api_key=os.environ['PINECONE_API_KEY'])

# Create index (run once)
pc.create_index(
    name='portfolio',
    dimension=1536,
    metric='cosine',
    spec=ServerlessSpec(cloud='aws', region='us-east-1')
)

index = pc.Index('portfolio')

# Upsert vectors
vectors = [
    {
        'id': f'doc_{i}',
        'values': embed_text(chunk),
        'metadata': {
            'text': chunk,
            'source': source_name,
            'type': doc_type  # 'project', 'resume', 'blog'
        }
    }
    for i, (chunk, source_name, doc_type) in enumerate(chunks_with_meta)
]

index.upsert(vectors=vectors, namespace='portfolio')
```

## Step 4: Querying at Runtime

```python
def retrieve_context(query: str, top_k: int = 5) -> list[str]:
    query_embedding = embed_text(query)
    
    results = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True,
        namespace='portfolio'
    )
    
    return [match['metadata']['text'] for match in results['matches']]
```

## Step 5: Generating the Answer

```python
def answer_with_rag(query: str, conversation_history: list) -> str:
    context_chunks = retrieve_context(query)
    context = '\n\n'.join(context_chunks)
    
    messages = [
        {
            "role": "system",
            "content": f"""You are an AI assistant for Phaneendra Gavara's portfolio.
            
Use this context to answer questions accurately:

{context}

Be helpful, concise, and direct. If the answer isn't in the context, say so."""
        },
        *conversation_history,
        {"role": "user", "content": query}
    ]
    
    response = client.chat.completions.create(
        model="gpt-4-turbo-preview",
        messages=messages,
        temperature=0.7,
        stream=True
    )
    
    return response  # stream to frontend
```

## Tips from Building This

- **Namespace by content type** in Pinecone — lets you filter retrieval to just projects, just resume, etc.
- **Include metadata** with every vector — you'll thank yourself at query time
- **Stream responses** — makes the assistant feel much snappier
- **Cache embeddings** — reindex only when content changes, not on every request

The full indexing script is available in the portfolio repo under `scripts/index-content.js`.
