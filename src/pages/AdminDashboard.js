import React from "react";
import { Link } from "react-router-dom";
import { Box, Paper, Container, Grid, Typography, List, ListItem } from "@material-ui/core";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import { ShoppingCart, Settings } from "@material-ui/icons";

import Button from "../components/CustomButtons/Button.js";
import Header from "../components/Header/Header.js";

import styles from "../assets/jss/material-kit-react/views/landingPage.js";

import menuStyles from "../assets/jss/material-kit-react/views/componentsSections/navbarsStyle.js";

const useStyles = makeStyles(styles);
const menuUseStyles = makeStyles(menuStyles);

export default function AdminDashboard(props) {
  const classes = useStyles();
  const menuClasses = menuUseStyles();
  return <React.Fragment>
    <Container className="main-cont">
      <Paper className={classNames(classes.main, classes.mainRaised)} elevation={3}>
        <Box p="1rem">
          <Header
            brand="Admin Dashboard"
            color="primary"
            className="menu-shadow-primary"
            rightLinks={
              <List className={menuClasses.list}>
                <ListItem className={menuClasses.listItem}>
                  <Button component={Link} to="/admin/order-list" color="transparent" className={menuClasses.navLink}>
                    <ShoppingCart className={menuClasses.icons} />
                  </Button>
                </ListItem>
                <ListItem className={menuClasses.listItem}>
                  <Button color="transparent" className={menuClasses.navLink}>
                    <Settings className={menuClasses.icons} />
                  </Button>
                </ListItem>
              </List>
            }
          />
          <br /><br />
        </Box>
      </Paper>
    </Container>
  </React.Fragment>;
}
