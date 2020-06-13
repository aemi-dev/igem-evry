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

window.AsyncImageLoader = new ImageLoader();