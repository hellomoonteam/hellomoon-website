$(document).ready(function() {

	// Bindings
	$('body').on( 'click','[data-action="modalOpen"]', modalOpen );
	$('body').on( 'click','[data-action="modalClose"]', modalClose);

	//init();
});


// function init() {
// 	render();
// }



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
	//console.log('hash change');
    //render();
});

// Render page
function render(hash) {
	//console.log('rendering ' + hash)
}

// Update hash
function updateHash(hash) {
	//document.location.hash = hash;
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
	$('#modal .modal').attr('style','top: ' + windowHeight + 'px;');
	$('.main').removeClass('is-behind');
	$('#modal .modal_close').attr('style','display: none;');
	setTimeout(modalEmpty, 600); // Don't empty until modal is hidden
}

function modalEmpty() {
	$('#modal').empty();
}