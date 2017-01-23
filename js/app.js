//Any random number
function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}
// Any random integer
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//singleHeight means the table height ,singleWidth means the table width
var singleHeight = 83,
    singleWidth = 101;

// Enemies our player must avoid
var Enemy = function () {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = -singleWidth;
    //singleHeight / 4 this value in order to keep enemies in the Middle
    this.y = singleHeight * getRandomInt(1, 3) - singleHeight / 4;
    this.speed = getRandom(1.5, 5.0);
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';//加载图片
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt * 40;
    if (this.x > singleWidth * 5) {
        this.x = -singleWidth;
        this.y = singleHeight * getRandomInt(1, 3) - singleHeight / 4;
    }

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class创建player类，并添加方法
// This class requires an update(), render() and
// a handleInput() method.
var Player = function () {
    this.x = singleWidth * 2;
    //singleHeight/6 this value in order to keep player in the Middle
    this.y = singleHeight * 5 - singleHeight / 6;
    // The image/sprite for our player, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-boy.png';//加载图片
};
//not need
Player.prototype.update = function () {

};
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
//An event listener is set to detect keyup positions of
//the arrows keys.
Player.prototype.handleInput = function (key) {
    switch (key) {
        case "left":
            if (this.x > 0) {
                this.x -= singleWidth;
            }
            break;
        case "right":
            if (this.x < 4 * singleWidth) {
                this.x += singleWidth;
            }
            break;
        case "up":
            if (this.y > 0)
                this.y -= singleHeight;
            else {
                this.reset();//When you reach the top of the River, player return to the starting position
            }
            break;
        case "down":
            if (this.y < 5 * singleHeight) {
                this.y += singleHeight;
            }
            break;
    }
};
Player.prototype.reset = function () {
    this.x = singleWidth * 2;
    this.y = singleHeight * 5 - singleHeight / 6;
};
//Impact validation functions，in four cases
Player.prototype.checkCollisions = function () {
    for (var i = 0; i < allEnemies.length; i++)
        if (this.y > allEnemies[i].y - singleHeight + singleHeight / 6 && //人的下边界与虫子上边界碰撞
            this.y < allEnemies[i].y + singleHeight - singleHeight / 6 && //人的上边界与虫子下边界碰撞
            this.x > allEnemies[i].x - singleWidth &&  //人的右边界与虫子左边界碰撞
            this.x < allEnemies[i].x + singleWidth - singleWidth / 4) {  //人的左边界与虫子右边界碰撞
            this.reset();
            break;
        }
};
// Now instantiate your objects.创建 enemy和player实例
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();
var allEnemies = [];
var enemyCount = 5;
for (var i = 0; i < enemyCount; i++) {
    var enemy = new Enemy();
    allEnemies.push(enemy);
    console.log(enemy.speed);
}
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

