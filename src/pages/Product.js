import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import qs from 'query-string';

import api from '../utils/api';

import Carousel from 'react-slick';

import styles from '../assets/jss/material-kit-react/views/landingPage.js';

import config from '../utils/config';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { useParams } from 'react-router-dom';
import OneTap from '../components/OneTap/OneTap';

// const useStyles = makeStyles(styles);

export default function ProductPage(props) {
  const { id } = useParams();
  const [product, setproduct] = useState();
  const [productsData, setproductsData] = useState([]);
  const [cartValue, setCartValue] = useState(1);

  const fetchSingleProduct = async (id) => {
    const { data } = await api.get(`/products/${id}`);
    const { product } = data;
    if (product) {
      setproduct(product);
    }
  };
  const fetchProducts = async () => {
    const { data } = await api.get('/products');
    const products = data;
    if (products && products.length) {
      setproductsData(products);
    }
  };
  useEffect(() => {
    fetchSingleProduct(id);
    fetchProducts();
    return () => { };
  }, [id]);

  const handleQuantity = (e) => {
    const { title } = e.target;

    if (title === 'increase') setCartValue((pre) => pre + 1);
    else if (cartValue !== 0) setCartValue((pre) => pre - 1);
  };

  const handleCart = useCallback(() => {
    if (cartValue > 0) {
      const isItemPresent = () => {
        props.cartItem.map((data) => {
          if (data.productId === product.variants[0].id) return true;
          else return false;
        });
      };
      if (!isItemPresent()) {
        props.setCartItem((arr) => {
          var newArr = [...arr];
          newArr.push({
            imgSrc: product.images[0].src,
            productName: product.title,
            price: product.variants[0].price,
            productId: id,
            quantity: cartValue,
          });
          return newArr;
        });
      }
      props.setRedDot('block');
    }
  }, [cartValue, product]);
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  const [reset, setreset] = useState(0);

  var closeCheckout = useCallback(async () => {
    if (cartValue <= 0) {
      setreset((r) => r + 1);
      return alert('Quantity cannot be 0');
    }
    try {
      const trans = await api.post("/order/generate-trans-id", {
        products: [{
          id: id,
          quantity: cartValue
        }]
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

    // var shippingChargeOptions = [];

    // if (parseInt(product.variants[0].price) * cartValue < 500) {
    //   shippingChargeOptions.unshift({
    //     name: 'Shipping Charge',
    //     price: 75,
    //   });
    // }

    // var closeObj = new window.Close({
    //   apiKey: config.apiKey,
    //   placeOrderUrl: `${api.defaults.baseURL}/order/place`,
    //   price: parseInt(product.variants[0].price) * cartValue,
    //   tax: 0,
    //   cb: (data) => {
    //     if (data.status == 'completed') {
    //       window.location = `${window.origin}/order-placed?${qs.stringify(
    //         data.data
    //       )}`;
    //     } else alert(`Transaction status: ${data.status}`);
    //   },
    //   products: [
    //     {
    //       productName: product.title,
    //       productId: product.variants[0].id,
    //       productPrice: parseInt(product.variants[0].price),
    //       productImage: product.image.src,
    //       productQuantity: cartValue,
    //     },
    //   ],
    //   shippingOptions: shippingChargeOptions,
    // });
    // closeObj.checkout();
  }, [product, cartValue]);

  if (!product) {
    return (
      <Box
        height='65vh'
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        <Box textAlign='center'>
          Loading..
          <br />
          <br />
          <CircularProgress />
        </Box>
      </Box>
    );
  }
  const { title, body_html, variants, images } = product;

  return (
    <React.Fragment>
      <Box>
        <Container>
          <Box>
            <Grid container>
              <Grid item xs={12} md={6}>
                <Box className='prod-display'>
                  <Carousel {...settings}>
                    {images ? (
                      images.map((a) => {
                        return (
                          <div>
                            <img
                              src={a.src}
                              alt={title}
                              className='slick-image'
                              style={{
                                height: '410px',
                                width: '400px',
                                objectFit: 'fill',
                                margin: 'auto',
                              }}
                            />
                          </div>
                        );
                      })
                    ) : (
                        <img
                          src='https://mask.closecheckout.com/imgs/default-image.jpg'
                          style={{
                            height: '380px',
                            width: '370px',
                            objectFit: 'fill',
                            margin: 'auto',
                          }}
                          alt=''
                          srcset=''
                        />
                      )}
                  </Carousel>
                  <br />
                  <Grid container spacing={2}>
                    {images ? (
                      images.map((a) => {
                        return (
                          <Grid item xs={4}>
                            <img
                              src={a.src}
                              alt='First slide'
                              className='slick-image'
                              style={{
                                height: '155px',
                                width: '150px',
                                objectFit: 'fill',
                                margin: 'auto',
                              }}
                            />
                          </Grid>
                        );
                      })
                    ) : (
                        <img
                          src='https://mask.closecheckout.com/imgs/default-image.jpg'
                          style={{
                            height: '155px',
                            width: '150px',
                            objectFit: 'fill',
                            margin: 'auto',
                          }}
                          alt=''
                          srcset=''
                        />
                      )}
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box textAlign='center'>
                  <Box>
                    <Typography variant='h6' style={{ fontSize: '2rem' }}>
                      {title}
                    </Typography>
                  </Box>
                  <br />
                  <Box>
                    <Typography variant='h4' color='primary'>
                      ₹ <span> {variants[0].price} </span>
                    </Typography>
                    <br />
                    <Typography>QUANTITY</Typography>
                    <Box>
                      <div class='quantity-field'>
                        <button
                          onClick={handleQuantity}
                          class='value-button decrease-button'
                          title='decrease'
                        >
                          -
                        </button>
                        <input
                          type='text'
                          className='number'
                          value={cartValue}
                          min={0}
                        />
                        <button
                          onClick={handleQuantity}
                          class='value-button increase-button'
                          title='increase'
                        >
                          +
                        </button>
                      </div>
                    </Box>
                    <Box marginTop='20px' maxWidth='262px' margin='auto'>
                      <button
                        title={title}
                        onClick={handleCart}
                        className='add-to-cart'
                      >
                        Add to Cart
                      </button>
                      <br /> <br />
                      <OneTap onTap={closeCheckout} />
                    </Box>
                  </Box>
                  <Box>
                    <Box py='25px'>
                      <Typography>
                        Estimated Delivery Between 8 to 10 days <br />
                        Free Shipping on Orders above ₹ 500
                      </Typography>
                    </Box>
                    <Box textAlign='left' px='20px' py='40px'>
                      <Typography>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: body_html,
                          }}
                        ></div>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
        <br /> <br /> <br />
        <Box px='1rem'>
          <Container>
            <Box textAlign='center' p='15px'>
              <Typography variant='h6'>YOU MAY ALSO LIKE</Typography>
            </Box>
            <Grid container>
              {productsData.map((data) => (
                <Grid item xs={12} sm={6} md={4}>
                  <Box textAlign='center'>
                    <div>
                      <a href={`/product/${data.id}`}>
                        <img
                          src={
                            data.images[0]
                              ? data.images[0].src
                              : 'https://mask.closecheckout.com/imgs/default-image.jpg'
                          }
                          style={{
                            height: '200px',
                            width: '200px',
                            objectFit: 'fill',
                            margin: 'auto',
                          }}
                          alt=''
                          srcset=''
                        />
                      </a>
                    </div>
                    <div className='prod-desc'>
                      <Box>
                        <Typography variant='h6'>
                          <span className='rc bold'>{data.title}</span>
                        </Typography>
                        <Typography
                          style={{ marginTop: '-0.5rem' }}
                          variant='subtitle1'
                          className='price'
                        >
                          <Box className='rc' color='text.secondary'>
                            ₹ <span> {data.variants[0].price} </span>
                          </Box>
                        </Typography>
                      </Box>
                    </div>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>
    </React.Fragment>
  );
}
