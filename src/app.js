import React, { useEffect, useState, useCallback } from 'react';
import { Route, Switch, Redirect, useParams, Link } from 'react-router-dom';

import {
  Box,
  Paper,
  Container,
  CircularProgress,
  Grid,
  Typography,
  Button,
  Drawer,
  ListItem,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import qs from 'query-string';

import HomePage from './pages/Home';
import OneTap from './components/OneTap/OneTap';

import ProductPage from './pages/Product';
// import { productData } from './pages/ProductData';

import OrderPlacedPage from './pages/OrderPlaced';
import OrderListPage from './pages/OrderList';
import AdminDashboardPage from './pages/AdminDashboard';

import LoginPage from './pages/Login';

import ShowMessagePage from './pages/ShowMessage';

import api from './utils/api';
import Carousel from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { useUserState, useUserDispatch } from './Context/UserContext';
import SwipeButton from './components/SwipeButton';
import Header from './components/Header/Header';
import HeaderLinks from './components/Header/HeaderLinks';
import Parallax from './components/Parallax/Parallax';
import config from 'utils/config';
function App() {
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useUserState();
  const dispatch = useUserDispatch();

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
  };

  const [cartItem, setCartItem] = useState([]);

  const [redDot, setRedDot] = useState('none');
  const [productData, setproductData] = useState();

  const fetchProducts = async () => {
    const { data } = await api.get('/products');
    const products = data;
    if (products && products.length) {
      setproductData(products);
    }
  };
  useEffect(() => {
    fetchProducts();
    return () => { };
  }, []);

  const SingleProduct = ({ match }) => {
    const { id } = useParams();
    //const product = match.params.id
    //console.log(product, productData);
    //const filteredProduct = productData.filter((data) => data.id == product);
    //return filteredProduct.map((data, index) => {
    return (
      <ProductPage
        setRedDot={setRedDot}
        cartItem={cartItem}
        setCartItem={setCartItem}
        id={id}
      />
    );
    //});
  };
  async function verify() {
    // try {
    // 	const res = await api.post(`/verify`);
    // 	if (res.data.done) dispatch({ type: 'LOGIN_SUCCESS' });
    // } catch (err) {
    // 	console.log(err);
    // }
    try {
      dispatch({ type: 'LOGIN_SUCCESS' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    verify();
  }, []);

  function PrivateRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={(props) =>
          isAuthenticated ? (
            React.createElement(component, props)
          ) : (
              <Redirect
                to={{
                  pathname: '/admin/login',
                  state: {
                    from: props.location,
                  },
                }}
              />
            )
        }
      />
    );
  }

  function PublicOnlyRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={(props) =>
          !isAuthenticated ? (
            React.createElement(component, props)
          ) : (
              <Redirect
                to={{
                  pathname: '/admin/dashboard',
                  state: {
                    from: props.location,
                  },
                }}
              />
            )
        }
      />
    );
  }

  const CartIcon = (props) => {
    const getWidth = () => {
      const screenWidth = window.screen.width;
      return screenWidth;
    };
    const [windowWidth, setWindowWidth] = useState(window.screen.width);
    window.onresize = () => {
      setWindowWidth(getWidth());
    };
    const [drawerState, setDrawerState] = useState(false);
    const handleDrawer = () => {
      setDrawerState(true);
    };
    const [reset, setreset] = useState(0);
    const [cartValue, setCartValue] = useState(0);

    const handleQuantity = (e) => {
      const { id } = e.target;
      props.cartItem.map((data) => {
        if (id === data.productId + '-decrease') {
          if (document.getElementsByName(data.productId)[0].value - 1 === 0) {
            props.setCartItem(
              props.cartItem.filter(
                (cartArrayData) => cartArrayData.productId !== data.productId
              )
            );
            if (
              props.cartItem.filter(
                (cartArrayData) => cartArrayData.productId !== data.productId
              ).length === 0
            ) {
              props.setCartItem([]);
            }
          } else document.getElementsByName(data.productId)[0].value--;
        }
        if (id === data.productId + '-increase') {
          document.getElementsByName(data.productId)[0].value++;
        }
      });
    };
    const checkout = useCallback(async () => {
      // if (cartValue <= 0) {
      //   setreset(r => r + 1);
      //   return alert("Quantity cannot be 0");
      // }

      try {
        const trans = await api.post("/order/generate-trans-id", {
          products: props.cartItem.map((p) => ({
            id: p.productId,
            quantity: p.quantity
          }))
        });
        if (!trans.data.done)
          return alert("Something went wrong");
        (new window.Close({
          transactionId: trans.data.transactionId,
          cb: (data) => {
            if (data.status == 'completed') {
              window.location = `${window.origin}/order-placed?${qs.stringify(
                data.data
              )}`;
            } else setImmediate(() => alert(`Transaction status: ${data.status}`));
          },
        })).checkout();
      }
      catch (err) {
        console.log(err);
        alert("Something went wrong");
      }
    }, [props.cartItem, cartValue]);

    return (
      <Box>
        <Box onClick={handleDrawer}>
          <ListItem style={{ paddingRight: 0 }}>
            <IconButton className='header-icon-button'>
              <img src='/imgs/shopping-bag.png' alt='' />
              <Box
                id='red-dot'
                width='1rem'
                display={redDot}
                height='1rem'
                borderRadius='50%'
                style={{
                  background: 'rgb(229, 68, 109)',
                  position: 'absolute',
                  right: '10px',
                  bottom: '8px',
                }}
              ></Box>
            </IconButton>
          </ListItem>
        </Box>
        <Drawer
          anchor='right'
          open={drawerState}
          onClose={() => setDrawerState(false)}
        >
          <Box
            width={windowWidth <= 425 ? getWidth() : 400}
            className='cart-drawer'
          >
            <Box
              p='20px'
              display='flex'
              justifyContent='space-between'
              alignContent='center'
              alignItems='center'
            >
              <h2 className='rc bold'>Cart</h2>
              <button
                style={{ border: 'none', background: 'none' }}
                onClick={() => setDrawerState(false)}
              >
                <CloseIcon />{' '}
              </button>
            </Box>
            <Box height='1px' style={{ background: 'grey' }}></Box>
            <Box>
              {props.cartItem.length !== 0 ? (
                <React.Fragment>
                  <Box
                    height='100%'
                    marginTop='5px'
                    style={{ overflow: 'scroll', overflowX: 'hidden' }}
                  >
                    {props.cartItem.map((data) => {
                      return (
                        <Box marginBottom='20px'>
                          <Box display='flex' alignItems='center'>
                            <Box textAlign='center'>
                              <img
                                // width='20px'
                                className='cart-image'
                                src={data.imgSrc}
                                alt=''
                                srcset=''
                              />
                            </Box>
                            <Box
                              display='flex'
                              flexDirection='column'
                              justifyContent='space-between'
                            >
                              <Typography
                                style={{ textTransform: 'uppercase' }}
                              >
                                {data.productName}
                              </Typography>
                              <br />
                              <br />
                              <Box
                                display='flex'
                                flexDirection='row'
                                justifyContent='space-between'
                                alignContent='center'
                                alignItems='center'
                              >
                                {/* <Box display='flex' flexDirection='row' justifyContent='center'> */}
                                <Box class='quantity-field'>
                                  <button
                                    id={data.productId + '-decrease'}
                                    onClick={handleQuantity}
                                    class='value-button decrease-button'
                                    title='decrease'
                                  >
                                    -
																	</button>
                                  <input
                                    type='text'
                                    className='number'
                                    name={data.productId}
                                    value={data.quantity}
                                    min={0}
                                  />
                                  <button
                                    id={data.productId + '-increase'}
                                    onClick={handleQuantity}
                                    class='value-button increase-button'
                                    title='increase'
                                  >
                                    +
																	</button>
                                </Box>
                                <Box className='quantity-field'>
                                  Rs. {data.price}
                                </Box>
                                {/* </Box> */}
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                    <Box height='1px' style={{ background: 'grey' }}></Box>
                  </Box>
                  <Box className='cart-footer'>
                    <Box height='1px' style={{ background: 'grey' }}></Box>
                    <Box padding='30px' paddingTop='0px'>
                      <Box>
                        <Box marginTop='5px' align='center'>
                          <p>
                            Shopping , taxes and discounts calculated at
                            checkout
													</p>
                        </Box>
                      </Box>
                      <Box textAlign='center'>
                        <Box className='swipe'>
                          {/* <SwipeButton
													overlayText={
														<Typography>Close 1-Swipe Checkout</Typography>
													}
													onSwipeDone={checkout}
													mainText={
														<Typography>
															Swipe to&nbsp;{' '}
															<img
																src='/imgs/close_logo.png'
																alt='logo'
																style={{
																	maxWidth: '3rem',
																	transform: 'translateY(-0.1rem)',
																}}
															/>
															&nbsp; checkout
														</Typography>
													}
												/> */}
                          <OneTap onTap={checkout} />
                        </Box>
                        <Box width='100%' style={{ marginTop: '35px' }}>
                          <Link
                            onClick={() => setDrawerState(false)}
                            className='continue-shopping'
                            to='/'
                          >
                            Continue Shopping
													</Link>
                        </Box>
                      </Box>
                    </Box>
                    <Box height='1px' style={{ background: 'grey' }}></Box>
                  </Box>
                </React.Fragment>
              ) : (
                  <Box textAlign='center' marginTop='30px'>
                    <Typography variant='h5'>Your Cart is Empty</Typography>
                  </Box>
                )}
            </Box>
          </Box>
        </Drawer>
      </Box>
    );
  };

  return (
    <React.Fragment>
      <Header
        color='white'
        brand={
          <img
            src='/imgs/mask_close_logo1.png'
            alt='logo'
            style={{ maxWidth: '10em', height: '40px', width: 'auto ' }}
          />
        }
        rightLinks={<HeaderLinks />}
        middleLinks={
          <CartIcon
            cartItem={cartItem}
            setCartItem={setCartItem}
            redDot={redDot}
            setRedDot={setRedDot}
          />
        }
        className='header-remove-margin'
      />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      {loading ? (
        <Container class='main-cont'>
          <Box px='5rem'>
            <Paper>
              <Box
                minHeight='20rem'
                display='flex'
                justifyContent='center'
                alignItems='center'
              >
                <CircularProgress color='secondary' />
              </Box>
            </Paper>
          </Box>
        </Container>
      ) : (
          <Switch>
            <Route path='/order-placed' component={OrderPlacedPage} />

            <Route path='/message' component={ShowMessagePage} />

            <PrivateRoute path='/admin/order-list' component={OrderListPage} />
            <PrivateRoute
              path='/admin/dashboard'
              component={AdminDashboardPage}
            />

            <PublicOnlyRoute path='/admin/login' component={LoginPage} />

            <Route path='/product/k95-mask' component={ProductPage} />
            <Route exact path='/product/:id' component={SingleProduct} />

            <Route path='/' component={HomePage} />
          </Switch>
        )}
    </React.Fragment>
  );
}
export default App;
