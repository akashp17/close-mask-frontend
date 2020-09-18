import React, { useState, useRef, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';

import './SwipeButton.css';
function findLeft(element) {
	var rec = document.getElementById(element).getBoundingClientRect();
	return rec.left + window.scrollX;
}
function SwipeButton({ mainText, overlayText, onSwipeDone, reset }) {
	const [overlayWidth, setOverlayWidth] = useState(40);
	// const [overlayTrans, setOverlayTrans] = useState(0.2);
	const [swipeComplete, setSwipeComplete] = useState(false);
	const handlers = useSwipeable({
		onSwipedRight: (data) => {
			if (swipeComplete) return;
			const butWidth = document.getElementById('swipeBut').offsetWidth;
			if (data.velocity > 0.6) {
				setOverlayWidth(butWidth);
				setSwipeComplete(true);
				setTimeout(() => onSwipeDone({}), 500);
			} else {
				const offsetLeft = findLeft('swipeBut');
				const startPos = Math.abs(data.initial[0] - offsetLeft);
				// console.log(startPos);
				if (
					startPos <= 100 &&
					(data.event.type == 'touchend'
						? data.event.changedTouches[0].clientX - offsetLeft
						: data.event.offsetX) >
						0.6 * butWidth
				) {
					setOverlayWidth(butWidth);
					setSwipeComplete(true);
					setTimeout(() => onSwipeDone({}), 500);
				} else setOverlayWidth(40);
			}
		},
		onSwiping: (data) => {
			if (swipeComplete) return;
			const offsetLeft = findLeft('swipeBut');
			// console.log(document.getElementById("swipeBut"));
			const startPos = Math.abs(data.initial[0] - offsetLeft);
			// console.log(startPos);
			if (startPos <= 100) {
				if (data.event.type && data.event.type == 'touchmove')
					setOverlayWidth(data.event.touches[0].clientX - offsetLeft);
				else setOverlayWidth(data.event.offsetX);
			}
		},
		delta: 10,
		trackMouse: true,
		preventDefaultTouchmoveEvent: true,
	});

	useEffect(() => {
		if (reset) {
			setSwipeComplete(false);
			setOverlayWidth(40);
		}
	}, [reset]);

	return (
		<div class='swipe-but' id='swipeBut' {...handlers}>
			<div class='swipe-overlay' style={{ width: overlayWidth }}>
				<div class='overlay-wrapper'>
					<div class='img-wrapper'>
						<img src={require('./arrow.png')} alt='arrow' />
					</div>
					<div class='overlay-txt'>{overlayText}</div>
				</div>
			</div>
			{mainText}
		</div>
	);
}

export default SwipeButton;
