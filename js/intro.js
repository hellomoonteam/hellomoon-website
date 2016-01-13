(function($){


	// SETTINGS
	//--------------------------------------------
	var isMobile = window.innerWidth < 769; // Flag for mobile browsers


	// MONITOR SCROLLING
	//--------------------------------------------
	var userIsScrolling = false;
	$('#main').scroll(function() {
		userIsScrolling = true;
	});
	(function loop() {
		setTimeout(function() {
			if (userIsScrolling && isMobile) {
				userIsScrolling = false;

				// Pause Stuff
				scrollIndicatorTween.pause();
				sphere1Spin.pause();
				sphere1Scale.pause();
				sphere2Spin.pause();
				sphere2Scale.pause();
				dotted1Spin.pause();
				dotted2Spin.pause();
				dotted3Spin.pause();
				arcSpin.pause();
				arc1Draw.pause();
				arc2Draw.pause();
				arc3Draw.pause();
				arc4Draw.pause();
				arc5Draw.pause();
				rayTrace.pause();
			} else {

				// Play Stuff
				scrollIndicatorTween.play();
				sphere1Spin.play();
				sphere1Scale.play();
				sphere2Spin.play();
				sphere2Scale.play();
				dotted1Spin.play();
				dotted2Spin.play();
				dotted3Spin.play();
				arcSpin.play();
				arc1Draw.play();
				arc2Draw.play();
				arc3Draw.play();
				arc4Draw.play();
				arc5Draw.play();
				rayTrace.play();
			}
			loop();
		}, 250);
	}());


	// PAUSE ANIMATIONS
	//--------------------------------------------

	// SCROLL INDICATOR ARROW
	//--------------------------------------------
	var scrollIndicatorTween = TweenMax.to('#scroll-indicator', .7, {
		marginTop: 150,
		ease: Power1.easeInOut
	});
	scrollIndicatorTween.yoyo(true).repeat(-1).play();


	// SPHERES
	//--------------------------------------------
	
	// SPHERE 1
	var sphere1Spin = TweenMax.to('#intro .background_sphere.is-1', 7, {
		rotation: 360,
		ease: Linear.easeNone
	});
	sphere1Spin.repeat(-1).play();
	var sphere1Scale = TweenMax.to('#intro .background_sphere.is-1', 10, {
		scale: .9,
		ease: Linear.easeNone
	});
	sphere1Scale.yoyo(true).repeat(-1).play();

	// SPHERE 2
	var sphere2Scale = TweenMax.to('#intro .background_sphere.is-2', 14, {
		scale: .9,
		ease: Linear.easeNone
	});
	sphere2Scale.yoyo(true).repeat(-1).play();
	var sphere2Spin = TweenMax.to('#intro .background_sphere.is-2', 5, {
		rotation: -360,
		ease: Linear.easeNone
	});
	sphere2Spin.repeat(-1).play();


	// ARCS
	//--------------------------------------------
	var arcSpin = TweenMax.to('#arcs', 9, { rotation: 360, ease: Linear.easeNone })
	 	.repeat(-1).play();
	var arc1Draw = new TimelineMax()
		.to('#arc1', .001, { drawSVG: '0% 0%', ease: Power0.easeIn })
		.to('#arc1', 0, { drawSVG: '0% 0%', ease: Power0.easeIn })
		.to('#arc1', 1.1, { drawSVG: '0% 100%', ease: Power1.easeOut })
		.to('#arc1', .2, { drawSVG: '0% 100%', ease: Power1.easeOut })
		.to('#arc1', 1, { drawSVG: '100% 100%', ease: Power0.easeOut })
		.to('#arc1', .4, { drawSVG: '100% 100%', ease: Power0.easeOut })
		.repeatDelay(4).repeat(-1).play();
	var arc2Draw = new TimelineMax()
		.to('#arc2', .001, { drawSVG: '0% 0%', ease: Power0.easeIn })
		.to('#arc2', .1, { drawSVG: '0% 0%', ease: Power0.easeIn })
		.to('#arc2', 1.1, { drawSVG: '0% 100%', ease: Power1.easeOut })
		.to('#arc2', .2, { drawSVG: '0% 100%', ease: Power1.easeOut })
		.to('#arc2', 1, { drawSVG: '100% 100%', ease: Power0.easeOut })
		.to('#arc2', .3, { drawSVG: '100% 100%', ease: Power0.easeOut })
		.repeatDelay(4).repeat(-1).play();
	var arc3Draw = new TimelineMax()
		.to('#arc3', .001, { drawSVG: '0% 0%', ease: Power0.easeIn })
		.to('#arc3', .2, { drawSVG: '0% 0%', ease: Power0.easeIn })
		.to('#arc3', 1.1, { drawSVG: '0% 100%', ease: Power1.easeOut })
		.to('#arc3', .2, { drawSVG: '0% 100%', ease: Power1.easeOut })
		.to('#arc3', 1, { drawSVG: '100% 100%', ease: Power0.easeOut })
		.to('#arc3', .2, { drawSVG: '100% 100%', ease: Power0.easeOut })
		.repeatDelay(4).repeat(-1).play();
	var arc4Draw = new TimelineMax()
		.to('#arc4', .001, { drawSVG: '0% 0%', ease: Power0.easeIn })
		.to('#arc4', .3, { drawSVG: '0% 0%', ease: Power0.easeIn })
		.to('#arc4', 1.1, { drawSVG: '0% 100%', ease: Power1.easeOut })
		.to('#arc4', .2, { drawSVG: '0% 100%', ease: Power1.easeOut })
		.to('#arc4', 1, { drawSVG: '100% 100%', ease: Power0.easeOut })
		.to('#arc4', .1, { drawSVG: '100% 100%', ease: Power0.easeOut })
		.repeatDelay(4).repeat(-1).play();
	var arc5Draw = new TimelineMax()
		.to('#arc5', .001, { drawSVG: '0% 0%', ease: Power0.easeIn })
		.to('#arc5', .4, { drawSVG: '0% 0%', ease: Power0.easeIn })
		.to('#arc5', 1.1, { drawSVG: '0% 100%', ease: Power1.easeOut })
		.to('#arc5', .2, { drawSVG: '0% 100%', ease: Power1.easeOut })
		.to('#arc5', 1, { drawSVG: '100% 100%', ease: Power0.easeOut })
		.repeatDelay(4).repeat(-1).play();


	// DOTTED CIRCLES
	//--------------------------------------------

	// DOTTED 1
	var dotted1Spin = TweenMax.to('#dotted1', 200, { rotation: 360, ease: Linear.easeNone })
		.repeat(-1).play();

	// DOTTED 2
	var dotted2Spin = TweenMax.to('#dotted2', 150, { rotation: -360, ease: Linear.easeNone })
		.repeat(-1).play();

	// DOTTED 3
	var dotted3Spin = TweenMax.to('#dotted3', 300, { rotation: 360, ease: Linear.easeNone })
		.repeat(-1).play();


	// RAYS
	//--------------------------------------------
	// Disabled Ray Spin for Better Performance
	// var raySpin = TweenMax.to('#rays', 250, { rotation: 360, ease: Linear.easeNone })
	// 	.repeat(-1).play();
	var rayTrace = new TimelineMax()
		.to('.ray', .001, {drawSVG: '0% 0%'})

		.to('#ray8', .3, { drawSVG: '70% 70%', ease: Power0.easeIn })
		.to('#ray8', .4, { drawSVG: '30% 50%', ease: Power0.easeIn })
		.to('#ray8', .6, { drawSVG: '10% 10%', opacity: .1, ease: Power1.easeOut })

		.to('#ray2', .3, { drawSVG: '70% 70%', ease: Power0.easeIn })
		.to('#ray2', .4, { drawSVG: '30% 50%', ease: Power0.easeIn })
		.to('#ray2', .6, { drawSVG: '10% 10%', opacity: .1, ease: Power1.easeOut })

		.to('#ray11', .3, { drawSVG: '70% 70%', ease: Power0.easeIn })
		.to('#ray11', .4, { drawSVG: '30% 50%', ease: Power0.easeIn })
		.to('#ray11', .6, { drawSVG: '10% 10%', opacity: .1, ease: Power1.easeOut })

		.to('#ray4', .3, { drawSVG: '70% 70%', ease: Power0.easeIn })
		.to('#ray4', .4, { drawSVG: '30% 50%', ease: Power0.easeIn })
		.to('#ray4', .6, { drawSVG: '10% 10%', opacity: .1, ease: Power1.easeOut })

		.to('#ray10', .3, { drawSVG: '70% 70%', ease: Power0.easeIn })
		.to('#ray10', .4, { drawSVG: '30% 50%', ease: Power0.easeIn })
		.to('#ray10', .6, { drawSVG: '10% 10%', opacity: .1, ease: Power1.easeOut })

		.to('#ray6', .3, { drawSVG: '70% 70%', ease: Power0.easeIn })
		.to('#ray6', .4, { drawSVG: '30% 50%', ease: Power0.easeIn })
		.to('#ray6', .6, { drawSVG: '10% 10%', opacity: .1, ease: Power1.easeOut })

		.to('#ray1', .3, { drawSVG: '70% 70%', ease: Power0.easeIn })
		.to('#ray1', .4, { drawSVG: '30% 50%', ease: Power0.easeIn })
		.to('#ray1', .6, { drawSVG: '10% 10%', opacity: .1, ease: Power1.easeOut })

		.to('#ray7', .3, { drawSVG: '70% 70%', ease: Power0.easeIn })
		.to('#ray7', .4, { drawSVG: '30% 50%', ease: Power0.easeIn })
		.to('#ray7', .6, { drawSVG: '10% 10%', opacity: .1, ease: Power1.easeOut })

		.to('#ray3', .3, { drawSVG: '70% 70%', ease: Power0.easeIn })
		.to('#ray3', .4, { drawSVG: '30% 50%', ease: Power0.easeIn })
		.to('#ray3', .6, { drawSVG: '10% 10%', opacity: .1, ease: Power1.easeOut })

		.to('#ray5', .3, { drawSVG: '70% 70%', ease: Power0.easeIn })
		.to('#ray5', .4, { drawSVG: '30% 50%', ease: Power0.easeIn })
		.to('#ray5', .6, { drawSVG: '10% 10%', opacity: .1, ease: Power1.easeOut })

		.to('#ray9', .3, { drawSVG: '70% 70%', ease: Power0.easeIn })
		.to('#ray9', .4, { drawSVG: '30% 50%', ease: Power0.easeIn })
		.to('#ray9', .6, { drawSVG: '10% 10%', opacity: .1, ease: Power1.easeOut })

		.to('#ray12', .3, { drawSVG: '70% 70%', ease: Power0.easeIn })
		.to('#ray12', .4, { drawSVG: '30% 50%', ease: Power0.easeIn })
		.to('#ray12', .6, { drawSVG: '10% 10%', opacity: .1, ease: Power1.easeOut })

		.repeat(-1);


}(jQuery));