import { FC, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { Connection, PublicKey } from '@solana/web3.js';
import { getAccount, getAssociatedTokenAddress } from '@solana/spl-token';
import { BsLink45Deg } from 'react-icons/bs'
import Link from 'next/link';

// Get soap id, get wallet pubkey
// check if ATA exists
// return checkmark if yes, no if no

const connection = new Connection(process.env.NEXT_PUBLIC_RPC_ENDPOINT + process.env.NEXT_PUBLIC_QUICKNODE_API_KEY + "/", 'processed');

export const OwnSoap: FC<soapAddressInterface> = ({ soapAddress }) => {
    const [walletAddress, setWalletAddress] = useState<string | null>(null)
    const [ownSoap, setOwnSoap] = useState<boolean>(null)
    const [ata, setAta] = useState(null)
    console.log("SoapAddress in examiner: ", soapAddress)

    // First load only
    useEffect(() => {

        if (!walletAddress) {
            if (Cookies.get('walletAddress')) {
                console.log("We found a public key of a user, we'll continue with that: ", Cookies.get('walletAddress'))
                setWalletAddress(Cookies.get('walletAddress'))
            } else {
                console.log("you got no wallet address in your local storage ser")
                return
            }
        }
    }, [])

    useEffect(() => {
        if (walletAddress) {
            console.log("Wallet Address: ", walletAddress)
            const walletPublicKey: PublicKey = new PublicKey(walletAddress)
            const soapPublicKey: PublicKey = new PublicKey(soapAddress)
            //get associated token account address for target wallet
            const getATA = async () => {
                const tokenATA = await getAssociatedTokenAddress(soapPublicKey, walletPublicKey);
                try {
                    console.log("Finding ATA for account: ", walletPublicKey.toBase58())
                    const tokenAccount = await getAccount(connection, tokenATA, 'processed');
                    console.log("Token Account exists: ", tokenAccount.address.toBase58())
                    setAta(tokenAccount.address.toBase58())
                    setOwnSoap(true)
                } catch (error) {
                    console.log("ATA " + tokenATA + " doesn't exist.")
                    setOwnSoap(false)
                }
            }
            getATA()
        }
    }, [walletAddress])

    return (
        <>
            <div className="text-xl font-bold font-neueHaasUnicaRegular">
                {walletAddress ? (
                    <>
                        {(ownSoap && walletAddress) ? (

                                <div className="text-transparent bg-clip-text bg-gradient-to-r from-greenBottomLeft to-greenTopRight overflow-hidden whitespace-nowrap">
                                    <Link href={`https://solscan.io/address/${ata}`}>
                                        <div className='flex-row flex items-center'>                
                                            <p>
                                            You own this soap 
                                                </p>                        
                                            <BsLink45Deg className="text-greenTopRight"/>
                                        </div>
                                    </Link>

                                </div>
                        
                        ) : (
                            <p className='text-gray-600'>
                                You don't have this soap
                            </p>
                        )}
                    </>
                ) : (
                    <p className='text-lg text-gray-600'>
                        Log in to check if you own this soap
                    </p>
                )}
            </div>
        </>
    )
}

interface soapAddressInterface {
    soapAddress: string
}