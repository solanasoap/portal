import type { NextPage } from 'next'
import Head from 'next/head'
import React, { } from 'react';
import { SoapGallery } from '../components/SoapGallery';

const Collection: NextPage = (props) => {

    return (
      <div className="px-5">
        <Head>
          <title>Your soap collection</title>
          <meta name="description" content="See your collection of soaps." />
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/favicon.ico" />
        </Head>
        <main >
          <SoapGallery></SoapGallery>

        </main>
      </div>
  
  
  
    )
  }
  
  export default Collection