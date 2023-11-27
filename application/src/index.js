/*****************************************/
/* Detect the MetaMask Ethereum provider */
/*****************************************/

import detectEthereumProvider from '@metamask/detect-provider';


const ethereumButton = document.querySelector('.enableEthereumButton');
const showAccount = document.querySelector('.showAccount');
const waitingcat = document.getElementById("kitty");
const chainIdSpan = document.getElementById("chId");

const provider = await detectEthereumProvider();

if (provider) {
  startApp(provider);

waitingcat.style.display = 'none';
ethereumButton.style.display = 'inline';
ethereumButton.addEventListener('click', () => {
  getAccount();
});

async function getAccount() {
  
  const [accounts, chainId] = await Promise.all([
  window.ethereum.request({ method: 'eth_requestAccounts' })
    .catch((err) => {
      if (err.code === 4001) {
        console.log('Please connect to MetaMask.');
        showAccount.innerHTML = 'Please connect to MetaMask!';
        chainIdSpan.innerHTML = "";
      } else {
        console.error(err);
        showAccount.innerHTML = 'Ohh, some error occured. Look: ' + err;
        chainIdSpan.innerHTML = "";
      }
    }),
    window.ethereum.request({ method: 'eth_chainId' })
  ]);
  const account = accounts[0];
  showAccount.innerHTML = 'Your account name is: ' + account;
  
  if (chainId==="0x1") {
  chainIdSpan.innerHTML = "You are in Ethereum main net, it's OK.";
  }
  else {chainIdSpan.innerHTML = "Do you know you aren't in Ethereum main net? Your chain id is:"+chainId;}
    
}

} else {
  console.log('Please install MetaMask!');
  waitingcat.style.display = 'none';
   showAccount.innerHTML = "Are you sure you have MetaMask browser extension?";

}

function startApp(provider) {
  if (provider !== window.ethereum) {
    console.error('Do you have multiple wallets installed?');
    waitingcat.style.display = 'none';
    showAccount.innerHTML = "Sorry, multiple wallets aren't supported.";
    chainIdSpan.innerHTML = "";
  }
}

/**********************************************************/
/* Handle chain (network) and chainChanged (per EIP-1193) */
/**********************************************************/

const chainId = await window.ethereum.request({ method: 'eth_chainId' });
if (chainId==="0x1") {
  chainIdSpan.innerHTML = "You are in Ethereum main net, it's OK.";
  }
  else {chainIdSpan.innerHTML = "Do you know you aren't in Ethereum main net? Your chain id is:"+chainId;}

window.ethereum.on('chainChanged', handleChainChanged);

function handleChainChanged(chainId) {
  window.location.reload();
}

/***********************************************************/
/* Handle user accounts and accountsChanged (per EIP-1193) */
/***********************************************************/

let currentAccount = null;
window.ethereum.request({ method: 'eth_accounts' })
  .then(handleAccountsChanged)
  .catch((err) => {
    console.error(err);
    showAccount.innerHTML = 'Ohh, some error occured. Look: ' + err;
    chainIdSpan.innerHTML = "";
  });

window.ethereum.on('accountsChanged', handleAccountsChanged);

function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    console.log('Please connect to MetaMask.');
    showAccount.innerHTML = 'Please connect to MetaMask!';
    chainIdSpan.innerHTML = "";
  } else if (accounts[0] !== currentAccount) {
    currentAccount = accounts[0];
    showAccount.innerHTML = 'Your account name is: ' + currentAccount;
    
  }
}


