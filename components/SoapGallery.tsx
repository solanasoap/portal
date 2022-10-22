import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey } from '@solana/web3.js'
import { FC, useEffect, useState } from 'react'
import axios from 'axios';
import { FindNftsByOwnerOutput, Metaplex, Nft, Sft } from '@metaplex-foundation/js';
import { useRouter } from 'next/router'


const mxconnection = new Connection("https://broken-green-forest.solana-mainnet.discover.quiknode.pro/" + process.env.NEXT_PUBLIC_QUICKNODE_API_KEY + "/");
const mx = Metaplex.make(mxconnection);
const soapCollectionId = new PublicKey("9McAofPndtizYttpcdPD4EnQniJZdCG7o6usF2d4JPDV")


export const SoapGallery: FC = () => {
    console.log(mxconnection.rpcEndpoint)
    const router = useRouter()

    const [balance, setBalance] = useState(0)
    const { connection } = useConnection()
    const { publicKey } = useWallet()
    const [walletAddress, setWalletAddress] = useState<string | null>(null)
    const [address, setAddress] = useState();

    const [nftList, setNftList] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentView, setCurrentView] = useState(null);
    const [userHasSoap, setUserHasSoap] = useState(true)
    const perPage = 30;

    // Fetch all NFTs held by wallet
    const fetchNFTs = async () => {
        try {
            setLoading(true);
            setCurrentView(null);
            // FIXME: This doesn't return SFT soaps if the user has more than 1 in their wallet
            const list: FindNftsByOwnerOutput = await mx.nfts().findAllByOwner({ owner: new PublicKey(walletAddress) });
            setNftList(soapList(list));
            setCurrentPage(1);
        } catch (e) {
            console.error(e);
        }
    };

    // redirect to login page
    const goToLoginPage = async () => {
        await sleep(2000)
        router.push('mobile')
    }

    function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

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

    // Update nft data in view when nftList or currentPage state gets updated
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
                setUserHasSoap(false)
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
                goToLoginPage()
                return
            }
        }
    }, [])

    return (
        <>
            <div>
                <p className='font-bold font-phenomenaRegular text-4xl text-center flex justify-center text-black px-2 py-2 rounded-lg'>{walletAddress ? null : `Please log in to see your soaps.`}</p>
            </div>

            {(walletAddress && currentView) ? (
                <>
                    <div className=' text-white bg-gradient-to-tr from-black to-black px-8 py-4 mb-4 rounded-lg'>
                        <p className='font-bold font-phenomenaRegular flex pb-4 text-4xl text-center'>
                            Welcome to your soap collection
                        </p>
                        <p className='font-phenomenaRegular text-xl text-center'>
                            These are all the 🧼 you&#39;ve collected into your wallet. Busy life huh!
                        </p>
                    </div>
                    <div className="flex-col text-white bg-gradient-to-tr from-RBGradient-Red-Left to-RBGradient-Blue-Right px-8 pt-2 mb-4 rounded-lg min-h-full">
                        <div>
                            {loading ? ( // false by default
                                <div className='flex justify-center'>
                                    <img className="" src="/loading.svg" />
                                </div>
                            ) : (
                                currentView &&
                                currentView.map((nft, index) => (
                                    <div key={index} className="w-full flex-col p-2">
                                        <h1 className="font-bold font-phenomenaBlack flex pb-2 pt-2 text-3xl justify-center shadow-lg">{nft.name}</h1>
                                        <img
                                            className="flex items-center justify-center w-auto h-auto rounded-lg mb-6 shadow-xl"
                                            src={nft?.json?.image || '/fallbackImage.jpg'}
                                            alt="The downloaded illustration of the provided NFT address."
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                        {/* <div>
                        {currentView && ( // null by default
                            <div className="pt-6 flex justify-center">
                                <button
                                    disabled={currentPage === 1}
                                    className="bg-RBGradient-Blue-Right hover:drop-shadow-md text-white font-bold py-3 rounded-lg uppercase font-neueHaasUnicaBlack w-64 h-18 m-2 text-xl disabled:bg-gray-800"
                                    onClick={() => changeCurrentPage('prev')}
                                >
                                    Prev
                                </button>
                                <button
                                    disabled={nftList && nftList.length / perPage === currentPage}
                                    className="bg-RBGradient-Blue-Right hover:drop-shadow-md text-white font-bold py-3 px-4 rounded-lg uppercase font-neueHaasUnicaBlack w-64 h-18 m-2 text-xl disabled:bg-gray-800"
                                    onClick={() => changeCurrentPage('next')}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div> */}
                    </div>
                </>
            ) : (loading && (
                <div className='flex justify-center'>
                    <img className="" src="/loading.svg" />
                </div>
            )
            )}

            {!currentView && walletAddress && !userHasSoap && (
                <div className="flex-col text-white mb-3 bg-gradient-to-tr from-RBGradient-Red-Left to-RBGradient-Blue-Right p-8 rounded-b-lg rounded-t-lg h-auto">
                    <p className='font-bold font-phenomenaRegular flex pb-2 text-4xl text-center'>You ain&#39;t got no soap, we can smell.</p>
                </div>
            )}
        </>
    )
}