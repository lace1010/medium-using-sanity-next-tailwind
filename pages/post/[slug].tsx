import { sanityClient, urlFor } from '../../sanity'
import Header from '../../components/Header'
import { Post } from '../../typings'
import { GetStaticProps } from 'next'
import PortableText from 'react-portable-text'

import { useForm, SubmitHandler } from 'react-hook-form'
import { useState } from 'react'

interface IFormInput {
  _id: string
  name: string
  email: string
  comment: string
}
interface Props {
  post: Post
}

const Post = ({ post }: Props) => {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>()

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        setSubmitted(true)
      })
      .catch((err) => {
        console.log(err)
        setSubmitted(false)
      })
  }

  return (
    <main>
      <Header />
      <img
        className="h-40 w-full object-cover"
        src={urlFor(post.mainImage).url()}
        alt="main"
      />
      <article className="mx-auto max-w-4xl p-5">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <h2 className="mb-2 text-xl font-light text-gray-500">
          {post.description}
        </h2>
        <div className="flex items-center space-x-3">
          <img
            className="h-12 w-12 rounded-full"
            src={urlFor(post.author.image).url()}
            alt="author"
          />
          <p className="text-sm font-extralight">
            Blog post by{' '}
            <span className="text-green-600">{post.author.name}</span>{' '}
            -published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>

        {/* install portableText dependency to get body data from sanity */}
        <div className="mt-10">
          <PortableText
            className=""
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => {
                return <h1 className="my-5 text-2xl font-bold" {...props} />
              },
              h2: (props: any) => {
                return <h2 className="my-5 text-xl font-bold" {...props} />
              },
              li: ({ children }: any) => {
                return <li className="ml-4 list-disc">{children}</li>
              },
              link: ({ href, children }: any) => {
                return (
                  <a href={href} className="text-blue-500 hover:underline">
                    {children}
                  </a>
                )
              },
              img: (src: any) => {
                return (
                  <img
                    className="my-5 h-60 w-full rounded-tr-lg rounded-tl-lg border object-cover"
                    src={src}
                    alt={post.title}
                  />
                )
              },
            }}
          />
        </div>
      </article>

      <hr className=" mx-auto my-5 max-w-lg border border-yellow-500" />

      {submitted ? (
        <div className="mx-auto my-10 flex max-w-2xl flex-col bg-yellow-500 p-10 text-white">
          <h3 className="text-3xl font-bold">Thank you for submitting</h3>
          <p>Once it has been approved, it will appear below</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto mb-10 flex max-w-2xl flex-col p-5"
        >
          <h3 className="text-sm text-yellow-500">Enjoyed the article?</h3>
          <h4 className="text-4xl font-bold">Leave a comment below!</h4>
          <hr className="my-2 py-3" />
          {/* hidden input to give each form an id when submitted */}
          <input
            {...register('_id')}
            type="hidden"
            name="_id"
            value={post._id}
          />
          <label className="mb-5 block">
            <span className="text-gray-700">Name</span>
            <input
              // ...register('name') is used for all inputs so react-hookforms collects all of the data and put it together
              {...register('name', { required: true })}
              className="form-input mt-1 block w-full rounded p-2 shadow outline-none ring-yellow-500 focus:ring-2"
              placeholder="John Calipari"
              type="text"
            ></input>
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Email</span>
            <input
              {...register('email', { required: true })}
              className="form-input mt-1 block w-full rounded p-2 shadow outline-none ring-yellow-500 focus:ring-2"
              placeholder="myemail@gmail.com"
              type="email"
            ></input>
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Comment</span>
            <textarea
              {...register('comment', { required: true })}
              className="form-textarea mt-1 block w-full rounded p-2 shadow outline-none ring-yellow-500 focus:ring-2"
              placeholder="Hunter is the GOAT"
              rows={8}
            ></textarea>
          </label>

          {/* errors will return when field validation fails  */}
          <div className="flex flex-col p-5">
            {errors.name && (
              <span className="text-red-500">- The name field is required</span>
            )}
            {errors.email && (
              <span className="text-red-500">
                - The email field is required
              </span>
            )}
            {errors.comment && (
              <span className="text-red-500">
                - The comment field is required
              </span>
            )}
          </div>

          <input
            type="submit"
            className="focus:shadow-outline cursor-pointer rounded bg-yellow-500 py-2 px-4 font-bold text-white shadow-md  shadow-gray-400 hover:bg-yellow-400 focus:outline-none"
          />
        </form>
      )}
      {/* comments */}
      <div className="px-5">
        <div className="my-10 mx-auto flex max-w-2xl flex-col space-y-2 rounded-md border p-10 shadow shadow-yellow-500">
          <h3 className="text-4xl font-bold">Comments</h3>
          <hr className="pb-2" />

          {post.comments.map((comment) => {
            return (
              <div key={comment._id}>
                <p>
                  <span className="text-yellow-500">{comment.name}</span>:{' '}
                  {comment.comment}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}

export default Post

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
    _id,
    slug {
    current
  },
  }`

  const posts = await sanityClient.fetch(query)

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    _createdAt,
    title,
    author -> {
    name,
    image
  },
  'comments': *[
    _type == "comment" &&
    post._ref == ^._id &&
    approved == true
  ],
  description,
  mainImage,
  slug,
  body
  }`

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
    revalidate: 60, // This will update old cache version every day (86400 secconds).
  }
}
