import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Pagination from "@material-ui/lab/Pagination";
import ListItems from "../../components/ListItems";
import Orders from "../../components/Orders";
import Navbar from "../../components/Navbar";
import { checkCookie, getCookie } from "../../services/cookie.js";
import firebase from "../../services/firebase.js";

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
    display: "block",
    width: "100%",
  },
  fixedHeight: {
    height: 240,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 250,
    width: "100%",
  },
  btnFormControl: {
    margin: theme.spacing(1),
    width: 100,
  },
  pagination: {
    marginTop: 20,
    display: "flex",
    justifyContent: "flex-end",
  },
}));

const Home = ({ history }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [dataTable, setDataTable] = React.useState([]);

  useEffect(() => {
    if (!checkCookie("session")) {
      history.push("/");
    } else {
      const userId = atob(getCookie("session"));
      const db = firebase.firestore();

      db.collection("transactions")
        .where("userId", "==", userId)
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
          setDataTable(data);
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    }
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSearch = (event) => {
    event.preventDefault();

    try {
      const db = firebase.firestore();

      db.collection("users")
        .where("username", "==", "admin")
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
          });
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    } catch (error) {
      console.log(error);
    }
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
            <Grid item xs={12} md={12} lg={12}>
              <Paper className={classes.paper}>
                <form
                  onSubmit={handleSearch}
                  className={classes.root}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    label="Start Date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    type="date"
                    variant="outlined"
                    className={classes.formControl}
                  />

                  <TextField
                    label="End Date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    type="date"
                    variant="outlined"
                    className={classes.formControl}
                  />

                  <Button
                    className={classes.btnFormControl}
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    Search
                  </Button>
                </form>
                <Orders dataTable={dataTable} />
                <div className={classes.pagination}>
                  <Pagination count={10} />
                </div>
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

export default Home;
