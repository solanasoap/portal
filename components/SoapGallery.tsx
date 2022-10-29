import { Connection, PublicKey } from '@solana/web3.js'
import { FC, useEffect, useState } from 'react'
import { FindNftsByOwnerOutput, Metaplex, Nft, Sft } from '@metaplex-foundation/js';
import { useRouter } from 'next/router'
import Cookies from 'js-cookie';
import Link from 'next/link';


const mxconnection = new Connection("https://broken-green-forest.solana-mainnet.discover.quiknode.pro/" + process.env.NEXT_PUBLIC_QUICKNODE_API_KEY + "/", 'confirmed');
const mx = Metaplex.make(mxconnection);
const soapCollectionId = new PublicKey("9McAofPndtizYttpcdPD4EnQniJZdCG7o6usF2d4JPDV")


export const SoapGallery: FC = () => {
    const router = useRouter()

    const [walletAddress, setWalletAddress] = useState<string | null>(null)
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
            if (nft.collection != null && nft.collection.verified == true) {
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

    useEffect(() => {
        if (walletAddress) {
            fetchNFTs()
        }
    }, [walletAddress])

    // First load only
    useEffect(() => {

        if (!walletAddress) {
            if (Cookies.get('walletAddress')) {
                console.log("We found a public key of a user, we'll continue with that: ", Cookies.get('walletAddress'))
                setWalletAddress(Cookies.get('walletAddress'))
            } else {
                console.log("you got no wallet address in your local storage ser")
                goToLoginPage()
                return
            }
        }
    }, [])

    return (
        <>
            <div>
                <p className='font-bold font-phenomenaRegular text-4xl text-center flex-col flex justify-center text-white px-2 py-2 rounded-lg'>{walletAddress ? null : (
                    <>
                        <p>Please log in to see your soaps.</p>
                        <div className='flex justify-center'>
                            <img className="" src="/loading.svg" />
                        </div>
                    </>
                )}</p>
            </div>

            {(walletAddress && currentView) ? (
                <>
                    <div>
                        <h1 className='text-6xl font-phenomenaBlack mt-[-20pt] pb-6'>
                            your collection
                        </h1>
                    </div>
                    <div className="flex text-white px-0 pt-2 mb-4 rounded-lg">
                        <div>
                            {loading ? ( // false by default
                                <div className='flex justify-center'>
                                    <img className="" src="/loading.svg" />
                                </div>
                            ) : (
                                currentView &&
                                currentView.map((nft, index) => (
                                    <div key={index} className="w-full flex px-4 flex-col rounded-xl mb-4 bg-gradient-to-tr from-[#e10b00] to-RBGradient-Red-Left shadow-md">
                                        <h1 className="font-bold font-phenomenaBlack flex py-3 pt-2 text-3xl justify-start">{nft.name}</h1>
                                        <Link href={`/examiner/${nft.address.toBase58()}`}>
                                            <img
                                                className="flex items-center justify-center w-auto h-auto rounded-lg mb-6 shadow-lg hover:shadow-md cursor-pointer"
                                                src={nft?.json?.image || '/fallbackImage.jpg'}
                                                alt="The downloaded illustration of the provided NFT address."
                                            />
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
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
                    <p className='font-bold font-phenomenaRegular flex pb-2 text-4xl text-center'>Can&#39;t find any soaps here!</p>
                </div>
            )}
        </>
    )
}