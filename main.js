// Global variables
var gates = [];
// var curGateIndex = 0;

// Camera scrolling section

function Camera() {
    this.x = 0;
    this.y = 0;
}

Camera.prototype.update = function(characterX, characterY) {
    if(characterX > 640 && characterY < 300) {
        this.x = characterX - 640;
        this.y = characterY - 300;
    }
    else if(characterX > 640) {
        this.x = characterX - 640;
        this.y = 0;
    }
    else if(characterY < 300) {
        this.x = 0;
        this.y = characterY - 300;
    }
    else{
        this.x = 0;
        this.y = 0;
    }
}
// End camera region

function BoundingBox(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.left = x;
    this.top = y;
    this.right = this.left + width;
    this.bottom = this.top + height;
}

BoundingBox.prototype.collide = function (oth) {
    if (this.right > oth.left && this.left < oth.right && this.top < oth.bottom && this.bottom > oth.top) return true;
    return false;
}

/**
 * Check if 2 objects collide with each other.
 * 
 * @param object1 an object with height and width
 * @param object2 an object with height and width
 */
function collided(object1, object2) {
    return (object1.x < object2.x + object2.width && 
        object1.x + object1.width > object2.x && 
        object1.y < object2.y + object2.height && 
        object1.y + object1.height > object2.y);
}

function knockedBack(entity) {
    for(var a = 0; a < entity.game.platforms.length; a++) {
        var wall = entity.game.platforms[a];
        if(wall.wall && entity.boundingbox.collide(wall.boundingbox) && entity.y > wall.boundingbox.y - 30) {
            
            if(entity.boundingbox.right > wall.boundingbox.left && entity.boundingbox.right < wall.boundingbox.right 
                && entity.boundingbox.top + 19 < wall.boundingbox.bottom) {
                    entity.x = entity.prevX
            } 
            else if(entity.boundingbox.left < wall.boundingbox.right && entity.boundingbox.left > wall.boundingbox.left 
                && entity.boundingbox.top + 19 < wall.boundingbox.bottom) {
                    entity.x = entity.prevX;
            }
        }
    }
}

// Begin distance formula
function distance(a, b) {
    var difX = a.x - b.x;
    var difY = a.y - b.y;
    return Math.sqrt(difX * difX + difY * difY);
};
// End

// #region Animation
function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}
// #endregion

// Begin background
function Background(game) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = ASSET_MANAGER.getAsset("./img/brickBG_1200x700.png");
    this.game = game;
    this.ctx = game.ctx;
}
Background.prototype.draw = function() {
    this.ctx.drawImage(this.spritesheet, this.x, this.y);
}
Background.prototype.update = function() {
}
// End Background

// Beginning StartScreen
function StartScreen(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

StartScreen.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);

};

StartScreen.prototype.update = function () {
};

function Menu(game, spritesheet, x , y) {
    this.x = x;
    this.y = y;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Menu.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Menu.prototype.update = function () {
};
// End StartScreen

// #region HealthBar
function HealthBar(game) {
    this.game = game;
    Entity.call(this, game, 0, 400);
    this.radius = 200;
}

HealthBar.prototype = new Entity();
HealthBar.prototype.constructor = HealthBar;

HealthBar.prototype.update = function () {
}

HealthBar.prototype.draw = function (ctx) {
    mc = this.game.entities.Character;

    ctx.fillStyle = "Red";
    ctx.fillRect(0,0, mc.hp, 30);
    ctx.fillStyle = "White";
    ctx.fillRect(mc.hp, 0, mc.maxHP - mc.hp, 30);
    ctx.beginPath();
    ctx.lineWidth = "4";
    ctx.strokeStyle = "black";
    ctx.rect(1, 1, mc.maxHP, 30);
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.font = "12px Verdana";
    ctx.fillText(mc.hp + "/" + mc.maxHP, 30, 20);

    ctx.fillStyle = "black";
    ctx.fillRect(0,30, 101, 16);
    ctx.fillStyle = "white";
    ctx.font = "12px Verdana";
    ctx.fillText("POWER: " + mc.attackPower, 20, 42);

    Entity.prototype.draw.call(this);
}
// #endregion

function GameWonScreen(game) {
    this.x = 0;
    this.y = 0;
    this.game = game;
    this.ctx = game.ctx;
};
GameWonScreen.prototype.draw = function () {
    this.ctx.fillStyle = "rgba(0, 0, 200, 0.7)";
    this.ctx.fillRect(0, 0, 1200, 700);
    this.ctx.fillStyle = "white";
    this.ctx.font = "100px Impact";
    this.ctx.fillText("You Won!", 330, 350);
};

GameWonScreen.prototype.update = function () {
    this.game.pause = true;
};

function GameOverScreen(game) {
    this.x = 0;
    this.y = 0;
    this.game = game;
    this.ctx = game.ctx;
};


GameOverScreen.prototype.draw = function () {
    this.ctx.fillStyle = "rgba(0, 0, 200, 0.7)";
    this.ctx.fillRect(0, 0, 1200, 700);
    this.ctx.fillStyle = "white";
    this.ctx.font = "100px Impact";
    this.ctx.fillText("Game Over", 330, 350);
};

GameOverScreen.prototype.update = function () {
    this.game.pause = true;
};

// the "main" code begins here
// #region Main

var ASSET_MANAGER = new AssetManager();

// Queue all assets used in game:

ASSET_MANAGER.queueDownload("./img/RobotUnicorn.png");
ASSET_MANAGER.queueDownload("./img/mc64.png");
ASSET_MANAGER.queueDownload("./img/ballsprite.png");
ASSET_MANAGER.queueDownload("./img/slimeEnemy.png");
ASSET_MANAGER.queueDownload("./img/turkey_32.png");
ASSET_MANAGER.queueDownload("./img/traps.png");
ASSET_MANAGER.queueDownload("./img/dino.png");
ASSET_MANAGER.queueDownload("./img/dinoReverse.png");
ASSET_MANAGER.queueDownload("./img/startScreen.png");
ASSET_MANAGER.queueDownload("./img/bat.png");
ASSET_MANAGER.queueDownload("./img/chest.png");
ASSET_MANAGER.queueDownload("./img/ghost.png");
ASSET_MANAGER.queueDownload("./img/nightmare.png");
ASSET_MANAGER.queueDownload("./img/redwolf.png");
ASSET_MANAGER.queueDownload("./img/blackwolf.png");
ASSET_MANAGER.queueDownload("./img/brickMed.png");

ASSET_MANAGER.queueDownload("./img/emberBack.gif");
ASSET_MANAGER.queueDownload("./img/startGame.png");
ASSET_MANAGER.queueDownload("./img/startGameHigh.png");
ASSET_MANAGER.queueDownload("./img/controls.png");
ASSET_MANAGER.queueDownload("./img/controlsHigh.png");
ASSET_MANAGER.queueDownload("./img/title.png");
ASSET_MANAGER.queueDownload("./img/miniBoss.png");
ASSET_MANAGER.queueDownload("./img/miniBossRev.png");
ASSET_MANAGER.queueDownload("./img/slashAttackRev.png");
ASSET_MANAGER.queueDownload("./img/slashAttackRevv.png");
ASSET_MANAGER.queueDownload("./img/miniBossRev2.png");

ASSET_MANAGER.queueDownload("./img/miniBossIdleRev.png");
ASSET_MANAGER.queueDownload("./img/miniBossFightingRev.png");
ASSET_MANAGER.queueDownload("./img/miniBossHitRev.png");
ASSET_MANAGER.queueDownload("./img/miniBossAttackSlashRev.png");


ASSET_MANAGER.queueDownload("./img/miniBossIdle.png");
ASSET_MANAGER.queueDownload("./img/miniBossFighting.png");
ASSET_MANAGER.queueDownload("./img/miniBossHit.png");
ASSET_MANAGER.queueDownload("./img/miniBossAttackSlash.png");

ASSET_MANAGER.queueDownload("./img/controlScreen.jpg");
ASSET_MANAGER.queueDownload("./img/skeleton.png");
ASSET_MANAGER.queueDownload("./img/brickBG_1200x700.png");
ASSET_MANAGER.queueDownload("./img/tiles_32x32.png");
ASSET_MANAGER.queueDownload("./img/brickSmall.png");
ASSET_MANAGER.queueDownload("./img/brickMed.png");
ASSET_MANAGER.queueDownload("./img/dirt_tiles.png");
ASSET_MANAGER.queueDownload("./img/tileBrickGreen.png");
ASSET_MANAGER.queueDownload("./img/mc_attack88x68.png");
ASSET_MANAGER.queueDownload("./img/spike30x24.png");
ASSET_MANAGER.queueDownload("./img/dart.png");
ASSET_MANAGER.queueDownload("./img/darttrap.png");
ASSET_MANAGER.queueDownload("./img/yellowplat28x16.png");
ASSET_MANAGER.queueDownload("./img/shuriken.png");
ASSET_MANAGER.queueDownload("./img/lever38x32.png");
ASSET_MANAGER.queueDownload("./img/sword40x39.png");

// Download all assests before starting game
ASSET_MANAGER.downloadAll(function () {
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');
    var gameEngine = new GameEngine();

    gameEngine.init(ctx);
    gameEngine.start();
    gameEngine.addEntity(new StartScreen(gameEngine, ASSET_MANAGER.getAsset("./img/emberBack.gif")));
    gameEngine.addEntity(new Menu(gameEngine, ASSET_MANAGER.getAsset("./img/title.png"), -20, 60));
    gameEngine.addEntity(new Menu(gameEngine, ASSET_MANAGER.getAsset("./img/startGameHigh.png"), 90, 400));
    gameEngine.addEntity(new Menu(gameEngine, ASSET_MANAGER.getAsset("./img/controls.png"), 100, 500));
 
});
// #endregion
