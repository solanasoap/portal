import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'
import Hero from '../components/Hero'
import React, { } from 'react';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { BalanceDisplay } from '../components/BalanceDisplay';
import YourSoaps from '../components/YourSoaps';
import Blog from '../components/Blog';

const Collection: NextPage = (props) => {
  
  
    return (
  
      // <ConnectionProvider endpoint={endpoint}>
      //   <WalletProvider wallets={[wallet]}>
      <div className="px-5">
        <Head>
          <title>Your soap collection</title>
          <meta name="description" content="See your collection of soaps." />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main >
          <Header></Header>
          <YourSoaps></YourSoaps>
          <BalanceDisplay></BalanceDisplay>

        </main>
      </div>
  
  
  
    )
  }
  
  export default Collection