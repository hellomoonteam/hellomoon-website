/*

TODO:
- Make code more modular (pubsub)
*/


$(document).ready(function() {

	// Bindings
	$('ul.pagedots').mouseenter( pagedotsOver ).mouseleave( pagedotsOut );
	$('[data-action="scrollJump"]').mouseenter( dotJump );
	$('[data-action="arrowJump"]').click( arrowJump );
	$('body').on( 'click','[data-action="modalOpen"]', modalOpen );
	$('body').on( 'click','[data-action="modalClose"]', modalClose);

	init();
});


function init() {
	render();
}


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
			scrollStop();	
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
	$('html, body').animate({
	 	scrollTop: scrollTo
	}, 300, 'swing', function() {
	 	updateHash(currentID);
	});
}


// Update Dots On Scroll
//----------------------------------------------------
$(window).scroll($.debounce( 200, true, function(){

	// Leave if modal or menu is active
	if ( $('.modal.is-active').length || $('body.is-menu-active').length ) {
		return false;
	}
	
	var currentScroll = $(window).scrollTop(),
		windowHeight = $(window).height(),
		currentPercent = (currentScroll % windowHeight) / windowHeight,
		index = Math.round(currentScroll / windowHeight);

	// Update Dots
	$('.pagedots .is-active').removeClass('is-active');
	$('.pagedots li:eq(' + index + ') a').addClass('is-active');
}));


// Update Layout On Resize
//----------------------------------------------------
$(window).resize($.debounce( 20, true, function(){
	var currentSection = getCurrentSection(),
		currentId = currentSection.id;

	jumpToSection(currentId);
}));


// SIMPLE SPA FRAMEWORK
//----------------------------------------------------
$(window).on('hashchange', function(){
    render();
});

// Render page
function render(hash) {
	var currentSection = getCurrentSection(),
		currentIndex = currentSection.index,
		totalSections = $('.pagesections > section').length,
		pagesections = $('.pagesections');

	// First Page
	if (currentIndex == 0) {
		$('.logo').addClass('is-hidden');
		$('.pagearrows li:first-child').addClass('is-hidden');
		$('.pagearrows li:last-child').removeClass('is-hidden');
	}

	// Last Page
	else if (currentIndex == totalSections-1) {
		$('.logo').removeClass('is-hidden');
		$('.pagearrows li:first-child').removeClass('is-hidden');
		$('.pagearrows li:last-child').addClass('is-hidden');
	}

	// Other Pages
	else {
		$('.logo').removeClass('is-hidden');
		$('.pagearrows li').removeClass('is-hidden');
	}

	// All Pages
	$('.pagedots .is-active').removeClass('is-active');
	$('.pagedots li:eq(' + currentIndex + ') a ').addClass('is-active');
}

// Update hash
function updateHash(hash) {
	document.location.hash = hash;
}


// UTILITES
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
	var windowHeight = $(window).height(),
		currentSection = getCurrentSection(),
		scrollTarget = (windowHeight * currentSection.index) * -1;

		$('.pagesections').css({ 'position' : 'fixed', 'top' : scrollTarget });
}

function unlockSections() {
	var windowHeight = $(window).height(),
		currentSection = getCurrentSection(),
		scrollTarget = (windowHeight * currentSection.index) * -1;

	$('.pagesections').css({ 'position' : 'relative', 'top' : 'auto' });
	console.log(currentSection.id);
	jumpToSection(currentSection.id);
}

function scrollToSection(id) {
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
	var target = $(id),
		index = $('.pagesections > section').index(target),
		scrollTarget = $(window).height() * index;

	// Instantly jump to Scroll Target
	$('html, body').scrollTop( scrollTarget );
}


// PAGEDOT NAVIGATION
//----------------------------------------------------
function pagedotsOver(){
	$('body').addClass('is-menu-active');
}

function pagedotsOut(){
	var hash = $(this).find('a.is-active').attr('href');

	$('body').removeClass('is-menu-active');
	updateHash(hash);
	jumpToSection(hash);
}

function dotJump(e) {
	var hash = $(this).attr('href');

	$('.pagedots .is-active').removeClass('is-active');
	$(this).addClass('is-active');
	scrollToSection(hash);
}


// NAVIGATION ARROWS
//----------------------------------------------------
function arrowJump(e){
	var direction = $(this).attr('href'),
		currentSection = getCurrentSection(), // The current section index
		index = currentSection.index,
		scrollTo,
		hash;

	e.preventDefault();
	if (direction == '#next') {
		index += 1;
	} else if (direction == '#prev') {
		index -= 1;
	}
	scrollTo = $('.pagesections > section:eq(' + index + ')').offset().top + 'px';
	newHash = $('.pagesections > section:eq(' + index + ')').attr('id');

	// Animate Section
	$('html, body').animate({
		scrollTop: scrollTo
	}, 500, 'swing', function() {
		updateHash(newHash);
	});
}


// MODAL
//----------------------------------------------------
function modalOpen(e){
	var currentSection = getCurrentSection(),
		url = $(this).attr('href');

	e.preventDefault();

	// Lock Sections and move them back
	lockSections();
	$(currentSection.id).addClass('is-behind');
	$('nav').addClass('is-behind');
	window.scrollTo(0, 0);

	// Inject Modal
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
	$('#modal .modal').attr('style','position: relative;');
	$('#modal .modal').addClass('is-active');
}

function modalClose(e){
	var windowHeight = $(window).height();

	e.preventDefault();
	$('#modal .modal').removeClass('is-active');
	$('#modal .modal').attr('style','top: ' + windowHeight + 'px;');
	unlockSections();
	$('.pagesections > section.is-behind').removeClass('is-behind').addClass('is-active');
	$('nav').removeClass('is-behind');
}
