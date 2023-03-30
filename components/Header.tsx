import Link from 'next/link'
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from 'next/router'
import styles from './Header.module.css'
import Image from 'next/image'

import BubbleImage from '../public/Bubble.png';

export default function Header() {
    const [walletAddress, setWalletAddress] = useState<string | null>(null)
    let displayWalletBtn = false

    const router = useRouter()
    const pathName = router.pathname

    // FIXME: this is not gud, do better, just for MVP
    if (pathName.includes("dealer") || pathName.includes("mintooor") || pathName.includes("link")) {
        displayWalletBtn = false
    } else if (pathName.includes("examiner") || pathName.includes("soaps") || pathName === "/") {
        displayWalletBtn = true
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
                <header className={`relative flex my-4 mx-4 lg:mx-10 justify-left ${styles.header}`}>
                    <img src="/puddle.png" alt="Puddle" className="puddle" />
                    <Link href="/">
                        <h1 className={`${styles.soap} text-6xl font-phenomenaBlack h-12 leading-6 cursor-pointer`}>soap</h1>
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
