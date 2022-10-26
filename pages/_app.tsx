import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
    GlowWalletAdapter,
    LedgerWalletAdapter,
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    SolletExtensionWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { AppProps } from 'next/app';
import { FC, useMemo } from 'react';
import { WalletWrapper } from '../context/MobileWalletContext';
import Header from '../components/Header'

// Use require instead of import since order matters
require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');

const App: FC<AppProps> = ({ Component, pageProps }) => {
    // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
    // Only the wallets you configure here will be compiled into your application, and only the dependencies
    // of wallets that your users connect to will be loaded
    const wallets = useMemo(
        () => [
            new GlowWalletAdapter(),
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new LedgerWalletAdapter(),
            new SolletExtensionWalletAdapter()
        ],
        [network]
    );

    return (
        <WalletWrapper>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect={true} localStorageKey="soapWalletAdapter">
                        <WalletModalProvider>
                            <Header/>
                            <Component {...pageProps} />
                        </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </WalletWrapper>
    );
};

export default App; 