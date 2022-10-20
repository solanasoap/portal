import { createContext, useContext, useMemo, useState } from "react";

const WalletContext = createContext(null);

export function WalletWrapper({ children }) {
   const [walletState, setWalletState] = useState({});
   const contextValue = useMemo(() => {
      return [walletState, setWalletState];
   }, [walletState, setWalletState]);

   return (
   <WalletContext.Provider value={contextValue}>
      {children}
   </WalletContext.Provider>
   );
}

export function useWalletContext() {
   return useContext(WalletContext);
}