import Link from 'next/link'

export default function Hero() {
    return (
        <>
            <div className="flex text-white bg-gradient-to-tr from-RBGradient-Red-Left to-RBGradient-Blue-Right py-8 px-6 mt-2 rounded-lg">
                <div className="lg:px-6 font-neueHaasUnicaRegular">
                    <div className="pt-6 py-6">
                        <div className="text-3xl lg:text-6xl md:text-4xl font-bold lg:w-5/6">
                            The next-gen token dispenser, built on Solana.
                        </div>
                    </div>
                    <div className="py-2 text-xl lg:w-5/6">
                        <p> Give out soaps as rewards, communicate with holders, and engage your tribe. With soap, people can prove their actions and get immersed in an on-chain world. </p>
                    </div>
                    <div className="py-8">
                        <Link href="/soaps">
                            <button className=" bg-RBGradient-Blue-Right hover:shadow-md uppercase font-neueHaasUnicaBlack text-white font-bold py-2 px-4 rounded w-64 h-16">
                                see your soaps
                            </button>
                        </Link>
                        <div className="py-8">
                            <Link href="/dealer/YngRrzzvjvdAhWTCyNMgvyrmeJ8jt4hL7NUqaK4derF">
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
