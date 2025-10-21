// Make sure these scripts are loaded before this file in your index.html:
// 1. ethers.umd.min.js
// 2. @reown/sdk@latest

const { ethers } = window.ethers || {};
const { Reown } = window.reown || {};

console.group("🧩 TONPayment Wallet Debug Log");

// Check dependencies
if (!ethers) console.error("❌ Ethers.js not loaded!");
if (!Reown) console.error("❌ Reown SDK not loaded!");
else console.log("✅ Reown SDK loaded");

// Grab DOM elements
const connectBtn = document.getElementById("connectBtn");
const walletInfo = document.getElementById("walletInfo");
const addressEl = document.getElementById("address");
const networkEl = document.getElementById("network");
const balanceEl = document.getElementById("balance");
const verifyBtn = document.getElementById("verifyBtn");
const statusEl = document.getElementById("status");

let provider, signer, reown;

async function initReown() {
  console.log("🚀 Initializing Reown...");
  try {
    reown = new Reown({
      projectId: "7be08574a6238618945452abdd8b896a",
      metadata: {
        name: "TON Payment",
        description: "EVM Real Connect Debug Version",
        url: window.location.origin,
        icons: [window.location.origin + "/icon.png"],
      },
    });
    console.log("✅ Reown initialized:", reown);
  } catch (err) {
    console.error("❌ Failed to initialize Reown:", err);
  }
}

async function connectWallet() {
  console.group("🟢 Connect Wallet Flow");
  console.log("Button clicked. Starting wallet connect...");
  try {
    if (!reown) {
      console.warn("⚠️ Reown not initialized yet. Initializing now...");
      await initReown();
    }

    console.log("🧠 Calling reown.connect()...");
    const session = await reown.connect({
      chains: ["eip155:1", "eip155:137", "eip155:56", "eip155:11155111"], // CAIP2 format
    });

    console.log("✅ Session object returned:", session);
    const walletProvider = reown.getWalletProvider();

    if (!walletProvider) {
      console.error("❌ walletProvider is undefined! Something went wrong.");
      alert("Reown did not return a wallet provider. Check console logs.");
      return;
    }

    console.log("✅ Wallet provider found:", walletProvider);
    provider = new ethers.BrowserProvider(walletProvider);
    signer = await provider.getSigner();
    console.log("✅ Ethers signer ready:", signer);

    const address = await signer.getAddress();
    const network = await provider.getNetwork();
    const balance = await provider.getBalance(address);
    const ethBalance = ethers.formatEther(balance);

    console.log("📄 Address:", address);
    console.log("🌐 Network:", network);
    console.log("💰 Balance:", ethBalance);

    addressEl.textContent = address;
    networkEl.textContent = `${network.name} (Chain ID: ${network.chainId})`;
    balanceEl.textContent = `${ethBalance} ETH`;
    walletInfo.style.display = "block";
    connectBtn.textContent = "Connected ✅";

  } catch (err) {
    console.error("❌ Wallet connection failed:", err);
    alert("Wallet connection failed — check console logs for detailed errors.");
  }
  console.groupEnd();
}

async function verifySignature() {
  console.group("✍️ Signature Verification");
  if (!signer) {
    console.warn("⚠️ No signer — please connect first.");
    alert("Please connect wallet first.");
    return;
  }

  const address = await signer.getAddress();
  const message = `Verify wallet ownership for ${address}\n${new Date().toISOString()}`;

  try {
    console.log("🧾 Signing message:", message);
    const signature = await signer.signMessage(message);
    console.log("🖋 Signature:", signature);

    const recovered = ethers.verifyMessage(message, signature);
    console.log("🔍 Recovered address:", recovered);

    if (recovered.toLowerCase() === address.toLowerCase()) {
      statusEl.textContent = "✅ Verified wallet owner!";
      statusEl.style.color = "green";
      console.log("✅ Wallet verified!");
    } else {
      statusEl.textContent = "❌ Verification failed.";
      statusEl.style.color = "red";
      console.warn("⚠️ Signature mismatch.");
    }
  } catch (err) {
    console.error("❌ Signature error:", err);
    statusEl.textContent = "❌ Signature canceled or failed.";
  }
  console.groupEnd();
}

// Add event listeners
connectBtn.addEventListener("click", connectWallet);
verifyBtn.addEventListener("click", verifySignature);

// Auto-init Reown on load
initReown();

console.groupEnd();
