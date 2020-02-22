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

function Platform(game, theX, theY) {
    this.idle = new Animation(ASSET_MANAGER.getAsset("./img/yellowplat28x16.png"), 0, 0, 28, 16, 1, 1, true, false);
    Entity.call(this, game, theX, theY);
    this.platform = true;
    this.boundingbox = new BoundingBox(theX,theY,32,32);
}
Platform.prototype = new Entity();
Platform.prototype.constructor = Platform;

Platform.prototype.update = function () {
    Entity.prototype.update.call(this);
}
Platform.prototype.draw = function(ctx) {
    this.idle.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    Entity.prototype.draw.call(this);
}

function Wall(game, theX, theY) {
    this.idle = new Animation(ASSET_MANAGER.getAsset("./img/brickMed.png"), 16, 32, 32, 32, 1, 1, true, false);
    Entity.call(this, game, theX, theY);
    this.platform = false;
    this.wall = true;
    this.boundingbox = new BoundingBox(theX, theY, 32, 32);
}

// this.idle = new Animation(ASSET_MANAGER.getAsset("./img/yellowplat28x16.png"), 0, 0, 28, 16, 1, 1, true, false);

Wall.prototype = new Entity();
Wall.prototype.constructor = Wall;

Wall.prototype.update = function () {
    Entity.prototype.update.call(this);
}

Wall.prototype.draw = function(ctx) {
    this.idle.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    Entity.prototype.draw.call(this);
}

function WallPlatform(game, theX, theY, collideBot, isPlatform, isGate) {
    this.game = game;
    this.idle = new Animation(ASSET_MANAGER.getAsset("./img/brickMed.png"), 16, 32, 32, 32, 1, 1, true, false);
    Entity.call(this, game, theX, theY);
    this.platform = isPlatform;
    this.wall = true;
    this.isGate = isGate;
    this.collideBottom = collideBot;
    this.boundingbox = new BoundingBox(theX,theY,28,16);
}

WallPlatform.prototype = new Entity();
WallPlatform.prototype.constructor = WallPlatform;

WallPlatform.prototype.update = function () {
    if (this.game.openNext && this.isGate) {
        this.removeFromWorld = true;
    } 
    Entity.prototype.update.call(this);
}

WallPlatform.prototype.draw = function(ctx) {
    this.idle.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    Entity.prototype.draw.call(this);
}

function DartTrap(game, theX, theY) {
    this.idle = new Animation(ASSET_MANAGER.getAsset("./img/darttrap.png"), 0, 0, 32, 32, 1, 1, true, false);
    Entity.call(this, game, theX, theY);
}

DartTrap.prototype = new Entity();
DartTrap.prototype.constructor = DartTrap;

DartTrap.prototype.update = function () {
    Entity.prototype.update.call(this);
}

DartTrap.prototype.draw = function(ctx) {
    this.idle.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    Entity.prototype.draw.call(this);
}

function Dart(game, theX, theY, minX) {
    this.game = game;
    this.fly = new Animation(ASSET_MANAGER.getAsset("./img/dart.png"), 0, 0, 27, 8, 1, 1, true, false);
    this.boundingbox = new BoundingBox(theX, theY, 27, 8);
    this.minX = minX;
    this.maxX = theX;
    Entity.call(this, game, theX, theY);
}

Dart.prototype = new Entity();
Dart.prototype.constructor = Dart;

Dart.prototype.update = function () {
    this.x = this.x - 200 * this.game.clockTick;
    if(this.x < this.minX) {
        this.x = this.maxX;
    }
    var mc = this.game.entities.Character;
    this.boundingbox = new BoundingBox(this.x, this.y, 27, 8);
    if (collided(this.boundingbox, mc.boundingbox)) {
        mc.hp -= 1;
        mc.damaged = true;
    }
    Entity.prototype.update.call(this);
}

Dart.prototype.draw = function(ctx) {
    this.fly.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    Entity.prototype.draw.call(this);
}

//#region Shuriken
function Shuriken(game) {
    this.thrown = new Animation(ASSET_MANAGER.getAsset("./img/shuriken.png"), 0, 0, 31, 31, .05, 3, true, false);
    this.radius = 32;
    this.ground = 592;
    this.left = true;
    this.boundingbox = new BoundingBox(this.x, this.y, 31, 31);
    Entity.call(this, game, game.entities.Character.x + 15, game.entities.Character.y + 12);
}

Shuriken.prototype = new Entity();
Shuriken.prototype.constructor = Shuriken;

// Bug when camera scroll
Shuriken.prototype.update = function () {
    this.boundingbox = new BoundingBox(this.x, this.y, 31, 31);
    if(this.left) {
        this.x = this.x + this.game.clockTick * 400;
    }
    else {
        this.x = this.x - this.game.clockTick * 400;
    }
    for(let b = 0; b < this.game.enemies.length; b++) {
        if(this.boundingbox.collide(this.game.enemies[b].boundingbox)) {
            this.removeFromWorld = true;
            this.game.enemies[b].hp -= 5;
            if(this.game.enemies[b].hp < 1) {
                this.game.enemies.removeFromWorld = true;
            }
        }
    }
    for(let a = 0; a < this.game.platforms.length; a++) {
        if(this.boundingbox.collide(this.game.platforms[a].boundingbox)) {
            this.removeFromWorld = true;
        }
    }
    Entity.prototype.update.call(this);
}

Shuriken.prototype.draw = function (ctx) {
    this.thrown.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
}
// #endregion

// #region Main Character
function MainCharacter(game) {
    this.game = game;

    this.walkAnim = new Animation(ASSET_MANAGER.getAsset("./img/mc64.png"), 0, 64, 64, 64, .1, 4, true, false);
    this.backWalkAnim= new Animation(ASSET_MANAGER.getAsset("./img/mc64.png"), 0, 0, 64, 64, .1, 4, true, false);
    this.attackBackAnim = new Animation(ASSET_MANAGER.getAsset("./img/mc_attack88x68.png"), 0, 68, 88, 68, .07, 4, false, false);
    this.attackForwardAnim = new Animation(ASSET_MANAGER.getAsset("./img/mc_attack88x68.png"), 0, 0, 88, 68, .07, 4, false, false);
    this.idleBackAnim = new Animation(ASSET_MANAGER.getAsset("./img/mc64.png"), 0, 0, 64, 64, .1, 1, true, false);
    this.idleAnim = new Animation(ASSET_MANAGER.getAsset("./img/mc64.png"), 0, 64, 64, 64, .1, 1, true, false);
    this.jumpForward = new Animation(ASSET_MANAGER.getAsset("./img/mc64.png"), 0, 320, 64, 64, .17, 4, false, false);
    this.jumpBackward = new Animation(ASSET_MANAGER.getAsset("./img/mc64.png"), 0, 256, 64, 64, .17, 4, false, false);
    this.fallForward = new Animation(ASSET_MANAGER.getAsset("./img/mc64.png"), 0, 320, 64, 64, .2, 4, true, false);
    this.fallBackward = new Animation(ASSET_MANAGER.getAsset("./img/mc64.png"), 0, 256, 64, 64, .2, 4, true, false);
    this.damageAnimeForw = new Animation(ASSET_MANAGER.getAsset("./img/mc64.png"), 0, 576, 64, 64, .1, 4, false, false);
    this.damageAnimeBack = new Animation(ASSET_MANAGER.getAsset("./img/mc64.png"), 0, 512, 64, 64, .1, 4, false, false);
    
    this.damaged = false;
    this.jumping = false;
    this.stand = true;
    this.back = false;
    this.attack = false;
    this.falling = false;
    this.base = null;
    this.jumpHeight = 175;
    this.maxHP = 500;
    this.attackPower = 5;
    this.ticksSinceDamage = 200;
    this.hp = 500;
    this.radius = 64;
    this.ground = 592;
    this.platform = this.game.platforms[0];
    this.checkPoint = {x: 50, y: 544};
    this.bossFight = false;
    
    this.boundingbox = new BoundingBox(this.x + 10, this.y, 22, 64);
    this.hitBoxFront = new BoundingBox(this.x + 40, this.y, 44, 64);
    this.hitBoxBack = new BoundingBox(this.x - 24, this.y, 44, 64);

    Entity.call(this, game, 50, 544);
    // Entity.call(this, game, 2464, -416);
    // Entity.call(this, game, 4608, 640);
    //Entity.call(this, game, 6500, 200);
    // Entity.call(this, game, 7100, 400);
}

MainCharacter.prototype = new Entity();
MainCharacter.prototype.constructor = MainCharacter;

MainCharacter.prototype.checkPointUpdate = function() {
    if(this.x > 7300 && this.bossFight === false) {
        this.game.enemies.push(new BossWolf(this.game, 7815, 277));
        this.bossFight = true;
    }

    if (this.y > 90 && this.x > 2000) {
        this.checkPoint = {x: 2410, y: 90};
    }
    if (this.y < -288 && this.x > 1800) {
        this.checkPoint = {x: 1800, y: -352};
    }
    else if(this.x > 7100) {
        this.checkPoint = {x: 7100, y: 400};
    }
    else if(this.x > 4500) {
        this.checkPoint = {x: 4500, y: 450};
    }
    else if(this.x > 1700) {
        this.checkPoint = {x: 1700, y: 400};
    }
    
}

// Character will get damaged if he collide with a trap (except when has fallen to the ground.)
// MainCharacter.prototype.collideTrap = function() {
//     var trapRadius = traps[0].radius;
//             // top collision
//     return (traps[0].y + trapRadius >= this.y && traps[0].y + trapRadius <= this.y + this.radius)
//             // left & right collision
//             && ((traps[0].x + trapRadius <= this.x + this.radius
//                 && traps[0].x + trapRadius >= this.x) || (traps[0].x >= this.x
//                 && traps[0].x <= this.x + this.radius));
// }

MainCharacter.prototype.update = function () {
    this.ticksSinceDamage += this.game.clockTick;
    this.boundingbox = new BoundingBox(this.x + 24, this.y, 22, 64);
    this.hitBoxFront = new BoundingBox(this.x + 40, this.y, 46, 64);
    this.hitBoxBack = new BoundingBox(this.x - 24, this.y, 46, 64);

    // if fall off map, die
    if (this.y > 700) {
        this.hp = this.hp - 20;
        this.x = this.checkPoint.x;
        this.y = this.checkPoint.y;
    }
    if (this.hp <= 0) {
        this.game.cosmeticEntities.push(new GameOverScreen(this.game));
    }
    if(this.game.d) {
        this.x = this.x + this.game.clockTick * 300;
    }
    if(this.game.a) {
        this.x = this.x - this.game.clockTick * 300
    }
    if (this.game.space && !this.falling && !this.jumping) {
        this.jumping = true;
        this.base = this.y; 
    }
    if(this.game.l) {
        this.attack = true;
    }
    if(this.game.d || this.game.a) {
        this.stand = false;
        if(this.game.d == false) {
            this.back = true;
        }
        else {
            this.back = false;
        }
    }
    else {
        this.stand = true;
    }
    if(this.game.r) {
        newBall = new Shuriken(this.game);
        if(this.back) {
            newBall.left = false;
        }
        this.game.addEntity(newBall);
        this.game.r = false;
    }
    if(this.game.camera) {
        this.game.camera.update(this.x, this.y);
    }

    if(this.x < 0) {
        this.x = 0;
    }
    this.checkPointUpdate();

    if (this.jumping) {
        if(this.jumpForward.elapsedTime + this.game.clockTick > this.jumpForward.totalTime) {
            this.jumping = false;
            this.jumpForward.elapsedTime = 0;
            this.jumpBackward.elapsedTime = 0;
            this.fallForward.elapsedTime = 0;
            this.fallBackward.elapsedTime = 0;
        }
        if(this.jumpBackward.elapsedTime > this.jumpForward.elapsedTime) {
            this.jumpForward.elapsedTime = this.jumpBackward.elapsedTime;
        }
        else if(this.jumpForward.elapsedTime > this.jumpBackward.elapsedTime) {
            this.jumpBackward.elapsedTime = this.jumpForward.elapsedTime;
        }
        var duration = this.jumpForward.elapsedTime + this.game.clockTick;
        if(duration > this.jumpForward.totalTime / 2) duration = this.jumpForward.totalTime - duration;
        duration = duration / this.jumpForward.totalTime;

        var totalHeight = this.jumpHeight;

        var height = (4 * duration - 4 * duration * duration) * this.jumpHeight;
        this.y = this.base - height;
        this.lastbottom = this.boundingbox.bottom;
        this.boundingbox = new BoundingBox(this.x + 24, this.y, 22, 64);
        this.hitBoxFront = new BoundingBox(this.x + 40, this.y, 46, 64);
        this.hitBoxBack = new BoundingBox(this.x - 24, this.y, 46, 64);
        for(var z = 0; z < this.game.platforms.length; z++) {
            var pf = this.game.platforms[z];
            if(pf.platform && this.boundingbox.collide(pf.boundingbox) && this.lastbottom < pf.boundingbox.top)  {
                this.jumping = false;
                this.y = pf.boundingbox.top - 64;
                this.platform = pf;
                this.jumpForward.elapsedTime = 0;
                this.jumpBackward.elapsedTime = 0;
                this.boundingbox = new BoundingBox(this.x + 24, this.y, 22, 64);
                this.hitBoxFront = new BoundingBox(this.x + 40, this.y, 46, 64);
                this.hitBoxBack = new BoundingBox(this.x - 24, this.y, 46, 64);
            }
        }
        
    }
    if(this.falling) {
        this.y += (this.game.clockTick / this.fallForward.totalTime * 4 * this.jumpHeight);
        this.lastbottom = this.boundingbox.bottom;
        this.boundingbox = new BoundingBox(this.x + 24, this.y, 22, 64);
        this.hitBoxFront = new BoundingBox(this.x + 40, this.y, 46, 64);
        this.hitBoxBack = new BoundingBox(this.x - 24, this.y, 46, 64);

        for (var i = 0; i < this.game.platforms.length; i++) {
            var pf = this.game.platforms[i];
            if (pf.platform && this.boundingbox.collide(pf.boundingbox) && this.lastbottom - 60 < pf.boundingbox.top) {
                this.falling = false;
                this.y = pf.boundingbox.top - 62;
                this.platform = pf;
                this.fallForward.elapsedTime = 0;
                this.fallBackward.elapsedTime = 0;
                console.log(this.platform.x + "    " + this.platform.y);
                this.boundingbox = new BoundingBox(this.x + 24, this.y, 22, 64);
                this.hitBoxFront = new BoundingBox(this.x + 40, this.y, 46, 64);
                this.hitBoxBack = new BoundingBox(this.x - 24, this.y, 46, 64);
            }
        }
    }
    if(!this.falling && !this.jumping) {
        if(!this.boundingbox.collide(this.platform.boundingbox))  {
            this.falling = true
        }
    }
    if(this.attack) {
        if(this.attackForwardAnim.elapsedTime > this.attackBackAnim.elapsedTime) {
            this.attackBackAnim.elapsedTime = this.attackForwardAnim.elapsedTime;
        }
        else {
            this.attackForwardAnim.elapsedTime = this.attackBackAnim.elapsedTime;
        }
        if (this.attackForwardAnim.elapsedTime + this.game.clockTick > this.attackForwardAnim.totalTime) {
            this.attackForwardAnim.elapsedTime = 0;
            this.attackBackAnim.elapsedTime = 0;
            this.attack = false;
        }
        if(this.jumping) {
            this.jumpForward.elapsedTime = this.jumpForward.elapsedTime + this.game.clockTick;
        }
    }

    if(this.damaged) {
        if (this.damageAnimeForw.elapsedTime + this.game.clockTick > this.damageAnimeForw.totalTime) {
            this.damageAnimeForw.elapsedTime = 0;
            this.damaged = false;
        } else if (this.damageAnimeBack.elapsedTime + this.game.clockTick > this.damageAnimeBack.totalTime) {            
            this.damageAnimeBack.elapsedTime = 0;
            this.damaged = false;
        }
    }
    for(var a = 0; a < this.game.platforms.length; a++) {
        var wall = this.game.platforms[a];
        if(wall.wall && this.boundingbox.collide(wall.boundingbox) && this.y > wall.boundingbox.y - 30) {
            
            if(this.boundingbox.right > wall.boundingbox.left && this.boundingbox.right < wall.boundingbox.right 
                && this.boundingbox.top + 19 < wall.boundingbox.bottom) {
                    this.x = this.x - this.game.clockTick * 300;
                    this.boundingbox = new BoundingBox(this.x + 24, this.y, 22, 64);
                    this.hitBoxFront = new BoundingBox(this.x + 40, this.y, 46, 64);
                    this.hitBoxBack = new BoundingBox(this.x - 24, this.y, 46, 64);
            } 
            else if(this.boundingbox.left < wall.boundingbox.right && this.boundingbox.left > wall.boundingbox.left 
                && this.boundingbox.top + 19 < wall.boundingbox.bottom) {
                    this.x = this.x + this.game.clockTick * 300;
                    this.boundingbox = new BoundingBox(this.x + 24, this.y, 22, 64);
                    this.hitBoxFront = new BoundingBox(this.x + 40, this.y, 46, 64);
                    this.hitBoxBack = new BoundingBox(this.x - 24, this.y, 46, 64);
            }
            else if(wall.collideBottom && this.boundingbox.top < wall.boundingbox.bottom && wall.boundingbox.top < this.boundingbox.bottom 
                ) {
                this.y = wall.boundingbox.bottom + 10;
                this.falling = true;
                this.jumping = false   
                this.jumpForward.elapsedTime = 0;
                this.jumpBackward.elapsedTime = 0;
            } 
        }
    }
    Entity.prototype.update.call(this);
}

MainCharacter.prototype.draw = function (ctx) {

    if(this.attack && this.back) {
        this.attackBackAnim.drawFrame(this.game.clockTick, ctx, this.x - 24 - this.game.camera.x, this.y - 2 - this.game.camera.y);
    }
    else if(this.attack && !this.back) {
        this.attackForwardAnim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - 2 - this.game.camera.y);
    }
    else if (this.jumping && !this.back) {
        this.jumpForward.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else if(this.jumping && this.back) {
        this.jumpBackward.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else if (this.falling && !this.back && this.y > this.platform.top) {
        this.fallForward.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else if(this.falling && this.back && this.y > this.platform.top) {
        this.fallBackward.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else if (this.damaged && !this.back) {
        this.damageAnimeForw.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else if (this.damaged && this.back) {
        this.damageAnimeBack.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else if(this.stand == false && this.back == false) {
        this.walkAnim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else if(this.stand == false && this.back == true) {
        this.backWalkAnim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else if(this.stand == true && this.back == false){
        this.idleAnim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else {
        this.idleBackAnim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    } 
    Entity.prototype.draw.call(this);
}
// #endregion

//#region Ball
function Ball(game) {
    this.thrown = new Animation(ASSET_MANAGER.getAsset("./img/ballsprite.png"), 0, 0, 32, 32, .05, 3, true, false);
    this.radius = 32;
    this.ground = 592;
    this.left = true;
    Entity.call(this, game, game.entities.Character.x, game.entities.Character.y);
}

Ball.prototype = new Entity();
Ball.prototype.constructor = Ball;

// Bug when camera scroll
Ball.prototype.update = function () {
    if(this.left) {
        this.x = this.x + this.game.clockTick * 400;
    }
    else {
        this.x = this.x - this.game.clockTick * 400;
    }
    if(this.x > 1500 || this.x < -200) {
        this.removeFromWorld = true;
    }
    Entity.prototype.update.call(this);
}

Ball.prototype.draw = function (ctx) {
    this.thrown.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
}
// #endregion

// function collidePlat(entity) {
//     collide = false;
//     for (var i = 0; i < entity.game.platforms.length; i++) {
//         collide = entity.boundingbox.collide(entity.game.platforms[i].boundingbox);
//         if (collide) {
//             return true;
//         }
//     }
//     return collide;
// }


//#region Falling Spike Trap
function FallingSpike(game, theX, theY) {
    this.game = game;
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/traps.png"), 12, 62, 32, 32, 0.3, 1, true, true);
    this.radius = 28;
    this.boundingbox = new BoundingBox(theX, theY, 30, 20);
    this.falling = false;
    Entity.call(this, game, theX, theY);
}
FallingSpike.prototype = new Entity();
FallingSpike.prototype.constructor = FallingSpike;
FallingSpike.prototype.collidePlat = function() {
    collide = false;
    for (var i = 0; i < this.game.platforms.length; i++) {
        collide = this.boundingbox.collide(this.game.platforms[i].boundingbox);
        if (collide) {
            return true;
        }
    }
    return collide;
}
FallingSpike.prototype.update = function() {
    this.boundingbox = new BoundingBox(this.x, this.y, 30, 20);
    var mc = this.game.entities.Character;
    if (this.falling) {
        this.y += 5;
    }
    else if (!this.collidePlat() && Math.abs(mc.x - this.x) <= 64 && Math.abs(mc.y - this.y) <= 224) {
        this.falling = true;
    }
    if (this.collidePlat() || this.y > 700) {
        this.removeFromWorld = true;
    }
    var mc = this.game.entities.Character;
    if (collided(mc.boundingbox, this.boundingbox)) {
        mc.damaged = true;
        mc.hp -= 2;
        if (mc.back) {
            mc.x += 15;
        } else {
            mc.x -= 15;
        }
    }

    Entity.prototype.update.call(this);
}
FallingSpike.prototype.draw = function(ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    Entity.prototype.draw.call(this);
}
// #endregion

//#region Spike Trap
function Spike(game, theX, theY) {
    this.game = game;
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/spike30x24.png"), 0, 0, 30, 24, 0.3, 1, true, true);
    this.radius = 28;
    this.boundingbox = new BoundingBox(theX, theY, 28, 24);
    Entity.call(this, game, theX, theY);
}
Spike.prototype = new Entity();
Spike.prototype.constructor = Spike;
Spike.prototype.collidePlat = function() {
    collide = false;
    for (var i = 0; i < this.game.platforms.length; i++) {
        collide = this.boundingbox.collide(this.game.platforms[i].boundingbox);
        if (collide) {
            return true;
        }
    }
    return collide;
}
Spike.prototype.update = function() {
    this.boundingbox = new BoundingBox(this.x, this.y, 28, 24);
    if (!this.collidePlat()) {
        this.y += 2;
    }
    var mc = this.game.entities.Character;
    if (collided(mc.boundingbox, this.boundingbox)) {
        mc.damaged = true;
        mc.hp -= 2;
        if (mc.back) {
            mc.x += 15;
        } else {
            mc.x -= 15;
        }
    }

    Entity.prototype.update.call(this);
}
Spike.prototype.draw = function(ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    Entity.prototype.draw.call(this);
}

//#region Turkey
function Turkey(game, x, y) {
    this.game = game;
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/turkey_32.png"), 0, 0, 32, 32, 0.3, 3, true, true);
    this.radius = 32;
    this.ground = y;
    this.boundingbox = new BoundingBox(this.x, this.y, 32, 32);
    Entity.call(this, game, x, y);
}

Turkey.prototype = new Entity();
Turkey.prototype.constructor = Turkey;
Turkey.prototype.collidePlat = function() {
    collide = false;
    for (var i = 0; i < this.game.platforms.length; i++) {
        collide = this.boundingbox.collide(this.game.platforms[i].boundingbox);
        if (collide) {
            return true;
        }
    }
    return collide;
}

// Check if collided with MC; return true if collided, false, otherwise
Turkey.prototype.collided = function() {
    var charact = this.game.entities.Character;
    return distance(this, charact) <= this.radius / 1.9 + charact.radius / 1.9;
}

Turkey.prototype.update = function() {
    this.boundingbox = new BoundingBox(this.x, this.y, 32, 36);
    if (!this.collidePlat()) {
        this.y += 2;
    }
    if (this.collided()) {
        this.removeFromWorld = true;
        if (this.game.entities.Character.hp + 30 >= this.game.entities.Character.maxHP) {
            this.game.entities.Character.hp = this.game.entities.Character.maxHP;
        } else {
            this.game.entities.Character.hp += 40;
        }
    }
    Entity.prototype.update.call(this);
}

Turkey.prototype.draw = function(ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    Entity.prototype.draw.call(this);
}
//#endregion

function Sword(game, x, y) {
    this.game = game;
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/sword40x39.png"), 0, 0, 40, 39, 1, 1, true, false);
    this.radius = 36;
    this.ground = y;
    Entity.call(this, game, x, y);
}
Sword.prototype = new Entity();
Sword.prototype.constructor = Sword;

// Check if collided with MC; return true if collided, false, otherwise
Sword.prototype.collided = function() {
    var charact = this.game.entities.Character;
    return distance(this, charact) <= this.radius / 1.9 + charact.radius / 1.9;
}

Sword.prototype.update = function() {
    if (this.collided()) {
        this.game.entities.Character.attackPower += 5;
        this.removeFromWorld = true;
    }
    Entity.prototype.update.call(this);
}

Sword.prototype.draw = function(ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    Entity.prototype.draw.call(this);
}

//Dino region
function Dino(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/dino.png"), 0, 0, 960 / 5, 576 / 3, 0.3, 10, true, false);
    this.WalkLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/dinoReverse.png"), 0, 0, 960 / 5, 576 / 3, 0.3, 10, true, true);
    this.TurnLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/dino.png"), 192, 0, 960 / 5, 576 / 3, 0.3, 3, true, false);
    this.TurnRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/dino.png"), 192, 0, 960 / 5, 576 / 3, 0.3, 3, true, true);
    this.jumping = false;
    this.speed = 50;
    this.radius = 576 / 3;
    this.ground = 465;
    this.walkLeft = true;
    this.walkRight = false; 
    this.jumpTime = 0;
    Entity.call(this, game, 100, this.ground);

}

Dino.prototype = new Entity();
Dino.prototype.constructor = Dino;

Dino.prototype.update = function() {
        // fall if not on a platform
        // if (!onPlatform(this)) {
        //     this.y += 1;
        // }
    
        if(this.walkLeft) {
            this.x -= this.game.clockTick * this.speed;
            if(this.x <= 100) {
                this.walkLeft = false;
                this.walkRight = true;
            }
        }
        else {
            this.x += this.game.clockTick * this.speed;
            if(this.x >= 1000) {
                this.walkRight = false;
                this.walkLeft = true;
            }
        }

        if(this.walkLeft) {
            this.x -= this.game.clockTick * this.speed;
            if(this.x <= 100) {
                this.walkLeft = false;
                this.walkRight = true;
            }
        }
        else {
            this.x += this.game.clockTick * this.speed;
            if(this.x >= 1000) {
                this.walkRight = false;
                this.walkLeft = true;
            }
        }

    Entity.prototype.update.call(this);

}

Dino.prototype.draw = function (ctx) {
    if(this.walkLeft) {
        this.WalkLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
        // this.walkRightAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);

    Entity.prototype.draw.call(this);
}
//end region

//#region Slime
function Slime(game, theX, theY, minX, maxX) {
    this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/slimeEnemy.png"), 0, 0, 64, 64, 0.15, 5, false, true);
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/slimeEnemy.png"), 0, 64, 64, 64, 0.3, 3, true, true);
    this.walkRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/slimeEnemy.png"), 192, 64, 64, 64, 0.3, 3, true, true);
    this.deathAnimation = new Animation(ASSET_MANAGER.getAsset("./img/slimeEnemy.png"), 64, 128, 64, 64, 0.35, 3, false, false);
    this.jumping = false;
    this.speed = 100;
    this.radius = 40;
    this.width = 40;
    this.height = 40;
    this.ground = theY;
    this.walkLeft = true;
    this.walkRight = false;
    this.jumpTime = 0;
    this.game = game;
    this.hp = 15;
    this.maxX = maxX;
    this.minX = minX;
    this.damagedTimer = 0;
    this.boundingbox = new BoundingBox(theX + 16, theY + 16, 32, 32);
    Entity.call(this, game, theX, theY);
    // Entity.call(this, game, 2800, 700);
}

Slime.prototype = new Entity();
Slime.prototype.constructor = Slime;

Slime.prototype.update = function() {
    this.boundingbox = new BoundingBox(this.x + 16, this.y + 16, 32, 32);
    var mc = this.game.entities.Character;
    if (this.hp <= 0 && this.deathAnimation.isDone()) {
        this.removeFromWorld = true;
    }

    if(this.y > this.ground ) {
        this.hp = -1;
    }

    if (collided(mc.boundingbox, this.boundingbox) && this.hp > 0) {
        mc.hp -= 2;
        mc.damaged = true;
        if (mc.back) {
            mc.x += 15;
        } else {
            mc.x -= 15;
        }
    }
    if (mc.attack) {
        if (collided(mc.hitBoxBack, this.boundingbox) || collided(mc.hitBoxFront, this.boundingbox)) {
            if(this.damagedTimer <= 0) {
                this.hp -= mc.attackPower;
                if(mc.back) {
                    this.x -= 30;
                }
                else {
                    this.x += 30;
                }
                this.damagedTimer = mc.attackForwardAnim.totalTime;
                console.log("Slime hit by MC");
                console.log("Slime Health: " + this.hp);
            }
            else {
                this.damagedTimer -= this.game.clockTick;
            }
        }
    }

    
    if(this.jumpTime >= 100) {
        this.jumping = true;
    }
    if(mc.x < this.x && this.x > this.minX && Math.abs(this.x - mc.x) <= 100) {
        this.walkLeft = true;
        this.walkRight = false;
    }
    if(mc.x > this.x && this.x < this.maxX && Math.abs(this.x - mc.x) <= 100) {
        this.walkRight = true;
        this.walkLeft = false;
    }
    if(mc.x < this.x && this.x > this.leftBoundX) {
        this.walkLeft = true;
        this.walkRight = false;
    }
    else if(mc.x > this.x && this.x < this.rightBoundX ) {
        this.walkLeft = false;
        this.walkRight = true;
    }
    if(this.jumping && this.hp > 0) {
        if(this.jumpAnimation.isDone()) {
            this.jumpAnimation.elapsedTime = 0;
            this.jumping = false;
        }
        var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
        var totalHeight = 50;
        if (jumpDistance > 0.5) {
            jumpDistance = 1 - jumpDistance;
        }
        var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
        this.jumpTime = 0;
        if(this.walkLeft) {
            this.x -= this.game.clockTick * this.speed;
            if(this.x <= this.minX) {
                this.walkLeft = false;
                this.walkRight = true;
            }
        }
        else {
            this.x += this.game.clockTick * this.speed;
            if(this.x >= this.maxX) {
            }
         }
    }
    else if(this.hp > 0) {
        if(this.walkLeft) {
            this.x -= this.game.clockTick * this.speed;
            if(this.x <= this.minX) {
                this.walkLeft = false;
                this.walkRight = true;
            }
        }
        else if(this.walkRight && this.hp > 0) {
            this.x += this.game.clockTick * this.speed;
            if(this.x >= this.maxX) {
                this.walkRight = false;
                this.walkLeft = true;
            }
        }
    }
    this.jumpTime++;
    Entity.prototype.update.call(this);

}

Slime.prototype.draw = function (ctx) {
    if(this.hp <= 0) {
        this.deathAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else {
        if (this.jumping) {
            this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
        }
        else {
            if(this.walkLeft) {
                this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
            }
            else {
                this.walkRightAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
            }
        }
    }
    Entity.prototype.draw.call(this);
}
//#endregion

//#region Bat
function Bat(game, spawnX, spawnY, leftBound, rightBound, amplitude) {
    this.flyRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/bat.png"), 0, 32, 32, 32, 0.05, 4, true, true);
    this.flyLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/bat.png"), 0, 96, 32, 32, 0.05, 4, true, true);
    this.amplitude = amplitude;
    this.speed = 225;
    this.flyRight = true;
    this.radius = 32;
    this.hp = 5;
    this.width = 32;
    this.height = 32;
    this.leftBound = leftBound;
    this.rightBound = rightBound;
    this.spawnY = spawnY;
    this.boundingbox = new BoundingBox(spawnX, spawnY, this.width, this.height);
    Entity.call(this, game, spawnX, spawnY);
}

Bat.prototype = new Entity();
Bat.prototype.constructor = Bat;

Bat.prototype.update = function () {
    this.boundingbox = new BoundingBox(this.x, this.y, this.width, this.height);
    var mc = this.game.entities.Character;
    if (this.hp <= 0) {
        this.removeFromWorld = true;
    }

    var mc = this.game.entities.Character;
    if (collided(mc.boundingbox, this.boundingbox) && this.hp > 0) {
        mc.hp -= 1;
        mc.damaged = true;
        console.log("Bat Collided with Mc");
        if (mc.back) {
            mc.x += 15;
        } else {
            mc.x -= 15;
        }
    }
    if (mc.attack) {
        if (collided(mc.hitBoxBack, this.boundingbox) || collided(mc.hitBoxFront, this.boundingbox)) {
            console.log("MC attacked Bat");
            console.log("Bat Health: " + this.hp);
            this.hp -= mc.attackPower;
        }
    }

    if(!this.flyRight) {
        if(this.x > this.leftBound) {
            this.x -= this.game.clockTick * this.speed;
        }
        else {
            this.flyRight = true;
        }
    }
    else {
        if(this.x < this.rightBound) {
            this.x += this.game.clockTick * this.speed;
        }
        else {
            this.flyRight = false;
        }
    }
    this.y = this.spawnY - Math.sin(this.x / 25) * this.amplitude;
    Entity.prototype.update.call(this);
}

Bat.prototype.draw = function(ctx) {
    if(!this.flyRight) {
        this.flyLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, 1.5);
    }
    else {
        this.flyRightAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, 1.5);
    }
    Entity.prototype.draw.call(this);
}
//#endregion

//#region Skeleton
function Skeleton(game, spawnX, spawnY, minX, maxX) {
    this.walkLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/skeleton.png"), 0, 0, 64, 64, 0.25, 4, true, true);
    this.walkRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/skeleton.png"), 0, 64, 64, 64, 0.25, 4, true, true);
    this.attackLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/skeleton.png"), 64, 192, 64, 64, 0.15, 3, false, true);
    this.attackRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/skeleton.png"), 0, 256, 64, 64, 0.15, 3, false, true);
    this.deathAnimation = new Animation(ASSET_MANAGER.getAsset("./img/skeleton.png"), 0, 128, 64, 64, 0.15, 5, false, false );
    this.startAnimation = new Animation(ASSET_MANAGER.getAsset("./img/skeleton.png"), 0, 128, 64, 64, 0.3, 5, false, true );
    this.idleAnimation = new Animation(ASSET_MANAGER.getAsset("./img/skeleton.png"), 0, 192, 64, 64, 0.3, 1, true, true);
    this.attacking = false;
    this.attackTime = 0;
    this.attackLeft = false;
    this.attackRight = true;
    this.walkLeft = false;
    this.walkRight = true;
    this.speed = 80;
    this.radius = 55;
    this.width = 64;
    this.height = 64;
    this.ground = spawnY;
    this.hp = 25;
    this.inRange = false;
    this.idle = true;
    this.startX = spawnX;
    this.damagedTimer = 0;
    this.minX = minX;
    this.maxX = maxX;
    this.boundingbox = new BoundingBox(spawnX + 16, spawnY + 7, 30, 45);
    Entity.call(this, game, spawnX, spawnY);
}
Skeleton.prototype = new Entity();
Skeleton.prototype.constructor = Skeleton;

Skeleton.prototype.update = function() {
    this.boundingbox = new BoundingBox(this.x + 16, this.y + 7, 30, 45);

    var mc = this.game.entities.Character;
    if (this.hp <= 0 && this.deathAnimation.isDone()) {
        this.removeFromWorld = true;
    }
    if (collided(mc.boundingbox, this.boundingbox) && this.hp > 0) {
        mc.hp -= 1;
        mc.damaged = true;
        if (mc.back) {
            mc.x += 15;
        } else {
            mc.x -= 15;
        }
    }
    //MC is in range
    if(Math.abs(this.x - mc.x) <= 300 && Math.abs(this.y - mc.y) <= 100) {
        this.inRange = true;
    }
    else {
        this.inRange = false;
    }
    if (mc.attack) {
        if (collided(mc.hitBoxBack, this.boundingbox) || collided(mc.hitBoxFront, this.boundingbox)) {
            if(this.damagedTimer <= 0) {
                this.hp -= mc.attackPower;
                if(mc.back) {
                    this.x -= 30;
                }
                else {
                    this.x += 30;
                }
                this.damagedTimer = mc.attackForwardAnim.totalTime;
                console.log("Bone boi hit by MC");
                console.log("Bone boi Health: " + this.hp);
            }
            else {
                this.damagedTimer -= this.game.clockTick;
            }
        }
    }

    if (this.attackTime >= 100  && this.inRange) {
        this.attacking = true;
    }
    if(this.attacking) {
        var direction = true;
        if(mc.x <= this.x) {
            direction = false;
            this.attackLeft = true;
            this.attackRight = false;
        }
        else {
            direction = true;
            this.attackRight = true;
            this.attackLeft = false;
        }
        if(this.attackLeftAnimation.isDone() || this.attackRightAnimation.isDone()) {
           // range = Math.sqrt(Math.abs(this.x - mc.x)) / 100;
           range = 0;
            let bone = new SkeletonBone(this.game, this.x, this.y, direction, 1 + range);
            this.game.addEntity(bone);
            this.attackLeftAnimation.elapsedTime = 0;
            this.attackRightAnimation.elapsedTime = 0;
            this.attacking = false;
            this.attackTime = 0;
        }
    }
    else if(this.hp > 0) {
        if(this.walkLeft) {
            this.x -= this.game.clockTick * this.speed;
            if(this.x <= this.minX) {
                this.walkLeft = false;
                this.walkRight = true;
            }
        }
        else {
            this.x += this.game.clockTick * this.speed;
            if(this.x >= this.maxX) {
                this.walkRight = false;
                this.walkLeft = true;
            }
        }
    }
    this.attackTime++;

    Entity.prototype.update.call(this);

}

Skeleton.prototype.draw = function(ctx) {
    if(this.hp <= 0) {
        this.deathAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, 1.3);
    }
    else {
        if(this.attacking) {
            if(this.attackLeft) {
                this.attackLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, 1.3);
            }
            else {
                this.attackRightAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, 1.3);
            }
        }
        else {
            if(this.walkLeft) {
                this.walkLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, 1.3);
            }
            else {
                this.walkRightAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, 1.3);
            }
        }
    }

    Entity.prototype.draw.call(this);

}

function SkeletonBone(game, skeletonX, skeletonY, direction, range) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/skeleton.png"), 192, 256, 64, 64, 0.3, 3, true, true);
    this.speed = 300;
    this.ground = skeletonY + 100;
    this.radius = 16;
    this.width = 64;
    this.height = 64;
    this.direction = direction;
    this.range = range;
    this.x0 = skeletonX;
    this.y0 = skeletonY;
    this.boundingbox = new BoundingBox(skeletonX + 23, skeletonY + 21, 20, 20);
    Entity.call(this, game, skeletonX, skeletonY);
}

SkeletonBone.prototype = new Entity();
SkeletonBone.prototype.constructor = SkeletonBone;

SkeletonBone.prototype.update = function() {
    this.boundingbox = new BoundingBox(this.x + 23, this.y + 21, 20, 20);
    var mc = this.game.entities.Character;

    if (collided(mc.boundingbox, this.boundingbox)) {
        mc.hp -= 15;
        mc.damaged = true;
        if (mc.back) {
            mc.x += 15;
        } else {
            mc.x -= 15;
        }
        this.removeFromWorld = true;
    }

    // if(this.y >= 800) {
    //     this.removeFromWorld = true;
    // }
    if(this.x > this.x0 + 300 || this.x < this.x0 - 300) {
        this.removeFromWorld = true;
    }

    // let deltaX = this.animation.elapsedTime / this.animation.totalTime;
    // let totalHeight = this.y + 10;

    // let deltaY = totalHeight * (-4 * (deltaX * deltaX - deltaX));
    // this.y = this.ground - deltaY;
    if(this.direction) {
        this.x += this.game.clockTick * this.speed * this.range;
    }
    else {
        this.x -= this.game.clockTick * this.speed * this.range;
    }
    // this.x = 10 * Math.cos(Math.PI / 2) * this.game.clockTick;
    // this.y = 10 * Math.sin(Math.PI / 2) * this.game.clockTick - 0.5 * 4 * Math.exp(this.game.clockTick, 2);
    Entity.prototype.update.call(this);
}

SkeletonBone.prototype.draw = function(ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, 1.3);
}
//#endregion

//#region Chest
function Chest(game, theX, theY) {
    this.game = game;
    this.openingAnimation = new Animation(ASSET_MANAGER.getAsset("./img/chest.png"), 0, 0, 64, 64, 0.1, 6, false, false);
    this.closedAnimation = new Animation(ASSET_MANAGER.getAsset("./img/chest.png"), 0, 0, 64, 64, 1, 1, true, false);
    this.openedAnimation = new Animation(ASSET_MANAGER.getAsset("./img/chest.png"), 320, 0, 64, 64, 1, 1, true, false);
    this.ground = 613;
    this.radius = 42;
    this.open = false;
    this.opening = false;
    this.openTime = 0;
    this.boundingbox = new BoundingBox(theX, theY, 42, 64);
    Entity.call(this, game, theX, theY);
}

Chest.prototype = new Entity();
Chest.prototype.constructor = Chest;
Chest.prototype.collidePlat = function() {
    collide = false;
    for (var i = 0; i < this.game.platforms.length; i++) {
        collide = this.boundingbox.collide(this.game.platforms[i].boundingbox);
        if (collide) {
            return true;
        }
    }
    return collide;
}

Chest.prototype.update = function() {
    this.boundingbox = new BoundingBox(this.x, this.y, 42, 42);

    if (!this.collidePlat()) {
        this.y += 1;
    }

    let mc = this.game.entities.Character;
    if(this.game.e && Math.abs(mc.x - this.x) <= 40 && Math.abs(mc.y - this.y) <= 60) {
        this.opening = true;
    }
    if(this.opening && this.openingAnimation.isDone()) {
        this.opening = false;
        this.open = true;
    }
    if(this.open) {
        this.openTime++;
        if(this.openTime >= 80) {
            sword = new Sword(this.game, this.x, this.y);
            this.game.addEntity(sword);
            this.removeFromWorld = true;
        }
    }
    Entity.prototype.update.call(this)
}

Chest.prototype.draw = function(ctx) {
    if(this.opening && !this.open) {
        this.openingAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else if(this.open && this.open) {
        this.openedAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - 6 - this.game.camera.y);
    }
    else {
        this.closedAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
}
//#endregion

function BossWolf(game, theX, theY) {
    this.game = game;
    this.attack = false;
    this.walkBack = new Animation(ASSET_MANAGER.getAsset("./img/blackwolf.png"), 0, 420, 110, 75, .1, 9, true, false);
    this.walk = new Animation(ASSET_MANAGER.getAsset("./img/blackwolf.png"), 0, 960, 110, 75, .1, 9, true, false);
    this.attackF = new Animation(ASSET_MANAGER.getAsset("./img/blackwolf.png"), 0, 780, 110, 75, .1, 9, false, false);
    this.attackBack = new Animation(ASSET_MANAGER.getAsset("./img/blackwolf.png"), 0, 450, 110, 75, .1, 9, true, false);
    this.howl = new Animation(ASSET_MANAGER.getAsset("./img/blackwolf.png"), 0, 600, 110, 75, .4, 6, false, false);
    this.idle = new Animation(ASSET_MANAGER.getAsset("./img/blackwolf.png"), 0, 600, 110, 75, .1, 6, true, false);
    this.hp = 500;
    this.howling = true;
    this.boundingbox = new BoundingBox(theX + 15, theY + 33, 81, 42);
    Entity.call(this, game, theX, theY);
}

BossWolf.prototype = new Entity();
BossWolf.prototype.constructor = BossWolf;

BossWolf.prototype.update = function () {
    this.boundingbox = new BoundingBox(this.x + 15, this.y + 33, 81, 42);
    if(this.howling) {
        if(this.howl.elapsedTime + this.game.clockTick > this.howl.totalTime) {
            this.howling = false;
            this.game.enemies.push(new AttackWolf(this.game, 7500, 450));
            this.game.enemies.push(new AttackWolf(this.game, 7800, 450));
        }
    }
    var mc = this.game.entities.Character;
    if(mc.x > 7600 && mc.y < 390) {
        this.attack = true;
    }
    if (collided(mc.boundingbox, this.boundingbox)) {
        mc.hp -= 1;
        mc.damaged = true;
        if (mc.back) {
            mc.x += 15;
        } else {
            mc.x -= 15;
        }
    }
    if (mc.attack) {
        if (collided(mc.hitBoxBack, this.boundingbox) || collided(mc.hitBoxFront, this.boundingbox)) {
        this.hp -= mc.attackPower;
        }
    }
    if (this.hp <= 0) {
        this.removeFromWorld = true;
    }
    Entity.prototype.update.call(this);
}

BossWolf.prototype.draw = function (ctx) {
    if(this.howling) {
        this.howl.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else if(this.attack) {
        this.attackBack.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else {
        this.idle.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    Entity.prototype.draw.call(this);
}


function AttackWolf(game, theX, theY) {
    this.walkBack = new Animation(ASSET_MANAGER.getAsset("./img/redwolf.png"), 0, 420, 88, 60, .1, 9, true, false);
    this.walk = new Animation(ASSET_MANAGER.getAsset("./img/redwolf.png"), 0, 960, 88, 60, .1, 9, true, false);
    this.attackF = new Animation(ASSET_MANAGER.getAsset("./img/redwolf.png"), 0, 780, 88, 60, .1, 9, false, false);
    this.attackBack = new Animation(ASSET_MANAGER.getAsset("./img/redwolf.png"), 0, 240, 88, 60, .1, 9, false, false);
    this.attack = false;
    this.back = false;
    this.width = 88;
    this.height = 60;
    this.hp = 300;
    this.boundingbox = new BoundingBox(theX + 15, theY + 29, 75, 31);
    Entity.call(this, game, theX, theY);
}

AttackWolf.prototype = new Entity();
AttackWolf.prototype.constructor = AttackWolf;
AttackWolf.prototype.collidePlat = function() {
    collide = false;
    for (var i = 0; i < this.game.platforms.length; i++) {
        collide = this.boundingbox.collide(this.game.platforms[i].boundingbox);
        if (collide) {
            return true;
        }
    }
    return collide;
}

AttackWolf.prototype.update = function () {
    this.boundingbox = new BoundingBox(this.x + 15, this.y + 29, 75, 31);
    if (!this.collidePlat()) {
        this.y += 5;
    }
    var mc = this.game.entities.Character;
    if (collided(mc.boundingbox, this.boundingbox)) {
        mc.hp -= 1;
        mc.damaged = true;
        if (mc.back) {
            mc.x += 15;
        } else {
            mc.x -= 15;
        }
    }
    if (mc.attack) {
        if (collided(mc.hitBoxBack, this) || collided(mc.hitBoxFront, this)) {
        this.hp -= mc.attackPower;
        }
    
    }
    if (this.hp <= 0) {
        this.removeFromWorld = true;
    }

    if(this.game.entities.Character) {
        if(this.game.entities.Character.x - this.x > -32 && this.game.entities.Character.x - this.x < 0) {
            this.attack = true;
        }
        else {
            if(this.game.entities.Character.x - this.x > 38 && this.game.entities.Character.x - this.x < 70) {
                this.attack = true;
            }
            else {
                this.attack = false;
            }
        }
        
        if(this.game.entities.Character.x - this.x > 40) {
            this.back = false;
        }
        else {
            this.back = true;
        }
    
    }
    
    // if dead, remove from world
    if (this.hp <= 0) {
        this.removeFromWorld = true;
    }

    if(this.attackF.isDone()) {
        this.back = false;
        this.attackF.elapsedTime = 0;
        this.attackBack.elapsedTime = 0;
        this.attack = false;
    }
    else if(this.attackBack.isDone()) {
        this.back = true;
        this.attackF.elapsedTime = 0;
        this.attackBack.elapsedTime = 0;
        this.attack = false;
    }

    if(this.back) {
            this.x = this.x - this.game.clockTick * 80
        }
    else {
            this.x = this.x + this.game.clockTick * 80
     }
    Entity.prototype.update.call(this);
}

AttackWolf.prototype.draw = function (ctx) {
    if(this.attack && !this.back) {
        this.attackF.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else if(this.attack && this.back) {
        this.attackBack.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else if(this.back) {
        this.walkBack.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else {
        this.walk.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    Entity.prototype.draw.call(this);
}

function Nightmare(game, theX, backbool) {
    this.runBackward = new Animation(ASSET_MANAGER.getAsset("./img/nightmare.png"), 0, 0, 144, 96, .20, 4, true, false);
    this.runForward = new Animation(ASSET_MANAGER.getAsset("./img/nightmare.png"), 0, 96, 144, 96, .20, 4, true, false);
    this.idleForward = new Animation(ASSET_MANAGER.getAsset("./img/nightmare.png"), 0, 192, 128, 96, .3, 4, false, false);
    this.idleBackward = new Animation(ASSET_MANAGER.getAsset("./img/nightmare.png"), 0, 288, 128, 96, .3, 4, false, false);
    this.idle = true;
    this.back = backbool;
    this.radius = 96;
    this.width = 144;
    this.height = 96;
    this.hp = 100;
    Entity.call(this, game, theX, 560);
}

Nightmare.prototype = new Entity();
Nightmare.prototype.constructor = Nightmare;

Nightmare.prototype.update = function () {
    // fall if not on a platform
    // if (!onPlatformWH(this)) {
    //     this.y += 1;
    // }

    // check for collision with mc
    if (isCollidedWH(this.game, this)) {
        var mc = this.game.entities.Character;
        if (mc.attack) {
            // console.log("nightmare is attacked");
            this.hp -= 5;
        } else {
            mc.hp -= 1;

        }
    }

    if (this.hp <= 0) {
        this.removeFromWorld = true;
    }

    if(this.x < 50) {
        this.back = false;
        this.idle = true;
    }
    if(this.x > 1250) {
        this.back = true;
        this.idle = true;
    }

    if(this.idleForward.isDone()) {
        this.idle = false;
        this.idleForward.elapsedTime = 0;
    }
    if(this.idleBackward.isDone()) {
        this.idle = false;
        this.idleBackward.elapsedTime = 0;
    }

    if(!this.idle && !this.back) {
        this.x = this.x + this.game.clockTick * 500;
    }
    else if(!this.idle && this.back) {
        this.x = this.x - this.game.clockTick * 500;
    }
    Entity.prototype.update.call(this);
}

Nightmare.prototype.draw = function (ctx) {
    if(this.idle && this.back) {
        this.idleBackward.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else if(this.idle && !this.back) {
        this.idleForward.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else if(!this.idle && this.back) {
        this.runBackward.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else {
        this.runForward.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
}

// Begin Ghost enemy
function Ghost(game, theX, theY) {
    this.appearA = new Animation(ASSET_MANAGER.getAsset("./img/ghost.png"), 0, 0, 64, 48, .15, 6, false, false);
    this.disappearA = new Animation(ASSET_MANAGER.getAsset("./img/ghost.png"), 0, 48, 64, 48, .15, 6, false, false);
    this.idleA = new Animation(ASSET_MANAGER.getAsset("./img/ghost.png"), 0, 96, 64, 48, .15, 6, false, false);
    this.scareA = new Animation(ASSET_MANAGER.getAsset("./img/ghost.png"), 0, 144, 64, 48, .15, 4, false, false);
    this.appear = true;
    this.disappear = false;
    this.idle = false;
    this.scare = false;
    this.hp = 10;
    this.width = 64;
    this.height = 48;
    Entity.call(this, game, theX, theY);
}

Ghost.prototype.update = function() {

    // check for collision with mc
    if (isCollidedWH(this.game, this)) {
        var mc = this.game.entities.Character;
        if (mc.attack) {
            // console.log("wolf is attacked");
            this.hp -= 5;
        } else {
            mc.hp -= 1;

        }
    }

    if (this.hp <= 0) {
        this.removeFromWorld = true;
    }

    Entity.call(this, game, theX, theY);
}

Ghost.prototype.update = function() {
    if (this.appearA.isDone()) {
        this.appearA.elapsedTime = 0;
        this.appear = false;
        this.idle = true;
    }
    else if(this.idleA.isDone()) {
        this.idle = false;
        this.scare = true;
        this.idleA.elapsedTime = 0;
    }
    else if(this.scareA.isDone()) {
        this.scare = false;
        this.disappear = true;
        this.scareA.elapsedTime = 0;
    }
    else if(this.disappearA.isDone()){
        this.disappearA.elapsedTime = 0;
        if(this.game.entities.Character) {
            var ghost = new Ghost(this.game, (Math.floor(Math.random() * 301)) - 50 + this.game.entities.Character.x, -(Math.floor(Math.random() * 301)) + 50 + this.game.entities.Character.y);
            this.game.addEntity(ghost);
            this.removeFromWorld = true;
            this.disappear = false;
        }
    }
    Entity.prototype.update.call(this);
}

Ghost.prototype.draw = function (ctx) {
    if(this.appear) {
        this.appearA.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else if(this.idle) {
        this.idleA.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else if(this.scare) {
        this.scareA.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else if(this.disappear) {
        this.disappearA.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    Entity.prototype.draw.call(this);
}
// End Ghost enemy

function Lever(game, theX, theY) {
    this.game = game;
    this.openingAnimation = new Animation(ASSET_MANAGER.getAsset("./img/lever38x32.png"), 0, 0, 38, 32, 0.1, 2, false, false);
    this.closedAnimation = new Animation(ASSET_MANAGER.getAsset("./img/lever38x32.png"), 0, 0, 38, 32, 1, 1, true, false);
    this.openedAnimation = new Animation(ASSET_MANAGER.getAsset("./img/lever38x32.png"), 38, 0, 38, 32, 1, 1, true, false);
    // this.ground = 613;
    // this.radius = 42;
    this.open = false;
    this.opening = false;
    this.openTime = 0;
    this.boundingbox = new BoundingBox(theX, theY, 38, 32);
    Entity.call(this, game, theX, theY);
}

Lever.prototype = new Entity();
Lever.prototype.constructor = Chest;
Lever.prototype.collidePlat = function() {
    collide = false;
    for (var i = 0; i < this.game.platforms.length; i++) {
        collide = this.boundingbox.collide(this.game.platforms[i].boundingbox);
        if (collide) {
            return true;
        }
    }
    return collide;
}
Lever.prototype.update = function() {
    this.boundingbox = new BoundingBox(this.x, this.y, 38, 32);

    if (!this.collidePlat()) {
        this.y += 1;
    }

    let mcXPosition = this.game.entities.Character.x;
    if(Math.abs(mcXPosition - this.x) <= 60 && this.game.e) {
        this.opening = true;
    }
    if(this.opening && this.openingAnimation.isDone()) {
        this.opening = false;
        this.open = true;
        this.game.openNext = true;
    }
    Entity.prototype.update.call(this)
}

Lever.prototype.draw = function(ctx) {
    if(this.opening && !this.open) {
        this.openingAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else if(this.open && this.open) {
        this.openedAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else {
        this.closedAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
}

// Begin mini Boss
function MiniBoss(game, spawnX, spawnY) {
    this.attackSlashRev = new Animation(ASSET_MANAGER.getAsset("./img/miniBossAttackSlashRev.png"), 0, 0, 4480 / 8, 408, .2, 7, false, false);
    this.attackSlash = new Animation(ASSET_MANAGER.getAsset("./img/miniBossAttackSlash.png"), 0, 0, 4480 / 8, 408, .2, 7, false, false);
    this.idle = new Animation(ASSET_MANAGER.getAsset("./img/miniBossIdle.png"), 0, 0, 729 / 3, 234, .1, 3, true, false);
    this.idleRev = new Animation(ASSET_MANAGER.getAsset("./img/miniBossIdleRev.png"), 0, 0, 729 / 3, 234, .5, 3, true, false);
    this.hitRev = new Animation(ASSET_MANAGER.getAsset("./img/miniBossHitRev.png"), 0, 0, 222, 280, .5, 1, false, false);
    this.hit = new Animation(ASSET_MANAGER.getAsset("./img/miniBossHit.png"), 0, 0, 222, 280, .5, 1, false, false);
    this.fightingAniRev = new Animation(ASSET_MANAGER.getAsset("./img/miniBossFightingRev.png"), 0, 0, 220, 206, .5, 2, true, false);
    this.fightingAni = new Animation(ASSET_MANAGER.getAsset("./img/miniBossFighting.png"), 0, 0, 220, 206, .5, 2, true, false);
    this.still = true;
    this.attackTimer = 0;
    this.bossIdle = true;
    this.found = false;
    this.stillFighting = false;
    this.attack = false;
    this.gotHit = false;
    this.back = false;
    this.attackTime = 0;
    this.width = 298;
    this.height = 298;
    this.hp = 5000;

    Entity.call(this, game, spawnX, spawnY);
    //Entity.call(this, game, theX, 600);
}

MiniBoss.prototype = new Entity();
MiniBoss.prototype.constructor = MiniBoss;

MiniBoss.prototype.update = function () {

   

    var mc = this.game.entities.Character;

    if (collided(mc.boundingbox, this)) {
        if (mc.attack) {
            this.hp -= 10;
            if(this.attackTime < 0) {
                this.attackTime = 10;
                this.attack = true;
            } else {
                this.attackTime -= 1;
            }
            
            
        } 
        if (this.attack && this.attackTime === 0) {
            mc.hp -= 3;
        }
    }
    
    
    if(this.game.entities.Character) {
        if(this.game.entities.Character.x - this.x > -32 && this.game.entities.Character.x - this.x < 0) {
            this.found = true;
        }
        else {
            if(this.game.entities.Character.x - this.x > 38 && this.game.entities.Character.x - this.x < 70) {
                this.found = true;
            }
            else {
            }
        }
        
        if(this.game.entities.Character.x - this.x > 40) {
            this.back = false;
        }
        else {
            this.back = true;
        }
    
    }
    

    


    if(this.hitRev.isDone()) {
        this.hitRev.elapsedTime = 0;
        this.attack = true;
    }

    if(this.hit.isDone()) {
        this.hitRev.elapsedTime = 0;
        this.attack = true;
    }

    if(this.attackSlashRev.elapsedTime + this.game.clockTick > this.attackSlashRev.totalTime  ) {
        
        this.attackSlashRev.elapsedTime = 0;
        this.attackTime = 0;
        this.attack = false;
        this.stillFighting = true;
    }

    if(this.attackSlash.elapsedTime + this.game.clockTick > this.attackSlash.totalTime ) {
        this.attackSlash.elapsedTime = 0;
        this.attackTime = 0;
        this.attack = false;
        this.stillFighting = true;
    }
    if(this.fightingAniRev.isDone()) {
        
        this.fightingAniRev.elapsedTime = 0;
        this.attack = false;
        this.stillFighting = true;
    }


    if (this.hp <= 0) {
        this.removeFromWorld = true;
        this.game.cosmeticEntities.push(new GameWonScreen(this.game));
    }
    if(this.found) {
    if(this.back) {
        this.x = this.x - this.game.clockTick * 100
    }
else {
        this.x = this.x + this.game.clockTick * 100
 }
}
    
    

    Entity.prototype.update.call(this);
}

MiniBoss.prototype.draw = function (ctx) {

    if(this.gotHit  && this.back) {
        this.hitRev.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x + 50, this.y - this.game.camera.y - 50);
        
    } else if (this.attack === true  && this.back) {
        console.log("ATTACK");
        this.attackSlashRev.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x - 115, this.y - this.game.camera.y - 100);

        

    } else if ( this.stillFighting && this.back ) {
        this.fightingAniRev.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x + 30, this.y - this.game.camera.y + 25);
    
    }else if(this.gotHit  && this.back === false) {
        this.hit.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x + 50, this.y - this.game.camera.y - 50);
            //this.gotHit = false;
            
    } else if (this.attack  && this.back === false) {
        console.log("ATTACK");
        this.attackSlash.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x - 115, this.y - this.game.camera.y - 100);
      
    
    } else if ( this.stillFighting && this.back === false) {
            this.fightingAni.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x + 30, this.y - this.game.camera.y + 25);
    } else if (this.back) {
        this.idleRev.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    } else if (this.bossIdle) {
        this.idleRev.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    } else  {
        this.idle.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
        
    }

    Entity.prototype.draw.call(this);
}



function MapLevel(game) {
    this.game = game;
    Entity.call(this, game, 0, 0);
    this.map = new Array(250);

    for (var i = 0; i < 250; i++) {
        this.map[i] = new Array();
    }
    this.sprites = new Array(7);
    
    var testMap = 
    [[3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3],
    [3,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,1,0,0,0,1,1,1,1,0,0,0,5,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,5,0,0,0,0,0,0,0,6,2,2,2,2,2,7,7,7,7,7,7,5,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,2,2,2,2,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,2,2,2,2,2,2,2,2,2,2,2,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,4,4,4,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,5,0,0,1,1,1,1,1,1,1,1,1,5,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,6,0,0,5,0,0,0,5,2,2,5,0,0,5,2,2,2,2,6,0,0,0,0,5,2,2,2,5,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,3,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,6,2,2,3,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,6,2,2,2,2,2,2,5,0,0,0,0,0,0,5,5,5,2,2,2,2,4,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,3,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,6,2,3,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,3,3,4,4,4,4,4,4,4,4,4,3,0,0,0,0,5,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,5,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,0,0,3,0,0,1,1,1,3,3,0,0,0,0,0,0,0,0,0,0,0,6,3,0,1,0,0,0,0,0,0,0,0,0,0,6,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,5,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,3,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,3,0,0,0,0,0,3,3,0,0,0,0,0,1,1,1,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [4,5,0,0,5,5,5,2,2,2,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,2,2,2,2,2,2,2,4,4,4,4,4,4,4,4,4,4,3,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,3,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [4,3,0,0,3,5,4,3,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,2,2,2,2,2,2,2,2,2,2,2,2,4,4,4,4,3,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,3,1,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [4,3,0,0,3,5,4,3,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,3,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,1,3,0,0,0,0,0,3,3,0,0,0,5,0,0,0,0,0,0,1,1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [4,3,1,1,3,2,2,2,2,2,2,2,2,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,3,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,3,0,0,0,0,0,3,3,0,0,0,3,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [4,3,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,5,1,1,1,0,0,0,3,4,4,4,4,3,1,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,3,0,0,0,0,1,3,3,0,0,0,3,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,5,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3],
    [4,3,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,3,0,0,0,0,0,0,3,4,4,4,4,3,0,0,0,6,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,0,0,0,0,0,3,0,1,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,3,0,0,0,3,0,0,0,0,0,3,3,0,0,0,3,1,1,0,0,0,0,0,0,3,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [2,2,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,3,0,0,0,0,0,0,3,4,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,3,1,0,0,3,1,0,0,0,0,6,2,2,2,2,6,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,3,0,0,0,0,1,1,3,4,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,2,2,2,2,2,2,2,2,3,4,4,4,4,3,0,0,0,0,0,0,3,4,4,4,4,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,5,0,0,0,0,0,1,1,3,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,3,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,0,0,0,0,0,0,0,3,0,0,1,0,0,0,0,0,0,0,3,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,6,2,2,2,2,2,6,0,0,0,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [3,2,2,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,3,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,3,1,1,0,0,0,0,3,4,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,6,1,1,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,0,0,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,6,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3],
    [4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,2,2,2,2,2,2,2,2,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,2,2,2,2,6,7,7,7,7,7,7,6,2,2,2,2,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3,2,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,3,2,2,5,0,0,0,0,0,0,0,6,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,6,7,7,2,2,2,2,2,2,2,2,2,2,2,2,3],
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,2,2,2,2,2,2,2,2,2,2,2,2,5,7,7,7,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,3,4,4,4,4,4,4,4,4,4,4,4,4,3,0,0,0,3,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,0,0,0,3,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,4,4,4,3,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,2,2,2,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,1,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,2,2,2,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,3,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,3,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,5,2,2,1,1,1,1,1,1,1,1,2,2,2,0,0,0,5,2,2,0,0,0,0,3,4,4,3,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,2,2,2,3,7,7,7,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [3,0,0,0,0,0,0,0,0,0,0,0,5,3,4,3,0,0,0,0,0,0,0,0,3,4,3,0,0,0,3,4,3,0,0,0,0,3,4,4,3,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [3,0,0,0,0,0,0,0,0,0,0,5,3,4,4,3,0,0,0,0,0,0,0,0,4,4,3,0,0,0,3,4,3,0,0,0,0,3,4,4,3,0,0,0,0,5,2,2,2,2,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,4,4,4,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [3,2,2,2,2,2,2,2,2,2,2,3,4,4,4,3,0,0,0,0,0,0,0,0,4,4,3,0,0,0,3,4,3,0,0,0,0,3,4,4,3,0,0,0,0,3,4,4,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,2,2,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4]];

    
    this.map = testMap;

    this.sprites[0] = null;
    this.sprites[1] = 1;
    this.sprites[2] = 2;
    this.sprites[3] = 3;
    this.sprites[4] = 4;
    this.sprites[5] = 5;
    this.sprites[6] = 6;
    this.sprites[7] = 7;

    for (var i = 0; i < 250; i++) {
        for (var j = 0; j < 35; j++) {
            // check if sprite is null, if not, draw it
            var sprite = this.sprites[this.map[j][i]];
            if (sprite) {
                if(sprite == 1) {
                    // this.game.platforms.push(new Platform(this.game, i * 32, j * 32 - 640));
                    this.game.platforms.push(new Platform(this.game, i * 32, j * 32 - 416));
                }
                else if(sprite == 2) {
                    this.game.platforms.push(new WallPlatform(this.game, i * 32, j * 32 - 416, true, true));
               }
                else if(sprite == 3) {
                    this.game.platforms.push(new Wall(this.game, i * 32, j * 32 - 416));
                }
                else if(sprite == 4) {
                    this.game.cosmeticEntities.push(new WallPlatform(this.game, i * 32, j * 32 - 416));
               //     Makes it so the character doesnt have to check if they are colliding.
                }
                else if(sprite == 5) {
                    this.game.platforms.push(new WallPlatform(this.game, i * 32, j * 32 - 416, false, true));
                }
                else if(sprite == 6) {
                    this.game.platforms.push(new WallPlatform(this.game, i * 32, j * 32 - 416, true, false));
                }
                else if (sprite == 7) {
                    this.game.platforms.push(new WallPlatform(this.game, i * 32, j * 32 - 416, true, true, true));
                }
            }
        }
    }
}

MapLevel.prototype = new Entity();
MapLevel.prototype.constructor = MapLevel;

MapLevel.prototype.update = function() {
    Entity.prototype.update.call(this);
}

MapLevel.prototype.draw = function (ctx) {
}

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
    console.log("starting up da sheild");
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