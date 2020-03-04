function GhostWolf(game, theX, theY, maxX, minX) {
    this.walkBack = new Animation(ASSET_MANAGER.getAsset("./img/wolfsheet.png"), 0, 420, 88, 60, .1, 9, true, false);
    this.walk = new Animation(ASSET_MANAGER.getAsset("./img/wolfsheet.png"), 0, 960, 88, 60, .1, 9, true, false);
    this.idle = new Animation(ASSET_MANAGER.getAsset("./img/wolfsheet.png"), 0, 240, 88, 60, .1, 1, true, false);
    this.attackF = new Animation(ASSET_MANAGER.getAsset("./img/wolfsheet.png"), 0, 780, 88, 60, .1, 10, false, false);
    this.attackBack = new Animation(ASSET_MANAGER.getAsset("./img/wolfsheet.png"), 0, 240, 88, 60, .1, 10, false, false);
    this.attack = false;
    this.maxX = maxX;
    this.minX = minX;
    this.idl = true;
    this.back = false;
    this.hp = 20;
    this.timeSinceDamage = 10;
    this.boundingbox = new BoundingBox(theX + 15, theY + 29, 75, 31);
    Entity.call(this, game, theX, theY);
}

GhostWolf.prototype = new Entity();
GhostWolf.prototype.constructor = GhostWolf;

GhostWolf.prototype.update = function () {
    this.timeSinceDamage += this.game.clockTick;
    var mc = this.game.entities.Character;
    if (collided(mc.boundingbox, this.boundingbox) && (this.attackF.elapsedTime > .5 || this.attackBack.elapsedTime > .5)) {
        if (mc.x > this.x) {
             mc.damage(5, 2);
        } else {
            mc.damage(5, -2);
        }
     }
    if (mc.attack) {
        if ((collided(mc.hitBoxBack, this.boundingbox) && mc.back) || (collided(mc.hitBoxFront, this.boundingbox) && !mc.back)) {
             if(this.timeSinceDamage > 1) {
                this.hp -= mc.attackPower;
                this.timeSinceDamage = 0;
             }
        }
    }
    if(this.game.entities.Character) {
        if(Math.abs(this.x - mc.x + 32) < 50 && Math.abs(this.y - mc.y) < 50) {
            this.attack = true;
        }
    
        if(this.game.entities.Character.x - this.x > 40) {
            this.back = false;
        }
        else {
            this.back = true;
        }

    }
    if(this.attackF.elapsedTime + this.game.clockTick > this.attackF.totalTime) {
        this.attackF.elapsedTime = 0;
        this.attackBack.elapsedTime = 0;
        this.attack = false
    }
    if(this.attackBack.elapsedTime + this.game.clockTick > this.attackBack.totalTime) {
        this.attackBack.elapsedTime = 0;
        this.attackF.elapsedTime = 0;
    }

    if(!this.attack && Math.abs(mc.x - this.x) < 300 && Math.abs(mc.y - this.y) < 70) {
        this.idl = false;
        if(this.back) {
            this.x = this.x - this.game.clockTick * 75
        }
        else {
            this.x = this.x + this.game.clockTick * 75
        }
    }
    else {
        this.idl = true;
    }
    if(this.x > this.maxX) {
        this.x = this.maxX;
        this.idl = true;
    }
    else if(this.x < this.minX) {
        this.x = this.minX
        this.idl = true;
    }
    if (this.hp <= 0) {
        this.removeFromWorld = true;
    }
    this.boundingbox = new BoundingBox(this.x + 15, this.y + 29, 73, 31);
    Entity.prototype.update.call(this);
}

GhostWolf.prototype.draw = function (ctx) {
    if(this.attack && !this.back) {
        this.attackF.drawFrame(this.game.clockTick, ctx, this.x-this.game.camera.x, this.y-this.game.camera.y);
    }
    else if(this.attack && this.back) {
        this.attackBack.drawFrame(this.game.clockTick, ctx, this.x-this.game.camera.x, this.y-this.game.camera.y);
    }
    else if(this.idl) {
        this.idle.drawFrame(this.game.clockTick, ctx, this.x-this.game.camera.x, this.y-this.game.camera.y);
    }
    else if(this.back) {
        this.walkBack.drawFrame(this.game.clockTick, ctx, this.x-this.game.camera.x, this.y-this.game.camera.y);
    }
    else {
        this.walk.drawFrame(this.game.clockTick, ctx, this.x-this.game.camera.x, this.y-this.game.camera.y);
    }
    Entity.prototype.draw.call(this);
}

// Begin Ghost enemy
function Ghost(game, theX, theY) {
    this.appearA = new Animation(ASSET_MANAGER.getAsset("./img/ghost.png"), 0, 0, 64, 48, .5, 6, false, false);
    this.disappearA = new Animation(ASSET_MANAGER.getAsset("./img/ghost.png"), 0, 48, 64, 48, .5, 6, false, false);
    this.idleA = new Animation(ASSET_MANAGER.getAsset("./img/ghost.png"), 0, 96, 64, 48, .15, 6, true, false);
    this.scareA = new Animation(ASSET_MANAGER.getAsset("./img/ghost.png"), 0, 144, 64, 48, .15, 4, false, false);
    this.appear = false;
    this.disappear = false;
    this.appeared = false;
    this.idle = false;
    this.scare = false;
    this.hp = 20;
    this.timeSinceDamage = 100;
    this.width = 64;
    this.height = 48;
    this.boundingbox = new BoundingBox(0,0,0,0);
    Entity.call(this, game, theX, theY);
}


Ghost.prototype.update = function() {
    this.timeSinceDamage += this.game.clockTick;
    var mc = this.game.entities.Character;
    if(Math.abs(this.x - mc.x) < 900 && !this.appeared) {
        this.appear = true;
        this.appeared = true;
        this.boundingbox = new BoundingBox(this.x + 17, this.y + 2, 30, 46);
    }
    if(this.appeared) {
        if (collided(mc.boundingbox, this.boundingbox) && this.scare) {
            if (mc.x > this.x) {
                mc.damage(5, 2);
            } else {
                mc.damage(5, -2);
            }
        }
        if (mc.attack) {
            if ((collided(mc.hitBoxBack, this.boundingbox) && mc.back) || (collided(mc.hitBoxFront, this.boundingbox) && !mc.back)) {
                if(this.timeSinceDamage > 1) {
                    this.hp -= mc.attackPower;
                    this.timeSinceDamage = 0;
                }
            }
        }
        if(Math.abs(this.x - mc.x) < 40) {
            this.scare = true;
            this.idle = false;
        }
        if(mc.x > this.x && !this.disappear) {
            this.x = this.x + 100 * this.game.clockTick
        }
        else if(mc.x < this.x && !this.disappear) {
            this.x = this.x - 100 * this.game.clockTick;
        }
    
        if(mc.y > this.y && !this.disappear) {
            this.y = this.y + 50 * this.game.clockTick;
        }
        else if(this.y > mc.y && !this.disappear) {
            this.y = this.y - 50 * this.game.clockTick;
        }
        this.boundingbox = new BoundingBox(this.x + 17, this.y + 2, 30, 46);
        if (this.appearA.isDone()) {
            this.appearA.elapsedTime = 0;
            this.appear = false;
            this.idle = true;
        }
        else if(this.scareA.isDone()) {
            this.scare = false;
            this.idle = true;
            this.scareA.elapsedTime = 0;
        }
        else if(this.disappearA.isDone()){
            this.disappearA.elapsedTime = 0;
            if(this.game.entities.Character) {
                this.removeFromWorld = true;
                this.disappear = false;
            }
        }
        if (this.hp <= 0) {
            this.disappear = true;
            this.idle = false;
            this.scare = false;
            this.boundingbox = new BoundingBox(0,0,0,0);
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

function Nightmare(game, theX, theY, maxX, minX, backbool) {
    this.runBackward = new Animation(ASSET_MANAGER.getAsset("./img/nightmare.png"), 0, 0, 144, 96, .20, 4, true, false);
    this.runForward = new Animation(ASSET_MANAGER.getAsset("./img/nightmare.png"), 0, 96, 144, 96, .20, 4, true, false);
    this.idleForward = new Animation(ASSET_MANAGER.getAsset("./img/nightmare.png"), 0, 192, 128, 96, .3, 4, false, false);
    this.idleBackward = new Animation(ASSET_MANAGER.getAsset("./img/nightmare.png"), 0, 288, 128, 96, .3, 4, false, false);
    this.idle = true;
    this.back = backbool;
    this.radius = 96;
    this.width = 144;
    this.height = 96;
    this.maxX = maxX;
    this.minX = minX;
    this.hp = 20;
    this.timeSinceDamage = 100;
    this.boundingbox = new BoundingBox(theX, theY, 96, 80);
    Entity.call(this, game, theX, theY);
}

Nightmare.prototype = new Entity();
Nightmare.prototype.constructor = Nightmare;

Nightmare.prototype.update = function () {
    this.timeSinceDamage += this.game.clockTick;
    var mc = this.game.entities.Character;
    if (collided(mc.boundingbox, this.boundingbox)) {
        if (mc.x > this.x) {
            mc.damage(5, 2);
        } else {
            mc.damage(5, -2);
        }
    }
    if (mc.attack) {
        if ((collided(mc.hitBoxBack, this.boundingbox) && mc.back) || (collided(mc.hitBoxFront, this.boundingbox) && !mc.back)) {
            if(this.timeSinceDamage > 1) {
                this.hp -= mc.attackPower;
                this.timeSinceDamage = 0;
            }
        }
    }

    if (this.hp <= 0) {
        this.removeFromWorld = true;
    }

    if(this.x < this.minX) {
        this.back = false;
        this.idle = true;
    }
    if(this.x > this.maxX) {
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
    if(this.idle) {
        this.boundingbox = new BoundingBox(this.x + 15, this.y + 15, 97, 80);
    }
    else {
        this.boundingbox = new BoundingBox(this.x + 15, this.y + 15, 112, 81);
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

function SkeleBoss(game, theX, theY) {
    this.idle = new Animation(ASSET_MANAGER.getAsset("./img/level1boss.png"), 0, 0, 264, 204, 1, 1, true, false);
    this.walke = new Animation(ASSET_MANAGER.getAsset("./img/level1boss.png"), 0, 0, 264, 204, .12, 4, true, false);
    this.backOff = false;
    this.walk = true;
    this.hp = 110;
    this.timeSinceDamage = 10;
    this.knockBackTime = -1;
    this.knockback = 0;
    Entity.call(this, game, theX, theY);
    this.boundingbox = new BoundingBox(theX, theY, 264, 204);
}

// this.idle = new Animation(ASSET_MANAGER.getAsset("./img/yellowplat28x16.png"), 0, 0, 28, 16, 1, 1, true, false);

SkeleBoss.prototype = new Entity();
SkeleBoss.prototype.constructor = SkeleBoss;

SkeleBoss.prototype.update = function () {
    this.timeSinceDamage += this.game.clockTick;
    var mc = this.game.entities.Character;
    if(Math.abs(this.x - mc.x) < 600) {
        this.walk = true;
    }
    else {
        this.walk = false;
    }
    if (collided(mc.boundingbox, this.boundingbox)) {
        if (mc.x > this.x) {
            mc.damage(10, 2);
        } else {
            mc.damage(10, -2);
        }
    }
    if (mc.attack) {
        if ((collided(mc.hitBoxBack, this.boundingbox) && mc.back) || (collided(mc.hitBoxFront, this.boundingbox) && !mc.back)) {
            if(this.timeSinceDamage > .7) {
                this.hp -= mc.attackPower;
                this.timeSinceDamage = 0;
                this.knockBackTime = .4;
                if(mc.x > this.x + 100) {
                    this.knockback = -3;
                }
                else if(mc.x < this.x) {
                    this.knockback = 3;
                }
            }
        }
    }
    if (this.hp <= 0) {
        this.removeFromWorld = true;
    }

    if(this.walk && this.knockBackTime <= 0) {
        if(this.x > mc.x) {
            this.x = this.x - this.game.clockTick * 80
        }
        else {
            this.x = this.x + this.game.clockTick * 80
        }
    }
    else if(this.knockBackTime > 0) {
        this.knockBackTime -= this.game.clockTick;
        this.x += this.knockback;
    }

    if(this.x > 7700) {
        this.x = 7700;
    }
    if(this.x < 6850) {
        this.x = 6850;
    }
    this.boundingbox = new BoundingBox(this.x, this.y, 264, 204);
    Entity.prototype.update.call(this);
}

SkeleBoss.prototype.draw = function(ctx) {
    if(this.walk && this.knockBackTime < 0) {
        this.walke.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else {
        this.idle.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }

    Entity.prototype.draw.call(this);
}


function RedWall(game, theX, theY) {
    this.idle = new Animation(ASSET_MANAGER.getAsset("./img/level1brick.png"), 0, 0, 32, 32, 1, 1, true, false);
    Entity.call(this, game, theX, theY);
    this.platform = false;
    this.wall = true;
    this.boundingbox = new BoundingBox(theX, theY, 32, 32);
}

// this.idle = new Animation(ASSET_MANAGER.getAsset("./img/yellowplat28x16.png"), 0, 0, 28, 16, 1, 1, true, false);

RedWall.prototype = new Entity();
RedWall.prototype.constructor = RedWall;

RedWall.prototype.update = function () {
    Entity.prototype.update.call(this);
}

RedWall.prototype.draw = function(ctx) {
    this.idle.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    Entity.prototype.draw.call(this);
}

function RedWallPlatform(game, theX, theY, collideBot, isPlatform, isGate) {
    this.game = game;
    this.idle = new Animation(ASSET_MANAGER.getAsset("./img/level1brick.png"), 0, 0, 32, 32, 1, 1, true, false);
    Entity.call(this, game, theX, theY);
    this.platform = isPlatform;
    this.wall = true;
    this.isGate = isGate;
    this.collideBottom = collideBot;
    this.boundingbox = new BoundingBox(theX,theY,28,16);
}

RedWallPlatform.prototype = new Entity();
RedWallPlatform.prototype.constructor = RedWallPlatform;

RedWallPlatform.prototype.update = function () {
    if (this.game.openNext && this.isGate) {
        this.removeFromWorld = true;
    } 
    Entity.prototype.update.call(this);
}

RedWallPlatform.prototype.draw = function(ctx) {
    this.idle.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    Entity.prototype.draw.call(this);
}

function RedMovingPlatform(game, theX, theY, xRange, xRangeMin, speed, start) {
    this.game = game;
    this.idle = new Animation(ASSET_MANAGER.getAsset("./img/level1brick.png"), 0, 0, 32, 32, 1, 1, true, false);
    this.platform = true;
    this.wall = true;
    this.forwardw = true;
    this.maxX = xRange;
    this.minX = xRangeMin;
    this.speed = speed;
    this.collideBottom = true;
    this.boundingbox = new BoundingBox(theX,theY,32,32);
    if(start) {
        Entity.call(this, game, theX + 128, theY);
    }
    else {
        Entity.call(this, game, theX, theY);
    }

}

RedMovingPlatform.prototype = new Entity();
RedMovingPlatform.prototype.constructor = RedMovingPlatform;

RedMovingPlatform.prototype.update = function () {
    if(this.maxX < this.x) {
        this.forward = false;
        this.x = this.maxX;
    }
    if(this.minX > this.x) {
        this.forward = true;
        this.x = this.minX;
    }
    if(this.forward) {
        this.x = this.x + this.speed * this.game.clockTick;
        if(this.game.entities.Character.platform == this && this.game.entities.Character.boundingbox.collide(this.boundingbox)) {
            this.game.entities.Character.x += this.speed * this.game.clockTick;
        }
    }
    else {
        this.x = this.x - this.speed * this.game.clockTick;
        if(this.game.entities.Character.platform == this && this.game.entities.Character.boundingbox.collide(this.boundingbox)) {
            this.game.entities.Character.x -= this.speed * this.game.clockTick;
        }
    }
    Entity.prototype.update.call(this);
    this.boundingbox = new BoundingBox(this.x, this.y, 28, 32);
}

RedMovingPlatform.prototype.draw = function(ctx) {
    this.idle.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    Entity.prototype.draw.call(this);
}

function RedVerticalPlatform(game, theX, theY, yRange, yRangeMin, speed, start) {
    this.game = game;
    this.idle = new Animation(ASSET_MANAGER.getAsset("./img/level1brick.png"), 0, 0, 32, 32, 1, 1, true, false);
    this.platform = true;
    this.wall = true;
    this.forwardw = true;
    this.maxY = yRange;
    this.minY = yRangeMin;
    this.speed = speed;
    this.collideBottom = true;
    this.boundingbox = new BoundingBox(theX,theY,32,32);
    if(start) {
        Entity.call(this, game, theX, theY);
    }
    else {
        Entity.call(this, game, theX, theY);
    }

}

RedVerticalPlatform.prototype = new Entity();
RedVerticalPlatform.prototype.constructor = RedVerticalPlatform;

RedVerticalPlatform.prototype.update = function () {
    if(this.maxY < this.y) {
        this.forward = false;
        this.y = this.maxY;
    }
    if(this.minY > this.y) {
        this.forward = true;
        this.y = this.minY;
    }
    if(this.forward) {
        this.y = this.y + this.speed * this.game.clockTick;
        if(this.game.entities.Character.platform == this && this.game.entities.Character.boundingbox.collide(this.boundingbox)) {
            this.game.entities.Character.y += this.speed * this.game.clockTick;
        }
    }
    else {
        this.y = this.y - this.speed * this.game.clockTick;
        if(this.game.entities.Character.platform == this && this.game.entities.Character.boundingbox.collide(this.boundingbox)) {
            this.game.entities.Character.y -= this.speed * this.game.clockTick;
        }
    }
    Entity.prototype.update.call(this);
    this.boundingbox = new BoundingBox(this.x, this.y, 24, 16);
}

RedVerticalPlatform.prototype.draw = function(ctx) {
    this.idle.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    Entity.prototype.draw.call(this);
}


function RedFallingWallPlatform(game, theX, theY, collideBot) {
    this.game = game;
    this.idle = new Animation(ASSET_MANAGER.getAsset("./img/fallingbrick.png"), 0, 0, 32, 32, 1, 1, true, false);
    this.fall = new Animation(ASSET_MANAGER.getAsset("./img/fallingbrick.png"), 0, 0, 32, 32, .15, 4, false, false);
    Entity.call(this, game, theX, theY);
    this.platform = true;
    this.wall = true;
    this.break = false;
    this.collideBottom = collideBot;
    this.boundingbox = new BoundingBox(theX,theY,24,16);
}

RedFallingWallPlatform.prototype = new Entity();
RedFallingWallPlatform.prototype.constructor = RedFallingWallPlatform;

RedFallingWallPlatform.prototype.update = function () {
    if(this.game.entities.Character && this.game.entities.Character.platform == this) {
        this.break = true;
    }
    if(this.fall.elapsedTime + this.game.clockTick > this.fall.totalTime) {
        this.removeFromWorld = true;
        if(this.game.entities.Character && this.game.entities.Character.platform == this) { 
            this.boundingbox = new BoundingBox(0,0,0,0);
            this.game.entities.Character.platform = this.game.platforms[0];
            this.game.entities.Character.falling = true;
        }
    }
    Entity.prototype.update.call(this);
}

RedFallingWallPlatform.prototype.draw = function(ctx) {
    if(!this.break) {
        this.idle.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else {
       this.fall.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }

    Entity.prototype.draw.call(this);
}

function MapLevel1(game) {
    this.game = game;
    Entity.call(this, game, 0, 0);
    this.map = new Array(250);

    for (var i = 0; i < 250; i++) {
        this.map[i] = new Array();
    }
    this.sprites = new Array(7);
    var A = 10;
    var B = 11;
    var testMap = 

    [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,5,0,0,0,0,5,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,3,0,0,0,0,3,4,4,4,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,8,8,8,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,3,0,0,0,0,3,4,4,4,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,3,0,0,0,0,3,4,4,4,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,6,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,3,8,8,8,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,3],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,2,2,5,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,8,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,2,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,0,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,9,9,9,9,9,9,0,0,0,0,0,0,A,A,A,A,A,0,0,0,0,9,9,9,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,2,2,0,0,0,3,3,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,0,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,3,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,0,0,0,0,0,0,0,0,0,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,0,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,B,B,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,3,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,0,0,0,0,0,0,0,0,0,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,0,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,B,B,3,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,0,0,0,0,0,0,0,0,0,4,4,3,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,0,4,4,3,0,0,5,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,0,0,0,0,0,0,0,0,0,4,4,3,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [0,0,0,0,0,0,0,0,0,B,B,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,2,2,3,3,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,0,4,4,3,0,0,3,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,0,0,0,0,0,0,0,0,0,4,4,3,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,0,4,4,3,0,0,3,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,0,0,0,0,0,0,0,0,0,4,4,3,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,0,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,0,0,0,0,0,0,0,0,0,4,4,3,0,0,0,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,0,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,9,9,0,0,0,0,0,0,0,3,3,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,0,3,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,0,0,0,0,0,0,0,0,0,4,4,3,0,0,0,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [0,0,0,0,0,0,0,0,0,0,0,0,8,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,2,2,2,0,0,0,3,3,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,0,4,4,3,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,3,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,0,0,0,0,0,0,0,0,0,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,9,9,9,9,0,0,0,0,A,A,A,A,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,0,4,4,3,0,0,3,3,4,4,4,4,4,4,4,4,4,4,4,3,4,4,4,4,4,4,4,4,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,3,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,0,0,0,0,0,0,0,0,0,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,0,4,4,3,0,0,3,3,0,0,0,0,4,4,0,0,0,0,4,3,0,0,0,0,4,4,0,0,0,0,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,3,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,0,0,0,0,0,0,0,0,0,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,3,4,3,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,4,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,0,4,4,3,0,0,3,3,0,0,0,0,4,4,0,0,0,0,4,3,0,0,0,0,4,4,0,0,0,0,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,3,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,0,0,0,0,0,0,0,0,0,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4]];
   
    
    this.map = testMap;

    this.sprites[0] = null;
    this.sprites[1] = 1;
    this.sprites[2] = 2;
    this.sprites[3] = 3;
    this.sprites[4] = 4;
    this.sprites[5] = 5;
    this.sprites[6] = 6;
    this.sprites[7] = 7;
    this.sprites[8] = 8;
    this.sprites[9] = 9;
    this.sprites[A] = 10;
    this.sprites[B] = 11;

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
                    this.game.platforms.push(new RedWallPlatform(this.game, i * 32, j * 32 - 416, true, true));
               }
                else if(sprite == 3) {
                    this.game.platforms.push(new RedWall(this.game, i * 32, j * 32 - 416));
                }
                else if(sprite == 4) {
                    this.game.cosmeticEntities.push(new RedWallPlatform(this.game, i * 32, j * 32 - 416));
               //     Makes it so the character doesnt have to check if they are colliding.
                }
                else if(sprite == 5) {
                    this.game.platforms.push(new RedWallPlatform(this.game, i * 32, j * 32 - 416, false, true));
                }
                else if(sprite == 6) {
                    this.game.platforms.push(new RedWallPlatform(this.game, i * 32, j * 32 - 416, true, false));
                }
                else if (sprite == 7) {
                    this.game.platforms.push(new RedWallPlatform(this.game, i * 32, j * 32 - 416, true, true, true));
                }
                else if(sprite == 8) {
                    this.game.platforms.push(new RedFallingWallPlatform(this.game, i * 32, j * 32 - 416, true));
                }
                else if(sprite == 9) {
                    this.game.platforms.push(new RedMovingPlatform(this.game, i*32, j*32 - 416, i*32 + 128, i*32, 150, false));
                }
                else if(sprite == 10) {
                    this.game.platforms.push(new RedMovingPlatform(this.game, i*32, j*32 - 416, i*32 + 128, i*32, 150, true));
                }
                else if(sprite == 11) {
                    this.game.platforms.push(new RedVerticalPlatform(this.game, i*32, j*32- 416, j * 32 - 220, j*32 - 416, 150, false));
                }
            }
        }
    }
}

MapLevel1.prototype = new Entity();
MapLevel1.prototype.constructor = MapLevel;

MapLevel1.prototype.update = function() {
    Entity.prototype.update.call(this);
}

MapLevel1.prototype.draw = function (ctx) {
}

//#region Strawberry
function Strawberry(game, x, y) {
    this.game = game;
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/fruit.png"), 128, 64, 32, 32, 1, 1, true, true);
    this.radius = 32;
    this.ground = y;
    this.boundingbox = new BoundingBox(this.x, this.y, 32, 32);
    Entity.call(this, game, x, y);
}

Strawberry.prototype = new Entity();
Strawberry.prototype.constructor = Strawberry;
Strawberry.prototype.collidePlat = function() {
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
Strawberry.prototype.collided = function() {
    var charact = this.game.entities.Character;
    return distance(this, charact) <= this.radius / 1.9 + charact.radius / 1.9;
}

Strawberry.prototype.update = function() {
    this.boundingbox = new BoundingBox(this.x, this.y, 32, 36);
    if (!this.collidePlat()) {
        this.y += 2;
    }
    if (this.collided()) {
        this.removeFromWorld = true;
        this.game.entities.Character.attackPower++;
        if (this.game.entities.Character.hp + 20 >= this.game.entities.Character.maxHP) {
            this.game.entities.Character.hp = this.game.entities.Character.maxHP;
        } else {
            this.game.entities.Character.hp += 20;
        }
    }
    Entity.prototype.update.call(this);
}

Strawberry.prototype.draw = function(ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    Entity.prototype.draw.call(this);
}
//#endregion