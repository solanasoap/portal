import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'
import Hero from '../components/Hero'
import React, { } from 'react';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { BalanceDisplay } from '../components/BalanceDisplay';
import WalletLogin from '../components/WalletLogin';

const Collection: NextPage = (props) => {
  
  
    return (
      <div className="px-5">
        <Head>
          <title>New mobile adapter</title>
          <meta name="description" content="See your collection of soaps." />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main >
          <Header></Header>
          <WalletLogin></WalletLogin>
          <BalanceDisplay></BalanceDisplay>

        </main>
      </div>
  
  
  
    )
  }
  
  export default Collection