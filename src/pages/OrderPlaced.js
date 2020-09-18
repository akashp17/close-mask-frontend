import React, { useEffect, useState } from 'react';

import {
  Box,
  Paper,
  Container,
  Typography,
  TableRow,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  TableHead,
  CircularProgress,
} from '@material-ui/core';

import queryString from 'query-string';
import classNames from 'classnames';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import styles from '../assets/jss/material-kit-react/views/landingPage.js';

import api from '../utils/api';

const useStyles = makeStyles(styles);

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#333',
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const selectOne = (val1, val2) => (val1 ? val1 : val2);

export default function OrderPlaced(props) {
  const classes = useStyles();

  const [loading, setLoading] = useState(true);
  const [errMessage, setErrMessage] = useState('');
  const query = queryString.parse(props.location.search);

  // async function placeOrder() {
  //   try {
  //     const res = await api.post("/order/place", query);
  //     if (res.data.done)
  //       setLoading(false);
  //     else
  //       setErrMessage(res.data.message);
  //   }
  //   catch (err) {
  //     setErrMessage(err.response && err.response.data && err.response.data.message ? err.response.data.message : "Something went wrong");
  //     console.log(err);
  //   }
  // }

  useEffect(() => {
    // placeOrder();
    setLoading(false);
  }, []);

  return (
    <React.Fragment>
      <Container className='main-cont'>
        <Paper
          className={classNames(classes.main, classes.mainRaised)}
          elevation={3}
        >
          <Box p='1rem'>
            {loading ? (
              <center>
                <Typography variant='h5'>
                  <span className='rc'>PLACING ORDER</span>
                </Typography>
                <br />
                <br />
                {errMessage ? (
                  <Typography>
                    Something went wrong: {errMessage} <br /> <br /> Your
                    transaction id is {query.transactionId} contact admin
                    referencing this id.
                  </Typography>
                ) : (
                  <CircularProgress color='secondary' />
                )}
                <br />
                <br />
              </center>
            ) : (
              <center>
                <Typography variant='h5'>
                  <span className='rc'>YOUR ORDER HAS BEEN PLACED</span>
                </Typography>
                <br />
                <br />
                <TableContainer component={Paper}>
                  <Table aria-label='customized table'>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Property</StyledTableCell>
                        <StyledTableCell align='center'>Value</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <StyledTableRow>
                        <StyledTableCell component='th' scope='row'>
                          Name
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          {selectOne(query.name, 'N/A')}
                        </StyledTableCell>
                      </StyledTableRow>

                      <StyledTableRow>
                        <StyledTableCell component='th' scope='row'>
                          Email
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          {selectOne(query.email, 'N/A')}
                        </StyledTableCell>
                      </StyledTableRow>

                      <StyledTableRow>
                        <StyledTableCell component='th' scope='row'>
                          Phone
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          {selectOne(query.phone, 'N/A')}
                        </StyledTableCell>
                      </StyledTableRow>

                      <StyledTableRow>
                        <StyledTableCell component='th' scope='row'>
                          Shipping Address
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          <pre>
                            {query.address
                              ? query.address.split(';').join('\n')
                              : 'N/A'}
                          </pre>
                        </StyledTableCell>
                      </StyledTableRow>

                      <StyledTableRow>
                        <StyledTableCell component='th' scope='row'>
                          Shipping Selected
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          {selectOne(query.shippingName, 'N/A')}
                        </StyledTableCell>
                      </StyledTableRow>

                      <StyledTableRow>
                        <StyledTableCell component='th' scope='row'>
                          Shipping Charge
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          {selectOne(query.shippingCharge, 0)}
                        </StyledTableCell>
                      </StyledTableRow>

                      <StyledTableRow>
                        <StyledTableCell component='th' scope='row'>
                          Coupon Applied
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          {selectOne(query.coupon, 'N/A')}
                        </StyledTableCell>
                      </StyledTableRow>

                      <StyledTableRow>
                        <StyledTableCell component='th' scope='row'>
                          Coupon Discount
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          {selectOne(query.couponDiscountAmount, 'N/A')}
                        </StyledTableCell>
                      </StyledTableRow>

                      {query.firstTransactionOfferApplied == 'true' && (
                        <StyledTableRow>
                          <StyledTableCell component='th' scope='row'>
                            Promotional Offer
                          </StyledTableCell>
                          <StyledTableCell align='center'>
                            {200}
                          </StyledTableCell>
                        </StyledTableRow>
                      )}

                      <StyledTableRow>
                        <StyledTableCell component='th' scope='row'>
                          Total Price
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          {parseInt(selectOne(query.price, 0)) +
                            parseInt(selectOne(query.shippingCharge, 0)) -
                            parseInt(selectOne(query.couponDiscountAmount, 0)) -
                            (query.firstTransactionOfferApplied == 'true'
                              ? 200
                              : 0)}
                        </StyledTableCell>
                      </StyledTableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </center>
            )}
          </Box>
        </Paper>
      </Container>
    </React.Fragment>
  );
}
