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

// Initialize Reown with your real project ID
const reown = new Reown({
  projectId: "7be08574a6238618945452abdd8b896a", // ✅ your Project ID
  metadata: {
    name: "TON Payment",
    description: "EVM Real Connect by TON Payment",
    url: "https://tonpayment.netlify.app/",
    icons: ["https://tonpayment.netlify.app/icon.png"],
  },
});

async function connectWallet() {
  try {
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

    addressEl.textContent = address;
    networkEl.textContent = network.name;
    balanceEl.textContent = `${ethBalance} ETH`;
    walletInfo.style.display = "block";
    connectBtn.textContent = "Connected ✅";
  } catch (err) {
    console.error(err);
    alert("Wallet connection failed — check console for details.");
  }
}

async function verifySignature() {
  if (!signer) return alert("Please connect wallet first!");
  const address = await signer.getAddress();
  const message = `Verify ownership of ${address}\nTime: ${new Date().toISOString()}`;
  try {
    const signature = await signer.signMessage(message);
    const recovered = ethers.verifyMessage(message, signature);
    if (recovered.toLowerCase() === address.toLowerCase()) {
      statusEl.textContent = "✅ Verified wallet owner!";
      statusEl.style.color = "green";
    } else {
      statusEl.textContent = "❌ Verification failed.";
      statusEl.style.color = "red";
    }
  } catch (e) {
    console.error(e);
    statusEl.textContent = "❌ Signature canceled or failed.";
  }
}

connectBtn.addEventListener("click", connectWallet);
verifyBtn.addEventListener("click", verifySignature);
