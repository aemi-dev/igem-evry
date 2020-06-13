async function checkWebPSupport() {
    'use strict';
    console.time('webp test');
    const WebPFeatures = [
        ['lossy', "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA"],
        ['lossless', "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA=="],
        ['alpha', "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA=="],
        ['animation', "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"]
    ];
    const WebPSupport = { length: 0 };

    function saveWebPSupport() {
        if (WebPSupport.length === 4) {
            delete WebPSupport.length;
            getGlobal().WebPSupport = WebPSupport;
        }
    }
    function imageLoading(src,feature) {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => {
                const bool = (img.width > 0) && (img.height > 0);
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
            }
            img.src = src;
        });
    }

    return Promise.all(WebPFeatures.map(([f, c]) => imageLoading(`data:image/webp;base64,${c}`, f)));

}

