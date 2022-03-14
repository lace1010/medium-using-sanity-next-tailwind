import React from 'react'

// Link in next is good because it prefetches the link page which makes transition fast.
import Link from 'next/link'

const Header = () => {
  return (
    /* tailwind CSS framework allows a quick way to style using classnames and no css files.*/
    <header className="mx-auto flex max-w-7xl justify-between py-5 pr-5 pl-2">
      <div className="flex space-x-5">
        <Link href="/">
          <img
            className="w-44 cursor-pointer object-contain"
            src="https://links.papareact.com/yvf"
            alt="sample logo"
          />
        </Link>

        {/* tailwind is mobile first. So hide on phone then to medium screens to large screens and so on */}
        <div className="hidden items-center space-x-5 md:inline-flex">
          <h1>About</h1>
          <h1>Contact</h1>
          <h1 className="rounded-full bg-green-600 px-4 py-1 text-white">
            Follow
          </h1>
        </div>
      </div>

      {/* login and sign up div */}
      <div className="flex items-center space-x-5 text-green-600">
        <h1>sign in</h1>
        <h1 className="rounded-full border border-green-600 px-4 py-1">
          get started
        </h1>
      </div>
    </header>
  )
}

export default Header
