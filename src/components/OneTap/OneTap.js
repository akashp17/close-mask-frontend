import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Paper,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Button,
} from '@material-ui/core';
import './OneTap.css';

export default function OneTap({ onTap }) {
  const handleTap = (e) => {
    e.preventDefault();
    onTap();
  };
  return (
    <button className='tap-btn' onClick={handleTap}>
      <Typography>
        <span>
          <img src='/imgs/0_logo.png' className='tap-btn-img'></img>
          1-Tap Checkout
        </span>
      </Typography>
    </button>
  );
}
