import React, { useEffect, useState } from "react";
import clsx from "clsx";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import AssessmentIcon from "@material-ui/icons/Assessment";
import ListAltIcon from "@material-ui/icons/ListAlt";
import firebase from "../services/firebase.js";
import { Link } from "react-router-dom";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  menuLink: {
    textDecoration: "none",
    color: "inherit",
  },
  avatar: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    margin: "10px auto 6px",
  },
  loadingIcon: {
    margin: "6px auto",
  },
}));

const ListItems = ({ open, handleDrawerClose }) => {
  const classes = useStyles();
  const [userData, setUserData] = useState({});
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const db = firebase.firestore();
    db.collection("users")
      .where("username", "==", "admin")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          setUserData({
            userId: doc.id,
            userName: doc.data().username,
            name: doc.data().name,
          });
        });
        setLoading(false);
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }, []);

  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
      }}
      open={open}
    >
      <div className={classes.toolbarIcon}>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <Avatar
        className={classes.avatar}
        alt="Remy Sharp"
        src="https://material-ui.com/static/images/avatar/1.jpg"
      />
      {isLoading ? (
        <CircularProgress className={classes.loadingIcon} size={16} />
      ) : (
        <Typography component="p" align="center">
          {userData?.name}
        </Typography>
      )}

      <Divider />
      <div>
        <List>
          <Link className={classes.menuLink} to="/summary">
            <ListItem button>
              <ListItemIcon>
                <AssessmentIcon />
              </ListItemIcon>
              <ListItemText primary="Summary" />
            </ListItem>
          </Link>
          <Link className={classes.menuLink} to="/home">
            <ListItem button>
              <ListItemIcon>
                <ListAltIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
          </Link>
        </List>
      </div>
    </Drawer>
  );
};

export default ListItems;
