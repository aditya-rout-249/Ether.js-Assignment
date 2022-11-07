import { React } from "react";
import { FormControl, Button, TextField } from "@material-ui/core";

const TransactionForm = ({
  processPayment,
  walletBalance,
  onAddressChange,
  onAmountChange,
  disableMessage,
}) => {
  return (
    <div>
      <h1>Send ETH payment</h1>
        <FormControl style={{ widht: 400 }}>
          <TextField
            onChange={onAddressChange}
            placeholder="Reciever's Address"
          />
          <TextField
					  type = 'number'
            onChange={onAmountChange}
            placeholder={`Amount < ${walletBalance}`}
          />
          <br />
          <Button
            type="submit"
            disabled={disableMessage}
            variant="contained"
            onClick={processPayment}
          >
            Pay
          </Button>
        </FormControl>
    </div>
  );
};

export default TransactionForm;
