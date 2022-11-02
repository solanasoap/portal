import Link from 'next/link'
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from 'next/router'

export default function Header() {
    const [walletAddress, setWalletAddress] = useState<string | null>(null)
    let displayWalletBtn = true

    const router = useRouter()
    const pathName = router.pathname

    if (pathName.includes("dealer") || pathName.includes("mintooor") || pathName.includes("link")) {
        displayWalletBtn = false
    }

    useEffect(() => {

        if (!walletAddress) {
            if (Cookies.get('walletAddress')) {
                setWalletAddress(Cookies.get('walletAddress'))
            } else {
                return
            }
        }
    }, [])

    return (
        <>
            <div className="lg:max-w-6xl m-auto">
                <header className="flex my-4 mx-4 lg:mx-0 justify-between">
                    <Link href="/">
                        <h1 className='text-6xl font-phenomenaBlack h-12 leading-6 cursor-pointer'>soap</h1>
                    </Link>
                    {displayWalletBtn && (
                        <div className="font-neueHaasUnicaRegular">
                            <Link href="/mobile">
                                <button className="bg-white hover:drop-shadow-md text-black font-bold py-2 w-40 rounded h-12 lg:invisible">
                                    {walletAddress ? `🔗 ${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : "WALLET"}
                                </button>
                            </Link>
                        </div>
                    )}
                </header>
            </div>
        </>
    )

}