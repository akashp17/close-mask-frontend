import React from "react";
import { Snackbar, IconButton } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";

function ErrorSnackbar({ showSnackbar, cleanSnackbar, errorMessage }) {
  return (
    <Snackbar open={showSnackbar}>
      <Alert severity="error" variant="filled">
        {errorMessage}
        <IconButton
          aria-label="close"
          color="inherit"
          style={{ padding: "0px", marginLeft: "10px" }}
          onClick={() => cleanSnackbar()}
        >
          <CloseIcon />
        </IconButton>
      </Alert>
    </Snackbar>
  );
}

export default ErrorSnackbar;
