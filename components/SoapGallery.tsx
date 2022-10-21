import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey } from '@solana/web3.js'
import { FC, useEffect, useState } from 'react'
const axios = require('axios')
import { FindNftsByOwnerOutput, Metaplex, Nft, Sft } from '@metaplex-foundation/js';



const connection = new Connection("https://broken-green-forest.solana-mainnet.discover.quiknode.pro/914e7031c3225e57b4a8295a35457913e59475cc/"); // FIXME REPLACE THIS
const mx = Metaplex.make(connection);

const soapCollectionId = new PublicKey("9McAofPndtizYttpcdPD4EnQniJZdCG7o6usF2d4JPDV")

const heliosParams = new URLSearchParams({
    "api-key": "7891f7f8-bd63-4506-9ba3-a4ec8ab81ddd" // FIXME REPLACE THIS
});

// MAY NOT NEED HELIUS
const buildHeliusUrl = (path: string, address: string, genre: string, params: URLSearchParams) =>
    `https://api.helius.xyz/v0/${path}/${address}/${genre}?${params.toString()}`;



export const SoapGallery: FC = () => {
    const [balance, setBalance] = useState(0)
    const { connection } = useConnection()
    const { publicKey } = useWallet()
    const [walletAddress, setWalletAddress] = useState<string | null>(null)
    const [address, setAddress] = useState();

    const [nftList, setNftList] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentView, setCurrentView] = useState(null);
    const perPage = 1;

    // Fetch all NFTs held by wallet
    const fetchNFTs = async () => {
        try {
            setLoading(true);
            setCurrentView(null);
            const list: FindNftsByOwnerOutput = await mx.nfts().findAllByOwner({ owner: new PublicKey(walletAddress) });
            setNftList(soapList(list));
            setCurrentPage(1);
        } catch (e) {
            console.error(e);
        }
    };

    // Filter only for authentic soaps from all nfts held by wallet
    const soapList = (list: FindNftsByOwnerOutput) => {
        let soaps = []
        list.map(nft => {
            if (nft.collection != null) {
                if (nft.collection.address.toBase58() == soapCollectionId.toBase58()) {
                    soaps.push(nft)
                }
            }
        })
        return soaps
    }

    useEffect(() => {
        if (!nftList) {
            return;
        }

        const execute = async () => {
            const startIndex = (currentPage - 1) * perPage;
            const endIndex = currentPage * perPage;
            const nfts = await loadData(startIndex, endIndex);

            if (!nfts.length) {
                // console.log("No NFTs held by wallet.")
                setCurrentView(null);
            } else {
                setCurrentView(nfts);
            }

            setLoading(false);
        };

        execute();
    }, [nftList, currentPage]);

    const loadData = async (startIndex, endIndex) => {
        const nftsToLoad = nftList.filter((_, index) => (index >= startIndex && index < endIndex))

        const promises = nftsToLoad.map((metadata) => mx.nfts().load({ metadata }));
        return Promise.all(promises);
    };

    const changeCurrentPage = (operation) => {
        setLoading(true);
        if (operation === 'next') {
            setCurrentPage((prevValue) => prevValue + 1);
        } else {
            setCurrentPage((prevValue) => (prevValue > 1 ? prevValue - 1 : 1));
        }
    };

    useEffect(() => {
        if (walletAddress) {
            fetchNFTs()
        }
    }, [walletAddress])

    // First load only
    useEffect(() => {

        if (!walletAddress) {
            if (localStorage.getItem('userPublicKey')) {
                console.log("We found a public key of a user, we'll continue with that: ", localStorage.getItem('userPublicKey'))
                setWalletAddress(localStorage.getItem('userPublicKey'))
            } else {
                console.log("you got no userPublicKey in your local storage ser")
                return
            }
        }

        // TODO:
        // Display all of them in a nice card system
    }, [])

    return (
        <>
            <div className="flex justify-center pb-2">
                <p className='font-bold font-phenomenaRegular flex pb-2 text-4xl'>{walletAddress ? `Wallet: ${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : "Please log in to see your soaps."}</p>
            </div>
            {walletAddress && currentView && (
                <div className="flex-col text-white mb-3 bg-gradient-to-tr from-RBGradient-Red-Left to-RBGradient-Blue-Right p-8 rounded-b-lg rounded-t-lg h-auto">
                    <div>
                        {loading ? ( // false by default
                            <div className='flex justify-center'>
                                <img className="" src="/loading.svg" />
                            </div>
                        ) : (
                            currentView &&
                            currentView.map((nft, index) => (
                                <div key={index} className="w-full fle-col p-2">
                                    <h1 className="font-bold font-phenomenaBlack flex pb-2 text-2xl justify-center pb-8">{nft.name}</h1>
                                    <img
                                        className="flex items-center justify-center w-auto h-auto rounded-lg"
                                        src={nft?.json?.image || '/fallbackImage.jpg'}
                                        alt="The downloaded illustration of the provided NFT address."
                                    />
                                </div>
                            ))
                        )}
                    </div>
                    <div>
                        {currentView && ( // null by default
                            <div className="pt-6 flex justify-center">
                                <button
                                    disabled={currentPage === 1}
                                    className="bg-RBGradient-Blue-Right hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg uppercase font-neueHaasUnicaBlack w-28 h-20 m-2 text-xl"
                                    onClick={() => changeCurrentPage('prev')}
                                >
                                    Prev
                                </button>
                                <button
                                    disabled={nftList && nftList.length / perPage === currentPage}
                                    className="bg-RBGradient-Blue-Right hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg uppercase font-neueHaasUnicaBlack w-28 m-2 text-xl"
                                    onClick={() => changeCurrentPage('next')}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {!currentView && walletAddress && (
                <div className="flex-col text-white mb-3 bg-gradient-to-tr from-RBGradient-Red-Left to-RBGradient-Blue-Right p-8 rounded-b-lg rounded-t-lg h-auto">
                    <p className='font-bold font-phenomenaRegular flex pb-2 text-4xl text-center'>You aint got no soap, smelly mfer</p>
                </div>
            )}
        </>
    )
}