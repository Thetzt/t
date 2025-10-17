<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TON Payment Wallet Connect</title>
    
    <script type="module" src="https://unpkg.com/@web3modal/ethers/dist/ethers.js?v=1.1"></script>

    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background-color: #1a1b1e; color: white; }
        .container { width: 90%; max-width: 500px; text-align: center; }
        header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid #333; margin-bottom: 3rem; }
        h1 { font-size: 1.5rem; margin: 0; }
        #profile { display: none; background-color: #2c2c34; padding: 2rem; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.3); }
        .profile-item { margin-bottom: 1rem; }
        .profile-item strong { display: block; color: #aaa; margin-bottom: 0.5rem; }
        .address-box { font-family: monospace; word-break: break-all; background-color: #1a1b1e; padding: 0.8rem; border-radius: 8px; border: 1px solid #444; }
        #welcomeMessage { text-align: center; }
        #status-message { color: #ffc107; font-family: monospace; padding: 10px; border: 1px dashed #ffc107; border-radius: 5px; margin-bottom: 2rem; }
    </style>
</head>
<body>

    <div class="container">
        <header>
            <h1>My dApp</h1>
            <w3m-button></w3m-button>
        </header>

        <main>
            <p id="status-message">Loading script...</p>
            <div id="welcomeMessage">
                <h2>Connect your wallet</h2>
                <p>Please connect your wallet to see your profile information.</p>
            </div>
        </main>
    </div>

    <script type="module">
        const statusMessage = document.getElementById('status-message');
        
        try {
            const { createWeb3Modal, defaultConfig } = await import('https://unpkg.com/@web3modal/ethers/dist/ethers.js?v=1.1');
            statusMessage.textContent = 'Script loaded. Initializing Web3Modal...';
            
            const projectId = 'bc60ecee1496cb198f70928725843489';
            const mainnet = { chainId: 1, name: 'Ethereum', currency: 'ETH', explorerUrl: 'https://etherscan.io', rpcUrl: 'https://cloudflare-eth.com' };
            const metadata = { name: 'TON Payment App', description: 'Web3 App', url: 'https://tonpayment.netlify.app', icons: ['https://avatars.githubusercontent.com/u/37784886'] };
            const ethersConfig = defaultConfig({ metadata });
            createWeb3Modal({ ethersConfig, chains: [mainnet], projectId });
            
            statusMessage.textContent = 'Web3Modal initialized successfully! Button should be visible.';
            statusMessage.style.color = '#28a745';
        } catch (error) {
            statusMessage.textContent = 'Error initializing Web3Modal. Check project ID and domain settings in WalletConnect Cloud.';
            statusMessage.style.color = '#dc3545';
            console.error("Initialization Error:", error);
        }
    </script>
</body>
</html>