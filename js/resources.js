/* Resources.js
 * This is simply an image loading utility. It eases the process of loading
 * image files so that they can be used within your game. It also includes
 * a simple "caching" layer so it will reuse cached images if you attempt
 * to load the same image multiple times.
 */
//图片加载器
(function () {
    var resourceCache = {};//存放已经加载过的图像
    var loading = [];
    var readyCallbacks = [];

    /* This is the publicly accessible image loading function. It accepts
     * an array of strings pointing to image files or a string for a single
     * image. It will then call our private image loading function accordingly.
     * 这是可公开访问的图像加载功能。
     * 它接受指向image文件的字符串或单个图像的字符串数组。
     * 然后它将相应地调用我们的私有图像加载函数。
     */
    function load(urlOrArr) {
        if (urlOrArr instanceof Array) {
            /* If the developer passed in an array of images
             * loop through each value and call our image
             * loader on that image file
             */
            urlOrArr.forEach(function (url) {
                _load(url);
            });
        } else {
            /* The developer did not pass an array to this function,
             * assume the value is a string and call our image loader
             * directly.
             */
            _load(urlOrArr);
        }
    }

    /* This is our private image loader function, it is
     * called by the public image loader function.
     * 这是我们的私有图像加载器函数，它由公共图像加载器函数调用。
     */
    function _load(url) {
        if (resourceCache[url]) {
            /* If this URL has been previously loaded it will exist within
             * our resourceCache array. Just return that image rather
             * re-loading the image.
             * 如果此URL之前已加载，它将存在于我们的resourceCache数组中。
             只需返回该图像，而不是重新加载图像。
             */
            return resourceCache[url];
        } else {
            /* This URL has not been previously loaded and is not present
             * within our cache; we'll need to load this image.
             * 如果URL之前未加载，并且不在我们的缓存中;我们需要加载此图片。
             */
            var img = new Image();
            img.onload = function () {
                /* Once our image has properly loaded, add it to our cache
                 * so that we can simply return this image if the developer
                 * attempts to load this file in the future.
                 * 一旦我们的图片正确加载，就将它添加到我们的缓存中，
                 * 以便我们可以简单地返回这个图像，如果开发人员试图在未来加载这个文件。
                 */
                resourceCache[url] = img;

                /* Once the image is actually loaded and properly cached,
                 * call all of the onReady() callbacks we have defined.
                 * 一旦图像实际加载并正确缓存，调用所有我们定义的onReady（）回调。
                 */
                if (isReady()) {
                    readyCallbacks.forEach(function (func) {
                        func();
                    });
                }
            };

            /* Set the initial cache value to false, this will change when
             * the image's onload event handler is called. Finally, point
             * the image's src attribute to the passed in URL.
             * 将初始缓存值设置为false，这将在调用图像的onload事件处理程序时更改。
             * 最后，将传入的URL指向图像的src属性。
             */
            resourceCache[url] = false;
            img.src = url;
        }
    }

    /* This is used by developers to grab references to images they know
     * have been previously loaded. If an image is cached, this functions
     * the same as calling load() on that URL.
     * 这是开发人员用来获取对他们知道以前加载的图像的引用。
     * 如果图像缓存，此函数与在该URL上调用load（）相同。
     */
    function get(url) {
        return resourceCache[url];
    }

    /* This function determines if all of the images that have been requested
     * for loading have in fact been properly loaded.
     * 此函数用来确定是否所有已被请求加载的图像实际上都已正确加载。
     */
    function isReady() {
        var ready = true;
        for (var k in resourceCache) {
            if (resourceCache.hasOwnProperty(k) && !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    /* This function will add a function to the callback stack that is called
     * when all requested images are properly loaded.
     * 此函数将向调用的回调栈（init）添加一个函数 当所有请求的图像正确加载时。
     */
    function onReady(func) {
        readyCallbacks.push(func);
    }

    /* This object defines the publicly accessible functions available to
     * developers by creating a global Resources object.
     * 此对象通过创建全局Resources对象来向开发人员定义了可用的可公开访问的函数。
     */
    window.Resources = {
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();
