import { React, useState } from "react";
import { ethers } from "ethers";
import { Button } from "@material-ui/core";
import { CircularProgress, Alert } from "@mui/material";
import TransactionForm from "./transactionForm";
import useMetaMask from "../utils/useMetaMask";

function WalletDetails() {
  // setting Up MetaMask Credentials
  const { signer, account, walletBalance, changeAccount, connectWallet } =
    useMetaMask();

  //Settting up state Variables
  const [receiverAddress, setRecieverAddress] = useState();
  const [amount, setAmount] = useState("");
  const [disableMessage, setDisableMessage] = useState(false);
  const [error, setError] = useState();
  const [transactionStatus, setTransactionStatus] = useState();
  const [isLoading, setIsLoading] = useState(false);

  window.ethereum.on("accountsChanged", () => {
    changeAccount();
  });

  //onChange eventlisterners For transaction form
  const onAddressChange = async (event) => {
    setRecieverAddress(event.target.value);
  };

  const onAmountChange = async (event) => {
    setAmount(event.target.value);
  };

  // handle wallet connect funtion to execute walletConnect in useMetaMask Hook
  const handleConnectWallet = async () => {
    console.log("here");
    await connectWallet();
  };

  //function to process payment transaction
  const processPayment = async (event) => {
    console.log(typeof account);
    console.log(typeof receiverAddress);

    event.preventDefault();
    if (account === receiverAddress) {
      return setError(" sender recievers address cannot be same");
    } else if (amount <= 0 || amount === "") {
      return setError("Enter a Valid Amount");
    } else if (+amount > +walletBalance) {
      return setError("Insufficient Funds");
    }
    setDisableMessage(true);
    setIsLoading(true);
    // disabling pay button until transanction executed
    try {
      ethers.utils.getAddress(receiverAddress); // Validating if reciever's address is Valid or Not
      const transaction = await signer.sendTransaction({
        to: receiverAddress,
        value: ethers.utils.parseEther(amount),
      }); // Sending Transaction  request
      setTransactionStatus(
        "Last Successful transaction : \n" + transaction.hash
      );
      setError(null);
      setAmount("");
    } catch (error) {
      setError(error.message);
      setAmount("");
    }
    setDisableMessage(false);
    setIsLoading(false);
    setRecieverAddress(null); // enabling pay button  after transaction is executed
  };

  //if account is connected then only payment form and ether balance component renders
  return account ? (
    <div>
      <div style={{ height: 100 }}> {walletBalance}:ETH</div>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <form>
            <TransactionForm
              disableMessage={disableMessage}
              processPayment={processPayment}
              walletBalance={walletBalance}
              onAddressChange={onAddressChange}
              onAmountChange={onAmountChange}
            />
          </form>
          <br />
          {error ? (
            <Alert style={{ width: 400, marginLeft: 400 }} severity="error">
              {error}
            </Alert>
          ) : (
            <></>
          )}

          {transactionStatus ? (
            <Alert
              style={{ width: 400, marginLeft: 400, fontSize: 8 }}
              severity="success"
            >
              {transactionStatus}
            </Alert>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  ) : (
    <Button variant="contained" onClick={handleConnectWallet}>
      Connect To Wallet
    </Button>
  );
}

export default WalletDetails;
