/* Engine.js
 * This file provides the game loop functionality (update entities and render),提供游戏循环功能（更新实体和渲染）
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).在屏幕上绘制初始游戏板，然后调用更新和
 *渲染方法在你的player和enemy对象（在app.js中定义）上
 *
 * A game engine works by drawing the entire game screen over and over,游戏引擎通过一遍又一遍地绘制整个游戏画面来工作
 kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable 这个引擎可通过引擎变量在全局范围内使用
 * and it also makes the canvas' context (ctx) object globally available to make writing app.js也使
 画布的上下文（ctx）对象全局可用于编写app.js
 * a little simpler to work with.
 */

var Engine = (function (global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),//创建canvas元素
        ctx = canvas.getContext('2d'),//新建画布
        lastTime;
    //画布宽高
    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);//将创建的画布添加到DOM中

    /* This function serves as the kickoff point for the game loop itself这个函数作为游戏循环本身的启动点
     * and handles properly calling the update and render methods.并正确处理调用的update 和 render方法。

     */
    function main() {
        /* Get our time delta information时间增量信息 which is required if your game
         * requires smooth animation平滑的动画. Because everyone's computer processes
         * instructions 计算机进程指令at different speeds we need a constant value恒定的值 that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),//获取当前时间
            dt = (now - lastTime) / 1000.0;//为确保时间的一致性

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        //调用我们的update / render函数
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta设置lastTime变量，这是用来确定时间delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         * 在浏览器能够绘制另一个框架时，使用浏览器的requestAnimationFrame函数再次调用此函数。
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    //此功能执行一些只发生一次的初始设置
    function init() {
        reset();//处理游戏重置状态
        lastTime = Date.now();//游戏时间的一致性
        main();//游戏循环本身的启动点
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    //这个函数由main（我们的游戏循环）调用，它自己调用所有可能需要更新实体的数据的功能。
    //基于你如何实现碰撞检测（当两个实体占用相同的空间，你的角色应该死），你可能会发现需要在这里添加一个附加的函数调用
    function update(dt) {
        updateEntities(dt);
        player.checkCollisions();//附加的碰撞检测函数调用
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     * 这由update函数调用，循环遍历app.js中定义的allEnemies数组中的所有对象，并调用它们的update（）方法。
     * 然后它将调用player对象的update（）方法。这些update（）方法应该仅仅用于更新与对象相关的数据/属性。
     * 在渲染方法中绘制图形。
     */
    function updateEntities(dt) {
        allEnemies.forEach(function (enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     * 此函数最初绘制“游戏级别”，然后将调用renderEntities函数。
     * 记住，这个函数被称为游戏引擎的循环，因为这是游戏的工作原理 - 它们像是是创建翻动的动画，但在现实中，他们只是一遍又一遍地画整个屏幕。
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         * 此数组包含用于游戏级别特定行图像的相对URL。
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,//行总数
            numCols = 5,//列总数
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         * 循环通过我们在上面定义的行数和列数，并使用rowImages数组，为“网格”的那部分绘制正确的图像，
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 * canvas的context元素的drawImage函数需要3个参数：要绘制的图像，开始绘制的x坐标，开始绘制的y坐标。
                 * 我们使用我们的资源帮助来引用我们的图像，以便我们获得缓存这些图像的好处，因为我们反复使用它们。
                 */

                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);//101 是图片的长 83是图片宽
            }
        }

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     * 此函数由render函数调用，并在每个游戏记号上调用。
     * 它的目的是为了调用你已经在app.js中定义的的虫子和玩家实体的render()渲染方法
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function (enemy) {
            enemy.render();
        });

        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    //处理游戏重置状态， 它只被init（）方法调用一次。
    function reset() {
        // noop
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     * 继续加载所有我们需要绘制我们的游戏关卡的图像，。
     * 然后设置init作为回调方法，以便当所有这些图像正确加载时我们的游戏也将开始。
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     * 将canvas的上下文对象映射到全局变量（在浏览器中运行时的窗口对象），以便开发人员可以在其app.js文件中更轻松地使用它。
     */
    global.ctx = ctx;
})(this);
