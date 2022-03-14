import React from 'react'
import { Post } from '../typings'

// Link in next is good because it prefetches the link page which makes transition fast.
import Link from 'next/link'
import { urlFor } from '../sanity'

interface Props {
  posts: [Post]
}

const Posts = ({ posts }: Props) => {
  console.log(posts)
  return (
    <div className="m:p-6 mx-auto grid max-w-7xl grid-cols-1 gap-3 p-2 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {posts.map((item) => (
        // Each post is a link so we use that as the parent for each post.
        <Link key={item._id} href={`/post/${item.slug.current}`}>
          {/* we use group here. So in image I can say group-hover so when any part of the group is hovered it will effect the image */}
          <div className="group cursor-pointer overflow-hidden">
            {/* use urlFor to figure out the image url with next.js and typescript, add the ! to make sure a null response doesn't mess things up */}
            <img
              className="h-60 w-full rounded-tr-lg rounded-tl-lg border object-cover transition-transform duration-200 group-hover:scale-105"
              src={urlFor(item.mainImage).url()!}
              alt="blog post"
            />
            <div className="flex items-center justify-between rounded-bl-lg rounded-br-lg border p-5">
              <div>
                <p className="text-xl font-bold">{item.title}</p>
                <p className="text-xs">
                  {item.description.slice(0, 30)}... by{' '}
                  <span>{item.author.name}</span>
                </p>
              </div>
              <div>
                <img
                  className=" ml-5 h-12 w-12 rounded-full"
                  src={urlFor(item.author.image).url()!}
                  alt="author"
                />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default Posts
