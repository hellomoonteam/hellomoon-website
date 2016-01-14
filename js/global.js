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
		modal = $('#modal'),
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
		$('.main').removeClass('is-behind');
		$('#modal').removeClass('is-active');
		setTimeout(modalEmpty, 600); // Don't empty until modal is hidden
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
function modalOpen(e){
	var hash = $(this).attr('data-hash'),
		scrollPosition = $(document).scrollTop(); //$('body').scrollTop();

	e.preventDefault();

	// Remember Previous Scroll Position
	$('body').data('scroll', scrollPosition);

	updateHash(hash);
}

function modalLaunch(url,hash) {
	modalBuild();
	modalInject(url,hash);
	setTimeout(modalShow, 30);
}

function modalClose(e){
	var scrollPosition = $('body').data('scroll');

	e.preventDefault();
	updateHash('');

	// Stop Loading any content that didn't finish before we close (images)
	try {
		window.stop();
	} catch(e) {
		document.execCommand('Stop');
	}

	$(document).scrollTop(scrollPosition);
	modalHide();	
	setTimeout(modalEmpty, 600); // Don't empty until modal is hidden
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
			$('#modal .modal_content').removeClass('is-hidden');

			// Google Analytics
  			ga('send', 'pageview');
		}
	});
}

function modalEmpty() {
	$('#modal').remove();
}

function modalHide(){
	$('#main').attr('style','');
	$('#modal').removeClass('is-active');
}

function modalShow(){
	var scrollPosition = $(document).scrollTop(),
		centerOffset = (scrollPosition * .1) + 'px';

	$('#main').css({
		'transform': 'scale(.9) translateY(' + centerOffset + ')',
		'opacity': '.5'
	});
	$('#modal').addClass('is-active');
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
