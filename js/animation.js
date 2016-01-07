(function(){


	// SETTINGS
	//--------------------------------------------
	var controller = new ScrollMagic.Controller({refreshInterval: 50}), // Init Scroll Magic Controller
		windowHeight = window.innerHeight,
		isMobile = window.innerWidth < 769, // Flag for mobile browsers
		glitches = [
			{ element: '.background_glitch.is-1', from: '40%', to: '60%' },
			{ element: '.background_glitch.is-2', from: '42%', to: '58%' },
			{ element: '.background_glitch.is-3', from: '38%', to: '62%' },
			{ element: '.background_glitch.is-4', from: '40%', to: '60%' },
			{ element: '.background_glitch.is-5', from: '42%', to: '58%' },
			{ element: '.background_glitch.is-6', from: '38%', to: '62%' },
			{ element: '.background_glitch.is-7', from: '40%', to: '60%' },
			{ element: '.background_glitch.is-8', from: '42%', to: '58%' },
		],
		diagonals = [
			'.background_diagonal.is-1',
			'.background_diagonal.is-2',
			'.background_diagonal.is-3',
			'.background_diagonal.is-4',
			'.background_diagonal.is-5',
		],
		backgrounds = [
			'.background_color.is-1',
			'.background_color.is-2',
			'.background_color.is-3',
			'.background_color.is-4',
		];


	// NO ANIMATIONS ON MOBILE
	//--------------------------------------------
	if (isMobile) {
		return false;
	}


	// GLITCHES
	//--------------------------------------------
	for (var i=0; i < glitches.length; i++){
		var tweenGlitch = new TweenMax.fromTo(glitches[i].element, 2, {
			top: glitches[i].from,
			},{ // from/to
			top: glitches[i].to,
			ease:Power0.easeInOut,
		});
		var sceneGlitch = new ScrollMagic.Scene({
			triggerElement: glitches[i].element,
			triggerHook: 1,
			duration: windowHeight * 2
		})
		.setTween(tweenGlitch)
		.addTo(controller);
	}


	// DIAGONALS
	//--------------------------------------------
	for (var i=0; i < diagonals.length; i++){
		var tweenDiagonal = new TweenMax.fromTo(diagonals[i], 2, {
			marginTop: -600
			},{ // from/to
			marginTop: 600,
			ease:Power0.easeInOut
		});
		var sceneDiagonal = new ScrollMagic.Scene({
			triggerElement: diagonals[i],
			triggerHook: 1,
			duration: windowHeight * 3
		})
		.setTween(tweenDiagonal)
		.addTo(controller);
	}


	// ANGLE ANIMATIONS
	//--------------------------------------------
	var tweenAngle = new TweenMax.fromTo('.background_angle.is-1', 2, {
		top: '60%',
		marginTop: '-5rem',
		marginLeft: '-15rem',
		},{ // from/to
		top: '80%',
		marginTop: '-15rem',
		marginLeft: '-25rem',
		ease:Power0.easeInOut
	});
	var sceneAngle = new ScrollMagic.Scene({
		triggerElement: '.background_angle.is-1',
		triggerHook: 1,
		duration: windowHeight * 2
	})
	.setTween(tweenAngle)
	.addTo(controller);
	var tweenAngle = new TweenMax.fromTo('.background_angle.is-2', 2, {
		top: '60%',
		marginTop: '5rem',
		marginLeft: '23rem',
		},{ // from/to
		top: '80%',
		marginTop: '15rem',
		marginLeft: '33rem',
		ease:Power0.easeInOut
	});
	var sceneAngle = new ScrollMagic.Scene({
		triggerElement: '.background_angle.is-1',
		triggerHook: 1,
		duration: windowHeight * 2
	})
	.setTween(tweenAngle)
	.addTo(controller);

	

	// TEXT ANIMATIONS
	//--------------------------------------------
	
	// LOGO
	var tweenLogo = new TweenMax.fromTo('#logo', 2, {
		top: '0',
		},{ // from/to
		top: '-200',
		ease:Power0.easeInOut
	});
	var sceneLogo = new ScrollMagic.Scene({
		triggerElement: '#logo',
		triggerHook: .5,
		duration: windowHeight
	})
	.setTween(tweenLogo)
	.addTo(controller);
	
	// EXPLORE
	var timelineExplore = new TimelineLite();
		timelineExplore
			.from('#grid-shift', .7, {scale: .4, opacity: 0, ease: Power1.easeOut})
			.from('#explore h1', .7, {y: 70, opacity: 0, ease: Power1.easeOut})
			.from('#explore p', .7, {x: 70, opacity: 0, ease: Power1.easeOut}, '-=.5');
	var sceneExplore = new ScrollMagic.Scene({
		triggerElement: '#explore h1',
		triggerHook: .8
	})
	.setTween(timelineExplore)
	.addTo(controller);

	// EVOLVE
	var timelineEvolve = new TimelineLite();
		timelineEvolve
			.from('#grid-evolve', .7, {scale: .4, opacity: 0, ease: Power1.easeOut})
			.from('#evolve h1', .7, {y: 70, opacity: 0, ease: Power1.easeOut})
			.from('#evolve p', .7, {x: -70, opacity: 0, ease: Power1.easeOut}, '-=.5');
	var sceneEvolve = new ScrollMagic.Scene({
		triggerElement: '#evolve h1',
		triggerHook: .8
	})
	.setTween(timelineEvolve)
	.addTo(controller);

	// CREATE
	var timelineCreate = new TimelineLite();
		timelineCreate
			.from('#create h1', .7, {y: 70, opacity: 0, ease: Power1.easeOut})
			.from('#create p', .7, {scale: .9, opacity: 0, ease: Power1.easeOut}, '-=.5');
	var sceneCreate = new ScrollMagic.Scene({
		triggerElement: '#create h1',
		triggerHook: .8
	})
	.setTween(timelineCreate)
	.addTo(controller);

	// WORK
	var timelineWork = new TimelineLite();
		timelineWork
			.from('#work h1', .7, {y: 70, opacity: 0, ease: Power1.easeOut});
	var sceneWork = new ScrollMagic.Scene({
		triggerElement: '#work h1',
		triggerHook: .8
	})
	.setTween(timelineWork)
	.addTo(controller);

	// SERVICES
	var timelineServices = new TimelineLite();
		timelineServices
			.from('#services h1', .7, {y: 70, opacity: 0, ease: Power1.easeOut})
			.from('#services p', .7, {x: 70, opacity: 0, ease: Power1.easeOut}, '-=.5')
			.from('#services #constellation', .7, {scale: .9, opacity: 0, ease: Power1.easeOut}, '-=1.2');
	var sceneServices = new ScrollMagic.Scene({
		triggerElement: '#services h1',
		triggerHook: .8
	})
	.setTween(timelineServices)
	.addTo(controller);

	// CONTACT
	var timelineContact = new TimelineLite();
		timelineContact
			.from('#contact h1', .7, {y: 70, opacity: 0, ease: Power1.easeOut})
			.from('#contact p:not(.is-small)', .7, {x: 70, opacity: 0, ease: Power1.easeOut}, '-=.5')
			.from('#contact .grid_col:nth-child(1) .button', .7, {x: 70, opacity: 0, ease: Power2.easeOut}, '-=.6')
			.from('#contact p.is-small', .6, {x: 70, opacity: 0, ease: Power1.easeOut}, '-=.6')
			.from('#contact .form', 1.2, {scale: .9, opacity: 0, ease: Power2.easeOut}, '-=.8');
	var sceneContact = new ScrollMagic.Scene({
		triggerElement: '#contact h1',
		triggerHook: .8
	})
	.setTween(timelineContact)
	.addTo(controller);
		

	// WORK GRID
	//--------------------------------------------
	var timelineWorkGrid = new TimelineLite();
		timelineWorkGrid
			.from('#work .grid_col:nth-child(1) .project', .8, {rotationX:100, scale: .8, opacity: 0, ease: Power1.easeOut}, '0')
			.from('#work .grid_col:nth-child(2) .project', .8, {rotationX:90, scale: .81, opacity: 0, ease: Power1.easeOut}, '.1')
			.from('#work .grid_col:nth-child(3) .project', .8, {rotationX:80, scale: .82, opacity: 0, ease: Power1.easeOut}, '.2')
			.from('#work .grid_col:nth-child(4) .project', .8, {rotationX:70, scale: .83, opacity: 0, ease: Power1.easeOut}, '.3')
			.from('#work .grid_col:nth-child(5) .project', .8, {rotationX:60, scale: .84, opacity: 0, ease: Power1.easeOut}, '.4')
			.from('#work .grid_col:nth-child(6) .project', .8, {rotationX:50, scale: .85, opacity: 0, ease: Power1.easeOut}, '.5')
			.from('#work .grid_col:nth-child(7) .project', .8, {rotationX:40, scale: .86, opacity: 0, ease: Power1.easeOut}, '.6')
			.from('#work .grid_col:nth-child(8) .project', .8, {rotationX:30, scale: .87, opacity: 0, ease: Power1.easeOut}, '.7')
			.from('#work .grid_col:nth-child(9) .project', .8, {rotationX:20, scale: .88, opacity: 0, ease: Power1.easeOut}, '.8')
			.from('#work .grid_col:nth-child(10) .project', .8, {rotationX:10, scale: .89, opacity: 0, ease: Power1.easeOut}, '.9');
	var sceneWorkGrid = new ScrollMagic.Scene({
		triggerElement: '#work h1',
		triggerHook: .5
	})
	.setTween(timelineWorkGrid)
	.addTo(controller);


	// BACKGROUND OPACITY
	//--------------------------------------------
	for (var i=0; i < backgrounds.length; i++){
		var tweenBackground = new TweenMax.fromTo(backgrounds[i], 2, {
			opacity: .5
			},{ // from/to
			opacity: 1,
			ease:Power1.easeOut
		});
		var sceneBackground = new ScrollMagic.Scene({
			triggerElement: backgrounds[i],
			triggerHook: 1,
			duration: windowHeight * 3
		})
		.setTween(tweenBackground)
		.addTo(controller);
	}


}(jQuery));