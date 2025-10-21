// Using Ethers v6 and Web3Modal v3
const { ethers } = window.ethers;
const { Web3Modal } = window["@web3modal/standalone"];

let provider, signer;

const connectBtn = document.getElementById("connectBtn");
const verifyBtn = document.getElementById("verifyBtn");
const walletInfo = document.getElementById("walletInfo");
const addressEl = document.getElementById("address");
const networkEl = document.getElementById("network");
const balanceEl = document.getElementById("balance");
const verifiedStatus = document.getElementById("verifiedStatus");

// Configure Web3Modal
const web3Modal = new Web3Modal({
  projectId: "demo", // optional, for WalletConnect you can set a real one from walletconnect.com
  themeMode: "light"
});

async function connectWallet() {
  try {
    const instance = await web3Modal.openModal();
    provider = new ethers.BrowserProvider(instance);
    signer = await provider.getSigner();
    const address = await signer.getAddress();
    const network = await provider.getNetwork();
    const balance = await provider.getBalance(address);
    const ethBalance = ethers.formatEther(balance);

    // Update UI
    addressEl.textContent = address;
    networkEl.textContent = network.name || network.chainId;
    balanceEl.textContent = `${ethBalance} ETH`;
    walletInfo.classList.remove("hidden");
    connectBtn.textContent = "Connected ✅";
  } catch (err) {
    console.error(err);
    alert("Connection failed");
  }
}

async function verifyOwner() {
  if (!signer) return alert("Connect wallet first!");
  const address = await signer.getAddress();
  const message = `EVM Real Connect verification for ${address}\nTimestamp: ${new Date().toISOString()}`;
  try {
    const signature = await signer.signMessage(message);
    const recovered = ethers.verifyMessage(message, signature);
    if (recovered.toLowerCase() === address.toLowerCase()) {
      verifiedStatus.textContent = "✅ Verified — You are the wallet owner.";
      verifiedStatus.style.color = "green";
    } else {
      verifiedStatus.textContent = "❌ Verification failed.";
      verifiedStatus.style.color = "red";
    }
  } catch (err) {
    console.error(err);
    verifiedStatus.textContent = "❌ Signature canceled or failed.";
  }
}

connectBtn.addEventListener("click", connectWallet);
verifyBtn.addEventListener("click", verifyOwner);
