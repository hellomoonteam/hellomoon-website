(function(){
	activeCard
	x
	y

	function onMouseEnter(){
		// set active card to element mouse is over (this)
		// Set mouse move binding
		// 		- activeCard.onMouseMove(moveFunction);
		// Start Animation loop loop();
	}

	function mouseLeave() {
		// set active card null
		// remove mouse move binding from the active card
		// Stop loop on mouse leave
	}

	function mouseMove() {
		if (activeCard = null) {
			return false;
		} else {
			// set x and y in relation to activeCard
		}
	}

	function loop() {
		if (activeCard == null) {
			return false;
		}
		setTimeout(function() {
			activeCard.css({
				transform: 'translate3d(' + x + ',' + y + ',z)')
			});
			loop();
		}, 33); // ~30fps
	};

}) ( );