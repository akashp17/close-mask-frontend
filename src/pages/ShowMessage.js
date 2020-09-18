import React from "react";

import {
  Box, Paper, Container, Typography
} from "@material-ui/core";

import queryString from 'query-string';
import classNames from "classnames";
import { makeStyles } from '@material-ui/core/styles';

import styles from "../assets/jss/material-kit-react/views/landingPage.js";

const useStyles = makeStyles(styles);

export default function ShowMessage(props) {
  const classes = useStyles();

  const query = queryString.parse(props.location.search);

  return <React.Fragment>
    <Container className="main-cont">
      <Paper className={classNames(classes.main, classes.mainRaised)} elevation={3}>
        <Box p="1rem">
          <center>
            <br />
            <br />
            <Typography variant="h5">
              <span className="rc">{query.message}</span>
            </Typography>
            <br />
            <br />
          </center>
        </Box>
      </Paper>
    </Container>
  </React.Fragment>;
}
