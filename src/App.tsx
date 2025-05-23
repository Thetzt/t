import React from 'react';
import { useConnect, useAccount } from 'wagmi';

function App() {
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const { address, isConnected } = useAccount();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Connect Your Wallet</h1>
      {isConnected ? (
        <div>
          <p>Connected Address: {address}</p>
        </div>
      ) : (
        <div>
          {connectors.map((connector) => (
            <button
              disabled={!connector.ready}
              key={connector.id}
              onClick={() => connect({ connector })}
              style={{ margin: '0.5rem' }}
            >
              {connector.name}
              {!connector.ready && ' (unsupported)'}
              {isLoading && connector.id === pendingConnector?.id && ' (connecting)'}
            </button>
          ))}
          {error && <div>{error.message}</div>}
        </div>
      )}
    </div>
  );
}

export default App;
