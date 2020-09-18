import React, { usest } from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';

import { Box, Typography } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import Header from './components/Header/Header.js';
import HeaderLinks from './components/Header/HeaderLinks.js';
import Parallax from './components/Parallax/Parallax.js';

import './assets/scss/material-kit-react.scss?v=1.9.0';
import CssBaseline from '@material-ui/core/CssBaseline';

import './index.css';

import { UserProvider } from './Context/UserContext';

import App from './app';

var hist = createBrowserHistory();

const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#28282A',
		},
		secondary: {
			main: '#ff5a5f',
		},
	},
});
ReactDOM.render(
	<ThemeProvider theme={theme}>
		<UserProvider>
			<CssBaseline />
			<Box
				className='rc'
				bgcolor='#fadae2'
				p='0.7rem'
				textAlign='center'
				color='#e5446d'
				style={{ textTransform: 'uppercase' }}
			>
				Free shipping on orders above Rs 500
			</Box>
			<Router history={hist}>
				{/* <Header
          color='white'
          brand={
            <img
              src='/imgs/mask_close_logo.png'
              alt='logo'
              style={{ maxWidth: '10em' }}
            />
          }
          rightLinks={<HeaderLinks />}
          className='header-remove-margin'
        />
        <center>
          <Parallax
            small
            image='/imgs/curvy.png'
            className='custom-parallax'
          ></Parallax>
        </center> */}
				<App />
			</Router>

			<footer className='my-footer'>
				<Typography variant='body'>© 2020 Close Checkout</Typography>
			</footer>
		</UserProvider>
	</ThemeProvider>,
	document.getElementById('root')
);
