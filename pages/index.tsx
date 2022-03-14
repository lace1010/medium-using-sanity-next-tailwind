import Head from 'next/head'
import Banner from '../components/Banner'
import Header from '../components/Header'
import Posts from '../components/Posts'
import { Post } from '../typings'
import { sanityClient } from '../sanity'

// Need this and typings.d.ts file to show typescript the type of date is being used in post.
interface Props {
  posts: [Post]
}

// connected posts from sanity and sending it to Posts component to style and have clean structure
const Home = ({ posts }: Props) => {
  return (
    <div>
      <Head>
        <title>Sanity/next practice</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <Banner />
      <Posts posts={posts} />
    </div>
  )
}

// This is just sanity's way of connecting to its database. I am convinced all of these databases are the same.
// Just need to get comfortable with new syntax and steps to connect with it.
// I see not much difference than mongoDB.

export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
    _id,
    title,
    description,
    slug,
    mainImage,
    author -> {
    name,
    image
  }
  }`

  const posts = await sanityClient.fetch(query)

  return {
    props: {
      posts,
    },
  }
}

export default Home
