function addEventToTogglers() {
	return new Promise( function ( resolve, reject ) {
		try {
			const togglers = document.getElementsByClassName( 'toggler' );
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
		const links = document.getElementsByTagName( 'a' );
		for ( const link of links ) {
			let url;
			let hash;
			let scrollable = false;
			try {
				url = new URL( link.href );
				hash = url.hash;
				scrollable = window.location.origin + window.location.pathname === url.origin + url.pathname && !!hash;
			} catch ( _ ) {
				if ( link.href.indexOf( '#' ) >= 0 ) {
					hash = link.href.split( '?' )[0];
					scrollable = !!hash;
				}
			}
			if ( scrollable ) {
				link.addEventListener( 'click', function ( event ) {
					smoothScrollTo( event, hash );
				} );
			}
		}
	}

	async function addSmoothScrollToScrollers() {
		const scrollers = document.getElementsByClassName( 'scroller' );
		for ( const scroller of scrollers ) {
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
Wait.whileLoading( function () {
	const varmem = new VariableManager();
	varmem.register( 'tab', {
		parser: {
			'sphere-diameter': 'number',
			'sio2-density': 'number',

		}, exec: function (obj) {
			obj = typeof obj === 'object' ? obj : {};
			let {
				sphereDiameter = 950,
				sio2Density = 1.973,
				silicaAmount = 30.72
			} = obj;

			const NMtoCM = number => number * 1e-7;
			const compute = () => {
				try {
					const silica = Number( in_silica.value );
					if ( silica !== null || silica !== undefined ) {
						const sphereDiameterCM = NMtoCM( Number( in_diameter.value ) );
						const sphereVolume = 4 / 3 * Math.PI * ( sphereDiameterCM / 2 ) ** 3;
						const sphereWeight = sphereVolume * Number( in_density.value );
						const sphereGram = 1 / sphereWeight;
						const nbSphereWeighted = ( silica * sphereGram ) * 1e-3;
						const volSphereWeighted = nbSphereWeighted * sphereVolume;
						const tubeTotalVolume = nbSphereWeighted / 30000000000;
						const resuspendVolume = tubeTotalVolume - volSphereWeighted;
						out_vol.innerText = resuspendVolume.toFixed(3);
					}
					else {
						out_vol.innerText = '';
					}
				}
				catch ( _ ) {
					out_vol.innerText = '';	
				}				
			};

			
			const in_diameter = ecs( { t: 'input', id:'input-diameter', class: 'input-diameter', attr: { type: 'text', value: sphereDiameter }, events: [
				['input', compute]
			] } );

			const bt_more_diameter = ecs( { t: 'button', class: 'button-diameter', attr: { type: 'button', value: '+' }, _: '+', events:[
				['click',() => {
					in_diameter.value = Number(in_diameter.value) + 10;
					compute();
				}]
			] } );
			
			const bt_less_diameter = ecs( { t: 'button', class: 'button-diameter', attr: { type: 'button', value: '-' }, _: '-', events:[
				['click',() => {
					in_diameter.value = Number(in_diameter.value) - 10;
					compute();
				}]
			] } );
			

			const in_density = ecs( { t: 'input', id:'input-density', class: 'input-density', attr: { type: 'text', value: sio2Density }, events: [
				['input', compute]
			] } );

			const bt_more_density = ecs( { t: 'button', class: 'button-density', attr: { type: 'button', value: '+' }, _: '+', events:[
				['click',() => {
					in_density.value = (Number(in_density.value) + 0.001).toFixed(3);
					compute();
				}]
			] } );
			
			const bt_less_density = ecs( { t: 'button', class: 'button-density', attr: { type: 'button', value: '-' }, _: '-', events:[
				['click',() => {
					in_density.value = (Number(in_density.value) - 0.001).toFixed(3);
					compute();
				}]
			]
			} );
			

			const in_silica = ecs( { t: 'input', id:'input-silica', class: 'input-silica', attr: { type: 'text', value: silicaAmount }, events: [
				['input', compute]
			] } );

			const bt_more_silica = ecs( { t: 'button', class: 'button-silica', attr: { type: 'button', value: '+' }, _: '+', events:[
				['click',() => {
					in_silica.value = (Number(in_silica.value) + 0.01).toFixed(2);
					compute();
				}]
			] } );
			
			const bt_less_silica = ecs( { t: 'button', class: 'button-silica', attr: { type: 'button', value: '-' }, _: '-', events:[
				['click',() => {
					in_silica.value = (Number(in_silica.value) - 0.01).toFixed(2);
					compute();
				}]
			]
			} );
			
			const out_vol = ecs( { t: 'string', class: 'output-volume' } );

			compute();
			
			return ecs( {
				class: 'form-calculator',
				_: [
					{class:'form-input',_:[
						{ class: 'element-group', _: [
							{t: 'label', _: 'Spheres diameter (nm) ', attr:{for:'input-diameter'} },
							{class:'input-wrapper',_:[
								bt_less_diameter,
								in_diameter,
								bt_more_diameter
							]
						}
						] },
						{ class: 'element-group', _: [
							{t: 'label', _: 'SiO<sub>2</sub> density (g/cm<sup>3</sup>)', attr:{for:'input-density'} },
							{class:'input-wrapper',_:[
								bt_less_density,
								in_density,
								bt_more_density
							]
						}
						] },
						{ class: 'element-group', _: [
							{t: 'label', _: 'Amount of silica beads weighted (mg)', attr:{for:'input-silica'} },
							{class:'input-wrapper',_:[
								bt_less_silica,
								in_silica,
								bt_more_silica
							]
						}
						] }
					]},
					{
						class: 'form-output', _: {
							class: 'element-group', _: [
								{t:'label',_:'Resuspend volume (mL) to reach 3x10<sup>10</sup> particles/mL'},
								{class:'input-wrapper',_:out_vol}]
						}
					}
				]
			});
		}
	} );
} );
Wait.interactive( useInter );
Wait.interactive( function () {
	document.head.appendChild(
		ecs( {
			t: 'meta',
			attr: {
				name: 'viewport',
				content: 'width=device-width, initial-scale=1.0'
			}
		} )
	);
} );
Wait.interactive( function () { return addClass( document.body, 'color-scheme-light' ); } );
Wait.interactive( Render, null, [
	Team.render,
	addEventToTogglers,
	addSmoothScroll,
	MarkdownParser.terminate,
	Compare.init,
	function () {
		const groupparts = document.getElementById( 'groupparts' );
		if ( groupparts ) {
			const pageContent = document.getElementById( 'page-content' );
			const pageRows = [...pageContent.querySelectorAll( '.page-row' )];
			pageRows[pageRows.length - 1].insertAdjacentElement( 'beforeend', groupparts );
		}
	},
	function () {
		for ( const table of document.getElementsByTagName( 'table' ) ) {
			const wrapper = ecs( { class: 'table-wrapper' } );
			table.insertAdjacentElement( 'beforebegin', wrapper );
			wrapper.appendChild( table );
		}
	},
	VariableManager.execute
] );
