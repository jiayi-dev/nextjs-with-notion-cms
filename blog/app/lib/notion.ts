import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import { cache } from 'react'

if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
  throw new Error('Required environment variables are not set')
}

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const n2m = new NotionToMarkdown({ notionClient: notion })

export type BlogPost = {
  id: string
  slug: string
  metadata: {
    title: string
    publishedAt: string
    summary: string
    image?: string
    tags: string[]
  }
  content: string
}

export const getBlogPosts = cache(async () => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      sorts: [
        {
          timestamp: 'created_time',
          direction: 'descending',
        },
      ],
    })


    const posts = await Promise.all(
      response.results.map(async (page: any) => {
        try {
          const mdBlocks = await n2m.pageToMarkdown(page.id)
          const mdString = n2m.toMarkdownString(mdBlocks)

          // Get properties
          const title = page.properties?.Name?.title?.[0]?.plain_text || 
                       page.properties?.Title?.title?.[0]?.plain_text || 
                       'Untitled'
          
          // Use page title as slug if not specified
          const slug = page.properties?.Slug?.rich_text?.[0]?.plain_text || 
                      title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
          
          const summary = page.properties?.Summary?.rich_text?.[0]?.plain_text || 
                         page.properties?.Description?.rich_text?.[0]?.plain_text || 
                         ''
          
          const publishedAt = page.properties?.PublishedAt?.date?.start || 
                             page.properties?.Published?.date?.start || 
                             page.created_time
          
          const image = page.properties?.Image?.files?.[0]?.file?.url || 
                       page.cover?.external?.url || 
                       null

          // Get tags from multi-select property
          const tags = page.properties?.Tags?.multi_select?.map((tag: any) => tag.name) || 
                      page.properties?.Categories?.multi_select?.map((tag: any) => tag.name) || 
                      []

          return {
            id: page.id,
            slug,
            metadata: {
              title,
              publishedAt,
              summary,
              image,
              tags,
            },
            content: mdString.parent,
          }
        } catch (error) {
          console.error('Error processing page:', page.id, error)
          return null
        }
      })
    )

    const validPosts = posts.filter((post)=> post !== null)

    return validPosts
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
})

export async function getBlogPost(slug: string) {
  const posts = await getBlogPosts()
  return posts.find((post) => post!.slug === slug)
}

// Helper function to get all tags
export async function getAllTags(): Promise<string[]> {
  const posts = await getBlogPosts()
  const tags = new Set<string>()
  
  posts.forEach(post => {
    post!.metadata.tags.forEach(tag => tags.add(tag))
  })
  
  return Array.from(tags).sort()
}
