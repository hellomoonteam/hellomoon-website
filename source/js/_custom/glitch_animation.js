(function(){	
	

	// ATTEMPT 1 USING GSAP
	
	function glitch1(){
		var glitch1 = shuffleArray($('#glitch1 g')),
			duration;
		
		for (var i=0; i < glitch1.length; i++) {
			duration = randomInt(3,8);
			TweenMax.fromTo(glitch1[i], duration, {
				opacity: .5
			},{
				opacity: 1,
				ease: Power3.easeIn
			})
			.yoyo(true)
			.repeat(-1);
		}
	};
	glitch1();
	

	// ATTEMPT 2 - JUST CSS (not done)
	// function glitch1(){
	// 	var glitch1 = shuffleArray( $('#glitch1 g') ),
	// 		current = 0,
	// 		length = glitch1.length;
		
	// 	function animate() {
	// 		$(glitch1[current]).attr('style','opacity: 1;');
	// 		if (current < length) {
	// 			current += 1;
	// 		} else {
	// 			current = 0;
	// 		}
	// 		$(glitch1[current]).attr('style','');
	// 	}
	// 	setInterval(animate, 100); // Call every 200 ms
	// };
	// glitch1();



	// UTILITES
	// Repeated from h_shift.js
	//--------------------------------------------
	function shuffleArray(array) {
		var currentIndex = array.length,
			temporaryValue,
			randomIndex;
		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		return array;
	}
	function randomInt(min,max) {
		return Math.floor(Math.random()*(max-min+1)+min);
	}

}(jQuery));