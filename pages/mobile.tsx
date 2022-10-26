import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'
import Hero from '../components/Hero'
import React, { } from 'react';
import WalletLogin from '../components/WalletLogin';
import QRCode from 'react-qr-code'

const Collection: NextPage = (props) => {


  return (
    <div className="px-4 lg:max-w-7xl lg:justify-center lg:items-center lg:m-auto">
      <Head>
        <title>New mobile adapter</title>
        <meta name="description" content="Connect to mobile" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=''>
        <div className="lg:invisible">
          <div className="flex">
            <div className="ml-auto">
              <WalletLogin
                target={`/soaps`}
                walletAction="Connect"
                forceReconnect={false}
              />
            </div>
          </div>
        </div>

        <div className="invisible lg:visible lg:max-w-7xl max-w-xl">
          <div className=" text-white bg-gradient-to-tr from-RBGradient-Red-Left to-RBGradient-Blue-Right px-4 py-8 mt-4 mb-3 rounded-lg">
            <div className='grid grid-cols-2'>

              <div className="pl-8">
                <div className="pb-2">
                  <div className="text-3xl lg:text-6xl md:text-4xl font-bold">
                    We&#39;re mobile first.
                  </div>
                </div>
                <div className="py-2 text-xl">
                  <p>Apologies, we plan to create a cross-platform experience in the future. For now, open this page on your phone by using the QR code. </p>
                </div>
              </div>
              <div className="font-neueHaasUnicaRegular bg-white rounded-lg m-auto">
                <div className="p-4">
                  <QRCode value={"https://" + process.env.NEXT_PUBLIC_BASE_URL} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>



  )
}

export default Collection