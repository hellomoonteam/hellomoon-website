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
		modal = $('#modal'),
		url = null;

	// If there is a hash and it matches a hash on the page
	for (i=0; i < hashes.length; i++) {
		if (hashes[i] == hash) {
			url = $('body').find('[data-hash="' + hash + '"]').attr('href');
			modalLaunch(url,hash);
		}
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

 

// UPDATE ON RESIZE
//----------------------------------------------------
// $(window).resize($.debounce( 20, true, function(){

// }));



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
	var hash = $(this).attr('data-hash');

	e.preventDefault();
	updateHash(hash);
}

function modalLaunch(url,hash) {
	modalBuild();
	modalInject(url,hash);
	setTimeout(modalShow, 30);
}

function modalClose(e){
	e.preventDefault();
	history.pushState("", document.title, window.location.pathname); // Remove Hash

	// Stop Loading any content that didn't finish before we close (images)
	try {
		window.stop();
	} catch(e) {
		document.execCommand('Stop');
	} 

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
			//var d = document.location.pathname + document.location.search + document.location.hash;
  			//_gaq.push(['_trackPageview', d]);
  			ga('send', 'pageview');
		}
	});
}

function modalEmpty() {
	$('#modal').remove();
}

function modalHide(){
	$('.main').removeClass('is-behind');
	$('#modal').removeClass('is-active');
}

function modalShow(){
	$('.main').addClass('is-behind');
	$('#modal').addClass('is-active');
}
