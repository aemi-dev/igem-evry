function getGlobal() {
	const value = globalThis || self || window || global;
	if ( value ) {
		return value;
	}
	throw new Error( 'Unable to get global object.' );
}

function entries( object, func ) {
	for ( let key in object ) {
		if ( Object.prototype.hasOwnProperty.call( object, key ) ) {
			func( key, object[key] );
		}
	}
}

class Chars {
	constructor () {
		this.values = Object.create( null );
		
		for ( let i = 0; i < 62; i++ ) {
			if ( i < 10 ) {
				this.values[i] = 48 + i;
			} else if ( i < 36 ) {
				this.values[i] = 65 + i - 10;
			} else if ( i < 62 ) {
				this.values[i] = 97 + i - 36;
			}
		}
	}
	get( x ) {
		return this.values[x < 62 ? x : x % 62];
	}
	static get( x ) {
		const gl = getGlobal();
		if ( !( 'CharsList' in gl ) ) {
			gl.CharsList = new Chars();
		}
		return gl.CharsList.get( x );
	}
}
/**
 * Measure Execution Time of a Function
 * @param {Function} func
 * @param  {...any} args
 * @returns {Promise} A Promise
 */
function measure( func, ...args ) {
	const perf = getGlobal().performance;
	const start = perf.now();
	const res = func( ...args );
	const end = perf.now();
	return new Promise( function ( resolve, reject ) {
		if ( res instanceof Promise ) {
			res.then( function (response) {
				const end = perf.now();
				console.info( `${func.name} Execution Time : ${end - start}` );
				resolve( response );
			} ).catch( function (_) {
				const end = perf.now();
				console.error( `${func.name} Execution Time : ${end - start}` );
				reject( _ );
			} );
		} else {
			console.info( `${func.name} Execution Time : ${end - start}` );
			resolve( res );
		}
	} );
}
/**
 * Randomly Generate a String
 * @param {Number} length Number
 * @returns {String} Randomly generated string of length size
 */
function identifier( length ) {
	const res = [];
	for ( let i = 0, l = length || 16; i < l; i += 1 ) {
		res[i] = String.fromCharCode( Chars.get( Math.floor( Math.random() * 124 ) & Math.ceil( Math.random() * 124 ) ) );
	}
	return res.join( '' );
}
/**
 * Inhibit Propagation and Default Behavior of an Event
 * @param {Event} event
 */
function inhibitEvent( event ) {
	event.preventDefault();
	event.stopPropagation();
}
/**
 * Return true if classname is present, false otherwise.
 * @param {HTMLElement} element
 * @param {String} className
 * @returns {Boolean}
 */
function hasClass( element, className ) {
	if ( element && !!className && typeof className === 'string' ) {
		return element.classList.contains( className );
	} else {
		throw new Error(
			'SyntaxError: element and/or classname is/or undefined.'
		);
	}
}
function addClass( element, className, requireFrame ) {
	requireFrame = requireFrame || false;
	if ( element && !!className && typeof className === 'string' ) {
		if ( !requireFrame ) {
			element.classList.add( className );
			return true;
		} else {
			return !!window.requestAnimationFrame( function () {
				element.classList.add( className );
			} );
		}
	} else {
		throw new Error( `element or/and className is/are undefined.` );
	}
}
/**
 * Remove classname from element and request a frame before removing it
 * @param {HTMLElement} element
 * @param {String} className
 * @param {Boolean} [requireFrame]
 * @returns {Boolean}
 */
function removeClass( element, className, requireFrame ) {
	requireFrame = requireFrame || false;
	if ( element && !!className && typeof className === 'string' ) {
		if ( !requireFrame ) {
			element.classList.remove( className );
			return true;
		} else {
			return !!window.requestAnimationFrame( function () {
				element.classList.remove( className );
			} );
		}
	} else {
		throw new Error( `element or/and className is/are not valid.` );
	}
}
/**
 * Toggle classname from element and request a frame before toggling it
 * @param {HTMLElement} element
 * @param {String} className
 * @param {Boolean} [window.requestAnimationFrame]
 * @returns {Boolean}
 */
function toggleClass( element, className, requireFrame ) {
	requireFrame = requireFrame || false;
	if ( element && !!className && typeof className === 'string' ) {
		const boolean = hasClass( element, className );
		if ( typeof boolean === 'boolean' ) {
			if ( boolean ) {
				return !removeClass( element, className, requireFrame );
			} else {
				return addClass( element, className, requireFrame );
			}
		}
	} else {
		throw new Error( `element or/and className is/are not valid.` );
	}
}
/**
 * Get or set attribute of Element
 * @param {HTMLElement} element
 * @param {String} attrName
 * @param {Any} [value]
 * @returns {String}
 */
function attr( element, attrName, value ) {
	if ( value === 0 ? true : !!value ) {
		return element.setAttribute( attrName, value );
	}
	return element.getAttribute( attrName );
}
function data() {
	const [element, dataset, value] = arguments;
	if ( !!dataset && typeof dataset === 'string' ) {
		if ( value === 0 ? true : !!value ) {
			element.dataset[dataset] = value;
			return element.dataset[dataset];
		}
		return element.dataset[dataset];
	}
	return Object.assign( Object.create( null ), element.dataset );
}
/**
 *
 * @param {String} selector
 * @param {Number} duration
 */
function smoothScrollTo( event, selector, duration ) {
	inhibitEvent( event );
	const easing = Easing.easeInOutCubic;
	let target = document.querySelector( selector );
	if ( !( target instanceof HTMLElement ) ) return;
	let startPosition = window.pageYOffset;
	let targetPosition = startPosition + target.getBoundingClientRect().top;
	duration = duration || 1000;
	let distance = targetPosition - startPosition;
	let startTime = null;
	function animation( currentTime ) {
		startTime = !!startTime ? startTime : currentTime;
		let timeElapsed = currentTime - startTime;
		let run = easing( timeElapsed, startPosition, distance, duration );
		window.scrollTo( 0, run );
		if ( timeElapsed < duration ) {
			window.requestAnimationFrame( animation );
		}
	}
	window.requestAnimationFrame( animation );
}
function useInter( force = false ) {
	if ( force || ( window && 'navigator' in window &&
		!['MacIntel', 'iPhone', 'iPod', 'iPad'].includes(
			window.navigator.platform
		) )
	) {
		return addClass( document.body, 'inter', true );
	}
	return false;
}
/**
 * Element Creation Shorthand
 * @param {...({attr:{String:String},data:{String:String},events:[type:String,listener:Function,options:Boolean|AddEventListenerOptions][],id:String,ns:String,style:{String:String}t:String,_:(Any[]|Any)})}
 * @returns {HTLMElement}
 */
function ecs() {
	const l = [];
	let ll = arguments.length;
	if ( ll === 0 ) return document.createElement( 'div' );
	for ( let x = 0, n = ll; x < n; x += 1 ) {
		const y = arguments[x];
		if ( !!y ) { l[x] = y; }
		else { ll -= 1; }

	}
	if ( ll === 0 ) {
		return document.createElement( 'div' );
	}
	else if ( ll !== 1 ) {
		const a = document.createElement( 'div' );
		for ( const b of l ) {
			a.appendChild( ecs( b ) );
		}
		return a;
	}
	let e = l.pop();
	if ( e instanceof Element ) {
		return e;
	}
	const {
		actions: a,
		attr: t,
		class: c,
		data: d,
		_: h,
		events: v,
		id,
		ns: n,
		style: s,
		t: g
	} = e;
	if ( id || c || g ) {
		if ( !!n && typeof n === 'string' ) {
			e = document.createElementNS( n, !!g && typeof g === 'string' ? g : 'div' );
		}
		else e = document.createElement( !!g && typeof g === 'string' ? g : 'div' );
		if ( id ) {
			e.id = id;
		}
		if ( c ) {
			if ( typeof c === 'string' ) {
				e.classList.add( c );
			}
			else {
				e.classList.add( ...c );
			}
		}
	} else {
		e = document.createElement( 'div' );
	}
	if ( t ) {
		entries( t, function ( k, v ) {
			if ( v instanceof Promise ) {
				v.then( function ( r ) {
					attr( e, k, r );
				} );
			}
			else {
				attr( e, k, v );
			}
		} );
	}
	if ( d ) {
		entries( d, function ( k, v ) {
			if ( v instanceof Promise ) {
				v.then( function ( r ) {
					e.dataset[k] = r;
				} );
			}
			else {
				e.dataset[k] = v;
			}
		} );
	}
	if ( v ) {
		for ( const ev of v ) {
			e.addEventListener( ...ev );
		}
	}
	if ( s ) {
		entries( s, function ( k, v ) {
			e.style[k] = v;
		} );
	}
	if ( h ) {
		for ( const i of ( !( typeof h === 'string' ) && Symbol.iterator in h ? h : [h] ) ) {
			if ( i instanceof Element ) {
				e.appendChild( i );
			} else if ( typeof i === 'string' ) {
				e.innerHTML += i;
			} else if ( i instanceof Promise ) {
				const a = document.createElement( 'template' );
				e.appendChild( a );
				i.then( function ( r ) {
					if ( typeof r === 'string' ) {
						a.outerHTML += r;
						a.remove();
					} else {
						e.replaceChild( ecs( r ), a );
					}
				} ).catch( function ( _ ) {
					console.error( 'ecs error: ', _ );
				} );
			} else if (
				['number', 'bigint', 'boolean', 'symbol'].includes( typeof i )
			) {
				e.innerHTML += `${i}`;
			} else {
				e.appendChild( ecs( i ) );
			}
		}
	}
	if ( a ) {
		entries( a, function ( k, v ) {
			const a = k.split( /\_\$/ );
			if ( a.length > 1 ) {
				e[a[0]]( ...v );
			}
			else {
				e[k]( ...v );
			}
		} );
	}
	return e;
}
/**
 * Execute ecs in an inline script an replace script by ecs' result
 * @param {...({attr:{String:String},data:{String:String},events:[type:String,listener:Function,options:Boolean|AddEventListenerOptions][],id:String,ns:String,style:{String:String}t:String,_:(Any[]|Any)})}
 */
function ecsr() {
	const { currentScript: c } = document;
	const { parentElement: p } = c;
	if ( ![document.head, document.documentElement].includes( p ) ) {
		p.replaceChild( ecs( ...arguments ), c );
	}
}
class WebPTest {
	constructor () { }
	static get data() {
		return [
			[
				'lossy',
				'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA'
			],
			['lossless', 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA=='],
			[
				'alpha',
				'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA=='
			],
			[
				'animation',
				'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA'
			]
		];
	}
	static save( features ) {
		return new Promise( function ( resolve ) {
			const gl = getGlobal();
			gl.WebPTestResult = features.reduce( function ( acc, [feature, bool] ) {
				if ( !( feature in acc ) ) {
					acc[feature] = bool;
					return acc;
				}
			}, Object.create( null ) );
			return resolve( gl.WebPTestResult );
		} );
	}
	static imageLoading( data, feature ) {
		return new Promise( function ( resolve ) {
			const img = new Image();
			img.onload = function () {
				resolve( [feature, img.width > 0 && img.height > 0] );
			};
			img.onerror = function () {
				resolve( [feature, false] );
			};
			img.src = data;
		} );
	}
	static test() {
		const gl = getGlobal();
		return new Promise( function ( resolve ) {
			if ( 'WebPTestResult' in gl ) {
				resolve( gl.WebPTestResult );
			} else {
				Promise.all(
					WebPTest.data.map( function ( [feature, data] ) {
						return WebPTest.imageLoading(
							`data:image/webp;base64,${data}`,
							feature
						);
					} )
				).then( function ( response ) {
					resolve( WebPTest.save( response ) );
				} );
			}
		} );
	}
	static get passed() {
		const gl = getGlobal();
		let wtr;
		return new Promise( async function ( resolve ) {
			if ( 'WebPTestResult' in gl ) {
				wtr = gl.WebPTestResult;
			} else {
				wtr = await WebPTest.test();
			}
			resolve( wtr.lossy && wtr.lossless && wtr.alpha && wtr.animation );
		} );
	}
}
class Cookies {
	constructor () { }
	static get( string ) {
		return new Map(
			decodeURIComponent( document.cookie )
				.split( /;/ )
				.map( function ( string ) {
					return string.trim().split( /=/ );
				} )
		).get( string );
	}
	static has( string ) {
		return new Map(
			decodeURIComponent( document.cookie )
				.split( /;/ )
				.map( function ( string ) {
					return string.trim().split( /=/ );
				} )
		).has( string );
	}
	static set( cookieName, cookieValue, options ) {
		options = options && typeof options === 'object' ? options : Object.create( null );
		let { expiration, sameSite } = options;
		if ( !( !!expiration ) ) {
			const newDate = new Date();
			const year = 365.244 * 24 * 3600 * 1000;
			newDate.setTime( newDate.getTime() + year );
			expiration = newDate.toGMTString();
		}
		const expirationString = `expires=${expiration}`;
		const sameSiteString = `SameSite=${sameSite || 'Strict'};Secure`;
		document.cookie = `${cookieName}=${encodeURIComponent(
			cookieValue
		)};path=/;${expirationString};${sameSiteString}`;
	}
	static delete( cookieName ) {
		const newDate = new Date();
		const year = 365.244 * 24 * 3600 * 1000;
		newDate.setTime( newDate.getTime() - year );
		const expirationString = `expires=${newDate.toGMTString()}`;
		document.cookie = `${cookieName}=${''};${expirationString};`;
	}
}
class Easing {
	constructor () { }
	static linearTween( t, b, c, d ) {
		return ( c * t ) / d + b;
	}
	static easeInQuad( t, b, c, d ) {
		t /= d;
		return c * t * t + b;
	}
	static easeOutQuad( t, b, c, d ) {
		t /= d;
		return -c * t * ( t - 2 ) + b;
	}
	static easeInOutQuad( t, b, c, d ) {
		t /= d / 2;
		if ( t < 1 ) {
			return ( c / 2 ) * t * t + b;
		}
		t--;
		return ( -c / 2 ) * ( t * ( t - 2 ) - 1 ) + b;
	}
	static easeInCubic( t, b, c, d ) {
		t /= d;
		return c * t * t * t + b;
	}
	static easeOutCubic( t, b, c, d ) {
		t /= d;
		t--;
		return c * ( t * t * t + 1 ) + b;
	}
	static easeInOutCubic( t, b, c, d ) {
		t /= d / 2;
		if ( t < 1 ) {
			return ( c / 2 ) * t * t * t + b;
		}
		t -= 2;
		return ( c / 2 ) * ( t * t * t + 2 ) + b;
	}
	static easeInQuart( t, b, c, d ) {
		t /= d;
		return c * t * t * t * t + b;
	}
	static easeOutQuart( t, b, c, d ) {
		t /= d;
		t--;
		return -c * ( t * t * t * t - 1 ) + b;
	}
	static easeInOutQuart( t, b, c, d ) {
		t /= d / 2;
		if ( t < 1 ) {
			return ( c / 2 ) * t * t * t * t + b;
		}
		t -= 2;
		return ( -c / 2 ) * ( t * t * t * t - 2 ) + b;
	}
	static easeInQuint( t, b, c, d ) {
		t /= d;
		return c * t * t * t * t * t + b;
	}
	static easeOutQuint( t, b, c, d ) {
		t /= d;
		t--;
		return c * ( t * t * t * t * t + 1 ) + b;
	}
	static easeInOutQuint( t, b, c, d ) {
		t /= d / 2;
		if ( t < 1 ) {
			return ( c / 2 ) * t * t * t * t * t + b;
		}
		t -= 2;
		return ( c / 2 ) * ( t * t * t * t * t + 2 ) + b;
	}
	static easeInSine( t, b, c, d ) {
		return -c * Math.cos( ( t / d ) * ( Math.PI / 2 ) ) + c + b;
	}
	static easeOutSine( t, b, c, d ) {
		return c * Math.sin( ( t / d ) * ( Math.PI / 2 ) ) + b;
	}
	static easeInOutSine( t, b, c, d ) {
		return ( -c / 2 ) * ( Math.cos( ( Math.PI * t ) / d ) - 1 ) + b;
	}
	static easeInExpo( t, b, c, d ) {
		return c * Math.pow( 2, 10 * ( t / d - 1 ) ) + b;
	}
	static easeOutExpo( t, b, c, d ) {
		return c * ( -Math.pow( 2, ( -10 * t ) / d ) + 1 ) + b;
	}
	static easeInOutExpo( t, b, c, d ) {
		t /= d / 2;
		if ( t < 1 ) {
			return ( c / 2 ) * Math.pow( 2, 10 * ( t - 1 ) ) + b;
		}
		t--;
		return ( c / 2 ) * ( -Math.pow( 2, -10 * t ) + 2 ) + b;
	}
	static easeInCirc( t, b, c, d ) {
		t /= d;
		return -c * ( Math.sqrt( 1 - t * t ) - 1 ) + b;
	}
	static easeOutCirc( t, b, c, d ) {
		t /= d;
		t--;
		return c * Math.sqrt( 1 - t * t ) + b;
	}
	static easeInOutCirc( t, b, c, d ) {
		t /= d / 2;
		if ( t < 1 ) {
			return ( -c / 2 ) * ( Math.sqrt( 1 - t * t ) - 1 ) + b;
		}
		t -= 2;
		return ( c / 2 ) * ( Math.sqrt( 1 - t * t ) + 1 ) + b;
	}
}
class Wait {
	constructor () { }
	static register() {
		const gl = getGlobal();
		if ( 'WaitRegister' in gl ) {
			return gl.WaitRegister;
		} else {
			try {
				const wr = Object.assign( Object.create( null ), {
					interactive: [],
					complete: [],
					DOMContentLoaded: [],
					load: []
				} );
				gl.WaitRegister = wr;
				document.addEventListener( 'readystatechange', function () {
					Wait.all( document.readyState );
				} );
				document.addEventListener( 'DOMContentLoaded', function () {
					Wait.all( 'DOMContentLoaded' );
				} );
				window.addEventListener( 'load', function () {
					Wait.all( 'load' );
				} );
				return gl.WaitRegister;
			} catch ( _ ) {
				throw _;
			}
		}
	}
	static set( type, options ) {
		const { resolve, reject, func, args } = options;
		try {
			const wr = Wait.register();
			let exec = false;
			const { readyState } = document;
			switch ( type ) {
				case 'interactive':
				case 'DOMContentLoaded': {
					if ( readyState !== 'loading' ) {
						exec = true;
						try {
							resolve( func( ...args ) );
						}
						catch ( _ ) {
							reject( _ );
						}
					}
					break;
				}
				case 'complete':
				case 'load': {
					if ( readyState === 'complete' ) {
						exec = true;
						try {
							resolve( func( ...args ) );
						}
						catch ( _ ) {
							reject( _ );
						}
					}
					break;
				}
			}
			if ( exec === false ) {
				wr[type].push( function () {
					return new Promise( function ( res, rej ) {
						try {
							return res( resolve( func( ...args ) ) );
						}
						catch ( _ ) {
							rej( reject( _ ) );
						}
					} );
				} );
			}
		} catch ( _ ) {
			throw _;
		}
	}
	static all( type ) {
		return Promise.all( Wait.register()[type].map( function ( e ) {
			return e();
		} ) );
	}
	static time( time ) {
		return new Promise( function ( resolve ) {
			return setTimeout( resolve, time );
		} );
	}
	static race() {
		return Promise.race( ...arguments );
	}
	static delay() {
		const [func, timeout, ...args] = arguments;
		return setTimeout( func, timeout || 0, ...args );
	}
	static async() {
		const [func, ...args] = arguments;
		return new Promise( function ( resolve, reject ) {
			try {
				return resolve( func( ...args ) );
			} catch ( _ ) {
				return reject( _ );
			}
		} );
	}
	static promiseDelay() {
		const [func, timeout, ...args] = arguments;
		return new Promise( function ( resolve, reject ) {
			return setTimeout( function ( ...args ) {
				try {
					return resolve( func( ...args ) );
				}
				catch ( _ ) {
					return reject( _ );
				}
			}, timeout, ...args );
		} );
	}
	static whileLoading() {
		if ( document.readyState === 'loading' ) {
			return func( ...arguments );
		}
	}
	static interactive() {
		const [func, ...args] = arguments;
		const options = Object.create( null );
		return new Promise( function ( resolve, reject ) {
			options.resolve = resolve;
			options.reject = reject;
			options.func = func;
			options.args = args;
			Wait.set( 'interactive', options );
		} );
	}
	static complete() {
		const [func, ...args] = arguments;
		const options = Object.create( null );
		return new Promise( function ( resolve, reject ) {
			options.resolve = resolve;
			options.reject = reject;
			options.func = func;
			options.args = args;
			Wait.set( 'complete', options );
		} );
	}
	static DOMContentLoaded() {
		const [func, ...args] = arguments;
		const options = Object.create( null );
		return new Promise( function ( resolve, reject ) {
			options.resolve = resolve;
			options.reject = reject;
			options.func = func;
			options.args = args;
			Wait.set( 'DOMContentLoaded', options );
		} );
	}
	static ready() {
		const [func, ...args] = arguments;
		const options = Object.create( null );
		return new Promise( function ( resolve, reject ) {
			options.resolve = resolve;
			options.reject = reject;
			options.func = func;
			options.args = args;
			Wait.set( 'complete', options );
		} );
	}
	static load() {
		const [func, ...args] = arguments;
		const options = Object.create( null );
		return new Promise( function ( resolve, reject ) {
			options.resolve = resolve;
			options.reject = reject;
			options.func = func;
			options.args = args;
			Wait.set( 'complete', options );
		} );
	}
}
class ExtendedWorker {
	constructor ( WorkerObject, WorkerOptions ) {
		if ( typeof WorkerObject === 'function' ) {
			WorkerObject = ExtendedWorker.prepareFromFunction( WorkerObject );
		}
		this.worker = new Worker( WorkerObject, WorkerOptions );
		if (
			WorkerOptions &&
			'promise' in WorkerOptions &&
			WorkerOptions.promise === true
		) {
			this.worker.promise = true;
			ExtendedWorker.assert();
			this.worker.onmessage = ExtendedWorker.onMessage;
		} else {
			this.worker.promise = false;
		}
	}
	static get global() {
		return getGlobal();
	}
	static prepareFromString( WorkerString ) {
		if ( typeof WorkerString === 'string' ) {
			const WorkerBody = '(' + WorkerString + ')()';
			const WorkerBlob = new Blob( [WorkerBody], {
				type: 'text/javascript'
			} );
			return URL.createObjectURL( WorkerBlob );
		}
		throw new Error( `WorkerString:${WorkerString} is not a string.` );
	}
	static prepareFromFunction( WorkerFunction ) {
		if ( typeof WorkerFunction === 'function' ) {
			return ExtendedWorker.prepareFromString( WorkerFunction.toString() );
		}
		throw new Error( `WorkerFunction:${WorkerFunction} is not a function.` );
	}
	static createFromString( WorkerString, WorkerOptions ) {
		if ( typeof WorkerString === 'string' ) {
			const WorkerBody = '(' + WorkerString + ')()';
			const WorkerBlob = new Blob( [WorkerBody], {
				type: 'text/javascript'
			} );
			return new ExtendedWorker(
				URL.createObjectURL( WorkerBlob ),
				WorkerOptions
			);
		}
		throw new Error( `WorkerString:${WorkerString} is not a string.` );
	}
	static createFromFunction( WorkerFunction, WorkerOptions ) {
		if ( typeof WorkerFunction === 'function' ) {
			return ExtendedWorker.createFromString(
				WorkerFunction.toString(),
				WorkerOptions
			);
		}
		throw new Error( `WorkerFunction:${WorkerFunction} is not a function.` );
	}
	get env() {
		return ExtendedWorker.global.ExtendedWorkers;
	}
	set onmessage( func ) {
		this.worker.onmessage = func;
	}
	get onmessage() {
		return this.worker.onmessage;
	}
	set onerror( func ) {
		this.worker.onerror = func;
	}
	get onerror() {
		return this.worker.onerror;
	}
	set onmessageerror( func ) {
		this.worker.onmessageerror = func;
	}
	get onmessageerror() {
		return this.worker.onmessageerror;
	}
	dispatchEvent() {
		return this.worker.dispatchEvent( ...arguments );
	}
	addEventListener() {
		return this.worker.addEventListener( ...arguments );
	}
	removeEventListener() {
		return this.worker.removeEventListener( ...arguments );
	}
	terminate() {
		return this.worker.terminate();
	}
	postMessage( data, transferableObject ) {
		return ExtendedWorker.postMessage(
			[data, transferableObject],
			this.worker
		);
	}
	static assert() {
		const self = ExtendedWorker.global;
		if ( !( 'ExtendedWorkers' in self ) ) {
			self.ExtendedWorkers = Object.assign( Object.create( null ), {
				resolves: [],
				rejects: []
			} );
		} else if (
			!(
				'resolves' in self.ExtendedWorkers &&
				'rejects' in self.ExtendedWorkers
			)
		) {
			self.ExtendedWorkers.resolves = [];
			self.ExtendedWorkers.rejecs = [];
		}
	}
	static postMessage( messagePayload, worker ) {
		if ( worker.promise ) {
			const messageId = identifier();
			const [data, transferableObject] = messagePayload;
			const message = Object.assign( Object.create( null ), {
				id: messageId,
				data: data
			} );
			return new Promise( function ( resolve, reject ) {
				ExtendedWorker.resolves[messageId] = resolve;
				ExtendedWorker.rejects[messageId] = reject;
				if ( !!transferableObject ) {
					worker.postMessage( message, transferableObject );
				} else {
					worker.postMessage( message );
				}
			} );
		} else {
			worker.postMessage( ...messagePayload );
		}
	}
	static onMessage( message ) {
		const { id, err, data } = message.data;
		const resolve = ExtendedWorker.resolves[id];
		const reject = ExtendedWorker.rejects[id];
		if ( data ) {
			if ( resolve ) {
				resolve( data );
			}
		} else if ( reject ) {
			if ( err ) {
				reject( err );
			} else {
				reject( 'Got nothing' );
			}
		}
		ExtendedWorker.delete( id );
	}
	static get resolves() {
		ExtendedWorker.assert();
		return ExtendedWorker.global.ExtendedWorkers.resolves;
	}
	static get rejects() {
		ExtendedWorker.assert();
		return ExtendedWorker.global.ExtendedWorkers.rejects;
	}
	static delete( id ) {
		delete ExtendedWorker.resolves[id];
		delete ExtendedWorker.rejects[id];
	}
}
class Compare {
	constructor () {
		Compare.attachEvent( document.getElementsByClassName( 'page-header' )[0] );
	}
	static init() {
		if ( document.getElementsByClassName( 'js-compare' ).length > 0 ) {
			new Compare();
		}
	}
	static attachEvent( element ) {
		if ( element instanceof HTMLElement ) {
			element.addEventListener(
				'mousemove',
				function (event) {
					window.requestAnimationFrame( function() {
						element.getElementsByClassName(
							'js-compare-layer'
						)[0].style.width = `${event.clientX}px`;
					} );
				},
				{ passive: true }
			);
			element.addEventListener(
				'touchmove',
				function (event) {
					Wait.delay( function () {
						window.requestAnimationFrame( function () {
							if ( event.touches.length > 0 ) {
								element.getElementsByClassName(
									'js-compare-layer'
								)[0].style.width = `${event.touches[0].clientX}px`;
							}
						} );
					} );
				},
				{ passive: true }
			);
		}
	}
}
class ImageLoader {
	constructor () {
		this.worker = new ExtendedWorker(
			function () {
				self.onmessage = function (event) {
					url( event.data.data.url, event.data.id ).then(
						function ( [id, result] ) {
							self.postMessage( {
								id: id,
								data: { url: result || '' }
							} );
						}
					);
				};
				function url( url, id ) {
					return new Promise( async function ( resolve, reject ) {
						fetch( url, {
							method: 'GET',
							mode: 'cors',
							credentials: 'include',
							cache: 'default'
						} ).then( async function (response) {
							if ( response.status === 200 ) {
								const blob = await response.blob();
								try {
									resolve( [id, URL.createObjectURL( blob )] );
								} catch ( _ ) {
									reject( [id, ''] );
								}
							}
						} );
					} );
				}
			},
			{ promise: true }
		);
	}
	async load( options ) {
		options = options || Object.create( null );
		const { url, webpURL } = options;
		let res;
		if ( !!webpURL && typeof webpURL === 'string' ) {
			const _ = await WebPTest.passed;
			if ( _ ) {
				res = ( await this.worker.postMessage( { url: webpURL } ) ).url;
			} else {
				res = ( await this.worker.postMessage( { url: url } ) ).url;
			}
		} else {
			res = ( await this.worker.postMessage( { url: url } ) ).url;
		}
		return res;
	}
	static async load( url, webpURL ) {
		const gl = getGlobal();
		if ( !( 'ImageLoader' in gl ) ) {
			gl.ImageLoader = new ImageLoader();
		}
		return await gl.ImageLoader.load( url, webpURL );
	}
	terminate() {
		this.worker.terminate();
	}
	static terminate() {
		const gl = getGlobal();
		if ( 'ImageLoader' in gl ) {
			gl.ImageLoader.terminate();
			delete gl.ImageLoader;
		}
	}
}

class MarkdownParser {
	constructor () {
		this.worker = new ExtendedWorker(
			function () {
				importScripts(
					'https://2020.igem.org/wiki/index.php?title=Template:Evry_Paris-Saclay/marked&action=raw&ctype=text/javascript'
				);
				self.onmessage = function (event) {
					self.postMessage( {
						id: event.data.id,
						data: { data: marked( event.data.data ) }
					} );
				};
			},
			{ promise: true }
		);
	}
	async parse( text ) {
		return ( await this.worker.postMessage( text ) ).data;
	}
	terminate() {
		this.worker.terminate();
	}
	static terminate() {
		const gl = getGlobal();
		if ( 'MarkdownParser' in gl ) {
			gl.MarkdownParser.terminate();
			delete gl.MarkdownParser;
		}
	}
}
class SocialIcon {
	constructor () { }
	static get resources() {
		return {
			facebook: {
				test: /^((https?\:)?\/\/(www\.)?facebook\.com\/)/,
				code: {
					t: 'svg',
					class: 'site-icon-svg',
					ns: 'http://www.w3.org/2000/svg',
					attr: {
						'clip-rule': 'evenodd',
						'fill-rule': 'evenodd',
						'stroke-linejoin': 'round',
						'stroke-miterlimit': '2',
						viewBox: '0 0 1355 1355',
						xmlns: 'http://www.w3.org/2000/svg'
					},
					_: {
						t: 'path',
						ns: 'http://www.w3.org/2000/svg',
						attr: {
							d:
								'm1024 512c0-282.77-229.23-512-512-512s-512 229.23-512 512c0 255.554 187.231 467.37 432 505.78v-357.78h-130v-148h130v-112.8c0-128.32 76.438-199.2 193.39-199.2 56.017 0 114.61 10 114.61 10v126h-64.562c-63.603 0-83.438 39.467-83.438 79.957v96.043h142l-22.7 148h-119.3v357.78c244.769-38.41 432-250.226 432-505.78z',
							fill: '#fff',
							'fill-rule': 'nonzero',
							transform:
								'matrix(.868457 0 0 .868457 232.433 235.134)'
						}
					}
				}
			},
			instagram: {
				test: /^((https?\:)?\/\/(www\.)?instagram\.com\/)/,
				code: {
					t: 'svg',
					class: 'site-icon-svg',
					ns: 'http://www.w3.org/2000/svg',
					attr: {
						'clip-rule': 'evenodd',
						'fill-rule': 'evenodd',
						'stroke-linejoin': 'round',
						'stroke-miterlimit': '2',
						viewBox: '0 0 1355 1355',
						xmlns: 'http://www.w3.org/2000/svg'
					},
					_: {
						t: 'g',
						ns: 'http://www.w3.org/2000/svg',
						attr: {
							fill: '#fff',
							'fill-rule': 'nonzero',
							transform:
								'matrix(1.68024 0 0 1.68024 253.796 253.529)'
						},
						_: [
							{
								t: 'path',
								ns: 'http://www.w3.org/2000/svg',
								attr: {
									d:
										'm251.921.159c-68.418 0-76.997.29-103.867 1.516-26.814 1.224-45.127 5.482-61.152 11.71-16.566 6.438-30.615 15.052-44.62 29.057s-22.619 28.054-29.057 44.62c-6.228 16.024-10.486 34.337-11.71 61.151-1.226 26.87-1.515 35.449-1.515 103.867 0 68.417.289 76.996 1.515 103.866 1.224 26.814 5.482 45.127 11.71 61.151 6.438 16.566 15.052 30.615 29.057 44.621 14.005 14.005 28.054 22.619 44.62 29.057 16.025 6.227 34.338 10.486 61.152 11.709 26.87 1.226 35.449 1.516 103.867 1.516 68.417 0 76.996-.29 103.866-1.516 26.814-1.223 45.127-5.482 61.151-11.709 16.566-6.438 30.615-15.052 44.621-29.057 14.005-14.006 22.619-28.055 29.057-44.621 6.227-16.024 10.486-34.337 11.709-61.151 1.226-26.87 1.516-35.449 1.516-103.866 0-68.418-.29-76.997-1.516-103.867-1.223-26.814-5.482-45.127-11.709-61.151-6.438-16.566-15.052-30.615-29.057-44.62-14.006-14.005-28.055-22.619-44.621-29.057-16.024-6.228-34.337-10.486-61.151-11.71-26.87-1.226-35.449-1.516-103.866-1.516zm0 45.392c67.265 0 75.233.256 101.797 1.468 24.562 1.121 37.901 5.225 46.778 8.674 11.759 4.57 20.151 10.03 28.966 18.845 8.816 8.815 14.275 17.208 18.845 28.966 3.45 8.877 7.554 22.216 8.674 46.778 1.212 26.564 1.469 34.532 1.469 101.798 0 67.265-.257 75.233-1.469 101.797-1.12 24.562-5.224 37.901-8.674 46.778-4.57 11.759-10.029 20.151-18.845 28.966-8.815 8.816-17.207 14.275-28.966 18.845-8.877 3.45-22.216 7.554-46.778 8.674-26.56 1.212-34.527 1.469-101.797 1.469-67.271 0-75.237-.257-101.798-1.469-24.562-1.12-37.901-5.224-46.778-8.674-11.759-4.57-20.151-10.029-28.967-18.845-8.815-8.815-14.275-17.207-18.844-28.966-3.45-8.877-7.554-22.216-8.675-46.778-1.212-26.564-1.468-34.532-1.468-101.797 0-67.266.256-75.234 1.468-101.798 1.121-24.562 5.225-37.901 8.675-46.778 4.569-11.758 10.029-20.151 18.844-28.966 8.816-8.815 17.208-14.275 28.967-18.845 8.877-3.449 22.216-7.553 46.778-8.674 26.564-1.212 34.532-1.468 101.798-1.468z'
								}
							},
							{
								t: 'path',
								ns: 'http://www.w3.org/2000/svg',
								attr: {
									d:
										'm251.921 336.053c-46.378 0-83.974-37.596-83.974-83.973 0-46.378 37.596-83.974 83.974-83.974 46.377 0 83.973 37.596 83.973 83.974 0 46.377-37.596 83.973-83.973 83.973zm0-213.338c-71.447 0-129.365 57.918-129.365 129.365 0 71.446 57.918 129.364 129.365 129.364 71.446 0 129.364-57.918 129.364-129.364 0-71.447-57.918-129.365-129.364-129.365z'
								}
							},
							{
								t: 'path',
								ns: 'http://www.w3.org/2000/svg',
								attr: {
									d:
										'm416.627 117.604c0 16.696-13.535 30.23-30.231 30.23-16.695 0-30.23-13.534-30.23-30.23s13.535-30.23 30.23-30.23c16.696 0 30.231 13.534 30.231 30.23z'
								}
							}
						]
					}
				}
			},
			linkedin: {
				test: /^((https?\:)?\/\/(www\.)?linkedin\.com\/)/,
				code: {
					t: 'svg',
					class: 'site-icon-svg',
					ns: 'http://www.w3.org/2000/svg',
					attr: {
						'clip-rule': 'evenodd',
						'fill-rule': 'evenodd',
						'stroke-linejoin': 'round',
						'stroke-miterlimit': '2',
						viewBox: '0 0 1355 1355',
						xmlns: 'http://www.w3.org/2000/svg'
					},
					_: {
						t: 'path',
						ns: 'http://www.w3.org/2000/svg',
						attr: {
							d:
								'm0 4.01c0-2.2 1.81-4.01 4.01-4.01h39.98c2.2 0 4.01 1.81 4.01 4.01v39.98c0 2.2-1.81 4.01-4.01 4.01h-39.98c-2.2 0-4.01-1.81-4.01-4.01v-39.98zm19 14.29h6.5v3.266c.937-1.878 3.338-3.566 6.945-3.566 6.914 0 8.555 3.738 8.555 10.597v12.703h-7v-11.141c0-3.906-.937-6.109-3.32-6.109-3.305 0-4.68 2.375-4.68 6.109v11.141h-7zm-12 22.7h7v-23h-7zm8-30.5c0 2.469-2.031 4.5-4.5 4.5s-4.5-2.031-4.5-4.5 2.031-4.5 4.5-4.5 4.5 2.031 4.5 4.5z',
							fill: '#fff',
							transform:
								'matrix(17.637 0 0 17.637 253.796 253.796)'
						}
					}
				}
			},
			twitter: {
				test: /^((https?\:)?\/\/(www\.)?twitter\.com\/)/,
				code: {
					t: 'svg',
					class: 'site-icon-svg',
					ns: 'http://www.w3.org/2000/svg',
					attr: {
						'clip-rule': 'evenodd',
						'fill-rule': 'evenodd',
						'stroke-linejoin': 'round',
						'stroke-miterlimit': '2',
						viewBox: '0 0 1355 1355',
						xmlns: 'http://www.w3.org/2000/svg'
					},
					_: {
						t: 'path',
						ns: 'http://www.w3.org/2000/svg',
						attr: {
							d:
								'm153.623 301.589c94.344 0 145.936-78.161 145.936-145.936 0-2.221-.045-4.432-.147-6.631 10.014-7.239 18.72-16.272 25.588-26.557-9.191 4.082-19.081 6.834-29.456 8.074 10.59-6.348 18.72-16.396 22.554-28.372-9.912 5.875-20.885 10.148-32.568 12.449-9.359-9.969-22.689-16.204-37.439-16.204-28.328 0-51.299 22.97-51.299 51.287 0 4.026.451 7.939 1.33 11.695-42.627-2.143-80.427-22.554-105.722-53.589-4.409 7.578-6.947 16.386-6.947 25.779 0 17.796 9.056 33.505 22.825 42.695-8.413-.259-16.318-2.571-23.231-6.417-.011.214-.011.429-.011.654 0 24.844 17.683 45.582 41.15 50.285-4.307 1.172-8.841 1.804-13.521 1.804-3.304 0-6.518-.327-9.642-.925 6.53 20.378 25.464 35.207 47.916 35.625-17.558 13.757-39.672 21.955-63.704 21.955-4.139 0-8.221-.236-12.235-.71 22.7 14.547 49.653 23.039 78.623 23.039z',
							fill: '#fff',
							'fill-rule': 'nonzero',
							transform:
								'matrix(4.16667 0 0 4.16667 -156.25 -156.252)'
						}
					}
				}
			}
		};
	}
	static get( url ) {
		if ( !( url && typeof url === 'string' ) ) {
			return;
		}
		return new Promise( function ( resolve, reject ) {
			entries( SocialIcon.resources, function ( key, value ) {
				const { test } = value;
				if ( test.test( url ) ) {
					resolve( value );
				}
			} );
			reject( new Error( `${url} did not match any known social icon.` ) );
		} );
	}
	static getLink( url ) {
		if ( !( url && typeof url === 'string' ) ) {
			return;
		}
		return new Promise( function ( resolve, reject ) {
			SocialIcon.get( url )
				.then( function ( { code } ) {
					resolve( {
						t: 'a',
						class: 'site-icon',
						attr: { href: url, target: '_blank' },
						_: code
					} );
				} )
				.catch( function ( error ) {
					return reject( error );
				} );
		} );
	}
}
class Team {
	constructor () { }

	/** @returns {ImageLoader} */
	static get loader() {
		const gl = getGlobal();
		if ( !( 'ImageLoader' in gl ) ) {
			gl.ImageLoader = new ImageLoader();
		}
		return gl.ImageLoader;
	}

	/** @returns {HTMLTemplateElement} */
	static getTemplate() {
		return document.getElementById( 'team-constructor' );
	}

	static processMember( element, id ) {
		const { name, role, img } = data( element );

		const load = Team.loader.load( { url: img } );

		const studiesTag = element.querySelector( 'studies' );
		const factTag = element.querySelector( 'fact' );
		
		const childs = [];

		if ( studiesTag ) {
			childs.push( {
				t: 'span',
				class: 'team-advisor-studies',
				_: `<b>Studies</b> : ${studiesTag.innerHTML}`
			} );
		}
		
		if ( factTag ) {
			childs.push( {
				t: 'span',
				class: 'team-advisor-fact',
				_: `<b>Fact</b> : ${factTag.innerHTML}`
			} );
		}
		return {
			cell: {
				class: ['team-member', 'team-member-cell'],
				_: [
					{
						t: 'picture',
						_: {
							t: 'img',
							class: 'team-member-image',
							attr: {
								src: load,
								alt: `Team Member Picture - ${name}`
							}
						}
					},
					{
						class: 'team-member-info', _: [
							{
								t: 'a',
								class: 'team-member-name',
								attr: { href: `#member-${id}` },
								_: `<strong>${name}</strong>`
							},
					]}
				]
			},
			row: {
				class: ['team-member', 'team-member-row'],
				id: `member-${id}`,
				_: [
					{
						t: 'picture',
						_: {
							t: 'img', class: 'team-member-image',
							attr: {
								src: load,
								alt: `Team Member Picture - ${name}`
							}
						}
					},
				{
					class: 'team-member-info',
					_: [
						{ t: 'span', class: ['team-member-name', 'h2'], _: name },
						{ t: 'span', class: 'team-member-role', _: `<b>Role</b> : ${role}` },
						...childs
				]}
			]
		}};
	}
	static processAdvisor( element, id ) {
		const { name, role, img } = data( element );
		const studiesTag = element.querySelector( 'studies' );
		const factTag = element.querySelector( 'fact' );

		const load = Team.loader.load( { url: img } );
		
		const childs = [];

		if ( studiesTag ) {
			childs.push( {
				t: 'span',
				class: 'team-advisor-studies',
				_: `<b>Studies</b> : ${studiesTag.innerHTML}`
			} );
		}
		
		if ( factTag ) {
			childs.push( {
				t: 'span',
				class: 'team-advisor-fact',
				_: `<b>Fact</b> : ${factTag.innerHTML}`
			} );
		}

		return {
			cell: {
				class: ['team-advisor', 'team-advisor-cell'],
				_: [
					{
						t: 'picture',
						_: {
							t: 'img',
							class: ['team-advisor-image'],
							attr: {
								src: load,
								alt: `Team advisor Picture - ${name}`
							}
						}
					},
					{
						class: ['team-advisor-info'],
						_: [
							{
								t: 'a',
								class: ['team-advisor-name'],
								attr: { href: `#advisor-${id}` },
								_: `<strong>${name}</strong>`
							},
					]}
				]
			},
			row: {
				class: ['team-advisor', 'team-advisor-row'],
				id: `advisor-${id}`, _: [
					{
						t: 'picture', _: {
							t: 'img',
							class: 'team-advisor-image',
							attr: {
								src: load,
								alt: `Team advisor Picture - ${name}`
							}
						}
					},
				{
					class: 'team-advisor-info',
					_: [
						{
							t: 'span',
							class: ['team-advisor-name', 'h2'],
							_: name
						},
						{
							t: 'span',
							class: 'team-advisor-role',
							_: `<b>Role</b> : ${role}`
						},
						...childs
					]
				}
			]
		}};
	}

	static render() {
		const template = Team.getTemplate();

		if ( !template ) {
			return { element: null, target: null };
		}

		const target = data( template, 'target' );
		const fragment = template.content;

		const members = [...fragment.querySelectorAll( 'member' )].map( ( member, index ) => Team.processMember( member, index + 1 ) );

		const advisors = [...fragment.querySelectorAll( 'advisor' )].map( ( advisor, index ) => Team.processAdvisor( advisor, index + 1 ) );
		
		const memberGrid = [];
		const memberRows = [];
		const advisorGrid = [];
		const advisorRows = [];

		for ( const member of members ) {
			memberGrid.push( member.cell );
			memberRows.push( member.row );
		}

		for ( const advisor of advisors ) {
			advisorGrid.push( advisor.cell );
			advisorRows.push( advisor.row );
		}

		const element = ecs( {
			id: 'team',
			class: 'team-global',
			_: [
				{
					class: 'team-grid', _: [
						{ t: 'span', class:['h2','team-type'], _: 'Team Members' },
						{ class: 'team-member-grid', _: memberGrid },
						{ t: 'span', class:['h2','team-type'], _: 'Team Advisors' },
						{ class: 'team-advisors-grid', _: advisorGrid },
					]
				},
				{
					class: 'team-rows', _: [
						{ t: 'span', class: ['h2', 'team-type'], _: 'Team Members' },
						{ class: 'team-member-rows', _: memberRows },
						{ t: 'span', class: ['h2', 'team-type'], _: 'Team Advisors' },
						{ class: 'team-advisors-rows', _: advisorRows },
					]
				}
			]
		} );

		const targetElement = document.getElementById( target );
		targetElement.insertAdjacentElement( 'afterend', element );
		targetElement.remove();
		template.remove();

	}
}
class Header {
	constructor () { }

	/** @returns {ImageLoader} */
	static get loader() {
		const gl = getGlobal();
		if ( !( 'ImageLoader' in gl ) ) {
			gl.ImageLoader = new ImageLoader();
		}
		return gl.ImageLoader;
	}

	static getTemplate() {
		return document.getElementById( 'header-constructor' );
	}

	static async load( options ) {
		return await Header.loader.load( options );
	}

	static async heading( options ) {
		const { igem, rosewood } = options;

		return {
			class: 'site-heading',
			_: [
				{
					t: 'a',
					attr: {
						href: 'https://igem-evry.org',
						target: '_blank',
						rel: 'noreferrer noopener'
					},
					_: {
						t: 'img',
						id: 'site-logo',
						attr: {
							loading: 'lazy',
							decoding: 'async',
							src: Header.load( {
								url: data( igem, 'src' ),
								webpURL: data( igem, 'webp' )
							} ),
							alt: data( igem, 'alt' )
						},
						style: { visibility: 'hidden' },
						events: [
							[
								'load',
								function (event) {
									event.target.style.visibility = 'visible';
								}
							]
						]
					}
				},
				{
					t: 'a',
					attr: {
						href: 'https://2020.igem.org/Team:Evry_Paris-Saclay'
					},
					_: {
						t: 'img',
						id: 'site-title',
						attr: {
							loading: 'lazy',
							decoding: 'async',
							src: Header.load( {
								url: data( rosewood, 'src' ),
								webpURL: data( rosewood, 'webp' )
							} ),
							alt: data( rosewood, 'alt' )
						},
						style: { visibility: 'hidden' },
						events: [
							[
								'load',
								function (event) {
									event.target.style.visibility = 'visible';
								}
							]
						]
					}
				}
			]
		};
	}

	static async navigation( menu ) {
		return {
			t: 'nav',
			class: 'site-navigation',
			_: [
				{
					t: 'button',
					class: ['menu-opener', 'no-style', 'toggler'],
					data: {
						toggleTargetSelector: '.menu',
						toggleClassName: 'open',
						toggleEventType: 'click'
					},
					attr: { 'aria-label': 'Menu' },
					_: [
						{
							class: 'menu-opener-text',
							_: [
								{
									t: 'span',
									class: 'text-open',
									_: 'Close Menu'
								},
								{
									t: 'span',
									class: 'text-close',
									_: 'Open Menu'
								}
							]
						},
						{ class: 'menu-opener-icon' }
					]
				},
				{
					t: 'ul',
					class: 'menu',
					_: [...menu.children].map( child => ( {
						t: 'li',
						class: 'menu-item',
						_: [
							{
								t: 'a',
								attr: { href: data( child, 'href' ) },
								_: [data( child, 'text' )]
							},
							child.children.length > 0
								? {
									t: 'ul',
									class: 'sub-menu',
									_: [...child.children].map( c => ( {
										t: 'li',
										class: 'sub-menu-item',
										_: [
											{
												t: 'a',
												attr: {
													href: data( c, 'href' )
												},
												_: data( c, 'text' )
											}
										]
									} ) )
								}
								: null
						]
					} ) )
				}
			]
		};
	}

	static render() {
		const template = Header.getTemplate();
		const parent = template.parentElement;
		const fragment = template.content;

		const childPromises = [];

		childPromises.push(
			Header.heading( {
				igem: fragment.querySelector( 'img#tmp-site-logo' ),
				rosewood: fragment.querySelector( 'img#tmp-site-title' )
			} )
		);

		childPromises.push( Header.navigation( fragment.querySelector( 'menu' ) ) );

		const element = ecs( {
			t: 'header',
			id: 'site-header',
			class: 'site-header',
			_: childPromises
		} );

		return new Promise( function ( resolve, reject ) {
			Promise.all( childPromises ).then( function () {
				if ( resolve ) {
					resolve( Object.assign( Object.create( null ), { element, template, parent } ) );
				}
				if ( reject ) {
					reject();
				}
			} );
		} );
	}
}
class Page {
	constructor () { }

	/** @returns {MarkdownParser} */
	static get parser() {
		const gl = getGlobal();
		if ( !( 'MarkdownParser' in gl ) ) {
			gl.MarkdownParser = new MarkdownParser();
		}
		return gl.MarkdownParser;
	}

	static getTemplate() {
		return document.getElementById( 'page-constructor' );
	}

	static async marked( text ) {
		return await Page.parser.parse( text );
	}

	static async header( text, options = Object.create( null ) ) {
		const {
			compare = true,
			compareFirst = 'https://2020.igem.org/wiki/images/4/4a/T--Evry_Paris-Saclay--Banner-Alive_Rosewood-ML.jpg',
			compareFirstWebP = 'https://2020.igem.org/wiki/images/4/4a/T--Evry_Paris-Saclay--Banner-Alive_Rosewood-ML.jpg',
			compareFirstAlt = 'Page Header Background - First Layer',
			compareSecond = 'https://2020.igem.org/wiki/images/e/ed/T--Evry_Paris-Saclay--Banner-Dead_Rosewood-ML.jpg',
			compareSecondWebP = 'https://2020.igem.org/wiki/images/e/ed/T--Evry_Paris-Saclay--Banner-Dead_Rosewood-ML.jpg',
			compareSecondAlt = 'Page Header Background - Second Layer'
		} = options;

		const headerChilds = [];

		if ( text && typeof text === 'string' ) {
			headerChilds.push( {
				class: 'header-titling',
				_: [
					await Page.marked( text ),
					{
						t: 'a',
						class: ['js-header-scroller', 'scroller'],
						attr: { href: '#page-content' },
						_: '&darr;',
						events: [
							[
								'click',
								event => smoothScrollTo( event, '#page-content' )
							]
						]
					}
				]
			} );
		}

		if ( ['true', '1', true].includes( compare ) ) {
			headerChilds.push( {
				class: 'js-compare',
				_: [
					{
						class: 'js-compare-layers',
						_: [
							{
								class: [
									'js-compare-layer',
									'js-compare-layer-1'
								],
								_: {
									t: 'img',
									attr: {
										src: ImageLoader.load( {
											url: compareFirst
										} ),
										alt: compareFirstAlt,
										loading: 'lazy',
										decoding: 'async'
									},
									style: { visibility: 'hidden' },
									events: [
										[
											'load',
											function ( { target } ) {
												target.style.visibility =
													'visible';
											}
										]
									]
								}
							},
							{
								class: [
									'js-compare-layer',
									'js-compare-layer-2'
								],
								_: {
									t: 'img',
									attr: {
										src: ImageLoader.load( {
											url: compareSecond
										} ),
										alt: compareSecondAlt,
										loading: 'lazy',
										decoding: 'async'
									},
									style: { visibility: 'hidden' },
									events: [
										[
											'load',
											function ( { target } ) {
												target.style.visibility = 'visible';
											}
										]
									]
								}
							}
						]
					}
				]
			} );
		}

		return {
			id: 'page-header',
			class: 'page-header',
			_: headerChilds
		};
	}

	static async content( text, options = Object.create( null ) ) {
		const { } = options;

		const contentChilds = [];

		if ( text && typeof text === 'string' ) {
			contentChilds.push( {
				class: 'page-row',
				_: await Page.marked( text )
			} );
		}

		return {
			id: 'page-content',
			class: 'page-content',
			_: contentChilds
		};
	}

	static async footer( text, options = Object.create( null ) ) {
		const { } = options;

		const footerChilds = [];

		if ( text && typeof text === 'string' ) {
			footerChilds.push( {
				class: 'footer-content',
				_: await Page.marked( text )
			} );
		}
		return {
			id: 'page-footer',
			class: 'page-footer',
			_: footerChilds
		};
	}

	static render() {
		const template = Page.getTemplate();
		const parent = template.parentElement;
		const fragment = template.content;

		const header = fragment.querySelector( 'header' );
		const content = fragment.querySelector( 'content' );
		const footer = fragment.querySelector( 'footer' );

		const childPromises = [];

		if ( header ) {
			const options = data( header );
			childPromises.push( Page.header( header.innerHTML, options ) );
		}
		if ( content ) {
			const options = data( content );
			childPromises.push( Page.content( content.innerHTML, options ) );
		}
		if ( footer ) {
			const options = data( footer );
			childPromises.push( Page.footer( footer.innerHTML, options ) );
		}

		const element = ecs( {
			t: 'main',
			id: 'site-content',
			class: 'site-content',
			_: childPromises
		} );

		return new Promise( function ( resolve, reject ) {
			Promise.all( childPromises ).then( function () {
				if ( resolve ) {
					resolve( Object.assign( Object.create( null ), { element, template, parent } ) );
				}
				if ( reject ) {
					reject();
				}
			} );
		} );
	}
}
class Footer {
	constructor () { }

	/** @returns {ImageLoader} */
	static get loader() {
		const gl = getGlobal();
		if ( !( 'ImageLoader' in gl ) ) {
			gl.ImageLoader = new ImageLoader();
		}
		return gl.ImageLoader;
	}

	static getTemplate() {
		return document.getElementById( 'footer-constructor' );
	}

	static async load( options ) {
		return await Footer.loader.load( options );
	}

	static async svg( url ) {
		return await SocialIcon.getLink( url );
	}

	static async sponsors(sponsors) {
		return {
			class: 'site-sponsors',
			_: [...sponsors].map(sponsor => ({
				class: 'site-sponsor',
				_: {
					t: 'a',
					attr: { href: data(sponsor, 'href'), target: '_blank', rel:'nofollow noreferer noopener' },
					_: {
						t: 'img',
						attr: {
							src: Footer.load({
								url: data(sponsor, 'src'),
								webp: data(sponsor, 'webp')
							}),
							alt: data(sponsor, 'title')
						}
					}
				}
			}))
		};
	}

	static async networks( networks ) {
		return {
			class: 'site-social-networks',
			_: [...networks].map( network => Footer.svg( data( network, 'href' ) ) )
		};
	}

	static async colophon( colophon ) {
		return {
			class: 'site-colophon',
			_: data( colophon, 'text' )
		};
	}

	static render() {
		const template = Footer.getTemplate();
		const parent = template.parentElement;
		const fragment = template.content;

		const networks = fragment.querySelector( 'networks' );
		const sponsors = fragment.querySelector( 'sponsors' );
		const colophon = fragment.querySelector('colophon');

		const childPromises = [];

		if ( networks ) {
			childPromises.push( Footer.networks( networks.children ) );
		}
		if ( sponsors ) {
			childPromises.push( Footer.sponsors( sponsors.children ) );
		}
		if ( colophon ) {
			childPromises.push( Footer.colophon( colophon ) );
		}

		const element = ecs( {
			t: 'footer',
			id: 'site-footer',
			class: 'site-footer',
			_: childPromises
		} );

		return new Promise( function ( resolve, reject ) {
			Promise.all( childPromises ).then( function () {
				if ( resolve ) {
					resolve( Object.assign( Object.create( null ), { element, template, parent } ) );
				}
				if ( reject ) {
					reject();
				}
			} );
		} );
	}
}
function Render( options, functions ) {
	let { visibility, requireFrame, parallel } = ( options || Object.create(null) );
	visibility = !!visibility ? visibility : false;
	requireFrame = !!requireFrame ? requireFrame : true;
	parallel = !!parallel ? parallel : true;
	if ( !visibility ) {
		addClass( document.body, 'loading', requireFrame );
	}
	if ( !parallel ) {
		return new Promise( function ( resolve, reject ) {
			Header.render().then( function ( { element: ee, template: te, parent: pe } ) {
				Page.render().then( function ( { element: ep, template: tp, parent: pp } ) {
					Footer.render().then( function ( { element: ef, template: tf, parent: pf } ) {
						if ( resolve ) {
							if ( requireFrame ) {
								window.requestAnimationFrame( function replaceTemplates() {
									pe.replaceChild( ee, te ).remove();
									pp.replaceChild( ep, tp ).remove();
									pf.replaceChild( ef, tf ).remove();
								} );
							}
							else {
								pe.replaceChild( ee, te ).remove();
								pp.replaceChild( ep, tp ).remove();
								pf.replaceChild( ef, tf ).remove();
							}
							if ( !visibility ) {
								Wait.delay( function () {
									removeClass( document.body, 'loading', requireFrame );
									addClass( document.body, 'loaded', requireFrame );
								}, 500);
							}
							if ( requireFrame ) {
								window.requestAnimationFrame( function () {
									Promise.all( functions.map( func => func() ) );
								} );
							} else {
								Promise.all( functions.map( func => func() ) );
							}

							resolve();
						}
					} ).catch( reject );
				} ).catch( reject );
			} ).catch( reject );
		} );
	} else {
		return new Promise( function ( resolve, reject ) {
			Promise.all( [Header.render(), Page.render(), Footer.render()] )
				.then( function (response) {
					if ( resolve ) {
						if ( requireFrame ) {
							window.requestAnimationFrame( function replaceTemplates() {
								for ( const { element, template, parent } of response ) {
									parent.replaceChild( element, template ).remove();
								}
							} );
						}
						else {
							for ( const { element, template, parent } of response ) {
								parent.replaceChild( element, template ).remove();
							}
						}
						if ( !visibility ) {
							Wait.delay( function () {
								removeClass( document.body, 'loading', requireFrame );
								addClass( document.body, 'loaded', requireFrame );
							}, 500);
						}
						if ( requireFrame ) {
							window.requestAnimationFrame( function () {
								Promise.all( functions.map( func => func() ) );
							} );
						}
						else {
							Promise.all( functions.map( func => func() ) );
						}

						resolve();
					} else if ( reject ) {
						reject();
					}
				} );
		} );
	}
}
