import RSS from 'rss'
import { getBlogPosts } from '../blog/utils'
import { baseUrl } from '../sitemap'

export async function GET() {
    const posts = await getBlogPosts()
    const validPosts = posts.filter((post): post is NonNullable<typeof post> => post !== null)

    const feed = new RSS({
        title: 'Your Blog Name',
        site_url: baseUrl,
        feed_url: `${baseUrl}/feed.xml`,
    })

    validPosts.sort((a, b) => {
        return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
    }).forEach((post) => {
        feed.item({
            title: post.metadata.title,
            url: `${baseUrl}/blog/${post.slug}`,
            date: post.metadata.publishedAt,
            description: post.metadata.summary,
        })
    })

    return new Response(feed.xml({ indent: true }), {
        headers: {
            'Content-Type': 'application/xml',
        },
    })
}
