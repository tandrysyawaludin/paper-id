import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import ListItems from "../../components/ListItems";
import Chart from "../../components/Chart";
import Deposits from "../../components/Deposits";
import TableDefault from "../../components/TableDefault";
import Navbar from "../../components/Navbar";
import { checkCookie, getCookie } from "../../services/cookie.js";
import firebase from "../../services/firebase.js";

const userId = atob(getCookie("session"));

const db = firebase.firestore();

const Copyright = () => {
  return (
    <Typography color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
}));

const Summary = ({ history }) => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [open, setOpen] = useState(true);
  const [dataAccountType, setDataAccountType] = useState([]);
  const [dataTransaction, setDataTransaction] = useState({});

  useEffect(() => {
    if (!checkCookie("session")) {
      history.push("/");
    } else {
      getAccountType();
      getData();
    }
  }, []);

  const getData = () => {
    const date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth();
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);
    const startTime = new Date().setHours(0, 0, 0, 0);
    const endTime = new Date().setHours(23, 59, 59, 999);

    db.collection("transactions")
      .where("userId", "==", userId)
      .get()
      .then((querySnapshot) => {
        const dataMonthly = [];
        const dataDaily = [];
        querySnapshot.forEach((doc) => {
          if (
            doc.data().createdAt.toDate() >= firstDay &&
            doc.data().createdAt.toDate() <= lastDay
          ) {
            dataMonthly.push({
              ...doc.data(),
              ...{
                time: doc.data().createdAt.toDate().getDate(),
              },
            });
          }

          if (
            doc.data().createdAt.toDate() >= startTime &&
            doc.data().createdAt.toDate() <= endTime
          ) {
            dataDaily.push(doc.data());
          }
        });
        setDataTransaction({
          dataMonthly,
          dataDaily,
          totalTransaction: dataMonthly
            .map((x) => x.amount)
            .reduce((a, b) => a + b, 0),
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  const getAccountType = () => {
    db.collection("account_type")
      .get()
      .then((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({
            ...doc.data(),
            ...{
              id: doc.id,
            },
          });
        });
        setDataAccountType(data);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Navbar open={open} handleDrawerOpen={handleDrawerOpen} />

      <ListItems
        classes={classes}
        open={open}
        handleDrawerClose={handleDrawerClose}
      />

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>
                <Chart dataTransaction={dataTransaction} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Deposits
                  totalTransaction={dataTransaction?.totalTransaction}
                />
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <TableDefault
                  dataAccountType={dataAccountType}
                  title={"Today Transaction"}
                  dataTable={dataTransaction?.dataDaily}
                />
              </Paper>
            </Grid>
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
};

export default Summary;
