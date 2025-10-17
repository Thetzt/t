// Get HTML elements
const connectButton = document.getElementById('connectButton');
const walletAddressDisplay = document.getElementById('walletAddress');
const profileSection = document.getElementById('profile');
const connectSection = document.getElementById('connect-section');

// --- Web3Modal Configuration ---

const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;

let web3ModalInstance;
let provider;

// Function to initialize Web3Modal
function init() {
    // Define provider options
    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                // You must get your own Project ID from https://cloud.walletconnect.com
                // This is a public ID and is rate-limited.
                infuraId: "27e484d29432424f944369d7b4b9b5f4",
            }
        }
    };

    web3ModalInstance = new Web3Modal({
        cacheProvider: false, // Optional: Set to true to remember the last used provider
        providerOptions, // Required
        disableInjectedProvider: false, // Optional: Hides MetaMask if true
    });
}

// Function to handle wallet connection
async function connectWallet() {
    try {
        const providerInstance = await web3ModalInstance.connect();
        const ethersProvider = new ethers.providers.Web3Provider(providerInstance);
        const signer = ethersProvider.getSigner();
        const address = await signer.getAddress();
        
        updateUI(address);

        // --- Subscribe to wallet events ---
        providerInstance.on("accountsChanged", (accounts) => {
            if (accounts.length > 0) {
                updateUI(accounts[0]);
            } else {
                resetUI();
            }
        });

        providerInstance.on("disconnect", (error) => {
            console.log("Wallet disconnected", error);
            resetUI();
        });

    } catch (error) {
        console.error("Could not get a wallet connection:", error);
    }
}

// --- UI Update Functions ---
function updateUI(address) {
    walletAddressDisplay.innerText = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    connectSection.style.display = 'none';
    profileSection.style.display = 'block';
}

function resetUI() {
    walletAddressDisplay.innerText = '';
    connectSection.style.display = 'block';
    profileSection.style.display = 'none';
}

// --- Initialize and set event listener ---
init();
connectButton.addEventListener('click', connectWallet);