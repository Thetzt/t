import { createConfig, configureChains } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { metaMask, walletConnect } from 'wagmi/connectors';

const { chains, publicClient } = configureChains(
  [mainnet, sepolia],
  [publicProvider()]
);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    metaMask(),
    walletConnect({
      projectId: a077335c41cfd0d8e5f10d6ceafb02d2',
    }),
  ],
  publicClient,
});
