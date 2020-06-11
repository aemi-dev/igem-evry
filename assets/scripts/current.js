function detectMobile() {
    requestFrame(() => {
        if ((window.innerWidth <= 1080) || (window.innerHeight <= 600)) {
            addClass(document.body, 'mobile', false);
        }
        else {
            removeClass(document.body, 'mobile', false);
        }
    });
}

function addEventToTogglers() {
    const togglers = document.getElementsByClassName('toggler');
    for (const toggler of togglers) {
        console.log(toggler);
        console.log(toggler.dataset);
        const {
            toggleTargetSelector,
            toggleTextOn,
            toggleTextOff,
            toggleClassName,
            toggleEventType
        } = data(toggler);
        toggler.addEventListener(toggleEventType, () => {
            toggleClass(toggler, toggleClassName);
            toggleClass(document.querySelector(toggleTargetSelector), toggleClassName);
            if (isset(toggleTextOn) && isset(toggleTextOff)) {
                toggler.textContent = hasClass(toggler, toggleClassName) ? toggleTextOff : toggleTextOn;   
            }
        });
    }
}

wait.interactive(() => {
	new Compare();
    detectMobile();
    addEventToTogglers();
    window.addEventListener('resize', detectMobile);
});
