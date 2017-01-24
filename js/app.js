//Any random number
function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}
// Any random integer
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//SINGLE_HEIGHT means the table height ,SINGLE_WIDTH means the table width
var SINGLE_HEIGHT = 83,
    SINGLE_WIDTH = 101;

// Enemies our player must avoid
var Enemy = function () {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = -SINGLE_WIDTH;
    //SINGLE_HEIGHT / 4 this value in order to keep enemies in the Middle
    this.y = SINGLE_HEIGHT * getRandomInt(1, 3) - SINGLE_HEIGHT / 4;
    this.speed = getRandom(1.5, 5.0);
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt * 40;
    if (this.x > SINGLE_WIDTH * 5) {
        this.x = -SINGLE_WIDTH;
        this.y = SINGLE_HEIGHT * getRandomInt(1, 3) - SINGLE_HEIGHT / 4;
    }

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function () {
    this.x = SINGLE_WIDTH * 2;
    //SINGLE_HEIGHT/6 this value in order to keep player in the Middle
    this.y = SINGLE_HEIGHT * 5 - SINGLE_HEIGHT / 8;
    // The image/sprite for our player, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-boy.png';
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
                this.x -= SINGLE_WIDTH;
            }
            break;
        case "right":
            if (this.x < 4 * SINGLE_WIDTH) {
                this.x += SINGLE_WIDTH;
            }
            break;
        case "up":
            if (this.y > 0)
                this.y -= SINGLE_HEIGHT;
            else {
                this.reset();//When you reach the top of the River, player return to the starting position
            }
            break;
        case "down":
            if (this.y <4 * SINGLE_HEIGHT) {
                this.y += SINGLE_HEIGHT;
            }
            break;
    }
};
Player.prototype.reset = function () {
    this.x = SINGLE_WIDTH * 2;
    this.y = SINGLE_HEIGHT * 5 - SINGLE_HEIGHT / 8;
};
//Impact validation functions，in four cases
Player.prototype.checkCollisions = function () {
    for (var i = 0; i < allEnemies.length; i++)
        if (this.y > allEnemies[i].y - SINGLE_HEIGHT + SINGLE_HEIGHT / 6 &&
            this.y < allEnemies[i].y + SINGLE_HEIGHT - SINGLE_HEIGHT / 6 &&
            this.x > allEnemies[i].x - SINGLE_WIDTH &&
            this.x < allEnemies[i].x + SINGLE_WIDTH - SINGLE_WIDTH / 4) {
            this.reset();
            break;
        }
};
// Now instantiate your objects.
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

