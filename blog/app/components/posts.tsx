import Link from 'next/link'
import { formatDate } from 'app/blog/utils'
import { getBlogPosts } from 'app/blog/utils'

export async function BlogPosts() {
  const allBlogs = await getBlogPosts()
  
  const validBlogs = allBlogs.filter((post)=> post !== null)
  
  const sortedBlogs = validBlogs.sort((a, b) => {
    if (new Date(a!.metadata.publishedAt) > new Date(b!.metadata.publishedAt)) {
      return -1
    }
    return 1
  })

  return (
    <div className="flex flex-col gap-4">
      {sortedBlogs.map((post) => (
        <Link
          key={post!.id}
          href={`/blog/${post!.slug}`}
          className="flex flex-col space-y-1 mb-4"
        >
          <div className="w-full flex flex-col">
            <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              {post!.metadata.title}
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {formatDate(post!.metadata.publishedAt)}
            </p>
            {post!.metadata.summary && (
              <p className="mt-2 text-neutral-700 dark:text-neutral-300">
                {post!.metadata.summary}
              </p>
            )}
            {post!.metadata.tags.length > 0 && (
              <div className="flex gap-2 mt-2">
                {post!.metadata.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-md text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
