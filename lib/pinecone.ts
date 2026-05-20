import { Pinecone } from '@pinecone-database/pinecone'

let client: Pinecone | null = null

export function getPineconeClient(): Pinecone {
  if (!client) {
    client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })
  }
  return client
}

export async function getPineconeIndex() {
  const pc = getPineconeClient()
  return pc.index(process.env.PINECONE_INDEX_NAME || 'portfolio')
}

export async function queryVectors(
  embedding: number[],
  topK = 5,
  namespace = 'portfolio'
): Promise<string[]> {
  try {
    const index = await getPineconeIndex()
    const ns = index.namespace(namespace)
    const results = await ns.query({
      vector: embedding,
      topK,
      includeMetadata: true,
    })
    return results.matches
      ?.filter(m => m.score && m.score > 0.6)
      .map(m => m.metadata?.text as string)
      .filter(Boolean) ?? []
  } catch (err) {
    console.error('[Pinecone] Query error:', err)
    return []
  }
}
