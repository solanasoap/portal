import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { FC, useEffect, useState } from 'react'
import Link from 'next/link'
const axios = require('axios')
import Image from 'next/image'

const params = new URLSearchParams({
    "api-key": "7891f7f8-bd63-4506-9ba3-a4ec8ab81ddd" // FIXME REPLACE THIS
});

const buildHeliusUrl = (path: string, address: string, genre: string, params: URLSearchParams) =>
    `https://api.helius.xyz/v0/${path}/${address}/${genre}?${params.toString()}`;

export const SoapGallery: FC = () => {
    const [balance, setBalance] = useState(0)
    const { connection } = useConnection()
    const { publicKey } = useWallet()
    const [ walletAddress, setWalletAddress] = useState('')

    useEffect(() => {
        const walletAddress = localStorage.getItem('walletEncryptionKey')
        console.log("walletaddress: ", walletAddress)
        setWalletAddress(walletAddress)


        if (!connection || !publicKey) { return }

        connection.getAccountInfo(publicKey).then(info => {
            setBalance(info.lamports)
            console.log("logged in wallet: ", publicKey.toBase58())
        })

        //const url = buildHeliusUrl("addresses", publicKey.toBase58(), "nfts", params);
        const url = buildHeliusUrl("addresses", "CN5zRzJGNqp5GNyfWjwSKeg8BuG5XJezAHMHfV7e69TT", "nfts", params);
        console.log("Wallet from helius is CN5zRzJGNqp5GNyfWjwSKeg8BuG5XJezAHMHfV7e69TT")
        console.log(url)
        const getNFTs = async () => {
            const { data } = await axios.get(url)
            console.log("nfts held: ", data)
        }
        getNFTs()

        // TODO:
        // Get all NFTs that belong to the 9McAofPndtizYttpcdPD4EnQniJZdCG7o6usF2d4JPDV collection from user's wallet
        // Display all of them in a nice card system

    }, [connection, publicKey])

    // Load user pubkey into state
    useEffect(() => {
        if (localStorage.getItem('userPublicKey')) {
            console.log("We found a public key of a user, we'll continue with that:")
            console.log(localStorage.getItem('userPublicKey'))
            setWalletAddress(localStorage.getItem('userPublicKey'))
        } else {
            console.log("you got no userPublicKey in your local storage ser")

        }
    }, [])


    // //const url = "https://api.helius.xyz/v0/addresses/" + " /nfts?api-key=<your-key>"
    // const url = buildHeliusUrl("addresses", publicKey.toBase58 params);

    // const getNFTs = async () => {
    //     const { data } = await axios.get(url)
    //     console.log("nfts held: ", data)
    // }

    

    return (
        <>
            {/* <div className='flex w-auto py-2 justify-center items-center'>
                <p className='' >{publicKey ? `Balance of ${publicKey.toBase58().slice(0, 5)}... is ${balance / LAMPORTS_PER_SOL} SOL` : 'Wallet not connected'}</p>
            </div> */}
            <div >
                <p>Wallet: { walletAddress }</p>
            </div>
            <div className="flex text-white mb-3 bg-gradient-to-tr from-RBGradient-Red-Left to-RBGradient-Blue-Right p-8 rounded-b-lg rounded-t-lg h-96">
                {/* <p className='' >{publicKey ? `${getNFTs()}` : 'Wallet not connected'}</p> */}
                <div className='flex items-center justify-center'>
                    <Image src={"https://arweave.net/sjTRm--NoyQK7v6hA2FwEE7RIA0tqc4YVZJ1FP8GV4M"} width={500} height={500}></Image>
                </div>
            </div>
        </>
    )
}