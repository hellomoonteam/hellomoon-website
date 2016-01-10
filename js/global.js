$(document).ready(function() {

	// Bindings
	$('body').on( 'click','[data-action="modalOpen"]', modalOpen );
	$('body').on( 'click','[data-action="modalClose"]', modalClose);

	//init();
});



// SIMPLE SPA FRAMEWORK
//----------------------------------------------------

// Init Page
function init() {
	render();
}

// Render Page
function render(hash) {
	// If there is a hash and it matches a portfolio modal
	// than load page with that modal open.
}

$(window).on('hashchange', function(){
	//console.log('hash change');
    //render();
});

// Update hash
function updateHash(hash) {
	//document.location.hash = hash;
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
	var url = $(this).attr('href');

	e.preventDefault();
	$('.main').addClass('is-behind');
	$('#modal').addClass('is-active');
	modalInject(url);
}

function modalClose(e){
	e.preventDefault();
	window.stop(); // Stop Loading any content that didn't finish before we close (images)
	$('.main').removeClass('is-behind');
	$('#modal').removeClass('is-active');
	setTimeout(modalEmpty, 600); // Don't empty until modal is hidden
}

function modalInject(url) {
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
		}
	});
}

function modalEmpty() {
	$('#modal .modal_content').empty();
}