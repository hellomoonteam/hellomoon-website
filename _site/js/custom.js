$(document).ready(function () {
  // Bindings
  $("body").on("click", '[data-action="modalOpen"]', modalOpen);
  $("body").on("click", '[data-action="modalClose"]', modalClose);
  $("body").on("click", '[data-action="scrollSome"]', scrollSome);

  init();
});

window.onresize = function () {
  setSectionHeights();
};

// SIMPLE SPA FRAMEWORK
//----------------------------------------------------

// Init Page
function init() {
  render();
  setSectionHeights();
}

// Render Page
function render(hash) {
  var hashes = getHashes(),
    hash = window.location.hash.substring(1),
    hashParts = hash.split("/"), // Pass additional info split by a forward slash
    modal = $("#modal").length > 0,
    url = null;

  // If there's a hash that matches a hash in the portfolio section
  for (i = 0; i < hashes.length; i++) {
    if (hashes[i] == hash) {
      url = $("#work")
        .find('[data-hash="' + hash + '"]')
        .attr("href");
      modalLaunch(url, hash);
    }
  }

  // If there's a hash and it's a dialog
  if (hash == "thanks") {
    dialogOpen(
      "Thank You!",
      "Your message has been sent.<br> We'll be in touch soon."
    );
  }

  // If we don't have a hash and a modal is open close it
  if (modal && hash == "") {
    modalHide();
  }
}

// Hash Change
$(window).on("hashchange", function () {
  render();
});

// Update Hash
function updateHash(hash) {
  document.location.hash = hash;
}

// Get Hashes
function getHashes() {
  var hashes = [],
    hash;

  $("#work a").each(function (index) {
    hash = $(this).data("hash");
    hashes.push(hash);
  });
  return hashes;
}

// PAGE LOADER
//----------------------------------------------------
$(window).load(function () {
  var pageLoaderTween = new TimelineMax()
    .to($("#page-loader .loader_spinner"), 0.75, {
      opacity: 0,
    })
    .to($("#page-loader"), 1.5, {
      opacity: 0,
      onComplete: function () {
        $("#page-loader").remove();
      },
    });
});

// MODAL
//----------------------------------------------------

// Trigger Modal Open
function modalOpen(e) {
  var hash = $(this).attr("data-hash"),
    scrollPosition = $(document).scrollTop();

  e.preventDefault();
  $("body").data("scroll", scrollPosition); // Store Scroll Position
  updateHash(hash);
}

// Trigger Modal Close
function modalClose(e) {
  e.preventDefault();
  updateHash(""); // Triggers modalHide from render function
}

// Modal Build/Show
function modalLaunch(url, hash) {
  modalBuild();
  modalInject(url, hash);
  // Don't call modalShow here - let modalInject handle it after content loads
}
function modalBuild() {
  html = '<div id="modal" class="modal">';
  html += '<a class="modal_close" data-action="modalClose">Close</a>';
  html += '<div class="modal_content is-hidden"></div>';
  html += "</div>";
  $("body").append(html);
  console.log("Modal built and added to DOM");
}
function modalInject(url, hash) {
  $.ajax({
    url: url,
    success: function (result) {
      $("#modal .modal_content").html($(result).find(".modal_content").html());
      console.log("Modal content injected successfully");
    },
    error: function (xhr, status, errorThrown) {
      console.log("Error: " + errorThrown);
      console.log("Status: " + status);
    },
    complete: function (xhr, status) {
      console.log("the request is complete");

      // Images are now handled directly without Imgix

      // Wrap Images in Responsive Wrap
      responsiveWrap("#modal");

      // Display Modal Content and show modal
      setTimeout(function () {
        $("#modal .modal_content").removeClass("is-hidden");
        console.log("is-hidden class removed from modal content");
        modalShow(); // Now show the modal after content is visible
      }, 100); // Reduced delay for better responsiveness

      // Google Analytics
      ga("send", "pageview");
    },
  });
}
function modalShow() {
  var scrollPosition = $("body").data("scroll"),
    centerOffset = scrollPosition * 0.1 + "px";

  console.log("modalShow called - scaling main and activating modal");
  
  $("#main").css({
    transform: "scale(.9) translateY(" + centerOffset + ")",
    opacity: ".5",
  });
  $("#modal").addClass("is-overflow-hidden");
  $("#modal").addClass("is-active");
  console.log("Modal is now active with classes:", $("#modal").attr("class"));
  
  setTimeout(modalScrollHandoff, 600); // Lock main with fixed once it's hidden
}
function modalScrollHandoff() {
  // Using position fixed to avoid double scrollbars on main
  // causes a crash on ipad and isn't really necessary anyway.
  var is_iPad = navigator.userAgent.match(/iPad/i) != null;
  if (!is_iPad) {
    $("#main").css({ position: "fixed" });
  }
  $("#modal").removeClass("is-overflow-hidden");
}

// Modal Hide/Empty
function modalHide(e) {
  var scrollPosition = $("body").data("scroll");

  $("#main").attr("style", "");
  $("#modal").removeClass("is-active");
  $("#modal").addClass("is-overflow-hidden");
  $(document).scrollTop(scrollPosition); // Restore previous scroll position

  setTimeout(modalEmpty, 600); // Remove modal once it's animated out of view
}
function modalEmpty() {
  $("#modal").remove(); // Remove modal markup

  // Stop currently running load events
  try {
    window.stop(); // Modern Browsers
  } catch (e) {
    document.execCommand("Stop"); // IE
  }
}

// DIALOG
// A simpler modal style component
//----------------------------------------------------
function dialogOpen(title, msg) {
  var html = null;

  // Build & Inject Dialog
  html = '<div id="dialog" class="dialog">';
  html += '<a class="dialog_close" data-action="dialogClose">Close</a>';
  html += '<div class="dialog_content">';
  html += "<h2>" + title + "</h2>";
  html += "<p>" + msg + "</p>";
  html += "</div>";
  html += "</div>";
  $("body").append(html);

  // Add bindings
  $("body").on("click", dialogClose);

  // Show Dialog
  setTimeout(dialogShow, 30);
}

function dialogShow() {
  var scrollPosition = $(document).scrollTop(),
    centerOffset = scrollPosition * 0.1 + "px";

  $("#main").css({
    transform: "scale(.9) translateY(" + centerOffset + ")",
    opacity: ".5",
  });
  $("#dialog").addClass("is-active");
}

function dialogClose(e) {
  e.preventDefault();

  updateHash(""); // Remove Hash

  // Remove bindings
  $("body").off("click", dialogClose);

  // Hide Dialog
  $("#main").attr("style", "");
  $("#dialog").removeClass("is-active");

  // Remove Dialog
  setTimeout(dialogRemove, 600); // Don't empty until modal is hidden
}

function dialogRemove() {
  $("#modal").remove();
}

// RESPONSIVE IMAGE WRAP
// Wrap images in aspect ratio locked div to preserve
// space in layout before they have loaded.
//----------------------------------------------------
function responsiveWrap(parent) {
  var $parent = $(parent),
    images = $parent.find("img");

  for (i = 0; i < images.length; i++) {
    loadingWrap(images[i]);
  }

  function loadingWrap(img) {
    var imageWidth = img.getAttribute("width"),
      imageHeight = img.getAttribute("height"),
      percentRatio = (imageHeight / imageWidth) * 100,
      wrapper = document.createElement("div");

    // Wrap Element
    img.setAttribute("style", "position: absolute; width: 100%; height: auto;");
    wrapper.setAttribute(
      "style",
      "position: relative; padding-bottom: " + percentRatio + "%;"
    );
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);
  }
}

// LOCK 100% SECTION HEIGHTS ON MOBILE
// Sections that are 100% high on mobile should have
// their section height locked to avoid glitches when
// viewport height changes due to url bar hiding in
// android.
//----------------------------------------------------
function setSectionHeights() {
  var maxHeight = 1000,
    windowHeight = $(window).height(),
    windowWidth = $(window).width(),
    viewportHeight = windowHeight > maxHeight ? maxHeight : windowHeight,
    viewportWidth = windowWidth;

  $(".section.is-height-100").css("height", viewportHeight);

  console.log("-----");
  console.log(windowHeight);
  console.log(viewportHeight);

  // Only set size in pixels if we are portrait on mobile
  if (viewportWidth < 770 && viewportHeight > 450) {
    $(".section.is-height-100").css("height", viewportHeight);
  }
}

// SCROLL SOME
// Used to communicate page can be scrolled
//----------------------------------------------------
function scrollSome(e) {
  e.preventDefault();

  var scrollPosition = $("body").scrollTop(),
    sectionHeight = $("main section:first-child").height(),
    newScrollPosition = scrollPosition + sectionHeight;

  //jQuery Animation Method
  //$('body').animate({ scrollTop: newScrollPosition });

  // GSAP Animation Method
  TweenMax.to(window, 0.8, {
    scrollTo: { y: newScrollPosition },
    ease: Power2.easeInOut,
  });
}

// START/RESET GRID ANIMATION
//----------------------------------------------------
$('[data-action="exploreAnimateToggle"]').on("click", function () {
  var textOn = "Watch Us Adapt",
    textOff = "Reset Shape";

  if ($(this).text() == textOn) {
    playShift();
    $(this).text(textOff);
  } else {
    resetShift();
    $(this).text(textOn);
  }
});

(function($){

	// SETTINGS
	//--------------------------------------------
	var isMobile = window.innerWidth < 769,
		windowHeight = window.innerHeight; // Flag for mobile browsers


	// MONITOR SCROLLING
	//--------------------------------------------
	var userIsScrolling = false;
	$(window).scroll(function() {
		userIsScrolling = true;
	});

	(function loop() {
		if (!isMobile) {
			return false;
		}
		setTimeout(function() {
			if (userIsScrolling) {
				userIsScrolling = false;
				introPause();
			} else {
				introPlay();				
			}
			loop();
		}, 250);
	}());
	
	
	// DISABLE INTRO
	//--------------------------------------------
	var controller = new ScrollMagic.Controller();
	new ScrollMagic.Scene({
			triggerElement: '#intro',
			triggerHook: 0,
			offset: windowHeight
		})
		.setClassToggle('#intro', 'is-inactive') // add class toggle
		.on('enter', function (e) {
			introPause();
		})
		.on('leave', function (e) {
			introPlay();
		})
		.addTo(controller);


	// PAUSE/PLAY INTRO
	//--------------------------------------------
	function introPause() {
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
	}

	function introPlay() {
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


	// LOGO
	var scrollIndicator = new TweenMax.fromTo('#scroll-indicator', 2, {
		opacity: '1',
		},{ // from/to
		opacity: '0',
		ease:Power0.easeInOut
	});
	var sceneScrollIndicator = new ScrollMagic.Scene({
		triggerElement: '#logo',
		triggerHook: .5,
		duration: windowHeight/2
	})
	.setTween(scrollIndicator)
	.addTo(controller);

	
	// EXPLORE
	var timelineExplore = new TimelineLite();
		timelineExplore
			.from('#grid-shift', .7, {scale: .4, opacity: 0, ease: Power1.easeOut})
			.from('#explore h2', .7, {y: 70, opacity: 0, ease: Power1.easeOut}, '-=.7')
			.from('#explore p', .7, {x: 40, opacity: 0, ease: Power1.easeOut}, '-=.5');
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
			.from('#evolve h2', .7, {y: 70, opacity: 0, ease: Power1.easeOut}, '-=.7')
			.from('#evolve p', .7, {x: -40, opacity: 0, ease: Power1.easeOut}, '-=.5');
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
			.from('#services #constellation', .7, {scale: .9, opacity: 0, ease: Power1.easeOut})
			.from('#services h1', .7, {y: 70, opacity: 0, ease: Power1.easeOut}, '-=.7')
			.from('#services p', .7, {x: 40, opacity: 0, ease: Power1.easeOut}, '-=.5');
			
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
			.from('#work .project-wrap:nth-child(1) ', .8, {rotationX:100, scale: .8, opacity: 0, ease: Power1.easeOut}, '0')
			.from('#work .project-wrap:nth-child(2) ', .8, {rotationX:90, scale: .81, opacity: 0, ease: Power1.easeOut}, '.1')
			.from('#work .project-wrap:nth-child(3) ', .8, {rotationX:80, scale: .82, opacity: 0, ease: Power1.easeOut}, '.2')
			.from('#work .project-wrap:nth-child(4) ', .8, {rotationX:70, scale: .83, opacity: 0, ease: Power1.easeOut}, '.3')
			.from('#work .project-wrap:nth-child(5) ', .8, {rotationX:60, scale: .84, opacity: 0, ease: Power1.easeOut}, '.4')
			.from('#work .project-wrap:nth-child(6) ', .8, {rotationX:50, scale: .85, opacity: 0, ease: Power1.easeOut}, '.5')
			.from('#work .project-wrap:nth-child(7) ', .8, {rotationX:40, scale: .86, opacity: 0, ease: Power1.easeOut}, '.6')
			.from('#work .project-wrap:nth-child(8) ', .8, {rotationX:30, scale: .87, opacity: 0, ease: Power1.easeOut}, '.7')
			.from('#work .project-wrap:nth-child(9) ', .8, {rotationX:20, scale: .88, opacity: 0, ease: Power1.easeOut}, '.8')
			.from('#work .project-wrap:nth-child(10) ', .8, {rotationX:10, scale: .89, opacity: 0, ease: Power1.easeOut}, '.9');
	var sceneWorkGrid = new ScrollMagic.Scene({
		triggerElement: '#work h1',
		triggerHook: .8
	})
	.setTween(timelineWorkGrid)
	.addTo(controller);



}(jQuery));
(function($){
$.fn.dotGrid = function(options) {

	// Default Settings
	//--------------------------------------------
	var settings = $.extend({
		play: false,
		mode: 'shift',
		columns: 4,				// columns in grid
		rows: 5,				// rows in grid
		size: 5, 				// rem size of grid squares
		gutterSize: 0, 			// pixel size of gutters
		shapeSetup: [
			[3,0,'#ffffff'],
			[0,0,'#008ff1'],
			[0,1,'#008ff1'],
			[0,2,'#008ff1'],
			[0,3,'#008ff1'],
			[0,4,'#008ff1'],
			[1,2,'#008ff1'],
			[2,2,'#008ff1'],
			[3,2,'#008ff1'],
			[3,3,'#008ff1'],
			[3,4,'#008ff1']
		]
	}, options);


	//--------------------------------------------
	// For Each Instance of Grid
	//--------------------------------------------
	this.each(function() {
        var gridElement = $(this),
        	columns = settings.columns,
        	rows = settings.rows,
        	remSize = getRemSize(),
        	size = settings.size * remSize,
        	shapeSetup = settings.shapeSetup,
        	shape = [],
        	nextColor = null,
        	playGrid = settings.play,
        	playLock = settings.playLock,
        	mode = settings.mode;

        // MONITOR SCROLLING
        var userIsScrolling = false;
		$(window).scroll(function() {
			userIsScrolling = true;
		})

        // SETUP SCROLL EVENTS
		var controller = new ScrollMagic.Controller();
		var scene = new ScrollMagic.Scene({
				triggerElement: this,
				triggerHook: .8,
				duration: 1000
			})
			.addTo(controller)
			.on('enter leave', function (e) {
				if (e.type == 'enter'){
					setTimeout(function() { playGrid = true; }, 1500);
				} else {
					playGrid = false;
				}
			})

		// GLOBAL METHODS
		if (mode == 'shift') {

			window.playShift = function() {
				playLock = false;
			}

			window.resetShift = function() {
				playLock = true;
				shape = [];
				gridElement.empty();
				init();
			}
		}


		// GET THE PARTY STARTED
		init();


		function init() {
			// make an array of objects out of shapeSetup array
			for (var i = 0; i < shapeSetup.length; i++) {
				shape.push({
					x: shapeSetup[i][0],
					y: shapeSetup[i][1],
					color: shapeSetup[i][2],
					name: 'square'+i
				});
			}
			createGrid();
			drawShape();

        }

		function createGrid() {
			var width = columns * size,
				height = rows * size;
			gridElement.css({
				'position': 'relative',
				'margin': '0 auto',
				'width': width,
				'height': height
			});
		}

		function drawShape() {
			for (var i = 0; i < shape.length; i++) {
				var x = shape[i].x,
					y = shape[i].y,
					color = shape[i].color,
					name = shape[i].name;
					addSquare(i,x,y,color,name, gridElement);					
			}
		}
	
		function addSquare(i,x,y,color,name, gridElement) {
			var element = '.'+name,
				markup = '<div class="square '+name+'"></div>';
			gridElement.append(markup);
			gridElement.find(element).css({
				'background': color,
				'position': 'absolute',
				'top': (y * size) + 'px',
				'left': (x * size) + 'px',
				'width': size - settings.gutterSize + 'px',
				'height': size - settings.gutterSize + 'px',
				'transition': 'top .5s, left .5s, background .5s'
			});
		}


		// LOOP
		(function loop() {
			var random = Math.round(Math.random() * 400 + 1100);
			setTimeout(function() {

				// Update the scrolling event
				if (userIsScrolling) {
					userIsScrolling = false;

				// Animate the grid if we aren't scrolling	
				} else {
					if (playGrid && !playLock && mode == 'shift'){
						shiftShape();
					}
					if (playGrid && !playLock && mode == 'evolve'){
						evolveShape();
					}
				}

				loop();
			}, random);
		}());

		
        // SHUFFLE SHAPE
		// 1. Shuffle directions to add randomness    
		// 2. Select first item in shape array
		// 3. Test a direction to move - it if fails move on to next direction
		// 4. if all directions fail move on to next item in shape array
		// 5. if a direction passes update shape array and position and then exit function
		function shiftShape(){
			var directions = ['up','right','down','left'],
				futureCoordinates = null,
				futureX = null,
				futureY = null;

			directions = shuffleArray(directions);
			for (var i = 0; i < shape.length; i++) {
				for (var j = 0; j < directions.length; j++) {
					futureCoordinates = getFutureCoordinates(shape[i].x, shape[i].y, directions[j]);
					futureX = futureCoordinates[0];
					futureY = futureCoordinates[1];

					movePossible = testMove(futureX, futureY);
					if (movePossible) {
						shape[i].x = futureX;
						shape[i].y = futureY;
						moveSquare(i);
						updateShapeArray(i);
						
						return false; 
					}
				}
			}
		}
		

		// EVOLVE SHAPE
		// 1. Shuffle directions to add randomness    
		// 2. Select first item in shape array
		// 3. Test a direction to move - it if fails move on to next direction
		// 4. if all directions fail move on to next item in shape array
		// 5. if a direction passes update shape array and position and then exit function
		function evolveShape(){
			var directions = ['up','right','down','left'],
				futureCoordinates = null,
				futureX = null,
				futureY = null;

			directions = shuffleArray(directions);

			// Colorize white pixels from last loop
			for (var i = 0; i < shape.length; i++) {
				if (shape[i].color == '#ffffff') {
					shape[i].color = nextColor;
					colorSquare(i, nextColor);
				}
			}

			// Set direction
			for (var i = 0; i < shape.length; i++) {
				for (var j = 0; j < directions.length; j++) {
					futureCoordinates = getFutureCoordinates(shape[i].x, shape[i].y, directions[j]);
					futureX = futureCoordinates[0];
					futureY = futureCoordinates[1];
					inBounds = testBoundaries(futureX, futureY);
					overlapped = testOverlap(futureX, futureY);

					if (inBounds && overlapped) {
						nextColor = shape[i].color;
						shape[i].x = futureX;
						shape[i].y = futureY;
						shape[i].color = '#ffffff';
						colorSquare(i, '#ffffff');
						shape[overlapped].color = '#ffffff';
						colorSquare(overlapped, '#ffffff');
						moveSquare(i);
						return false;
					} else if (inBounds) {
						shape[i].x = futureX;
						shape[i].y = futureY;
						moveSquare(i);
						updateShapeArray(i);

						return false;
					}
				}
			}
		}

		// GET FUTURE COORDINATES
		function getFutureCoordinates(x,y,direction) {
			var coordinates = [];
			switch(direction) {
				case 'up':
					coordinates[0] = x;
					coordinates[1] = y-1;
					break;
				case 'right':
					coordinates[0] = x+1;
					coordinates[1] = y;
					break;
				case 'down':
					coordinates[0] = x;
					coordinates[1] = y+1;
					break;
				case 'left':
					coordinates[0] = x-1;
					coordinates[1] = y;
					break;
			}
			return coordinates;
		}
	
		// TEST MOVE
		function testMove(futureX, futureY) {
			// Test if out of bounds
			if (futureX < 0 || futureX >= columns || futureY < 0 || futureY >= rows) {
				return false;
			}
			// Test if occupied - check if coordinates in shape array for match
			for (var i = 0; i < shape.length; i++) {
				xToTest = shape[i].x;
				yToTest = shape[i].y;
				if (futureX == xToTest && futureY == yToTest) {
					return false;
				}
			}
			return true;
		}

		// TEST IF SQUARE WILL LEAVE BOUNDARIES
		function testBoundaries(futureX, futureY) {
			// Test if out of bounds
			if (futureX < 0 || futureX >= columns || futureY < 0 || futureY >= rows) {
				return false;
			}
			return true;
		}
	
		// TEST IF SQUARE WILL OVERLAP
		function testOverlap(futureX, futureY) {
			for (var i = 0; i < shape.length; i++) {
				xToTest = shape[i].x;
				yToTest = shape[i].y;
				if (futureX == xToTest && futureY == yToTest) {
					return i;
				}
			}
			return false;
		}

		// MOVE SQUARE
		// Update the on screen location of square in i position of shape array
		function moveSquare(i) {
			var elementClass = '.'+shape[i].name,
				x = shape[i].x,
				y = shape[i].y;
			gridElement.find(elementClass).css({
				'top': (y * size) + 'px',
				'left': (x * size) + 'px',
			});
		}

		// COLOR SQUARE
		// Update the on screen color of square in i position of shape array
		function colorSquare(i, color) {
			var elementClass = '.'+shape[i].name;

			gridElement.find(elementClass).css({
				'background': color
			});
		}
		
		// UPDATE SHAPE ARRAY
		function updateShapeArray(i) {
			var deletedItem = shape.splice(i, 1),
				randomNumber = randomInt(1,8);
			shape.push({
				x: deletedItem[0].x,
				y: deletedItem[0].y,
				color: deletedItem[0].color,
				name: deletedItem[0].name
			});
			if (randomNumber == 1) {
				shape = shuffleArray(shape);
			}
		}

    }); // END FOR EACH


	//--------------------------------------------
	// UTILITIES
	//--------------------------------------------

	// SHUFFLE AN ARRAY
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

	// RETURN A RANDOM INTERGER
	function randomInt(min,max) {
		return Math.floor(Math.random()*(max-min+1)+min);
	}

	// RETURN CURRENT REM SIZE IN PIXELS
	function getRemSize() {
		remSize = 10; // sensible default

		fontSize = $('html').css('font-size');
		fontSize = parseInt(fontSize, 10);
		if (fontSize) {
			remSize = fontSize;
		}

		return remSize;
	}

	return this;

};
}(jQuery));
(function(){
//grid_tilt.js
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