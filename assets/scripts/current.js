async function detectMobile() {
	requestFrame(() => {
		if (window.innerWidth <= 1080 || window.innerHeight <= 600) {
			addClass(document.body, 'mobile', false);
		} else {
			removeClass(document.body, 'mobile', false);
		}
	});
}

async function addEventToTogglers() {
	'use strict';
	const togglers = document.getElementsByClassName('toggler');
	for (const toggler of togglers) {
		const {
			toggleTargetSelector,
			toggleTextOn,
			toggleTextOff,
			toggleClassName,
			toggleEventType,
		} = data(toggler);
		toggler.addEventListener(toggleEventType, () => {
			toggleClass(toggler, toggleClassName);
			toggleClass(document.querySelector(toggleTargetSelector), toggleClassName);
			if (isset(toggleTextOn) && isset(toggleTextOff)) {
				toggler.textContent = hasClass(toggler, toggleClassName)
					? toggleTextOff
					: toggleTextOn;
			}
		});
	}
}

async function addSmoothScroll() {
	'use strict';
	async function addSmoothScrollToLink() {
		const links = document.getElementsByTagName('a');
		for (const link of links) {
			let url;
			let hash;
			let scrollable = false;
			try {
				url = new URL(link.href);
				hash = url.hash;
				scrollable = window.location.origin + window.location.pathname === url.origin + url.pathname && isset(hash);
			}
			catch (_) {
				if (link.href.indexOf('#') >= 0) {
					hash = link.href.split('?')[0];
					scrollable = isset(hash);
				}
			}
			if (scrollable) {
				link.addEventListener('click', event => {
					smoothScrollTo(hash);
				});
			}
		}
	}
	async function addSmoothScrollToScrollers() {
		const scrollers = document.getElementsByClassName('scroller');
		for (const scroller of scrollers) {
			const {
				scrollTarget,
				scrollDuration
			} = data(scroller);
			scroller.addEventListener('click', event => {
				smoothScrollTo(scrollTarget);
			});
		}
	}
	Promise.all([addSmoothScrollToLink(), addSmoothScrollToScrollers()]);
}

wait.interactive(() => {
    new Compare();
    Promise.all([detectMobile(), addEventToTogglers(), addSmoothScroll()]);
	window.addEventListener('resize', detectMobile);
});
