import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "IDR",
});

const Deposits = ({ totalTransaction }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Title>Total Transaction</Title>
      <Typography component="p" variant="h4">
        {formatter.format(totalTransaction)}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        this month
      </Typography>
    </React.Fragment>
  );
};

export default Deposits;
