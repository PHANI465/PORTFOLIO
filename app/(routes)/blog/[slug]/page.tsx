import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '@/lib/blog'
import { format } from 'date-fns'
import { Clock, ArrowLeft, Tag } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Metadata } from 'next'

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return {}
  return {
    title: `${post.title} | Phaneendra Gavara`,
    description: post.excerpt,
  }
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <article className="max-w-3xl mx-auto">
        {/* Back */}
        <Link href="/blog"
          className="inline-flex items-center gap-1.5 text-sm opacity-40 hover:opacity-70 transition-opacity mb-8">
          <ArrowLeft size={14} /> Back to blog
        </Link>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs opacity-40 mb-4">
          <span>{format(new Date(post.date), 'MMMM dd, yyyy')}</span>
          <span>·</span>
          <Clock size={11} />
          <span>{post.readingTime} min read</span>
          <span>·</span>
          <span>{post.category}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{post.title}</h1>
        <p className="text-base opacity-50 mb-6 leading-relaxed">{post.excerpt}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-8 pb-8 border-b border-current/10">
          {post.tags.map(tag => (
            <span key={tag}
              className="flex items-center gap-1 text-xs opacity-40 border border-current/15 px-2 py-0.5">
              <Tag size={10} />{tag}
            </span>
          ))}
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none
          prose-headings:font-bold
          prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
          prose-p:opacity-70 prose-p:leading-relaxed
          prose-code:text-sm prose-pre:text-sm
          prose-a:opacity-80 prose-a:underline
          prose-li:opacity-70
          prose-strong:opacity-90">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  )
}
