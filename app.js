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

console.log("Initializing Reown...");

const reown = new Reown({
  projectId: "7be08574a6238618945452abdd8b896a",
  metadata: {
    name: "TON Payment – Real Connect",
    description: "Connect your wallet via Reown SDK",
    url: window.location.origin,
    icons: [ window.location.origin + "/icon.png" ],
  },
});

async function connectWallet() {
  console.log("connectWallet triggered");
  try {
    const session = await reown.connect({
      chains: [ "eip155:1", "eip155:137", "eip155:56" ] // CAIP-2 format maybe required
    });
    console.log("Session:", session);

    const walletProvider = reown.getWalletProvider();
    if (!walletProvider) {
      console.error("No walletProvider returned by Reown");
      alert("Failed to get wallet provider");
      return;
    }

    provider = new ethers.BrowserProvider(walletProvider);
    signer = await provider.getSigner();
    const address = await signer.getAddress();
    const network = await provider.getNetwork();
    const balance = await provider.getBalance(address);
    const ethBalance = ethers.formatEther(balance);

    addressEl.textContent = address;
    networkEl.textContent = network.name + ` (chainId: ${network.chainId})`;
    balanceEl.textContent = `${ethBalance} ETH`;
    walletInfo.style.display = "block";
    connectBtn.textContent = "Connected ✅";

  } catch (err) {
    console.error("Error connecting wallet:", err);
    alert("Connection failed – check console.");
  }
}

async function verifySignature() {
  console.log("verifySignature triggered");
  if (!signer) {
    alert("Please connect wallet first.");
    return;
  }
  try {
    const address = await signer.getAddress();
    const message = `Verify wallet ownership for ${address}\nTime: ${new Date().toISOString()}`;
    const signature = await signer.signMessage(message);
    const recovered = ethers.verifyMessage(message, signature);
    console.log("Recovered address:", recovered);
    if (recovered.toLowerCase() === address.toLowerCase()) {
      statusEl.textContent = "✅ Verified wallet owner!";
      statusEl.style.color = "green";
    } else {
      statusEl.textContent = "❌ Verification failed.";
      statusEl.style.color = "red";
    }
  } catch (err) {
    console.error("Signature error:", err);
    statusEl.textContent = "❌ Signature cancelled or failed.";
  }
}

connectBtn.addEventListener("click", connectWallet);
verifyBtn.addEventListener("click", verifySignature);
