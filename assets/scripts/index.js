function is(object) {
	'use strict';
	return object !== null && object !== undefined;
}
function isset(object) {
	'use strict';
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
	'use strict';
	for (let key in object) {
		if (object.hasOwnProperty(key)) {
			func(key, object[key]);
		}
	}
}
function isNumber(variable) {
	'use strict';
	return typeof variable === 'number' || variable instanceof Number;
}
function isString(variable) {
	'use strict';
	return typeof variable === 'string' || variable instanceof String;
}
function isBoolean(variable) {
	'use strict';
	return typeof variable === 'boolean';
}
function isFunction(object) {
	'use strict';
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
	'use strict';
	event.preventDefault();
	event.stopPropagation();
}
function catchError(caughtError) {
	'use strict';
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
	'use strict';
	return document.getElementById(string);
}
function requestFrame() {
	'use strict';
	const [func, ...args] = arguments;
	if (isFunction(func)) {
		return window.requestAnimationFrame(timestamp => func(timestamp, ...args));
	}
	throw new Error(`${func} is not a function.`);
}
function cancelFrame(id) {
	'use strict';
	try {
		cancelAnimationFrame(id);
		return true;
	} catch (error) {
		catchError(error);
		return false;
	}
}
function hasClass(element, className) {
	'use strict';
	if (is(element)) {
		return element.classList.contains(isset(className) ? className : 'toggled');
	} else {
		return catchError(`element:${element} is undefined.`);
	}
}
function addClass(element, className, doNotRequestFrame) {
	'use strict';
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
	'use strict';
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
	'use strict';
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
	'use strict';
	const [element, attrName, value] = arguments;
	if (is(value)) {
		return element.setAttribute(attrName, value);
	}
	return element.getAttribute(attrName);
}

function data() {
	'use strict';
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
	constructor() {
		'use strict';
	}
	static linearTween(t, b, c, d) {
		'use strict';
		return (c * t) / d + b;
	}
	static easeInQuad(t, b, c, d) {
		'use strict';
		t /= d;
		return c * t * t + b;
	}
	static easeOutQuad(t, b, c, d) {
		'use strict';
		t /= d;
		return -c * t * (t - 2) + b;
	}
	static easeInOutQuad(t, b, c, d) {
		'use strict';
		t /= d / 2;
		if (t < 1) {
			return (c / 2) * t * t + b;
		}
		t--;
		return (-c / 2) * (t * (t - 2) - 1) + b;
	}
	static easeInCubic(t, b, c, d) {
		'use strict';
		t /= d;
		return c * t * t * t + b;
	}
	static easeOutCubic(t, b, c, d) {
		'use strict';
		t /= d;
		t--;
		return c * (t * t * t + 1) + b;
	}
	static easeInOutCubic(t, b, c, d) {
		'use strict';
		t /= d / 2;
		if (t < 1) {
			return (c / 2) * t * t * t + b;
		}
		t -= 2;
		return (c / 2) * (t * t * t + 2) + b;
	}
	static easeInQuart(t, b, c, d) {
		'use strict';
		t /= d;
		return c * t * t * t * t + b;
	}
	static easeOutQuart(t, b, c, d) {
		'use strict';
		t /= d;
		t--;
		return -c * (t * t * t * t - 1) + b;
	}
	static easeInOutQuart(t, b, c, d) {
		'use strict';
		t /= d / 2;
		if (t < 1) {
			return (c / 2) * t * t * t * t + b;
		}
		t -= 2;
		return (-c / 2) * (t * t * t * t - 2) + b;
	}
	static easeInQuint(t, b, c, d) {
		'use strict';
		t /= d;
		return c * t * t * t * t * t + b;
	}
	static easeOutQuint(t, b, c, d) {
		'use strict';
		t /= d;
		t--;
		return c * (t * t * t * t * t + 1) + b;
	}
	static easeInOutQuint(t, b, c, d) {
		'use strict';
		t /= d / 2;
		if (t < 1) {
			return (c / 2) * t * t * t * t * t + b;
		}
		t -= 2;
		return (c / 2) * (t * t * t * t * t + 2) + b;
	}
	static easeInSine(t, b, c, d) {
		'use strict';
		return -c * Math.cos((t / d) * (Math.PI / 2)) + c + b;
	}
	static easeOutSine(t, b, c, d) {
		'use strict';
		return c * Math.sin((t / d) * (Math.PI / 2)) + b;
	}
	static easeInOutSine(t, b, c, d) {
		'use strict';
		return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b;
	}
	static easeInExpo(t, b, c, d) {
		'use strict';
		return c * Math.pow(2, 10 * (t / d - 1)) + b;
	}
	static easeOutExpo(t, b, c, d) {
		'use strict';
		return c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
	}
	static easeInOutExpo(t, b, c, d) {
		'use strict';
		t /= d / 2;
		if (t < 1) {
			return (c / 2) * Math.pow(2, 10 * (t - 1)) + b;
		}
		t--;
		return (c / 2) * (-Math.pow(2, -10 * t) + 2) + b;
	}
	static easeInCirc(t, b, c, d) {
		'use strict';
		t /= d;
		return -c * (Math.sqrt(1 - t * t) - 1) + b;
	}
	static easeOutCirc(t, b, c, d) {
		'use strict';
		t /= d;
		t--;
		return c * Math.sqrt(1 - t * t) + b;
	}
	static easeInOutCirc(t, b, c, d) {
		'use strict';
		t /= d / 2;
		if (t < 1) {
			return (-c / 2) * (Math.sqrt(1 - t * t) - 1) + b;
		}
		t -= 2;
		return (c / 2) * (Math.sqrt(1 - t * t) + 1) + b;
	}
}

function smoothScrollTo(selector, duration) {
	'use strict';
	const easing = Easing.easeInOutCubic;
	let target = document.querySelector(selector);
	let targetPosition = target.getBoundingClientRect().top;
	duration = duration || 1000;
	let startPosition = window.pageYOffset;
	let distance = targetPosition - startPosition;
	let startTime = null;
	function animation(currentTime) {
		startTime = is(startTime) ? startTime : currentTime;
		let timeElapsed = currentTime - startTime;
		let run = easing(timeElapsed, startPosition, distance, duration);
		window.scrollTo(0, run);
		if (timeElapsed < duration ) {
			requestFrame(animation);
		}
	}
	requestFrame(animation);
}

class cookies {
	constructor() {
		'use strict';
	}
	static get(string) {
		'use strict';
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
		'use strict';
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
		'use strict';
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
		'use strict';
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
	'use script';
	const c = document.currentScript;
	if (![document.head, document.documentElement].includes(c.parentElement)) {
		for (const b of arguments) {
			c.insertAdjacentElement('beforebegin', ecs(b));
		}
		c.remove();
	}
}
class wait {
	constructor() {
		'use strict';
	}
	static time(time) {
		'use strict';
		return new Promise(resolve => setTimeout(resolve, time));
	}
	static async first() {
		return Promise.race(...arguments);
	}
	static delay() {
		'use strict';
		const [func, timeout, ...args] = arguments;
		return setTimeout(func, timeout || 0, ...args);
	}
	static async async() {
		'use strict';
		const [func, ...args] = arguments;
		return func(...args);
	}
	static async asyncDelay() {
		'use strict';
		const [func, ...args] = arguments;
		return wait.delay(func, ...args);
	}
	static loading() {
		'use strict';
		const [func, ...args] = arguments;
		if (document.readyState === 'loading') {
			func(...args);
		}
	}
	static interactive() {
		'use strict';
		const [func, ...args] = arguments;
		if (document.readyState !== 'loading') {
			func(...args);
		} else {
			document.addEventListener('readystatechange', () => func(...args));
		}
	}
	static complete() {
		'use strict';
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
		'use strict';
		const [func, ...args] = arguments;
		if (document.readyState === 'interactive' || document.readyState === 'complete') {
			func(...args);
		} else {
			document.addEventListener('DOMContentLoaded', () => func(...args));
		}
	}
	static ready() {
		'use strict';
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
		'use strict';
		const [func, ...args] = arguments;
		window.addEventListener('load', () => func(...args));
	}
}
class Environment {
	constructor() {
		'use strict';
		this.actions = [];
	}
	push() {
		'use strict';
		for (const func of arguments) {
			if (isFunction(func)) {
				this.actions.push(func);
			} else {
				catchError(func, 'is not a function.');
			}
		}
	}
	run() {
		'use strict';
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
		'use strict';
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
	static get global() {
		'use script';
		const value = globalThis || self || window || global;
		if (value) {
			return value;
		}
		throw new Error('Unable to get global object.');
	}
	static prepareFromString(WorkerString) {
		'use strict';
		if (typeof WorkerString === 'string') {
			const WorkerBody = '(' + WorkerString + ')()';
			const WorkerBlob = new Blob([WorkerBody], { type: 'text/javascript' });
			return URL.createObjectURL(WorkerBlob);
		}
		throw new Error(`WorkerString:${WorkerString} is not a string.`);
	}
	static prepareFromFunction(WorkerFunction) {
		'use strict';
		if (typeof WorkerFunction === 'function') {
			return ExtendedWorker.prepareFromString(WorkerFunction.toString());
		}
		throw new Error(`WorkerFunction:${WorkerFunction} is not a function.`);
	}
	static createFromString(WorkerString, WorkerOptions) {
		'use strict';
		if (typeof WorkerString === 'string') {
			const WorkerBody = '(' + WorkerString + ')()';
			const WorkerBlob = new Blob([WorkerBody], { type: 'text/javascript' });
			return new ExtendedWorker(URL.createObjectURL(WorkerBlob), WorkerOptions);
		}
		throw new Error(`WorkerString:${WorkerString} is not a string.`);
	}
	static createFromFunction(WorkerFunction, WorkerOptions) {
		'use strict';
		if (typeof WorkerFunction === 'function') {
			return ExtendedWorker.createFromString(WorkerFunction.toString(), WorkerOptions);
		}
		throw new Error(`WorkerFunction:${WorkerFunction} is not a function.`);
	}
	get env() {
		'use strict';
		return ExtendedWorker.global.ExtendedWorkers;
	}
	set onmessage(func) {
		'use script';
		this.worker.onmessage = func;
	}
	get onmessage() {
		'use strict';
		return this.worker.onmessage;
	}
	set onerror(func) {
		'use script';
		this.worker.onerror = func;
	}
	get onerror() {
		'use strict';
		return this.worker.onerror;
	}
	set onmessageerror(func) {
		'use script';
		this.worker.onmessageerror = func;
	}
	get onmessageerror() {
		'use strict';
		return this.worker.onmessageerror;
	}
	dispatchEvent() {
		'use script';
		return this.worker.dispatchEvent(...arguments);
	}
	addEventListener() {
		'use script';
		return this.worker.addEventListener(...arguments);
	}
	removeEventListener() {
		'use script';
		return this.worker.removeEventListener(...arguments);
	}
	terminate() {
		'use strict';
		return this.worker.terminate();
	}
	postMessage(data, transferableObject) {
		'use strict';
		return ExtendedWorker.postMessage([data, transferableObject], this.worker);
	}
	static assert() {
		'use strict';
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
		'use strict';
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
		'use strict';
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
		'use strict';
		ExtendedWorker.assert();
		return ExtendedWorker.global.ExtendedWorkers.resolves;
	}
	static get rejects() {
		'use strict';
		return ExtendedWorker.global.ExtendedWorkers.rejects;
	}
	static delete(id) {
		'use strict';
		delete ExtendedWorker.resolves[id];
		delete ExtendedWorker.rejects[id];
	}
}
