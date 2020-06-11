class ImageLoader {
	constructor () {
		this.worker = new ExtendedWorker(() => {
			self.onmessage = async event => {
			    console.log(event);
                loadImage(event.data.data.url,event.data.id).then( response => self.postMessage({id:response[0],data:{blob:response[1]}}));
			};
			async function loadImage(url,id) {
			    console.log(url);
				const response = await fetch(url)
                const blob = await response.blob()
                return [id,blob];
			}
		},{promise:true});
	}
	async load(url) {
        return await this.worker.postMessage({url:window.location.href+url});
	}
}

class Compare {

    constructor() {
        'use strict';
        this.elements = [...document.getElementsByClassName('js-compare')];
        for (const element of this.elements) {
            Compare.attachEvent(element);
        }
    }

    static attachEvent(element) {
        if (element instanceof HTMLElement) {
            element.addEventListener( 'mousemove', event => {
                requestFrame(() => {
                    console.log(event);
                    element.children[0].style.width = event.clientX + 'px';
                });
            } );   
        }
    }
}