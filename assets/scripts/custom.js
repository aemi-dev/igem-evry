function addEventToTogglers() {
	return new Promise( function ( resolve, reject ) {
		try {
			const togglers = document.getElementsByClassName('toggler');
			for ( const toggler of togglers ) {
				const {
					toggleTargetSelector,
					toggleTextOn,
					toggleTextOff,
					toggleClassName,
					toggleEventType
				} = data( toggler );
				toggler.addEventListener( toggleEventType, function () {
					toggleClass( toggler, toggleClassName );
					toggleClass( document.querySelector( toggleTargetSelector ), toggleClassName );
					if ( !!toggleTextOn && !!toggleTextOff ) {
						toggler.textContent = hasClass( toggler, toggleClassName ) ? toggleTextOff : toggleTextOn;
					}
				} );
			}
			resolve( true );
		}
		catch ( error ) {
			console.error( error );
			reject( error );
		}
	} );
}

function addSmoothScroll() {

	async function addSmoothScrollToLink() {
		const links = document.getElementsByTagName('a');
		for (const link of links) {
			let url;
			let hash;
			let scrollable = false;
			try {
				url = new URL(link.href);
				hash = url.hash;
				scrollable = window.location.origin + window.location.pathname === url.origin + url.pathname && !!hash;
			} catch (_) {
				if (link.href.indexOf('#') >= 0) {
					hash = link.href.split('?')[0];
					scrollable = !!hash;
				}
			}
			if (scrollable) {
				link.addEventListener('click', function (event) {
					smoothScrollTo( event, hash );
				} );
			}
		}
	}

	async function addSmoothScrollToScrollers() {
		const scrollers = document.getElementsByClassName( 'scroller' );
		for (const scroller of scrollers) {
			const { scrollTarget, scrollDuration } = data( scroller );
			scroller.addEventListener( 'click', function ( event ) {
				smoothScrollTo( event, scrollTarget );
			} );
		}
	}

	return new Promise( function ( resolve ) {
		Promise.all( [addSmoothScrollToLink(), addSmoothScrollToScrollers()] )
			.then( function ( response ) {
				resolve( response );
			} );
	} );
}
Wait.interactive( useInter );
Wait.interactive( function () {
	document.head.appendChild(
		ecs( {
			$: 'meta',
			attr: {
				name: 'viewport',
				content: 'width=device-width, initial-scale=1.0'
			}
		} )
	);
} );
Wait.interactive( function () { return addClass( document.body, 'color-scheme-light' ); } );
Wait.interactive( Render, null, [addEventToTogglers, addSmoothScroll,MarkdownParser.terminate,Compare.init] );
