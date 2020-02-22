// Camera scrolling section
function Camera() {
    this.x = 0;
    this.y = 0;
}
// Follows our main character positions
Camera.prototype.update = function(characterX, characterY) {
    if(characterX > 640) {
        this.x = characterX - 640;
        this.y = characterY;
    }
    else{
        this.x = 0;
        this.y = 0;
    }
}
// End camera region

// Begin distance formula
function distance(a, b) {
    var difX = a.x - b.x;
    var difY = a.y - b.y;
    return Math.sqrt(difX * difX + difY * difY);
};
// End

// Check if a given entity is on a platform
function onPlatform(theEntity) {
    onPlat = false;

    for (let i = 0; i < platforms.length && !onPlat; i++) {
        var tile = platforms[i];

        if ((theEntity.y + theEntity.radius === tile.y)
            && (theEntity.x <= tile.x + tile.radius 
                && theEntity.x + theEntity.radius >= tile.x + tile.radius)) {
                    onPlat = true;
                }

        // if (tile.y <= theEntity.y + theEntity.radius 
        //     && tile.x + tile.radius > theEntity.x
        //     && tile.x <= theEntity.x) {
        //     onPlat = true;
        // }
    }
    return onPlat;
}

function onPlatformWH(theEntity) {
    onPlat = false;

    for (let i = 0; i < platforms.length && !onPlat; i++) {
        var tile = platforms[i];

        if ((theEntity.y + theEntity.height === tile.y)
            && (theEntity.x <= tile.x + tile.radius 
                && theEntity.x + theEntity.width >= tile.x + tile.radius)) {
                    onPlat = true;
                }

        // if (tile.y <= theEntity.y + theEntity.radius 
        //     && tile.x + tile.radius > theEntity.x
        //     && tile.x <= theEntity.x) {
        //     onPlat = true;
        // }
    }
    return onPlat;
}

// Check if a given entity collided with the MC
function isCollided(game, theEntity) {
    var mc = game.entities.Character;
    if (theEntity.x < mc.x + mc.radius && theEntity.x + theEntity.radius > mc.x
        && theEntity.y < mc.y + mc.radius && theEntity.y + theEntity.radius > mc.y) {
            // console.log("collided with mc")
            return true;
        }
    // console.log("did not collide");
    return false;
}

function isCollidedWH(game, theEntity) {
    var mc = game.entities.Character;
    if (theEntity.x < mc.x + mc.radius && theEntity.x + theEntity.width > mc.x
        && theEntity.y < mc.y + mc.radius && theEntity.y + theEntity.height > mc.y) {
            // console.log("collided with mc")
            return true;
        }
    // console.log("did not collide");
    return false;
}

// End

function Camera() {
    this.x = 0;
    this.y = 0;
}

Camera.prototype.update = function(characterX, characterY) {
    if(characterX > 640) {
        this.x = characterX - 640;
        this.y = characterY;
    }
    else{
        this.x = 0;
        this.y = 0;
    }
}
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

// Dialog section
// function DialogPane(ctx) {
//     ctx.fillStyle = "white";
//     ctx.font = "20px Verdana"
//     ctx.fillText("Health : ");
//     Entity.prototype.draw.call(this);
// }

// DialogPane.prototype.update = function () {
// }


// end dialog section

// function Background(game) {
//     Entity.call(this, game, 0, 400);
//     this.radius = 200;
// }


// // #region Background
// Background.prototype = new Entity();
// Background.prototype.constructor = Background;

// Background.prototype.update = function () {
// }

// Background.prototype.draw = function (ctx) {
//     ctx.fillStyle = "ForestGreen";
//     ctx.fillRect(0,500,1200,300);
//     Entity.prototype.draw.call(this);
// }
// // #endregion 

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
    Entity.call(this, game, 0, 400);
    this.radius = 200;
}

HealthBar.prototype = new Entity();
HealthBar.prototype.constructor = HealthBar;

HealthBar.prototype.update = function () {
}

HealthBar.prototype.draw = function (ctx) {
    ctx.fillStyle = "Red";
    ctx.fillRect(0,0,this.game.entities.Character.hp,30);
    ctx.fillStyle = "White";
    ctx.fillRect(this.game.entities.Character.hp,0,100-this.game.entities.Character.hp,30);
    ctx.beginPath();
    ctx.lineWidth = "4";
    ctx.strokeStyle = "black";
    ctx.rect(1, 1, 100, 30);
    ctx.stroke();
    Entity.prototype.draw.call(this);
}
// #endregion
function Platform(game, theX, theY) {
    this.idle = new Animation(ASSET_MANAGER.getAsset("./img/brickMed.png"), 16, 32, 32, 32, 1, 1, true, false);
    Entity.call(this, game, theX, theY);
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

// #region Main Character
function MainCharacter(game) {
    this.game = game;

    this.walkAnim = new Animation(ASSET_MANAGER.getAsset("./img/mc64.png"), 0, 64, 64, 64, .1, 4, true, false);
    this.backWalkAnim= new Animation(ASSET_MANAGER.getAsset("./img/mc64.png"), 0, 0, 64, 64, .1, 4, true, false);
    this.attackBackAnim = new Animation(ASSET_MANAGER.getAsset("./img/mc64.png"), 0, 128, 64, 64, .1, 4, false, false);
    this.attackForwardAnim = new Animation(ASSET_MANAGER.getAsset("./img/mc64.png"), 0, 192, 64, 64, .1, 4, false, false);
    this.idleBackAnim = new Animation(ASSET_MANAGER.getAsset("./img/mc64.png"), 0, 0, 64, 64, .1, 1, true, false);
    this.idleAnim = new Animation(ASSET_MANAGER.getAsset("./img/mc64.png"), 0, 64, 64, 64, .1, 1, true, false);
    this.jumpForward = new Animation(ASSET_MANAGER.getAsset("./img/mc64.png"), 0, 320, 64, 64, .2, 4, false, false);
    this.jumpBackward = new Animation(ASSET_MANAGER.getAsset("./img/mc64.png"), 0, 256, 64, 64, .2, 4, false, false);
    this.fallForward = new Animation(ASSET_MANAGER.getAsset("./img/mc64.png"), 0, 224, 64, 64, .2, 4, false, false);
    this.fallBackward = new Animation(ASSET_MANAGER.getAsset("./img/mc64.png"), 0, 192, 64, 64, .2, 4, false, false);
    
    this.jumping = false;
    this.stand = true;
    this.back = false;
    this.attack = false;
    // this.falling = false;

    this.maxHP = 100;
    this.hp = 10000;
    this.radius = 64;
    this.ground = 592;
    // this.x = 0;
    // this.y = 590;
    Entity.call(this, game, 0, this.ground);
}

MainCharacter.prototype = new Entity();
MainCharacter.prototype.constructor = MainCharacter;

// Character will get damaged if he collide with a trap (except when has fallen to the ground.)
MainCharacter.prototype.collideTrap = function() {
    var trapRadius = traps[0].radius;
            // top collision
    return (traps[0].y + trapRadius >= this.y && traps[0].y + trapRadius <= this.y + this.radius)
            // left & right collision
            && ((traps[0].x + trapRadius <= this.x + this.radius
                && traps[0].x + trapRadius >= this.x) || (traps[0].x >= this.x
                && traps[0].x <= this.x + this.radius));
            // && ((traps[0].x + trapRadius >= this.x + this.radius
            //     && traps[0].x <= this.x + this.radius) || (traps[0].x + trapRadius >= this.x
            //     && traps[0].x <= this.x));
}

// MainCharacter.prototype.onPlatform = function () {
//     onPlat = false;

//     for (let i = 0; i < platforms.length && !onPlat; i++) {
//         var tile = platforms[i];
//         if (tile.y <= this.y + this.radius && tile.x + tile.radius > this.x
//             && tile.x <= this.x) {
//             onPlat = true;
//         }
//     }
//     return onPlat;
// }

MainCharacter.prototype.update = function () {

    // detect collision for traps
    if (this.collideTrap()) {
        this.hp -= 2;
    }

    // fall if not on a platform
    if (!onPlatform(this)) {
        this.y += 3;
    } else {
        this.jumping = false;
    }

    // if fall off map, die
    if (this.y > 700) {
        this.hp = 0;
        // this = null;
    }

    if (this.hp === 0) {
        this.game.entities.push(new GameOverScreen(this.game));
        // this = null;
    }

    if (this.game.space) {
        this.jumping = true; 
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
        newBall = new Ball(this.game);
        if(this.back) {
            newBall.left = false;
        }
        this.game.entities.Character.hp = this.game.entities.Character.hp - 1;
        this.game.addEntity(newBall);
        this.game.r = false;
    }

    if (this.jumping) {
        if (this.jumpForward.isDone()) {
            this.jumpForward.elapsedTime = 0;
            this.jumpBackward.elapsedTime = 0;
            this.jumping = false;
        }
        if(this.jumpBackward.isDone()) {
            this.jumpForward.elapsedTime = 0;
            this.jumpBackward.elapsedTime = 0;
            this.jumping = false; 
        }
        if(this.jumpBackward.elapsedTime > this.jumpForward.elapsedTime) {
            this.jumpForward.elapsedTime = this.jumpBackward.elapsedTime;
        }
        else if(this.jumpForward.elapsedTime > this.jumpBackward.elapsedTime) {
            this.jumpBackward.elapsedTime = this.jumpForward.elapsedTime;
        }
        var jumpDistance = this.jumpForward.elapsedTime / this.jumpForward.totalTime;
        var totalHeight = 70;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        //var height = jumpDistance * 2 * totalHeight;
        var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
    }
    else if(this.attack) {
        if (this.attackForwardAnim.isDone() || this.attackBackAnim.isDone()) {
            this.attackForwardAnim.elapsedTime = 0;
            this.attackBackAnim.elapsedTime = 0;
            this.attack = false;
        }
    }

    if(this.game.d) {
        if(this.game.c) {
            this.x = this.x + this.game.clockTick * 900;
        }
        else {
            this.x = this.x + this.game.clockTick * 300;
        }
    }
    if(this.game.a) {
        if(this.game.c) {
            this.x = this.x - this.game.clockTick * 900
        }
        else {
            this.x = this.x - this.game.clockTick * 300
        }
    }
    if(this.game.camera) {
        this.game.camera.update(this.x, 0);
    }

    if(this.x < 0) {
        this.x = 0;
    }
    if(this.game.camera) {
        this.game.camera.update(this.x, 0);
    }

    if(this.x < 0) {
        this.x = 0;
    }

    Entity.prototype.update.call(this);
}

MainCharacter.prototype.draw = function (ctx) {
    if (this.jumping && !this.back) {
        this.jumpForward.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else if(this.jumping && this.back) {
        this.jumpBackward.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else if(this.attack && this.back) {
        this.attackBackAnim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else if(this.attack && !this.back) {
        this.attackForwardAnim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
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

//#region Spike Trap
function Spike(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/traps.png"), 12, 62, 32, 32, 0.3, 1, true, true);
    this.radius = 32;
    // this.ground = 462;
    Entity.call(this, game, 20, 20);
}

Spike.prototype = new Entity();
Spike.prototype.constructor = Spike;
Spike.prototype.update = function() {
    // var collidePlat = false;
    // fall if not on a platform
    // for(var i = 0; i < platforms.length; i++) {
    //     element = platforms[i];
    //     collidePlat = (element.x < this.x + this.radius && element.x + element.radius > this.x
    //         && element.y < this.y + this.radius && element.y + element.radius > this.y);
    //     if (collidePlat) {
    //         break;
    //     }
    // }

    if (this.y < 670) {
        this.y += 5;
    }


    // if (!onPlatform(this)) {
    //     this.y += 3;
    // }

    // if(this.y < 500) {
    //     this.y = this.y + 5;
    // }
    Entity.prototype.update.call(this);
}

Spike.prototype.draw = function(ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    Entity.prototype.draw.call(this);

}
// #endregion

//#region Turkey
function Turkey(game, x, y) {
    this.game = game;
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/turkey_32.png"), 0, 0, 32, 32, 0.3, 3, true, true);
    this.radius = 32;
    this.ground = y;
    Entity.call(this, game, x, y);
}

Turkey.prototype = new Entity();
Turkey.prototype.constructor = Turkey;

// Check if collided with MC; return true if collided, false, otherwise
Turkey.prototype.collided = function() {
    var charact = this.game.entities.Character;
    return distance(this, charact) <= this.radius / 1.9 + charact.radius / 1.9;
}

// Turkey.prototype.onPlatform = function () {
//     onPlat = false;
//     for (let i = 0; i < platforms.length && !onPlat; i++) {
//         var tile = platforms[i];
//         if (tile.y <= this.y + this.radius && tile.x + tile.radius > this.x
//             && tile.x <= this.x) {
//             onPlat = true;
//         }
//     }
//     return onPlat;
// }

Turkey.prototype.update = function() {
    if (this.collided()) {
        this.removeFromWorld = true;
        if (this.game.entities.Character.hp + 30 >= this.game.entities.Character.maxHP) {
            this.game.entities.Character.hp = this.game.entities.Character.maxHP;
        } else {
            this.game.entities.Character.hp += 30;
        }
    }
    // fall if not on a platform
    if (onPlatform(this)) {
        this.y += 1;
    }
    Entity.prototype.update.call(this);
}

Turkey.prototype.draw = function(ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    Entity.prototype.draw.call(this);
}
//#endregion

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
        if (!onPlatform(this)) {
            this.y += 1;
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
function Slime(game) {
    this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/slimeEnemy.png"), 0, 0, 64, 64, 0.15, 5, false, true);
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/slimeEnemy.png"), 0, 64, 64, 64, 0.3, 3, true, true);
    this.walkRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/slimeEnemy.png"), 192, 64, 64, 64, 0.3, 3, true, true);
    this.jumping = false;
    this.speed = 100;
    this.radius = 40;
    this.ground = 616;
    this.walkLeft = true;
    this.walkRight = false;
    this.jumpTime = 0;
    this.game = game;
    this.hp = 50;
    Entity.call(this, game, 300, 616);
}

Slime.prototype = new Entity();
Slime.prototype.constructor = Slime;

Slime.prototype.update = function() {

    // check for collision with mc
    if (isCollided(this.game, this)) {
        var mc = this.game.entities.Character;
        if (mc.attack) {
            // console.log("slime is attacked");
            this.hp -= 5;
        } else {
            mc.hp -= 1;

        }
    }

    if (this.hp <= 0) {
        // console.log("sline hp :" + this.hp);
        this.removeFromWorld = true;
    }
    
    if(this.jumpTime >= 100) {
        this.jumping = true;
    }
    if(this.jumping) {
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
            if(this.x <= 100) {
                this.walkLeft = false;
                this.walkRight = true;
            }
        }
        else {
            this.x += this.game.clockTick * this.speed;
            if(this.x >= 700) {
                this.walkRight = false;
                this.walkLeft = true;
            }
        }
    }
    else {


        if(this.walkLeft) {
            this.x -= this.game.clockTick * this.speed;
            if(this.x <= 100) {
                this.walkLeft = false;
                this.walkRight = true;
            }
        }
        else {
            this.x += this.game.clockTick * this.speed;
            if(this.x >= 700) {
                this.walkRight = false;
                this.walkLeft = true;
            }
        }
        this.jumpTime++;

    }
    Entity.prototype.update.call(this);

}

Slime.prototype.draw = function (ctx) {
    // fall if not on a platform
    if (!onPlatform(this)) {
        this.y += 3;
    }

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
    Entity.prototype.draw.call(this);
}
//#endregion

//#region Bat
function Bat(game) {
    this.flyRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/bat.png"), 0, 32, 32, 32, 0.05, 4, true, true);
    this.flyLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/bat.png"), 0, 96, 32, 32, 0.05, 4, true, true);
    this.amplitude = 50;
    this.speed = 150;
    this.flyRight = true;
    this.radius = 32;
    this.hp = 50;
    Entity.call(this, game, 200, 400);
}

Bat.prototype = new Entity();
Bat.prototype.constructor = Bat;

Bat.prototype.update = function () {

    // check for collision with mc
    if (isCollided(this.game, this)) {
        var mc = this.game.entities.Character;
        if (mc.attack) {
            this.hp -= 5;
        } else {
            mc.hp -= 1;

        }
    }

    if (this.hp <= 0) {
        this.removeFromWorld = true;
    }

    if(this.flyLeft) {
        //fly left
        this.x -= this.game.clockTick * this.speed;
        if(this.x <= 100) {
            this.flyLeft = false;
        }
    }
    else {
        //fly right
        this.x += this.game.clockTick * this.speed;
        if(this.x >= 700) {
            this.flyLeft = true;
        }
    }
    this.y = 200 - Math.sin(this.x / 25) * this.amplitude;

    Entity.prototype.update.call(this);
}

Bat.prototype.draw = function(ctx) {
    if(this.flyLeft) {
        this.flyLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else {
        this.flyRightAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    Entity.prototype.draw.call(this);
}
//#endregion

//#region Skeleton
function Skeleton(game) {
    this.walkLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/skeleton.png"), 0, 0, 64, 64, 0.25, 4, true, true);
    this.walkRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/skeleton.png"), 0, 64, 64, 64, 0.25, 4, true, true);
    this.attackLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/skeleton.png"), 64, 192, 64, 64, 0.15, 3, false, true);
    this.attackRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/skeleton.png"), 0, 256, 64, 64, 0.15, 3, false, true);
    this.attacking = false;
    this.attackTime = 0;
    this.attackLeft = false;
    this.attackRight = true;
    this.walkLeft = false;
    this.walkRight = true;
    this.speed = 80;
    this.radius = 55;
    this.ground = 605;
    this.hp = 50;
    Entity.call(this, game, 300, this.ground);
}
Skeleton.prototype = new Entity();
Skeleton.prototype.constructor = Skeleton;

Skeleton.prototype.update = function() {
    // fall if not on a platform
    if (!onPlatform(this)) {
        this.y += 1;
    }

    // check for collision with mc
    if (isCollided(this.game, this)) {
        var mc = this.game.entities.Character;
        if (mc.attack) {
            // console.log("skeleton is attacked");
            this.hp -= 5;
        } else {
            mc.hp -= 1;

        }
    }

    // if dead, remove from world
    if (this.hp <= 0) {
        this.removeFromWorld = true;
    }

    if (this.attackTime >= 100) {
        this.attacking = true;
    }
    if(this.attacking) {
        this.walkLeft ? this.attackLeft = true : this.attackRight = true;
        if(this.attackLeftAnimation.isDone() || this.attackRightAnimation.isDone()) {
            let bone = new SkeletonBone(this.game, this.x + 1, this.y - 5, this.walkRight);
            this.game.addEntity(bone);
            this.attackLeftAnimation.elapsedTime = 0;
            this.attackRightAnimation.elapsedTime = 0;
            this.attacking = false;
            this.attackTime = 0;
        }
    }
    else {
        if(this.walkLeft) {
            this.x -= this.game.clockTick * this.speed;
            if(this.x <= 100) {
                this.walkLeft = false;
                this.walkRight = true;
                this.attackRight = true;
                this.attackLeft = false;
            }
        }
        else {
            this.x += this.game.clockTick * this.speed;
            if(this.x >= 700) {
                this.walkRight = false;
                this.walkLeft = true;
                this.attackLeft = true;
                this.attackRight = false;
            }
        }
    }
    this.attackTime++;

    Entity.prototype.update.call(this);

}

Skeleton.prototype.draw = function(ctx) {
    if(this.attacking) {
        if(this.attackLeft) {
            this.attackLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
        }
        else {
            this.attackRightAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
        }
    }
    else {
        if(this.walkLeft) {
            this.walkLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
        }
        else {
            this.walkRightAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
        }
    }

    Entity.prototype.draw.call(this);

}

function SkeletonBone(game, skeletonX, skeletonY, direction) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/skeleton.png"), 192, 256, 64, 64, 0.2, 3, true, true);
    this.speed = 300;
    this.ground = 687;
    this.radius = 16;
    this.direction = direction;
    Entity.call(this, game, skeletonX, skeletonY);
}

SkeletonBone.prototype = new Entity();
SkeletonBone.prototype.constructor = SkeletonBone;

SkeletonBone.prototype.update = function() {
    // fall if not on a platform
    if (!onPlatform(this)) {
        this.y += 1;
    }

    if(this.y >= this.ground) {
        this.removeFromWorld = true;
    }
    if(this.x > 1200 || this.x < 0) {
        this.removeFromWorld = true;
    }

    let deltaX = this.animation.elapsedTime / this.animation.totalTime;
    let totalHeight = this.y + 10;

    let deltaY = totalHeight * (-4 * (deltaX * deltaX - deltaX));
    this.y = this.ground - deltaY;
    if(this.direction) {
        this.x += this.game.clockTick * this.speed;
    }
    else {
        this.x -= this.game.clockTick * this.speed;
    }
    Entity.prototype.update.call(this);
}

SkeletonBone.prototype.draw = function(ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
}
//#endregion

//#region Chest
function Chest(game) {
    this.openingAnimation = new Animation(ASSET_MANAGER.getAsset("./img/chest.png"), 0, 0, 64, 64, 0.1, 6, false, false);
    this.closedAnimation = new Animation(ASSET_MANAGER.getAsset("./img/chest.png"), 0, 0, 64, 64, 1, 1, true, false);
    this.openedAnimation = new Animation(ASSET_MANAGER.getAsset("./img/chest.png"), 320, 0, 64, 64, 1, 1, true, false);
    this.ground = 613;
    this.radius = 42;
    this.open = false;
    this.opening = false;
    this.openTime = 0;
    Entity.call(this, game, 400, this.ground);
}

Chest.prototype = new Entity();
Chest.prototype.constructor = Chest;

Chest.prototype.update = function() {
    // fall if not on a platform
    if (!onPlatform(this)) {
        this.y += 1;
    }

    let mcXPosition = this.game.entities.Character.x;
    if(Math.abs(mcXPosition - this.x) <= 40 && this.game.e) {
        this.opening = true;
    }
    if(this.opening && this.openingAnimation.isDone()) {
        this.opening = false;
        this.open = true;
    }
    if(this.open) {
        this.openTime++;
        if(this.openTime >= 150) {
            turkey = new Turkey(this.game, this.x - this.game.camera.x, this.y - this.game.camera.y);
            this.game.addEntity(turkey);
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
        this.openedAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else {
        this.closedAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
}
//#endregion

function AttackWolf(game, theX) {
    this.walkBack = new Animation(ASSET_MANAGER.getAsset("./img/wolfsheet.png"), 0, 420, 88, 60, .1, 9, true, false);
    this.walk = new Animation(ASSET_MANAGER.getAsset("./img/wolfsheet.png"), 0, 960, 88, 60, .1, 9, true, false);
    this.attackF = new Animation(ASSET_MANAGER.getAsset("./img/wolfsheet.png"), 0, 780, 88, 60, .1, 9, false, false);
    this.attackBack = new Animation(ASSET_MANAGER.getAsset("./img/wolfsheet.png"), 0, 240, 88, 60, .1, 9, false, false);
    this.attack = false;
    this.back = false;
    this.width = 88;
    this.height = 60;
    this.hp = 90;
    Entity.call(this, game, theX, 580);
    Entity.call(this, game, theX, 450);
}

AttackWolf.prototype = new Entity();
AttackWolf.prototype.constructor = AttackWolf;

AttackWolf.prototype.update = function () {
    // fall if not on a platform
    if (!onPlatformWH(this)) {
        this.y += 1;
    }

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

    // if dead, remove from world
    if (this.hp <= 0) {
        this.removeFromWorld = true;
    }
    if(this.x > 600) {
        this.back = true;
        this.attack = true;
    }
    else if(this.x < 50) {
        this.back = false;
        this.attack = true;
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
            this.x = this.x - this.game.clockTick * 75
        }
    else {
            this.x = this.x + this.game.clockTick * 75
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
    if (!onPlatformWH(this)) {
        this.y += 1;
    }

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


// Begin mini Boss
function MiniBoss(game, theX) {
    this.walkBack = new Animation(ASSET_MANAGER.getAsset("./img/miniBoss.png"), 0, 290, 235, 230, .1, 2, true, false);
    this.walk = new Animation(ASSET_MANAGER.getAsset("./img/miniBoss.png"), 0, 290, 235, 230, .1, 2, true, false);
    this.attackSlashRev = new Animation(ASSET_MANAGER.getAsset("./img/slashAttackRevv.png"), 0, 0, 10416 / 7, 350, .2, 7, false, false);
    this.idle = new Animation(ASSET_MANAGER.getAsset("./img/miniBoss.png"), 0, 0, 249, 245, .1, 3, true, true);
    this.idleRev = new Animation(ASSET_MANAGER.getAsset("./img/miniBossRev.png"), 0, 0, 253, 245, 1, 3, true, false);
    this.hitRev = new Animation(ASSET_MANAGER.getAsset("./img/miniBossRev.png"), 760, 0, 253, 245, .5, 1, true, false);
    this.fightingAni = new Animation(ASSET_MANAGER.getAsset("./img/miniBossRev2.png"), 0, 290, 235, 230, .5, 2, true, false);
    this.still = true;
    this.stillFighting = false;
    this.attack = false;
    this.gotHit = false;
    this.back = false;
    this.attackTime = 0;
    this.preAttack = false;
    this.width = 298;
    this.height = 298;
    this.hp = 10000;
    Entity.call(this, game, 1700, 390);
    //Entity.call(this, game, theX, 600);
}

MiniBoss.prototype = new Entity();
MiniBoss.prototype.constructor = MiniBoss;

MiniBoss.prototype.update = function () {
    // fall if not on a platform
    if (!onPlatformWH(this)) {
        //this.y += 1;
    }

        // check for collision with mc
    if (isCollidedWH(this.game, this)) {
        var mc = this.game.entities.Character;
        if (mc.attack) {
            // console.log("wolf is attacked");
            this.hp -= 20;
            this.gotHit = true;
        
        } else if (this.attack === true) {
            mc.hp -= 1;
        
        } else {
          

        }
    }

    if(this.attackSlashRev.isDone()) {
        this.attack = false;
        this.stillFighting = true;
        this.attackSlashRev.elapsedTime = 0;
    }


    if (this.hp <= 0) {
        this.removeFromWorld = true;
    }
    // if(this.x > 600) {
    //     this.back = true;
    //     this.attack = true;
    // }
    // else if(this.x < 50) {
    //     this.back = false;
    //     this.attack = true;
    // }

    // if(this.attackF.isDone()) {
    //     this.back = false;
    //     this.attackF.elapsedTime = 0;
    //     this.attackBack.elapsedTime = 0;
    //     this.attack = false;
    // }
    // else if(this.attackBack.isDone()) {
    //     this.back = true;
    //     this.attackF.elapsedTime = 0;
    //     this.attackBack.elapsedTime = 0;
    //     this.attack = false;
    // }
    

    if(this.back) {
            //this.x = this.x - this.game.clockTick * 75
        }
    else {
            //this.x = this.x + this.game.clockTick * 75
     }
    this.attackTime++;
    Entity.prototype.update.call(this);
}

MiniBoss.prototype.draw = function (ctx) {


    if(this.gotHit ) {
        this.hitRev.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
        this.gotHit = false;
        this.attack = true;
    // } else if (this.attack) {
    //     //this.attackSlash.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y); 
    //     this.attack = false;
    } else if (this.attack === true ) {
        this.attackSlashRev.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y - 25);


    } else if ( this.stillFighting) {
        this.fightingAni.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y + 50);
    } else {
        this.idleRev.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
        this.attack = false;
    }
    Entity.prototype.draw.call(this);
}

// BEGIN PLATFORM

// Key piece:
// 1 - bright brick medium (32 x 32 px)
// 2 - bright brick half-size (32 X 16 px)
// 3 - right round
function Platform(game, theX, theY, tilePiece) {
    this.game = game;
    this.radius = 32;
    // this.x = theX;
    // this.y = theY;

    switch(tilePiece) {
        case 1:
        this.idle = new Animation(ASSET_MANAGER.getAsset("./img/brickMed.png"), 16, 32, 32, 32, 1, 1, true, false);
        break;

        case 2:
        this.idle = new Animation(ASSET_MANAGER.getAsset("./img/brickMed.png"), 16, 32, 32, 16, 1, 1, true, false);
        break;
    }
    
    Entity.call(this, game, theX, theY);
}

Platform.prototype = new Entity();
Platform.prototype.constructor = Platform;

Platform.prototype.update = function() {
    Entity.prototype.update.call(this);
}

Platform.prototype.draw = function(ctx) {
    this.idle.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    Entity.prototype.draw.call(this);
}
// END PLATFORM


function MapLevel(game) {
    this.game = game;
    Entity.call(this, game, 0, 0);
    this.map = new Array(32);

    for (var i = 0; i < 32; i++) {
        this.map[i] = new Array(24);
    }
    this.sprites = new Array(2);

    var testMap =   [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                     [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                     [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                     [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                     [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                     [1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
                     [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                     [1,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
                     [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                     [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // right --->>>
                     [1,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
                     [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                     [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                     [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                     [1,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
                     [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                     [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                     [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                     [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                     [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
                     [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                     [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];

    this.map = testMap;

    this.sprites[0] = null;
    this.sprites[1] = ASSET_MANAGER.getAsset("./img/tileBrickGreen.png");
}

MapLevel.prototype = new Entity();
MapLevel.prototype.constructor = MapLevel;

MapLevel.prototype.update = function() {
    Entity.prototype.update.call(this);
}

MapLevel.prototype.draw = function (ctx) {
    for (var i = 0; i < 24; i++) {
        for (var j = 0; j < 32; j++) {
            // check if sprite is null, if not, draw it
            var sprite = this.sprites[this.map[j][i]];
            if (sprite) {
                // (sprite tile, x, y)
                ctx.drawImage(sprite, i * 32 - this.game.camera.x, j * 32 - this.game.camera.y);
                platforms.push(new Platform(this.game, i * 32 - this.game.camera.x, j * 32 - this.game.camera.y));
            }
        }
    }
    // Entity.prototype.draw.call(this);
}

function GameOverScreen(game) {
    this.x = 0;
    this.y = 0;
    this.game = game;
    this.ctx = game.ctx;
};

GameOverScreen.prototype.draw = function () {
    this.game.pause = true;
    this.ctx.fillStyle = "rgba(0, 0, 200, 0.7)";
    this.ctx.fillRect(0, 0, 1200, 700);
    this.ctx.fillStyle = "white";
    this.ctx.font = "100px Arial";
    this.ctx.fillText("Game Over", 330, 350);
};

GameOverScreen.prototype.update = function () {
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
ASSET_MANAGER.queueDownload("./img/wolfsheet.png");
ASSET_MANAGER.queueDownload("./img/brickMed.png");

ASSET_MANAGER.queueDownload("./img/emberBack.gif");
ASSET_MANAGER.queueDownload("./img/startgame.png");
ASSET_MANAGER.queueDownload("./img/startgameHigh.png");
ASSET_MANAGER.queueDownload("./img/controls.png");
ASSET_MANAGER.queueDownload("./img/controlsHigh.png");
ASSET_MANAGER.queueDownload("./img/title.png");
ASSET_MANAGER.queueDownload("./img/miniBoss.png");
ASSET_MANAGER.queueDownload("./img/miniBossRev.png");
ASSET_MANAGER.queueDownload("./img/slashAttackRev.png");
ASSET_MANAGER.queueDownload("./img/slashAttackRevv.png");
ASSET_MANAGER.queueDownload("./img/miniBossRev2.png");

ASSET_MANAGER.queueDownload("./img/controlScreen.jpg");
ASSET_MANAGER.queueDownload("./img/skeleton.png");
ASSET_MANAGER.queueDownload("./img/brickBG_1200x700.png");
ASSET_MANAGER.queueDownload("./img/tiles_32x32.png");
ASSET_MANAGER.queueDownload("./img/brickSmall.png");
ASSET_MANAGER.queueDownload("./img/brickMed.png");
ASSET_MANAGER.queueDownload("./img/dirt_tiles.png");
ASSET_MANAGER.queueDownload("./img/tileBrickGreen.png");


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
    gameEngine.addEntity(new Menu(gameEngine, ASSET_MANAGER.getAsset("./img/startgameHigh.png"), 90, 400));
    gameEngine.addEntity(new Menu(gameEngine, ASSET_MANAGER.getAsset("./img/controls.png"), 100, 500));
 
});
// #endregion