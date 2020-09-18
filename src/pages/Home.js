import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Paper, Container, Grid, Typography } from '@material-ui/core';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

import styles from '../assets/jss/material-kit-react/views/landingPage.js';
import { productData } from './ProductData';
import ProductList from 'components/ProductList/productList.js';
const useStyles = makeStyles(styles);

export default function HomePage(props) {
	const classes = useStyles();
	return (
		<React.Fragment>
			<Container className='main-cont'>
				<Box p='1rem'>
					<Grid container spacing={2}>
						<ProductList />
					</Grid>
				</Box>
			</Container>
		</React.Fragment>
	);
}
