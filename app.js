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

// 1️⃣ Initialize Reown
const reown = new Reown({
  projectId: "7be08574a6238618945452abdd8b896a", // Get from https://reown.com/
  metadata: {
    name: "Reown Real Connect",
    description: "Simple EVM wallet connect using Reown",
    url: window.location.origin,
    icons: ["https://reown.com/icon.png"],
  },
});

// 2️⃣ Connect wallet
async function connectWallet() {
  try {
    const session = await reown.connect();
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
    alert("Wallet connection failed");
  }
}

// 3️⃣ Sign message to verify ownership
async function verifySignature() {
  try {
    const address = await signer.getAddress();
    const message = `Verify ownership of ${address}\n${new Date().toISOString()}`;
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
    statusEl.textContent = "❌ Signature canceled";
  }
}

connectBtn.onclick = connectWallet;
verifyBtn.onclick = verifySignature;
