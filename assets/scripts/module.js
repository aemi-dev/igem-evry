'use strict';
function is(object) {
	return object !== null && object !== undefined;
}
function isset(object) {
	return is(object) && object !== '';
}
function getGlobal() {
	'use script';
	const value = globalThis || self || window || global;
	if (value) {
		return value;
	}
	throw new Error('Unable to get global object.');
}
function entries(object, func) {
	for (let key in object) {
		if (object.hasOwnProperty(key)) {
			func(key, object[key]);
		}
	}
}
function isNumber(variable) {
	return typeof variable === 'number' || variable instanceof Number;
}
function isString(variable) {
	return typeof variable === 'string' || variable instanceof String;
}
function isBoolean(variable) {
	return typeof variable === 'boolean';
}
function isFunction(object) {
	return typeof object === 'function' || object instanceof Function ? object : false;
}
function isURL(object) {
	if (isString(object)) {
		try {
			return new URL(object) instanceof URL;
		} catch (_) {
			return false;
		}
	} else {
		return object instanceof URL;
	}
}
function identifier(length) {
	'use script';
	const values = [];
	const list = [];
	for (let i = 0; i < 62; i += 1) {
		if (i < 10) {
			values[i] = 48 + i;
		} else if (i < 36) {
			values[i] = 65 + (i - 10);
		} else if (i < 62) {
			values[i] = 97 + (i - 36);
		}
	}
	for (let i = 0; i < (length || 16); i += 1) {
		list[i] = values[Math.floor(Math.random() * 62)];
	}
	return String.fromCharCode(...list);
}
function inhibitEvent(event) {
	event.preventDefault();
	event.stopPropagation();
}
function catchError(caughtError) {
	if (typeof caughtError === 'string') {
		caughtError = new Error(caughtError);
	}
	wait.delay(() => {
		console.group(caughtError.name);
		console.warn(caughtError.name);
		console.warn(caughtError.message);
		console.warn(caughtError.stack);
		console.groupEnd(caughtError.name);
	});
	return false;
}
function id(string) {
	return document.getElementById(string);
}
function requestFrame() {
	const [func, ...args] = arguments;
	if (isFunction(func)) {
		return window.requestAnimationFrame(timestamp => func(timestamp, ...args));
	}
	throw new Error(`${func} is not a function.`);
}
function cancelFrame(id) {
	try {
		cancelAnimationFrame(id);
		return true;
	} catch (error) {
		catchError(error);
		return false;
	}
}
function hasClass(element, className) {
	if (is(element)) {
		return element.classList.contains(isset(className) ? className : 'toggled');
	} else {
		return catchError(`element:${element} is undefined.`);
	}
}
function addClass(element, className, doNotRequestFrame) {
	doNotRequestFrame = doNotRequestFrame || true;
	if (is(element) && isset(className)) {
		if (doNotRequestFrame) {
			element.classList.add(className);
			return true;
		} else {
			return !!requestFrame(() => element.classList.add(className));
		}
	}
	return catchError(`element:${element} or class:${classname} is undefined.`);
}
function removeClass(element, className, doNotRequestFrame) {
	doNotRequestFrame = doNotRequestFrame || true;
	if (is(element) && isset(className)) {
		if (doNotRequestFrame) {
			element.classList.remove(className);
			return true;
		} else {
			return !!requestFrame(() => element.classList.remove(className));
		}
	}
	return catchError(`element:${element} or class:${className} is undefined.`);
}
function toggleClass(element, className) {
	if (is(element)) {
		className = isset(className) ? className : 'toggled';
		const boolean = hasClass(element, className);
		if (boolean === true || boolean === false) {
			return !!requestFrame(() =>
				boolean ? !removeClass(element, className) : addClass(element, className)
			);
		}
	}
	return catchError(`${element} is undefined.`);
}
function attr() {
	const [element, attrName, value] = arguments;
	if (is(value)) {
		return element.setAttribute(attrName, value);
	}
	return element.getAttribute(attrName);
}

function data() {
	const [element, dataset, value] = arguments;
	if (isset(dataset)) {
		if (is(value)) {
			element.dataset[dataset] = value;
			return element.dataset[dataset];
		}
		return element.dataset[dataset];
	}
	return element.dataset;
}

class Easing {
	constructor() {}
	static linearTween(t, b, c, d) {
		return (c * t) / d + b;
	}
	static easeInQuad(t, b, c, d) {
		t /= d;
		return c * t * t + b;
	}
	static easeOutQuad(t, b, c, d) {
		t /= d;
		return -c * t * (t - 2) + b;
	}
	static easeInOutQuad(t, b, c, d) {
		t /= d / 2;
		if (t < 1) {
			return (c / 2) * t * t + b;
		}
		t--;
		return (-c / 2) * (t * (t - 2) - 1) + b;
	}
	static easeInCubic(t, b, c, d) {
		t /= d;
		return c * t * t * t + b;
	}
	static easeOutCubic(t, b, c, d) {
		t /= d;
		t--;
		return c * (t * t * t + 1) + b;
	}
	static easeInOutCubic(t, b, c, d) {
		t /= d / 2;
		if (t < 1) {
			return (c / 2) * t * t * t + b;
		}
		t -= 2;
		return (c / 2) * (t * t * t + 2) + b;
	}
	static easeInQuart(t, b, c, d) {
		t /= d;
		return c * t * t * t * t + b;
	}
	static easeOutQuart(t, b, c, d) {
		t /= d;
		t--;
		return -c * (t * t * t * t - 1) + b;
	}
	static easeInOutQuart(t, b, c, d) {
		t /= d / 2;
		if (t < 1) {
			return (c / 2) * t * t * t * t + b;
		}
		t -= 2;
		return (-c / 2) * (t * t * t * t - 2) + b;
	}
	static easeInQuint(t, b, c, d) {
		t /= d;
		return c * t * t * t * t * t + b;
	}
	static easeOutQuint(t, b, c, d) {
		t /= d;
		t--;
		return c * (t * t * t * t * t + 1) + b;
	}
	static easeInOutQuint(t, b, c, d) {
		t /= d / 2;
		if (t < 1) {
			return (c / 2) * t * t * t * t * t + b;
		}
		t -= 2;
		return (c / 2) * (t * t * t * t * t + 2) + b;
	}
	static easeInSine(t, b, c, d) {
		return -c * Math.cos((t / d) * (Math.PI / 2)) + c + b;
	}
	static easeOutSine(t, b, c, d) {
		return c * Math.sin((t / d) * (Math.PI / 2)) + b;
	}
	static easeInOutSine(t, b, c, d) {
		return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b;
	}
	static easeInExpo(t, b, c, d) {
		return c * Math.pow(2, 10 * (t / d - 1)) + b;
	}
	static easeOutExpo(t, b, c, d) {
		return c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
	}
	static easeInOutExpo(t, b, c, d) {
		t /= d / 2;
		if (t < 1) {
			return (c / 2) * Math.pow(2, 10 * (t - 1)) + b;
		}
		t--;
		return (c / 2) * (-Math.pow(2, -10 * t) + 2) + b;
	}
	static easeInCirc(t, b, c, d) {
		t /= d;
		return -c * (Math.sqrt(1 - t * t) - 1) + b;
	}
	static easeOutCirc(t, b, c, d) {
		t /= d;
		t--;
		return c * Math.sqrt(1 - t * t) + b;
	}
	static easeInOutCirc(t, b, c, d) {
		t /= d / 2;
		if (t < 1) {
			return (-c / 2) * (Math.sqrt(1 - t * t) - 1) + b;
		}
		t -= 2;
		return (c / 2) * (Math.sqrt(1 - t * t) + 1) + b;
	}
}

function smoothScrollTo(selector, duration) {
	const easing = Easing.easeInOutCubic;
	let target = document.querySelector(selector);
	if (!(target instanceof HTMLElement)) return;
	let startPosition = window.pageYOffset;
	let targetPosition = startPosition + target.getBoundingClientRect().top;
	duration = duration || 1000;
	let distance = targetPosition - startPosition;
	let startTime = null;
	function animation(currentTime) {
		startTime = is(startTime) ? startTime : currentTime;
		let timeElapsed = currentTime - startTime;
		let run = easing(timeElapsed, startPosition, distance, duration);
		window.scrollTo(0, run);
		if (timeElapsed < duration) {
			requestFrame(animation);
		}
	}
	requestFrame(animation);
}

class cookies {
	constructor() {}
	static get(string) {
		const cookiesString = decodeURIComponent(document.cookie);
		const cookiesList = cookiesString.split(/;/);
		for (let cookie of cookiesList) {
			while (cookie.charAt(0) === ' ') {
				cookie = cookie.substring(1);
			}
			if (cookie.indexOf(string + '=') === 0) {
				const cookieValue = cookie.substring(string.length + 1, cookie.length);
				if (cookieValue !== '' && is(cookieValue)) {
					return cookieValue;
				} else {
					return;
				}
			}
		}
		return;
	}
	static has(string) {
		const cookiesString = decodeURIComponent(document.cookie);
		const cookiesList = cookiesString.split(/;/);
		for (let cookie of cookiesList) {
			while (cookie.charAt(0) === ' ') {
				cookie = cookie.substring(1);
			}
			if (cookie.indexOf(string + '=') === 0) {
				const cookieValue = cookie.substring(string.length + 1, cookie.length);
				if (cookieValue !== '' && is(cookieValue)) {
					return true;
				} else {
					return false;
				}
			}
		}
		return false;
	}
	static set(cookieName, cookieValue, expiration) {
		if (expiration === undefined) {
			const newDate = new Date();
			const year = 365.25 * 24 * 3600 * 1000;
			newDate.setTime(newDate.getTime() + year);
			expiration = newDate.toUTCString();
		}
		const expirationString = 'expires=' + expiration;
		document.cookie =
			cookieName + '=' + encodeURIComponent(cookieValue) + ';' + expirationString + ';path=/';
	}
	static delete(cookieName) {
		const newDate = new Date();
		newDate.setTime(newDate.getTime() - 1);
		const expiration = 'expires=' + newDate.toUTCString();
		document.cookie = cookieName + '=;' + expiration + ';path=/';
	}
}
function ecs() {
	const ce = a => document.createElement(isset(a) ? a : 'div');
	const ac = (a, b) => {
		a.appendChild(b);
		return a;
	};
	const l = [...arguments].filter(isset);
	const ll = l.length;
	if (ll === 0) {
		return ce();
	} else if (ll !== 1) {
		const a = ce();
		for (const b of l) {
			ac(a, ecs(b));
		}
		return a;
	}
	let e = l.pop();
	if (e instanceof Element) {
		return ac(ce(), e);
	}
	const { attr: a, class: c, data, events, id, ns, style, actions, _, $ } = e;
	if (id || c || $) {
		if (ns) {
			e = document.createElementNS(ns, $);
		} else {
			e = ce($);
		}
		if (id) {
			e.id = id;
		}
		if (c) {
			e.classList.add(...c);
		}
	} else {
		e = ce();
	}
	if (a) {
		entries(a, (k, v) => {
			attr(e, k, v);
		});
	}
	if (data) {
		entries(data, (k, v) => {
			e.dataset[k] = v;
		});
	}
	if (events) {
		events.forEach(ev => e.addEventListener(...ev));
	}
	if (style) {
		entries(style, (k, v) => {
			e.style[k] = v;
		});
	}
	if (_) {
		for (const i of _) {
			if (i instanceof Element) {
				ac(e, i);
			} else if (['string', 'number', 'bigint', 'boolean', 'symbol'].includes(typeof i)) {
				e.innerHTML += `${i}`;
			} else {
				try {
					ac(e, ecs(i));
				} catch (_) {
					catchError(_);
				}
			}
		}
	}
	if (actions) {
		entries(actions, (k, v) => {
			const a = k.split(/\_\$/);
			if (a.length > 1) {
				e[a[0]](...v);
			} else {
				e[k](...v);
			}
		});
	}
	return e;
}

function ecsScript() {
	const c = document.currentScript;
	if (![document.head, document.documentElement].includes(c.parentElement)) {
		for (const b of arguments) {
			c.insertAdjacentElement('beforebegin', ecs(b));
		}
		c.remove();
	}
}
class wait {
	constructor() {}
	static time(time) {
		return new Promise(resolve => setTimeout(resolve, time));
	}
	static async first() {
		return Promise.race(...arguments);
	}
	static delay() {
		const [func, timeout, ...args] = arguments;
		return setTimeout(func, timeout || 0, ...args);
	}
	static async async() {
		const [func, ...args] = arguments;
		return func(...args);
	}
	static async asyncDelay() {
		const [func, ...args] = arguments;
		return wait.delay(func, ...args);
	}
	static loading() {
		const [func, ...args] = arguments;
		if (document.readyState === 'loading') {
			func(...args);
		}
	}
	static interactive() {
		const [func, ...args] = arguments;
		if (document.readyState !== 'loading') {
			func(...args);
		} else {
			document.addEventListener('readystatechange', () => func(...args));
		}
	}
	static complete() {
		const [func, ...args] = arguments;
		if (document.readyState === 'complete') {
			func(...args);
		} else {
			document.addEventListener('readystatechange', () =>
				document.readyState === 'complete' ? func(...args) : null
			);
		}
	}
	static DOMContentLoaded() {
		const [func, ...args] = arguments;
		if (document.readyState === 'interactive' || document.readyState === 'complete') {
			func(...args);
		} else {
			document.addEventListener('DOMContentLoaded', () => func(...args));
		}
	}
	static ready() {
		const [func, ...args] = arguments;
		if (document.readyState !== 'loading') {
			func(...args);
		} else {
			document.addEventListener('readystatechange', () =>
				document.readyState === 'complete' ? func(...args) : null
			);
		}
	}
	static load() {
		const [func, ...args] = arguments;
		window.addEventListener('load', () => func(...args));
	}
}
class Environment {
	constructor() {
		this.actions = [];
	}
	push() {
		for (const func of arguments) {
			if (isFunction(func)) {
				this.actions.push(func);
			} else {
				catchError(func, 'is not a function.');
			}
		}
	}
	run() {
		try {
			for (const action of this.actions) {
				wait.interactive(action);
			}
		} catch (error) {
			return catchError(error);
		}
	}
}

class ExtendedWorker {
	constructor(WorkerObject, WorkerOptions) {
		if (typeof WorkerObject === 'function') {
			WorkerObject = ExtendedWorker.prepareFromFunction(WorkerObject);
		}
		this.worker = new Worker(WorkerObject, WorkerOptions);
		if (WorkerOptions && 'promise' in WorkerOptions && WorkerOptions.promise === true) {
			this.worker.promise = true;
			ExtendedWorker.assert();
			this.worker.onmessage = ExtendedWorker.onMessage;
		} else {
			this.worker.promise = false;
		}
	}
	static identifier(length) {
		const values = [];
		const list = [];
		for (let i = 0; i < 62; i += 1) {
			if (i < 10) {
				values[i] = 48 + i;
			} else if (i < 36) {
				values[i] = 65 + (i - 10);
			} else if (i < 62) {
				values[i] = 97 + (i - 36);
			}
		}
		for (let i = 0; i < (length || 16); i += 1) {
			list[i] = values[Math.floor(Math.random() * 62)];
		}
		return String.fromCharCode(...list);
	}
	static get global() {
		const value = globalThis || self || window || global;
		if (value) {
			return value;
		}
		throw new Error('Unable to get global object.');
	}
	static prepareFromString(WorkerString) {
		if (typeof WorkerString === 'string') {
			const WorkerBody = '(' + WorkerString + ')()';
			const WorkerBlob = new Blob([WorkerBody], { type: 'text/javascript' });
			return URL.createObjectURL(WorkerBlob);
		}
		throw new Error(`WorkerString:${WorkerString} is not a string.`);
	}
	static prepareFromFunction(WorkerFunction) {
		if (typeof WorkerFunction === 'function') {
			return ExtendedWorker.prepareFromString(WorkerFunction.toString());
		}
		throw new Error(`WorkerFunction:${WorkerFunction} is not a function.`);
	}
	static createFromString(WorkerString, WorkerOptions) {
		if (typeof WorkerString === 'string') {
			const WorkerBody = '(' + WorkerString + ')()';
			const WorkerBlob = new Blob([WorkerBody], { type: 'text/javascript' });
			return new ExtendedWorker(URL.createObjectURL(WorkerBlob), WorkerOptions);
		}
		throw new Error(`WorkerString:${WorkerString} is not a string.`);
	}
	static createFromFunction(WorkerFunction, WorkerOptions) {
		if (typeof WorkerFunction === 'function') {
			return ExtendedWorker.createFromString(WorkerFunction.toString(), WorkerOptions);
		}
		throw new Error(`WorkerFunction:${WorkerFunction} is not a function.`);
	}
	get env() {
		return ExtendedWorker.global.ExtendedWorkers;
	}
	set onmessage(func) {
		this.worker.onmessage = func;
	}
	get onmessage() {
		return this.worker.onmessage;
	}
	set onerror(func) {
		this.worker.onerror = func;
	}
	get onerror() {
		return this.worker.onerror;
	}
	set onmessageerror(func) {
		this.worker.onmessageerror = func;
	}
	get onmessageerror() {
		return this.worker.onmessageerror;
	}
	dispatchEvent() {
		return this.worker.dispatchEvent(...arguments);
	}
	addEventListener() {
		return this.worker.addEventListener(...arguments);
	}
	removeEventListener() {
		return this.worker.removeEventListener(...arguments);
	}
	terminate() {
		return this.worker.terminate();
	}
	postMessage(data, transferableObject) {
		return ExtendedWorker.postMessage([data, transferableObject], this.worker);
	}
	static assert() {
		const self = ExtendedWorker.global;
		if (!('ExtendedWorkers' in self)) {
			self.ExtendedWorkers = {
				resolves: [],
				rejects: [],
			};
		} else if (!('resolves' in self.ExtendedWorkers && 'rejects' in self.ExtendedWorkers)) {
			self.ExtendedWorkers.resolves = [];
			self.ExtendedWorkers.rejecs = [];
		}
	}
	static postMessage(messagePayload, worker) {
		if (worker.promise) {
			const messageId = identifier();
			const [data, transferableObject] = messagePayload;
			const message = { id: messageId, data: data };
			return new Promise((resolve, reject) => {
				ExtendedWorker.resolves[messageId] = resolve;
				ExtendedWorker.rejects[messageId] = reject;
				if (is(transferableObject)) {
					worker.postMessage(message, transferableObject);
				} else {
					worker.postMessage(message);
				}
			});
		} else {
			worker.postMessage(...messagePayload);
		}
	}
	static onMessage(message) {
		const { id, err, data } = message.data;
		const resolve = ExtendedWorker.resolves[id];
		const reject = ExtendedWorker.rejects[id];
		if (data) {
			if (resolve) {
				resolve(data);
			}
		} else if (reject) {
			if (err) {
				reject(err);
			} else {
				reject('Got nothing');
			}
		}
		ExtendedWorker.delete(id);
	}
	static get resolves() {
		ExtendedWorker.assert();
		return ExtendedWorker.global.ExtendedWorkers.resolves;
	}
	static get rejects() {
		return ExtendedWorker.global.ExtendedWorkers.rejects;
	}
	static delete(id) {
		delete ExtendedWorker.resolves[id];
		delete ExtendedWorker.rejects[id];
	}
}

async function checkWebPSupport() {
	const WebPFeatures = [
		['lossy', 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA'],
		['lossless', 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA=='],
		[
			'alpha',
			'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
		],
		[
			'animation',
			'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA',
		],
	];
	const WebPSupport = { length: 0 };

	function saveWebPSupport() {
		if (WebPSupport.length === 4) {
			delete WebPSupport.length;
			getGlobal().WebPSupport = WebPSupport;
		}
	}
	function imageLoading(src, feature) {
		return new Promise((resolve, reject) => {
			let img = new Image();
			img.onload = () => {
				const bool = img.width > 0 && img.height > 0;
				WebPSupport[feature] = bool;
				WebPSupport.length++;
				saveWebPSupport();
				return resolve(WebPSupport);
			};
			img.onerror = () => {
				WebPSupport[feature] = false;
				WebPSupport.length++;
				saveWebPSupport();
				return reject(WebPSupport);
			};
			img.src = src;
		});
	}

	return Promise.race(
		WebPFeatures.map(([f, c]) => imageLoading(`data:image/webp;base64,${c}`, f))
	);
}

class Compare {
	constructor() {
		this.elements = [...document.getElementsByClassName('js-compare-layers')];
		for (const element of this.elements) {
			Compare.attachEvent(element);
		}
	}
	static attachEvent(element) {
		if (element instanceof HTMLElement) {
			element.addEventListener(
				'mousemove',
				event => {
					requestFrame(() => {
						element.children[0].style.width = `${event.clientX}px`;
					});
				},
				{ passive: true }
			);
			element.addEventListener(
				'touchmove',
				event => {
					wait.delay(() =>
						requestFrame(() => {
							if (event.touches.length > 0) {
								element.children[0].style.width = `${event.touches[0].clientX}px`;
							}
						})
					);
				},
				{ passive: true }
			);
		}
	}
}

class Menu {
	constructor() {
		this.items = [];
		this.structure = new Map();
		if (arguments.length > 0) {
			this.load(...arguments);
		}
	}
	load() {
		if (this.items.length > 0) {
			this.items = [];
		}
		if (this.structure.size > 0) {
			this.structure.clear();
		}
		const args = [...arguments].filter(({ text, href }) => isset(text) && isset(href));
		let index = 0;
		for (const { text, href, target, rel, children, title } of args) {
			let currentIndex = index;
			let childrenIndexes = [];
			index = this.items.push(
				ecs({
					$: 'a',
					attr: {
						href: href,
						target: target,
						rel: rel,
						title: title,
					},
					_: text,
				})
			);
			if (children) {
				if (
					children instanceof Array &&
					children.filter(({ text, href }) => isset(text) && isset(href)).length > 0
				) {
					for (const { text, href, target, rel, title } of children) {
						childrenIndexes.push(index);
						index = this.items.push(
							ecs({
								$: 'a',
								attr: {
									href: href,
									target: target,
									rel: rel,
									title: title,
								},
								_: text,
							})
						);
					}
				}
			}
			this.structure.set(currentIndex, childrenIndexes);
		}
	}
	html() {
		return ecs({
			$: 'ul',
			class: ['menu'],
			_: [...this.structure.keys()].map(index => ({
				$: 'li',
				class: ['menu-item'],
				_: [
					this.items[index],
					{
						$: 'ul',
						class: ['sub-menu'],
						_: this.structure.get(index).map(index => ({
							$: 'li',
							class: ['sub-menu-item'],
							_: [this.items[index]],
						})),
					},
				],
			})),
		});
	}
}

class ImageLoader {
	constructor() {
		this.worker = new ExtendedWorker(
			() => {
				self.onmessage = async event => {
					loadImage(event.data.data.url, event.data.id).then(response =>
						self.postMessage({ id: response[0], data: { blob: response[1] } })
					);
				};
				async function loadImage(url, id) {
					const response = await fetch(url);
					const blob = await response.blob();
					return [id, blob];
				}
			},
			{ promise: true }
		);
	}
	async load(url) {
		return await this.worker.postMessage({ url: window.location.href + url });
	}
}

const AsyncImageLoader = new ImageLoader();
