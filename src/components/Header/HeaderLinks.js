/*eslint-disable*/
import React, { useState } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
// react components for routing our app without refresh
import { Link } from 'react-router-dom';

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Tooltip from '@material-ui/core/Tooltip';

// @material-ui/icons
import { Facebook, Instagram, Twitter } from '@material-ui/icons';

// core components
import CustomDropdown from '../CustomDropdown/CustomDropdown.js';
import Button from '../CustomButtons/Button.js';
import styles from '../../assets/jss/material-kit-react/components/headerLinksStyle.js';
import Drawer from '@material-ui/core/Drawer';
import { Box, Typography } from '@material-ui/core';
import SwipeButton from '../SwipeButton/index.js';
const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
	const classes = useStyles();

	return (
		<div
			style={{
				marginRight: '55px',
			}}
		>
			<List className={classes.list}>
				<ListItem className={classes.listItem}>
					<Button
						href='https://soxytoes.com/pages/track-order'
						color='transparent'
						target='_blank'
						className={classes.navLink}
					>
						<span className='rc semibold'>Track Order</span>
					</Button>
				</ListItem>
				<ListItem className={classes.listItem}>
					<Button
						href='https://mail.google.com/mail/?view=cm&fs=1&to=hi@closecheckout.com'
						color='transparent'
						target='_blank'
						className={classes.navLink}
					>
						<span className='rc semibold'>Contact</span>
					</Button>
				</ListItem>
				{/*
      <ListItem className={classes.listItem}>
        <Tooltip title="Facebook">
          <IconButton className="header-icon-button" href="https://closecheckout.com" aria-label="Facebook">
            <Facebook fontSize="small" />
          </IconButton>
        </Tooltip>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Tooltip title="Instagram">
          <IconButton className="header-icon-button" aria-label="Instagram">
            <Instagram fontSize="small" />
          </IconButton>
        </Tooltip>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Tooltip title="Twitter">
          <IconButton className="header-icon-button" aria-label="Twitter">
            <Twitter fontSize="small" />
          </IconButton>
        </Tooltip>
      </ListItem>
      */}
			</List>
		</div>
	);
}
