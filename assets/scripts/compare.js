class Compare {
    constructor() {
        'use strict';
        this.elements = [...document.getElementsByClassName('js-compare-layers')];
        for (const element of this.elements) {
            Compare.attachEvent(element);
        }
    }
    static attachEvent(element) {
        if (element instanceof HTMLElement) {
            element.addEventListener('mousemove', event => {
                inhibitEvent(event);
                requestFrame(() => {
                    element.children[0].style.width = `${event.clientX}px`;
                });
            },{passive:true}); 
            element.addEventListener('touchmove', event => {
                inhibitEvent(event);
                wait.delay(() => requestFrame(() => {
                    if (event.touches.length > 0) {
                        element.children[0].style.width = `${event.touches[0].clientX}px`;
                    }
                }));
            },{passive:true});
        }
    }
}