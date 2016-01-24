$(document).ready(function() {

	// Bindings
	$('body').on('click','[data-action="modalOpen"]', modalOpen);
	$('body').on('click','[data-action="modalClose"]', modalClose);

	init();
});



// SIMPLE SPA FRAMEWORK
//----------------------------------------------------

// Init Page
function init() {
	render();
}

// Render Page
function render(hash) {
	var hashes = getHashes(),
		hash = window.location.hash.substring(1), 
		hashParts = hash.split('/'), // Pass additional info split by a forward slash
		modal = $('#modal').length > 0,
		url = null;

	// If there's a hash that matches a hash in the portfolio section
	for (i=0; i < hashes.length; i++) {
		if (hashes[i] == hash) {
			url = $('#work').find('[data-hash="' + hash + '"]').attr('href');
			modalLaunch(url,hash);
		}
	}

	// If there's a hash and it's a dialog
	if (hash == 'thanks') {
		dialogOpen('Thank You!', 'Your message has been sent.<br> We\'ll be in touch soon.');
	}
	
	// If we don't have a hash and a modal is open close it
	if (modal && hash=='') {
		modalHide();
	}	
}

// Hash Change
$(window).on('hashchange', function(){
    render();
});

// Update Hash
function updateHash(hash) {
	document.location.hash = hash;
}

// Get Hashes
function getHashes(){
	var hashes = [],
		hash;

	$('#work a').each(function( index ) {
		hash = $(this).data('hash');
		hashes.push(hash);
	});
	return hashes;
}



// PAGE LOADER
//----------------------------------------------------
$(window).load(function () {
	var pageLoaderTween = new TimelineMax()
		.to($('#page-loader .loader_spinner'), .75, {
			opacity: 0
		})
		.to($('#page-loader'), 1.5, {
			opacity: 0,
			onComplete: function() {
				$('#page-loader').remove();
			}
		});
})



// MODAL
//----------------------------------------------------

// Trigger Modal Open
function modalOpen(e){
	var hash = $(this).attr('data-hash'),
		scrollPosition = $(document).scrollTop();

	e.preventDefault();
	$('body').data('scroll', scrollPosition); // Store Scroll Position
	updateHash(hash);
}

// Trigger Modal Close
function modalClose(e){
	e.preventDefault();
	updateHash(''); // Triggers modalHide from render function
}

// Modal Build/Show
function modalLaunch(url,hash) {
	modalBuild();
	modalInject(url,hash);
	setTimeout(modalShow, 30);
}
function modalBuild(){
	html =  '<div id="modal" class="modal">';
	html += 	'<a class="modal_close" data-action="modalClose">Close</a>';
	html += 	'<div class="modal_content is-hidden"></div>';
	html += '</div>';
	$('body').append(html);
}
function modalInject(url,hash) {
	$.ajax({
		url: url ,
		success: function( result ) {
			$('#modal .modal_content').html($(result).find('.modal_content'));
		},
		error: function( xhr, status, errorThrown ) {
			console.log( "Error: " + errorThrown );
			console.log( "Status: " + status );
		},
		complete: function( xhr, status ) {
			console.log( 'the request is complete' );

			// Wrap Images in Responsive Wrap
			responsiveWrap();
			
			// Display Modal Content (but wait a bit to make sure it's done animating)
			setTimeout(function(){
				$('#modal .modal_content').removeClass('is-hidden');
			}, 300);

			// Google Analytics
  			ga('send', 'pageview');
		}
	});
}
function modalShow(){
	var scrollPosition = $('body').data('scroll'),
		centerOffset = (scrollPosition * .1) + 'px';

	$('#main').css({
		transform: 'scale(.9) translateY(' + centerOffset + ')',
		opacity: '.5',
	});
	$('#modal').addClass('is-overflow-hidden')
	$('#modal').addClass('is-active');
	setTimeout(modalScrollHandoff, 600); // Lock main with fixed once it's hidden
}
function modalScrollHandoff(){
	$('#main').css({
		position: 'fixed',
	});
	$('#modal').removeClass('is-overflow-hidden')
}

// Modal Hide/Empty
function modalHide(e) {
	var scrollPosition = $('body').data('scroll');

	$('#main').attr('style','');
	$('#modal').removeClass('is-active');
	$('#modal').addClass('is-overflow-hidden')
	$(document).scrollTop(scrollPosition); // Restore previous scroll position
	
	setTimeout(modalEmpty, 600); // Remove modal once it's animated out of view
}
function modalEmpty() {
	console.log('empty');

	$('#modal').remove(); // Remove modal markup

	// Stop currently running load events
	try {
	 	window.stop(); // Modern Browsers
	} catch(e) {
		document.execCommand('Stop'); // IE
	}
}


// DIALOG
// A simpler modal style component
//----------------------------------------------------
function dialogOpen(title,msg){
	var html = null;
	
	// Build & Inject Dialog
	html =  '<div id="dialog" class="dialog">';
	html += 	'<a class="dialog_close" data-action="dialogClose">Close</a>';
	html += 	'<div class="dialog_content">';
	html += 		'<h2>' + title + '</h2>';
	html += 		'<p>' + msg + '</p>';
	html += 	'</div>';
	html += '</div>';
	$('body').append(html);

	// Add bindings
	$('body').on('click', dialogClose);

	// Show Dialog
	setTimeout(dialogShow, 30);
}

function dialogShow(){
	var scrollPosition = $(document).scrollTop(),
		centerOffset = (scrollPosition * .1) + 'px';

	$('#main').css({
		'transform': 'scale(.9) translateY(' + centerOffset + ')',
		'opacity': '.5'
	});
	$('#dialog').addClass('is-active');
}

function dialogClose(e){
	e.preventDefault();

	updateHash(''); // Remove Hash

	// Remove bindings
	$('body').off('click', dialogClose);

	// Hide Dialog
	$('#main').attr('style','');
	$('#dialog').removeClass('is-active');

	// Remove Dialog
	setTimeout(dialogRemove, 600); // Don't empty until modal is hidden
}


function dialogRemove() {
	$('#modal').remove();
}


// RESPONSIVE IMAGE WRAP
// Wrap images in aspect ratio locked div to preserve
// space in layout before they have loaded.
//----------------------------------------------------
function responsiveWrap(){
	var $parent = $('#modal'),
		images = $parent.find('img');

	for (i=0; i<images.length; i++) {
   		loadingWrap(images[i]);
	}

	console.log('responsive wrap');
	console.log(images);

	function loadingWrap(img) {
        var imageWidth = img.getAttribute('width'),
            imageHeight = img.getAttribute('height'),
            percentRatio = imageHeight/imageWidth * 100,
            wrapper = document.createElement('div');
    
        // Wrap Element
        img.setAttribute('style', 'position: absolute; width: 100%; height: auto;');
        wrapper.setAttribute('style', 'position: relative; padding-bottom: ' + percentRatio + '%;');
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
    }
}

