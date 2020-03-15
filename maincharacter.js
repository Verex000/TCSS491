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
    this.prevX = 50;
    this.knockedBackDuration = 0;
    this.timeSinceThrow = 0;
    this.knockBackAmount = 0;

    
    

    // DEFAULT: LEVEL 1 CHECKPOINTS
    this.checkpoint1 = {x: 50, y: 544};
    this.checkpoint2 = {x: 1984, y: 0};
    this.checkpoint3 = {x: 4736, y: 224};
    this.checkpoint4 = {x: 6208, y: 500};
    
    this.boundingbox = new BoundingBox(this.x + 16, this.y, 32, 64);
    this.hitBoxFront = new BoundingBox(this.x + 40, this.y, 44, 64);
    this.hitBoxBack = new BoundingBox(this.x - 24, this.y, 44, 64);

   Entity.call(this, game, 50, 544);
   //Entity.call(this, game, 6400, 0);
}

MainCharacter.prototype = new Entity();
MainCharacter.prototype.constructor = MainCharacter;

MainCharacter.prototype.checkPointUpdate = function() {
    if (this.x >= this.checkpoint4.x) {
        this.checkPoint = {x: this.checkpoint4.x, y: this.checkpoint4.y};
    }
    else if (this.x >= this.checkpoint3.x) {
        this.checkPoint = {x: this.checkpoint3.x, y: this.checkpoint3.y};
    }
    else if (this.x >= this.checkpoint2.x) {
        this.checkPoint = {x: this.checkpoint2.x, y: this.checkpoint2.y};
    }
    else if (this.x >= this.checkpoint1.x) {
        this.checkPoint = {x: this.checkpoint1.x, y: this.checkpoint1.y};
    }

    // if(this.x > 7300 && this.bossFight === false) {
    //     this.game.enemies.push(new BossWolf(this.game, 7815, 277));
    //     this.bossFight = true;
    // }

    // if (this.y > 90 && this.x > 2000) {
    //     this.checkPoint = {x: 2410, y: 90};
    // }
    // if (this.y < -288 && this.x > 1800) {
    //     this.checkPoint = {x: 1800, y: -352};
    // }
    // else if(this.x > 7100) {
    //     this.checkPoint = {x: 7100, y: 400};
    // }
    // else if(this.x > 4500) {
    //     this.checkPoint = {x: 4500, y: 450};
    // }
    // else if(this.x > 1700) {
    //     this.checkPoint = {x: 1700, y: 400};
    // }
}

MainCharacter.prototype.damage = function (damage, knockback) {
    if(this.ticksSinceDamage > .75 && knockback == 0) {
        this.hp -= damage * damageMult;
        this.ticksSinceDamage = 0;
        this.damaged = true;
    }
    else if(this.ticksSinceDamage > .75 && knockback != 0) {
        this.hp -= damage * damageMult;
        this.ticksSinceDamage = 0;
        this.knockedBackDuration = .3;
        this.knockBackAmount = knockback;
        this.damaged = true;
    }
}

MainCharacter.prototype.update = function () {
    this.ticksSinceDamage += this.game.clockTick;
    this.timeSinceThrow += this.game.clockTick;
    this.boundingbox = new BoundingBox(this.x + 16, this.y, 32, 64);
    this.hitBoxFront = new BoundingBox(this.x + 40, this.y, 46, 64);
    this.hitBoxBack = new BoundingBox(this.x - 24, this.y, 46, 64);
    if(this.platform) {
        console.log(this.platform.x + " " + this.platform.y);
    }
    // if fall off map, die
    if (this.y > 700) {
        this.hp = this.hp - 20 * damageMult;
        this.x = this.checkPoint.x;
        this.y = this.checkPoint.y;
    }
    if (this.hp <= 0) {
        this.hp = 0;
        this.game.cosmeticEntities.push(new GameOverScreen(this.game));
    }
    if (this.hp > this.maxHP) {
        this.hp = this.maxHP;
    }
    if(this.knockedBackDuration <= 0 && !this.game.stopMc) {
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
        if(this.game.r && !this.attack && this.timeSinceThrow > .19) {
            this.timeSinceThrow = 0;
            newBall = new Shuriken(this.game);
            if(this.back) {
                newBall.left = false;
            }
            this.game.addEntity(newBall);
            this.game.r = false;
        }
    }
    else {
        this.stand = true;
        if(this.knockedBackDuration <= 0) {
            this.knockBackAmount = 0;
        }
        this.knockedBackDuration -= this.game.clockTick;
        this.x += this.knockBackAmount;
        knockedBack(this);
     }


    if(this.x < 0) {
        this.x = 0;
    }
    this.checkPointUpdate();
    if(!this.falling && !this.jumping) {
        if(!this.boundingbox.collide(this.platform.boundingbox))  {
            this.falling = true
        }
    }
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
        this.boundingbox = new BoundingBox(this.x + 16, this.y, 32, 64);
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
                this.boundingbox = new BoundingBox(this.x + 16, this.y, 32, 64);
                this.hitBoxFront = new BoundingBox(this.x + 40, this.y, 46, 64);
                this.hitBoxBack = new BoundingBox(this.x - 24, this.y, 46, 64);
            }
        }
        
    }
    if(this.falling) {
        this.y += (this.game.clockTick / this.fallForward.totalTime * 4 * this.jumpHeight);
        this.lastbottom = this.boundingbox.bottom;
        this.boundingbox = new BoundingBox(this.x + 16, this.y, 32, 64);
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
                //console.log(this.platform.x + "    " + this.platform.y);
                this.boundingbox = new BoundingBox(this.x + 16, this.y, 32, 64);
                this.hitBoxFront = new BoundingBox(this.x + 40, this.y, 46, 64);
                this.hitBoxBack = new BoundingBox(this.x - 24, this.y, 46, 64);
            }
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
                    this.boundingbox = new BoundingBox(this.x + 16, this.y, 32, 64);
                    this.hitBoxFront = new BoundingBox(this.x + 40, this.y, 46, 64);
                    this.hitBoxBack = new BoundingBox(this.x - 24, this.y, 46, 64);
            } 
            else if(this.boundingbox.left < wall.boundingbox.right && this.boundingbox.left > wall.boundingbox.left 
                && this.boundingbox.top + 19 < wall.boundingbox.bottom) {
                    this.x = this.x + this.game.clockTick * 300;
                    this.boundingbox = new BoundingBox(this.x + 16, this.y, 32, 64);
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
    this.prevX = this.x;
    if(this.game.camera) {
        this.game.camera.update(this.x, this.y);
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
    else if (this.falling && !this.back) {
        this.fallForward.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else if(this.falling && this.back) {
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
            this.game.enemies[b].hp -= 6;
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
