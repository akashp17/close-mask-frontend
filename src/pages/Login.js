import React, { useState } from "react";
import {
  Box, Paper, Container, Typography, TextField, CircularProgress
} from "@material-ui/core";

import classNames from "classnames";
import { makeStyles } from '@material-ui/core/styles';

import ErrorSnackbar from "../components/ErrorSnackbar";
import Button from "../components/CustomButtons/Button.js";
import styles from "../assets/jss/material-kit-react/views/landingPage.js";

import { useUserDispatch } from "../Context/UserContext";

import api from "../utils/api";

const useStyles = makeStyles(styles);


export default function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const classes = useStyles();

  const dispatch = useUserDispatch();

  function cleanSnackbar() {
    showSnackbar && setShowSnackbar(false);
    setErrMessage("");
  }

  async function login(ev) {
    ev.preventDefault();
    if (!username || !password) {
      setErrMessage("One of the field is missing");
      setShowSnackbar(true);
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/login", {
        username,
        password
      });
      if (res.data.done)
        dispatch({ type: "LOGIN_SUCCESS" });
      else {
        setErrMessage(res.data.message);
        setShowSnackbar(true);
        setLoading(false);
      }
    }
    catch (err) {
      setErrMessage(err.response && err.response.data && err.response.data.message ? err.response.data.message : "Something went wrong");
      setShowSnackbar(true);
      setLoading(false);
    }
  }

  return <React.Fragment>
    <Container className="main-cont" maxWidth="md">
      <Paper className={classNames(classes.main, classes.mainRaised)} elevation={3}>
        <Box p="1rem">
          <center>
            <Typography variant="h5">
              <span className="rc">LOGIN</span>
            </Typography>
            <br />
            <Box maxWidth="25rem">
              <form onSubmit={login}>
                <TextField disabled={loading} color="secondary" autoFocus type="text" fullWidth name="email" value={username} onChange={ev => setUsername(ev.target.value)} label="Username" />
                <br /><br />
                <TextField disabled={loading} color="secondary" type="password" fullWidth name="password" value={password} onChange={ev => setPassword(ev.target.value)} label="Password" />
                <br /><br /><br />

                <Button disabled={loading} style={{ width: '100%' }} size="sm" type="submit">Login</Button>
                {loading && <React.Fragment>&nbsp;&nbsp;&nbsp;<CircularProgress size={14} /></React.Fragment>}
                <br /><br />
              </form>
            </Box>

          </center>
        </Box>
      </Paper>
    </Container>
    <ErrorSnackbar
      showSnackbar={showSnackbar}
      cleanSnackbar={cleanSnackbar}
      errorMessage={errMessage}
    />
  </React.Fragment>;
}
