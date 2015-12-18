$(document).ready(function() {

	// Bindings
	//$('ul.pagedots').mouseenter( pagedotsOver ).mouseleave( pagedotsOut );
	//$('[data-action="scrollJump"]').mouseenter( dotJump );
	//$('[data-action="arrowJump"]').click( arrowJump );
	$('body').on( 'click','[data-action="modalOpen"]', modalOpen );
	$('body').on( 'click','[data-action="modalClose"]', modalClose);

	//init();
});


// function init() {
// 	render();
// }


// Scroll Stop Detection
// Requires jquery debounce plugin
//----------------------------------------------------
(function () {
	var scrollStart = 0;

	$(window).scroll($.debounce( 250, true, function(){
		scrollStart = $(window).scrollTop();
	}));

	$(window).scroll($.debounce( 250, function(){
		var scrollTravel = $(window).scrollTop() - scrollStart;

		// Make scrollTravel position if it's negative
		if (scrollTravel < 0) {
			scrollTravel = scrollTravel * -1;
		}

		// Make sure we aren't on the menu or modal
		if ( $('.modal.is-active').length || $('body.is-menu-active').length || scrollTravel < 20 ) {
			return false;
		} else {
			//scrollStop();	
		}
	}));
})();


function scrollStop() {
	var currentScroll = $(window).scrollTop(),
		windowHeight = $(window).height(),
		index = Math.round(currentScroll / windowHeight),
		scrollTo = $('.pagesections > section:eq(' + index + ')').offset().top + 'px',
		currentID = $('.pagesections > section:eq(' + index + ')').attr('id');

	// Animate to nearest section
	// $('html, body').animate({
	//  	scrollTop: scrollTo
	// }, 300, 'swing', function() {
	//  	updateHash(currentID);
	// });

	updateHash(currentID);
}

// Update Layout On Resize
//----------------------------------------------------
// $(window).resize($.debounce( 20, true, function(){
// 	var currentSection = getCurrentSection(),
// 		currentId = currentSection.id;

// 	jumpToSection(currentId);
// }));


// SIMPLE SPA FRAMEWORK
//----------------------------------------------------
$(window).on('hashchange', function(){
	console.log('hash change');
    //render();
});

// Render page
function render(hash) {
	console.log('rendering ' + hash)
}

// Update hash
function updateHash(hash) {
	//document.location.hash = hash;
}


// SECTION NAVIGATION UTILITES
//----------------------------------------------------
function getCurrentSection() {
	var currentSection = {};
	currentSection.id = document.location.hash;
	currentSection.element = $(currentSection.id);
	currentSection.index = $('.pagesections > section').index(currentSection.element);
	return currentSection;
}

function getTotalSections() {
	var totalSections = $('.pagesections > section').length;
	return totalSections;
}

function lockSections() {
	console.log('lock sections');

	var windowHeight = $(window).height(),
		currentSection = getCurrentSection(),
		scrollTarget = (windowHeight * currentSection.index) * -1;
	$('.pagesections').css({ 'position' : 'fixed', 'top' : scrollTarget });
}

function unlockSections() {
	console.log('unlock sections');

	var windowHeight = $(window).height(),
		currentSection = getCurrentSection(),
		scrollTarget = (windowHeight * currentSection.index) * -1;
	$('.pagesections').css({ 'position' : 'relative', 'top' : 'auto' });
	jumpToSection(currentSection.id);
}

function scrollToSection(id) {
	console.log('scroll to section');

	var target = $(id),
		index = $('.pagesections > section').index(target),
		scrollTarget = $(window).height() * index;

	// Animate page to Scroll Target
	$('html, body').stop().animate({
		scrollTop: scrollTarget
	}, 500, 'swing', function() {
	});
}

function jumpToSection(id) {
	console.log('jump to section');

	var target = $(id),
		index = $('.pagesections > section').index(target),
		scrollTarget = $(window).height() * index;

	// Instantly jump to Scroll Target
	$('html, body').scrollTop( scrollTarget );
}


// MODAL
//----------------------------------------------------
function modalOpen(e){
	var url = $(this).attr('href');

	e.preventDefault();   
	$('.main').addClass('is-behind');
	modalInject(url);
}

function modalInject(url) {
	var windowHeight = $(window).height();

	$('#modal').load(url + ' .modal', function( response, status, xhr ) {
		if ( status == "error" ) {
			var msg = "Sorry but there was an error: ";
			$( "#error" ).html( msg + xhr.status + " " + xhr.statusText );
		} else {
			// Set modal top to prep for animation
			$('#modal .modal').attr('style','top: ' + windowHeight + 'px;');
			// Delay activating modal to allow time for css animation to trigger
			setTimeout(modalActive, 30);
		}
	});
}

function modalActive() {
	$('#modal .modal').attr('style','position: absolute;');
	$('#modal .modal').addClass('is-active');
}

function modalClose(e){
	var windowHeight = $(window).height();

	e.preventDefault();
	$('#modal .modal').removeClass('is-active');
	$('#modal .modal').attr('style','top: ' + windowHeight + 'px;');
	$('.main').removeClass('is-behind');
}
