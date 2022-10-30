import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'
import Hero from '../components/Hero'
import React, { } from 'react';
import Link from 'next/link'
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'

const Homes: NextPage = (props) => {

  return (

    // TODO: Make this look nicer
    // https://www.kindacode.com/snippet/how-to-create-frosted-glass-effect-in-tailwind-css/
    
    <div className="flex px-4 max-w-7xl justify-center items-center m-auto">
      <Head>
        <title>SOAP</title>
        <meta name="description" content="SOAP" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </Head>
      <main>
        {/* <div className="py-2 justify-center flex ">
          <Link href="/mobile">
            <button className="bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 rounded w-96 h-12">
              Wallet Adapters
            </button>
          </Link>
        </div> */}
        <Hero></Hero>
        {/* <button ref="/dispenser/HKPcjAi699egocGNqMVEEkPqYAwPZ12oqFWKfzVcCudV">Go to Dispneser example</button> */}
      </main>
    </div>



  )
}

export default Homes


{/* <div className='inline-block bg-blue max-w-sm place-content-center'>
          <h1 className=''>
            The smoothest way to interact with your community on-chain.</h1>
        </div>

        <div className='py-10'></div>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.tsx</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div> */}


{/* <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}