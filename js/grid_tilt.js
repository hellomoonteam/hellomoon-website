(function(){
	
	var degreesOfMotionX = 20,
			degreesOfMotionY = 10,
			speed = 1,
			fps = 60,
			$wrap = $('#work .project-wrap'),
			isMobile = window.innerWidth < 769;

	// NOT ON MOBILE
	if (isMobile) {
		return false;
	}
	
	// MOUSE ENTER
	$wrap.on('mouseenter', function() {
		$(this).data('active', true);
	})
	
	// MOUSE LEAVE
	$wrap.on('mouseleave', function() {
		$(this).data('active', false);
	})
	
	// MOUSE MOVE
	$wrap.on('mousemove', function(e) {
		var pageX = e.pageX, // mouse cursor from top corner of screen
			pageY = e.pageY,
			cardOffset = $(this).offset(),
			cardX = cardOffset.left - e.pageX, // mouse cursor from top corner of element
			cardY = cardOffset.top - e.pageY,
			cardWidth = $(this).outerWidth(), // element width
			cardHeight = $(this).outerHeight(),
			cardPercentX = (cardX / cardWidth) * -1, // percentage that mouse cursor is from top left
			cardPercentY = (cardY / cardHeight) * -1,
			cardDegreesX = (cardPercentX * degreesOfMotionX) - (degreesOfMotionX/2), // split it in half
			cardDegreesY = (cardPercentY * degreesOfMotionY) - (degreesOfMotionY/2);
		
		$(this).data('degreesX', cardDegreesX);
		$(this).data('degreesY', cardDegreesY);
	})
	
	// INIT
	function init(){
		$wrap.each(setupCard);
	}
	init();
	
	// SETUP CARD
	function setupCard(){
		$(this).data('active', false);
		$(this).data('previousDegreesX', 0);
		$(this).data('previousDegreesY', 0);
		$(this).data('degreesX', 0);
		$(this).data('degreesY', 0);
		$(this).data('scale', 1);
	}
	
	// LOOP
	function loop(){
		setTimeout(function() {
			$wrap.each(animate);
			loop();
		}, 1000/fps);
	}
	loop();
	
	// ANIMATE
	function animate(){
		var active = $(this).data('active'),
				previousDegreesX = $(this).data('previousDegreesX'),
				previousDegreesY = $(this).data('previousDegreesY'),
				degreesX = $(this).data('degreesX'),
				degreesY = $(this).data('degreesY'),
				scale = $(this).data('scale');
		
		// Active Card
		if (active) {
			if (degreesX < previousDegreesX - speed) {
				degreesX = previousDegreesX - speed;				
			} else if (degreesX > previousDegreesX + speed) {
 				degreesX = previousDegreesX + speed;
 			}
			if (degreesY < previousDegreesY - speed) {
				degreesY = previousDegreesY - speed;				
			} else if (degreesY > previousDegreesY + speed) {
 				degreesY = previousDegreesY + speed;
 			}
			if (scale > .97) {
				scale = scale * .996;
				$(this).data('scale', scale);
			}
			
		}
		
		// Inactive Card
		if (!active) {			
			if (degreesX - speed > 0) {
				degreesX -= speed;
			} else if ( degreesX + speed < 0) {
				degreesX += speed;				
			} else {
			 	degreesX = 0;
			}
			if (degreesY - speed > 0) {
				degreesY -= speed;
			} else if ( degreesY + speed < 0) {
				degreesY += speed;
			} else {
			 	degreesY = 0;
			}
			if (scale < 1) {
				scale = scale * 1.004;
				$(this).data('scale', scale);
			}
			
			$(this).data('degreesX', degreesX);
			$(this).data('degreesY', degreesY);
		}
		
		// Update Data
		$(this).data('previousDegreesX', degreesX);
		$(this).data('previousDegreesY', degreesY);

		// Animate
		$(this).find('.project').css({
			transform: 'rotateY(' + degreesX + 'deg) rotateX(' + (degreesY * -1) + 'deg) scale(' + scale + ')'
		});
			
	}
	
}());