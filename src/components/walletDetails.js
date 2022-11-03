import { React, useState } from "react";
import { ethers } from "ethers";
import { Alert, AlertTitle } from "@mui/material";
import { Button } from "@material-ui/core";
import TransactionForm from "./transactionForm";

function WalletDetails() {
  //Settting up state Variables
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [account, setAccount] = useState();
  const [walletBalance, setWalletBalance] = useState();
  const [receiverAddress, setRecieverAddress] = useState();
  const [amount, setAmount] = useState();
  const [disableMessage, setDisableMessage] = useState(false);
  const [error, setError] = useState();
  const [transactionStatus, setTransactionStatus] = useState();

  //onacccount change provider.on(acccountchangewill be called)
  window.ethereum.on("accountsChanged", async () => {
    const accounts = await provider.send("eth_requestAccounts");
    setAccount(accounts[0]);
    const balance = await provider.getBalance(accounts[0]);
    setWalletBalance(ethers.utils.formatEther(balance));
  });

  // Setting up Metamask Account details with ether.js Provider
  const connectWallet = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      const accounts = await provider.send("eth_requestAccounts");
      setAccount(accounts[0]); // Setting account state to current selected account
      const currentSigner = provider.getSigner();
      setSigner(currentSigner);
      const balance = await provider.getBalance(accounts[0]);
      setWalletBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      setError(error);
    }
  };

  //onChange eventlisterners For transaction form
  const onAddressChange = async (event) => {
    setRecieverAddress(event.target.value);
  };

  const onAmountChange = async (event) => {
    setAmount(event.target.value);
  };

  //function to process payment transaction
  const processPayment = async () => {
    setDisableMessage(true); // disabling pay button until transanctioni executed
    try {
      ethers.utils.getAddress(receiverAddress); // Validating if reciever's address is Valid or Not
      const transaction = await signer.sendTransaction({
        to: receiverAddress,
        value: ethers.utils.parseEther(amount),
      }); // Sending Transaction  request
      setTransactionStatus("Last Successful transaction" + transaction.hash);
    } catch (error) {
      setError(error.message);
    }
    setDisableMessage(false); // enabling pay button  after transaction is executed
  };

  //if account is connected then only payment form and ether balance component renders
  return account ? (
    <div>
      <div style={{ height: 100 }}>{walletBalance}:ETH</div>
      <form>
        <TransactionForm
          disableMessage={disableMessage}
          processPayment={processPayment}
          walletBalance={walletBalance}
          onAddressChange={onAddressChange}
          onAmountChange={onAmountChange}
        />
      </form>
      <div style={{ backgroundColor: "red" }}>{error}</div>
      <div style={{ backgroundColor: "green" }}>{transactionStatus}</div>
    </div>
  ) : (
    <Button variant="contained" onClick={connectWallet}>
      Connect To Wallet
    </Button>
  );
}

export default WalletDetails;
