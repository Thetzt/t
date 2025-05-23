import React from 'react';
import {
  AppKitProvider,
  WalletModalProvider,
  ConnectButton,
} from '@reown/appkit';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import {
  createConfig,
  configureChains,
  WagmiConfig,
} from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const { chains, publicClient } = configureChains(
  [mainnet],
  [publicProvider()]
);

const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <AppKitProvider adapter={new WagmiAdapter()}>
          <WalletModalProvider>
            <div style={{ padding: 30, fontFamily: 'Arial' }}>
              <h1>WalletConnect + Reown App</h1>
              <ConnectButton />
            </div>
          </WalletModalProvider>
        </AppKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}

export default App;
