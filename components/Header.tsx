import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Header() {

    return (
        <>
            {/* <header className="flex items-center justify-between bg-blue-100 px-10 py-2 bg-blue-100">
                <img
                    src="https://cdn.hashnode.com/res/hashnode/image/upload/v1643004937711/k3NMskkSn.png"
                    width="50"
                    alt="Daily Dev Tips Logo"
                />
                <strong>This is my website</strong>
                <button
                    className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                >
                    Click me
                </button>
            </header> */}

            <nav className="py-3 mb-2 flex justify-between">
                <h1 className='text-4xl font-phenomenaBlack h-12 leading-8'>soap</h1>
                <ul className="flex items-center font-neueHaasUnicaRegular">
                    {/* <li className="pl-6">
                        <p>Discover</p>
                    </li>
                    <li className="pl-6">
                        Try
                    </li> */}
                    <li className="pl-6">
                    <WalletMultiButton className='bg-black leading-none'/>
                    </li>
                </ul>
            </nav>
        </>
    )

}

// h-12 mb-12 leading-8 font-phenomenaBlack

// font-neueHaasUnicaRegular text-sm