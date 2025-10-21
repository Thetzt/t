const { ethers } = window.ethers;
const { Reown } = window.reown;

const connectBtn = document.getElementById("connectBtn");
const walletInfo = document.getElementById("walletInfo");
const addressEl = document.getElementById("address");
const networkEl = document.getElementById("network");
const balanceEl = document.getElementById("balance");
const verifyBtn = document.getElementById("verifyBtn");
const statusEl = document.getElementById("status");

let provider, signer;

// ✅ Initialize Reown SDK with your project ID
const reown = new Reown({
  projectId: "7be08574a6238618945452abdd8b896a",
  metadata: {
    name: "EVM Real Connect",
    description: "WalletConnect with Reown SDK example",
    url: window.location.origin,
    icons: ["https://reown.com/favicon.ico"],
  },
});

async function connectWallet() {
  try {
    // 🔹 Request a wallet connection session
    const session = await reown.connect({
      chains: [1, 137, 56, 11155111], // Ethereum, Polygon, BSC, Sepolia
    });

    const walletProvider = reown.getWalletProvider();
    provider = new ethers.BrowserProvider(walletProvider);
    signer = await provider.getSigner();

    const address = await signer.getAddress();
    const network = await provider.getNetwork();
    const balance = await provider.getBalance(address);
    const ethBalance = ethers.formatEther(balance);

    // Update UI
    addressEl.textContent = address;
    networkEl.textContent = network.name;
    balanceEl.textContent = `${ethBalance} ETH`;
    walletInfo.style.display = "block";
    connectBtn.textContent = "Connected ✅";

  } catch (error) {
    console.error("Wallet connection failed:", error);
    alert("Failed to connect wallet. Check console for details.");
  }
}

// 🧾 Signature verification
async function verifyOwner() {
  if (!signer) {
    alert("Please connect your wallet first!");
    return;
  }

  const address = await signer.getAddress();
  const message = `Verify wallet ownership for ${address}\n${new Date().toISOString()}`;
  try {
    const signature = await signer.signMessage(message);
    const recovered = ethers.verifyMessage(message, signature);
    if (recovered.toLowerCase() === address.toLowerCase()) {
      statusEl.textContent = "✅ Verified owner!";
      statusEl.style.color = "green";
    } else {
      statusEl.textContent = "❌ Verification failed";
      statusEl.style.color = "red";
    }
  } catch (err) {
    console.error(err);
    statusEl.textContent = "❌ Signature canceled.";
  }
}

connectBtn.addEventListener("click", connectWallet);
verifyBtn.addEventListener("click", verifyOwner);
