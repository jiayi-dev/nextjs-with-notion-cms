import { getBlogPosts } from './blog/utils'
import { MetadataRoute } from 'next'

export const baseUrl = 'https://your-domain.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogPosts()

  const blogs = posts.filter((post): post is NonNullable<typeof post> => post !== null)
    .map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.metadata.publishedAt),
    }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...blogs,
  ]
}
