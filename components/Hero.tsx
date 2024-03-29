import Link from 'next/link'
import { BsLink45Deg } from 'react-icons/bs'

export default function Hero() {
    return (
        <>
            <div className="flex text-white ">
                <div className="lg:px-6 font-neueHaasUnicaRegular">
                    <div className="pt-24 py-6">
                        <div className="text-5xl lg:text-6xl md:text-4xl font-bold lg:w-5/6 font-phenomenaBlack text-transparent bg-clip-text bg-gradient-to-r from-greenBottomLeft to-greenTopRight">
                            The smoothest tokens in town.
                        </div>
                    </div>
                    <div className="py-2 text-lg lg:w-5/6">
                        <p> Soap enables you to easily create and distribute digital collectibles to your community.  </p>
                    </div>
                    <div className="py-8 flex-row flex gap-4 lg:justify-start ">
                        <Link href="/soaps">
                            <button className="bg-gradient-to-tr from-[#e10b00] to-RBGradient-Red-Left hover:shadow-md uppercase font-neueHaasUnicaBlack text-white font-bold py-2 px-4 rounded w-auto h-16 drop-shadow-lg m-auto lg:m-0">
                                see your soaps
                            </button>
                        </Link>
                        <Link href="/dealer/YngRrzzvjvdAhWTCyNMgvyrmeJ8jt4hL7NUqaK4derF">
                            <button className="bg-gradient-to-tr from-phantomTopRight to-justPurple hover:shadow-md uppercase font-neueHaasUnicaBlack text-white font-bold py-2 px-4 rounded w-auto h-16 drop-shadow-lg m-auto lg:m-0">
                                try dispenser
                            </button>
                        </Link>
                        <Link href="/creator">
                            <button className="bg-gradient-to-tr from-green-600 to-green-500 hover:shadow-md uppercase font-neueHaasUnicaBlack text-white font-bold py-2 px-4 rounded w-auto h-16 drop-shadow-lg m-auto lg:m-0">
                                Create Soap
                            </button>
                        </Link>
                    </div>
                    <div className="text-transparent bg-clip-text bg-gradient-to-r from-greenBottomLeft to-greenTopRight overflow-hidden whitespace-nowrap">
                        <Link href={`https://t.me/oyacaro`}>
                            <div className='flex-row flex items-center'>
                                <p className='text-lg font-bold font-neueHaasUnicaRegular'>
                                    Contact
                                </p>
                                <BsLink45Deg className="text-greenTopRight" />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
