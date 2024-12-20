import { BlogPosts } from 'app/components/posts'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Next.JS + Notion CMS
      </h1>
      <p className="mb-4">
        {`This is a Next.js blog with Notion CMS. This project is built and modified from the Notion Blog Template. You can write your blog posts in Notion, and the blog will render them here, without the need to write posts locally and commit/merge them to GitHub.
        `}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}
