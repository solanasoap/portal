import "solana-wallets-vue/styles.css";
import SolanaWallets from "solana-wallets-vue";
import {
  PhantomWalletAdapter,
  GlowWalletAdapter,
  SolflareWalletAdapter,
  ExodusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletStoreProps } from "solana-wallets-vue/dist/types";

const walletOptions = {
  wallets: [
    new SolflareWalletAdapter(),
    new PhantomWalletAdapter(),
    new GlowWalletAdapter(),
    new ExodusWalletAdapter(),
  ],
  autoConnect: true,
  cluster: "mainnet-beta",
} as WalletStoreProps;

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(SolanaWallets, walletOptions);
});
