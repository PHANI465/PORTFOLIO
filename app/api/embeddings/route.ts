import { NextRequest, NextResponse } from 'next/server'
import { getEmbedding } from '@/lib/ai-assistant'
import { getPineconeIndex } from '@/lib/pinecone'
import portfolioData from '@/content/portfolio.json'
import projectsData from '@/content/projects.json'
import resumeData from '@/content/resume.json'
import { Project, Resume } from '@/types'

// POST /api/embeddings: re-index all portfolio content into Pinecone
// Requires: Authorization: Bearer <DASHBOARD_PASSWORD>
export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!process.env.DASHBOARD_PASSWORD || auth !== `Bearer ${process.env.DASHBOARD_PASSWORD}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.OPENAI_API_KEY || !process.env.PINECONE_API_KEY) {
    return NextResponse.json({ error: 'Missing API keys' }, { status: 503 })
  }

  const docs: Array<{ text: string; source: string; type: string }> = []

  // Portfolio overview
  docs.push({
    text: `${portfolioData.name}: ${portfolioData.title}. ${portfolioData.bio}. Location: ${portfolioData.location}. Email: ${portfolioData.email}. Open to work: ${portfolioData.availability}`,
    source: 'portfolio',
    type: 'overview',
  })

  // Projects
  for (const p of projectsData as Project[]) {
    docs.push({
      text: `Project: ${p.title}. Category: ${p.category}. ${p.longDescription}. Tech: ${p.tech.join(', ')}. Highlights: ${p.highlights.join('. ')}`,
      source: `project-${p.id}`,
      type: 'project',
    })
  }

  // Resume skills
  const resume = resumeData as Resume
  for (const cat of resume.skills) {
    docs.push({
      text: `Skills in ${cat.category}: ${cat.skills.join(', ')}`,
      source: `skills-${cat.category}`,
      type: 'skills',
    })
  }

  // Experience
  for (const exp of [...resume.experience, ...resume.education]) {
    docs.push({
      text: `${exp.type === 'education' ? 'Education' : 'Experience'}: ${exp.role} at ${exp.organization}. ${exp.description}. Highlights: ${exp.highlights.join('. ')}`,
      source: `exp-${exp.id}`,
      type: exp.type,
    })
  }

  // Achievements
  for (const ach of resume.achievements) {
    docs.push({
      text: `Achievement: ${ach.title} from ${ach.organization}. ${ach.description}`,
      source: `achievement-${ach.id}`,
      type: 'achievement',
    })
  }

  try {
    const index = await getPineconeIndex()
    const vectors = []

    for (let i = 0; i < docs.length; i++) {
      const embedding = await getEmbedding(docs[i].text)
      vectors.push({
        id: `doc-${i}-${docs[i].source}`,
        values: embedding,
        metadata: {
          text: docs[i].text,
          source: docs[i].source,
          type: docs[i].type,
        },
      })
    }

    // Upsert in batches of 100
    for (let i = 0; i < vectors.length; i += 100) {
      await index.upsert(vectors.slice(i, i + 100))
    }

    return NextResponse.json({ success: true, indexed: docs.length })
  } catch (err) {
    console.error('[API] /api/embeddings error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
