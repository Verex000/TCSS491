

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

function Background(game) {
    Entity.call(this, game, 0, 400);
    this.radius = 200;
}
// #endregion

// #region Background
Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
}

Background.prototype.draw = function (ctx) {
    ctx.fillStyle = "SaddleBrown";
    ctx.fillRect(0,500,1200,300);
    Entity.prototype.draw.call(this);
}
// #endregion 

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

// #region Main Character
function MainCharacter(game) {
    this.walkAnim = new Animation(ASSET_MANAGER.getAsset("./img/MainCharacter.png"), 0, 32, 32, 32, .1, 4, true, false);
    this.backWalkAnim= new Animation(ASSET_MANAGER.getAsset("./img/MainCharacter.png"), 0, 0, 32, 32, .1, 4, true, false);
    this.attackBackAnim = new Animation(ASSET_MANAGER.getAsset("./img/MainCharacter.png"), 0, 64, 32, 32, .1, 4, false, false);
    this.attackForwardAnim = new Animation(ASSET_MANAGER.getAsset("./img/MainCharacter.png"), 0, 96, 32, 32, .1, 4, false, false);
    this.idleBackAnim = new Animation(ASSET_MANAGER.getAsset("./img/MainCharacter.png"), 0, 128, 32, 32, .1, 4, true, false);
    this.idleAnim = new Animation(ASSET_MANAGER.getAsset("./img/MainCharacter.png"), 0, 160, 32, 32, .1, 4, true, false);
    this.jumpForward = new Animation(ASSET_MANAGER.getAsset("./img/MainCharacter.png"), 0, 224, 32, 32, .2, 4, false, false);
    this.jumpBackward = new Animation(ASSET_MANAGER.getAsset("./img/MainCharacter.png"), 0, 192, 32, 32, .2, 4, false, false);
    this.jumping = false;
    this.stand = true;
    this.back = false;
    this.attack = false;
    this.hp = 100;
    this.radius = 64;
    this.ground = 468;
    Entity.call(this, game, 0, 468);
}

MainCharacter.prototype = new Entity();
MainCharacter.prototype.constructor = MainCharacter;

MainCharacter.prototype.update = function () {
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
            if(this.x > 1200) this.x = -20; 
        }
        else {
            this.x = this.x + this.game.clockTick * 300;
            if(this.x > 1200) this.x = -20; 
        }
    }
    if(this.game.a) {
        if(this.game.c) {
            this.x = this.x - this.game.clockTick * 900
            if(this.x < 0) this.x = 1220;
        }
        else {
            this.x = this.x - this.game.clockTick * 300
            if(this.x < 0) this.x = 1220;
        }
        
    }

    Entity.prototype.update.call(this);
}

MainCharacter.prototype.draw = function (ctx) {
    if (this.jumping && !this.back) {
        this.jumpForward.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    else if(this.jumping && this.back) {
        this.jumpBackward.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    else if(this.attack && this.back) {
        this.attackBackAnim.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    else if(this.attack && !this.back) {
        this.attackForwardAnim.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    else if(this.stand == false && this.back == false) {
        this.walkAnim.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    else if(this.stand == false && this.back == true) {
        this.backWalkAnim.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    else if(this.stand == true && this.back == false){
        this.idleAnim.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    else {
        this.idleBackAnim.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
}
// #endregion

//#region Ball
function Ball(game) {
    this.thrown = new Animation(ASSET_MANAGER.getAsset("./img/ballsprite.png"), 0, 0, 32, 32, .05, 3, true, false);
    this.radius = 64;
    this.ground = 400;
    this.left = true;
    Entity.call(this, game, game.entities.Character.x, game.entities.Character.y);
}

Ball.prototype = new Entity();
Ball.prototype.constructor = Ball;

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
    this.thrown.drawFrame(this.game.clockTick, ctx, this.x, this.y);
}
// #endregion

//#region Spike Trap
function Spike(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/traps.png"), 12, 62, 32, 32, 0.3, 1, true, true);
    this.radius = 64;
    this.ground = 462;
    Entity.call(this, game, 20, 20);
}

Spike.prototype = new Entity();
Spike.prototype.constructor = Spike;
Spike.prototype.update = function() {
    if(this.y < 500) {
        this.y = this.y + 1;
    }
    Entity.prototype.update.call(this);
}

Spike.prototype.draw = function(ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    Entity.prototype.draw.call(this);

}
// #endregion

//#region Turkey
function Turkey(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/turkey.png"), 0, 0, 64, 64, 1, 1, true, true);
    this.radius = 64;
    this.ground = 462;
    Entity.call(this, game, 200, 600);
}

Turkey.prototype = new Entity();
Turkey.prototype.constructor = Turkey;

Turkey.prototype.update = function() {
    Entity.prototype.update.call(this);
}

Turkey.prototype.draw = function(ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
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
    this.radius = 0;
    this.ground = 462;
    this.walkLeft = true;
    this.walkRight = false; 
    this.jumpTime = 0;
    Entity.call(this, game, 100, 310);

}

Dino.prototype = new Entity();
Dino.prototype.constructor = Dino;

Dino.prototype.update = function() {
    
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
        this.WalkLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
        // this.walkRightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);

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
    this.radius = 0;
    this.ground = 462;
    this.walkLeft = true;
    this.walkRight = false; 
    this.jumpTime = 0;
    Entity.call(this, game, 300, 462);
}

Slime.prototype = new Entity();
Slime.prototype.constructor = Slime;

Slime.prototype.update = function() {
    if(this.jumpTime >= 100) {
        console.log("yeet");
        this.jumping = true;
    }
    if(this.jumping) {
        if(this.jumpAnimation.isDone()) {
            this.jumpAnimation.elapsedTime = 0;
            this.jumping = false;
        }
        var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
        var totalHeight = 10;
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
    if (this.jumping) {
        this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x + 17, this.y - 34);
    }
    else {
        if(this.walkLeft) {
            this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        }
        else {
            this.walkRightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        }
        // this.walkRightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);

    }
    Entity.prototype.draw.call(this);
}
//#endregion

// the "main" code begins here
// #region Main
var ASSET_MANAGER = new AssetManager();

//ASSET_MANAGER.queueDownload("./img/traps.png");
ASSET_MANAGER.queueDownload("./img/RobotUnicorn.png");
ASSET_MANAGER.queueDownload("./img/MainCharacter.png");
ASSET_MANAGER.queueDownload("./img/ballsprite.png");
ASSET_MANAGER.queueDownload("./img/slimeEnemy.png");
ASSET_MANAGER.queueDownload("./img/turkey.png");
ASSET_MANAGER.queueDownload("./img/traps.png");
ASSET_MANAGER.queueDownload("./img/dino.png");
ASSET_MANAGER.queueDownload("./img/dinoReverse.png");
ASSET_MANAGER.queueDownload("./img/startScreen.png");


ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();
    gameEngine.addEntity(new StartScreen(gameEngine, ASSET_MANAGER.getAsset("./img/startScreen.png")));

    // var gameEngine = new GameEngine();
    // var bg = new Background(gameEngine);
    // var maincharacter = new MainCharacter(gameEngine);
    // var healthbar = new HealthBar(gameEngine);
	// var slime = new Slime(gameEngine);
	// var turkey = new Turkey(gameEngine);
	// var spike = new Spike(gameEngine);


    // gameEngine.addEntity(bg);
    // gameEngine.addEntity(healthbar);
    // gameEngine.entities.Character = maincharacter;
	// gameEngine.addEntity(slime);
	// gameEngine.addEntity(turkey);
	// gameEngine.addEntity(spike);
 
});
// #endregion