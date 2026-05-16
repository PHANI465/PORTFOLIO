import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { BlogPost } from '@/types'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return []

  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'))

  const posts = files.map(filename => {
    const slug = filename.replace('.md', '')
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf8')
    const { data, content } = matter(raw)
    const stats = readingTime(content)

    return {
      slug,
      title: data.title || slug,
      excerpt: data.excerpt || '',
      content,
      date: data.date || new Date().toISOString(),
      author: data.author || 'Phaneendra Gavara',
      tags: data.tags || [],
      category: data.category || 'General',
      readingTime: Math.ceil(stats.minutes),
      published: data.published !== false,
      coverImage: data.coverImage || null,
    } as BlogPost
  })

  return posts
    .filter(p => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.md`), 'utf8')
    const { data, content } = matter(raw)
    const stats = readingTime(content)

    return {
      slug,
      title: data.title || slug,
      excerpt: data.excerpt || '',
      content,
      date: data.date || new Date().toISOString(),
      author: data.author || 'Phaneendra Gavara',
      tags: data.tags || [],
      category: data.category || 'General',
      readingTime: Math.ceil(stats.minutes),
      published: data.published !== false,
      coverImage: data.coverImage || null,
    } as BlogPost
  } catch {
    return null
  }
}

export function getAllTags(): string[] {
  const posts = getAllPosts()
  const tags = new Set<string>()
  posts.forEach(p => p.tags.forEach(t => tags.add(t)))
  return Array.from(tags)
}

export function getAllCategories(): string[] {
  const posts = getAllPosts()
  const cats = new Set<string>()
  posts.forEach(p => cats.add(p.category))
  return Array.from(cats)
}
