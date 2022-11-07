import { useState } from "react";
import { ethers } from "ethers";

function useMetaMask() {
  
	const [walletBalance, setWalletBalance] = useState();
  const [provider, setProvider] = useState();
		const [signer, setSigner] = useState();
		const [account, setAccount] = useState();
  // Setting up Metamask Account details with ether.js Provider
  const connectWallet = async () => {

    try {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);

      //onAccount change provider.on(acccountchange will be called)
      const accounts = await web3Provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]); // Setting account state to current selected account
      const currentSigner = web3Provider.getSigner();
      setSigner(currentSigner);
			const obj = web3Provider;
			console.log("signer", signer);
      setProvider(obj);
			console.log( provider);
      const balance = await web3Provider.getBalance(accounts[0]);
      setWalletBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.log(error)
    }
  };

  // function to change account state
  const changeAccount = async () => {
	
    const accounts = await provider.send("eth_requestAccounts");
		console.log("provider",provider)
		setAccount(accounts[0]);
    const balance = await provider.getBalance(accounts[0]);
    setWalletBalance(ethers.utils.formatEther(balance));
	
  };
	
	return {
    signer,
    account,
    walletBalance,
    connectWallet,
    changeAccount
	}
 

};

export default useMetaMask;
