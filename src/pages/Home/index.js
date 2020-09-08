import React, { useEffect, useState } from "react";
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
import Dialog from "@material-ui/core/Dialog";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import ListItems from "../../components/ListItems";
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
    display: "inline-block",
  },
  pagination: {
    marginTop: 20,
    display: "flex",
    justifyContent: "flex-end",
  },
  formContainer: {
    padding: 10,
  },
}));

const Home = ({ history }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [dataTable, setDataTable] = useState([]);
  const [dataAccountType, setDataAccountType] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [openAlert, setOpenAlert] = useState(false);
  const [openUpdateForm, setOpenUpdateForm] = useState(false);

  useEffect(() => {
    if (!checkCookie("session")) {
      history.push("/");
    } else {
      getData();
      getAccountType();
    }
  }, []);

  const getData = () => {
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

  const handleChangeValue = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setInputValues({ ...inputValues, ...{ [name]: value } });
  };

  const handleUpdate = (data) => {
    setOpenUpdateForm(true);
    setInputValues(data);
  };

  const handleCreate = () => {
    setOpenUpdateForm(true);
    setInputValues({});
  };

  const handleDelete = (dataId) => {
    db.collection("transactions")
      .doc(dataId)
      .delete()
      .then(() => {
        getData();
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const { startDate = 0, endDate = 0 } = inputValues;

    if (new Date(startDate) > new Date(endDate)) {
      setOpenAlert(true);
    } else {
      db.collection("transactions")
        .where("userId", "==", userId)
        .get()
        .then((querySnapshot) => {
          const data = [];
          querySnapshot.forEach((doc) => {
            if (
              doc.data().createdAt.toDate() >= new Date(startDate) &&
              doc.data().createdAt.toDate() <= new Date(endDate)
            ) {
              data.push({
                ...doc.data(),
                ...{
                  id: doc.id,
                },
              });
            }
          });
          setDataTable(data);
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }
  };

  const handleSubmitData = (event) => {
    event.preventDefault();

    if (inputValues?.id) {
      db.collection("transactions")
        .doc(inputValues?.id)
        .set({
          ...inputValues,
          ...{
            amount: parseInt(inputValues?.amount),
            accountTypeId: inputValues?.accountTypeId,
            createdAt: new Date(),
          },
        })
        .then(function () {
          getData();
          setOpenUpdateForm(false);
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    } else {
      db.collection("transactions")
        .add({
          userId: userId,
          amount: parseInt(inputValues?.amount),
          accountTypeId: inputValues?.accountTypeId,
          createdAt: new Date(),
        })
        .then(function (docRef) {
          getData();
          setOpenUpdateForm(false);
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    }
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Navbar
        open={open}
        handleDrawerOpen={() => {
          setOpen(true);
        }}
      />

      <ListItems
        classes={classes}
        open={open}
        handleDrawerClose={() => {
          setOpen(false);
        }}
      />

      <Dialog
        onClose={() => {
          setOpenUpdateForm(false);
        }}
        open={openUpdateForm}
      >
        <form
          noValidate
          autoComplete="off"
          className={classes.formContainer}
          onSubmit={handleSubmitData}
        >
          <TextField
            fullWidth
            label="Amount"
            defaultValue={parseInt(inputValues?.amount)}
            variant="outlined"
            onChange={handleChangeValue}
            name="amount"
            type="number"
            margin="normal"
          />
          <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel id="account-type-select">Account Type</InputLabel>
            <Select
              labelId="account-type-select"
              onChange={handleChangeValue}
              defaultValue={inputValues?.accountTypeId}
              name="accountTypeId"
              label="Account Type"
            >
              {dataAccountType.map((val) => (
                <MenuItem value={val.id} key={val.id}>
                  {val.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            margin="normal"
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Dialog>

      <Dialog
        onClose={() => {
          setOpenAlert(false);
        }}
        open={openAlert}
      >
        Start Date should be lower than End Date
      </Dialog>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <Paper className={classes.paper}>
                <Button
                  className={classes.btnFormControl}
                  variant="contained"
                  color="primary"
                  type="submit"
                  onClick={handleCreate}
                >
                  Create Transaction
                </Button>
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
                    onChange={handleChangeValue}
                    value={inputValues?.startDate}
                    name="startDate"
                  />

                  <TextField
                    label="End Date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    type="date"
                    variant="outlined"
                    className={classes.formControl}
                    onChange={handleChangeValue}
                    value={inputValues?.endDate}
                    name="endDate"
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
                <TableDefault
                  dataAccountType={dataAccountType}
                  dataTable={dataTable}
                  handleDelete={handleDelete}
                  handleUpdate={handleUpdate}
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

export default Home;
