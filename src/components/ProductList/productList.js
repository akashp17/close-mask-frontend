import { Box, Grid, Typography, CircularProgress } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from 'utils/api';

export default function ProductList() {
	const [products, setproducts] = useState();

  const fetchProducts = async () => {
    const { data } = await api.get('/products');
    const products = data;
    if (products && products.length) {
      setproducts(products);
    }
  };
  useEffect(() => {
    fetchProducts();
    return () => {};
  }, []);

  if (!products) {
    return (
      <Box
        height='55vh'
        width='100%'
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
  return (
    products &&
    products.map(({ title, id, variants, image }) => {
      return (
        <Grid item xs={12} md={4}>
          <Link to={`/product/${id}`} className='product-listing'>
            <div class='prod-img-wrapper'>
              <img
                style={{ height: '410px', width: '400px', objectFit: 'fill' }}
                src={
                  image
                    ? image.src
                    : 'https://mask.closecheckout.com/imgs/default-image.jpg'
                }
              />
						</div>
						<div className='prod-desc'>
							<Typography variant='h6'>
								<span className='rc bold'>{title}</span>
							</Typography>
							<Typography
								style={{ marginTop: '-0.5rem' }}
								variant='subtitle1'
								className='price'
							>
								<Box className='rc' color='text.secondary'>
									Rs {variants[0].price}
								</Box>
							</Typography>
						</div>
					</Link>
				</Grid>
			);
		})
	);
}
