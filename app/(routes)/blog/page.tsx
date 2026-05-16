import { getAllPosts, getAllTags, getAllCategories } from '@/lib/blog'
import BlogClientPage from './BlogClientPage'

export const dynamic = 'force-dynamic'

export default function BlogPage() {
  const posts = getAllPosts()
  const tags = getAllTags()
  const categories = getAllCategories()
  return <BlogClientPage posts={posts} tags={tags} categories={categories} />
}
