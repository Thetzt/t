import React from 'react';
import { AppKitProvider, WalletModalProvider, ConnectButton } from '@reown/appkit';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const { chains, publicClient } = configureChains([mainnet], [publicProvider()]);

const config = createConfig({
  autoConnect: true,
  publicClient,
});

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <AppKitProvider adapter={new WagmiAdapter()}>
          <WalletModalProvider>
            <div style={{ padding: 30 }}>
              <h1>WalletConnect + Reown</h1>
              <ConnectButton />
            </div>
          </WalletModalProvider>
        </AppKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
