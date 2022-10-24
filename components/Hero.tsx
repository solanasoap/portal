import Link from 'next/link'

export default function Hero() {
    return (
        <>
            <div className="flex text-white mb-3 bg-gradient-to-tr from-RBGradient-Red-Left to-RBGradient-Blue-Right p-8 mt-4 rounded-b-lg rounded-t-lg">
                <div className="max-w-3xl lg:pl-32 font-neueHaasUnicaRegular">
                    <div className="pt-6 py-6">
                        <div className="text-3xl lg:text-6xl md:text-4xl font-bold">
                            The next-gen token dispenser, built on Solana.
                        </div>
                    </div>
                    <div className="py-2 text-xl">
                        <p> Give out soaps as rewards, communicate with holders, and engage your tribe. With soap, people can prove their actions and get immersed in an on-chain world. </p>
                    </div>
                    <div className="py-8">
                        <Link href="/soaps">
                            <button className=" bg-RBGradient-Blue-Right hover:shadow-md uppercase font-neueHaasUnicaBlack text-white font-bold py-2 px-4 rounded w-64 h-16">
                                see your soaps
                            </button>
                        </Link>
                        <div className="py-8">
                            <Link href="/dealer/HKPcjAi699egocGNqMVEEkPqYAwPZ12oqFWKfzVcCudV">
                                <button className=" bg-RBGradient-Blue-Right hover:shadow-md uppercase font-neueHaasUnicaBlack text-white font-bold py-2 px-4 rounded w-64 h-16">
                                    Test dealer
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
