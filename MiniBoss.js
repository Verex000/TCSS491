function MiniBoss(game, spawnX, spawnY) {
    this.game = game;
    this.attackSlashRev = new Animation(ASSET_MANAGER.getAsset("./img/miniBossAttackSlashRev.png"), 0, 0, 4480 / 8, 408, .2, 7, false, false);
    this.attackSlash = new Animation(ASSET_MANAGER.getAsset("./img/miniBossAttackSlash.png"), 0, 0, 4480 / 8, 408, .2, 7, false, false);
    this.idle = new Animation(ASSET_MANAGER.getAsset("./img/miniBossIdle.png"), 0, 0, 729 / 3, 234, .1, 3, true, false);
    this.idleRev = new Animation(ASSET_MANAGER.getAsset("./img/miniBossIdleRev.png"), 0, 0, 729 / 3, 234, .5, 3, true, false);
    this.hitRev = new Animation(ASSET_MANAGER.getAsset("./img/miniBossHitRev.png"), 0, 0, 222, 280, .5, 1, false, false);
    this.hit = new Animation(ASSET_MANAGER.getAsset("./img/miniBossHit.png"), 0, 0, 222, 280, .5, 1, false, false);
    this.fightingAniRev = new Animation(ASSET_MANAGER.getAsset("./img/miniBossFightingRev.png"), 0, 0, 220, 206, .5, 2, true, false);
    this.fightingAni = new Animation(ASSET_MANAGER.getAsset("./img/miniBossFighting.png"), 0, 0, 220, 206, .5, 2, true, false);
    this.spikeShootRev = new Animation(ASSET_MANAGER.getAsset("./img/miniBossShootRev.png"), 0, 0, 1792 / 7, 258, .5, 7, true, false);
    this.spikeShoot = new Animation(ASSET_MANAGER.getAsset("./img/miniBossShoot.png"), 0, 0, 1792 / 7, 258, .5, 7, true, false);
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
    this.hp = 1500000000;


   
    this.amountHit = 0;

    Entity.call(this, this.game, spawnX, spawnY);
    //Entity.call(this, game, theX, 600);
}



MiniBoss.prototype = new Entity();
MiniBoss.prototype.constructor = MiniBoss;

MiniBoss.prototype.update = function () {

   

    var mc = this.game.entities.Character;

    console.log(mc.x);
    console.log(mc.y);

    if (collided(mc.boundingbox, this)) {
        if (mc.attack) {
            this.hp -= mc.attackPower;
            if(this.attackTime < 0) {
                this.attackTime = 10;
                this.attack = true;

            } else {
                            
                this.amountHit++;
                this.attackTime -= 1;
            }
        } 
        if (this.attack && this.attackTime === 0) {
            mc.hp -= 3;
        }
    }

    if (mc && mc.x > 7400 && mc.y < 64) {
        this.found = true;
    }
    if (this.found) {           // if found follow mc
        if(mc.x - this.x > 40) {
            this.back = false;
        } else {
            this.back = true;
        }
        if (this.back && this.attack ===false) {
            this.x = this.x - this.game.clockTick * 100;
        } else if (this.attack ===false && this.back === false){
            this.x = this.x + this.game.clockTick * 100;
        }
    }


    if(this.attackSlashRev.elapsedTime + this.game.clockTick > this.attackSlashRev.totalTime  ) {
        this.attackSlashRev.elapsedTime = 0;
        
        this.attackTime = 0;
        this.attack = false;
        this.stillFighting = true;
    }

    if(this.spikeShootRev.elapsedTime + this.game.clockTick > this.spikeShootRev.totalTime  ) {
        var spike1 = new BossFallingFlame(this.game, mc.x - 50, mc.y);
        var spike2 = new BossFallingFlame(this.game, mc.x - 100, mc.y );
        var spike3 = new BossFallingFlame(this.game, mc.x - 150, mc.y );
        var spike4 = new BossFallingFlame(this.game, mc.x - 200, mc.y );
        this.game.addEntity(spike1);
        this.game.addEntity(spike2);
        this.game.addEntity(spike3);
        this.game.addEntity(spike4);

        this.amountHit = 0;
        this.spikeShootRev.elapsedTime = 0;
        this.attackTime = 0;
        this.attack = false;
        this.stillFighting = true;
    }

    if(this.spikeShoot.elapsedTime + this.game.clockTick > this.spikeShoot.totalTime  ) {
        var spike1 = new BossFallingFlame(this.game, mc.x + 50, mc.y);
        var spike2 = new BossFallingFlame(this.game, mc.x + 100, mc.y );
        var spike3 = new BossFallingFlame(this.game, mc.x + 150, mc.y );
        var spike4 = new BossFallingFlame(this.game, mc.x + 200, mc.y );
        this.game.addEntity(spike1);
        this.game.addEntity(spike2);
        this.game.addEntity(spike3);
        this.game.addEntity(spike4);

        this.amountHit = 0;
        this.spikeShoot.elapsedTime = 0;
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
   
        if(mc.x <= 6248) {
            var crown = new FallingCrown(this.game, 6400, mc.y);
        } else if ( mc.x >= 7919) {
            var crown = new FallingCrown(this.game, 7800, mc.y);
        } else {
            var crown = new FallingCrown(this.game, mc.x, mc.y);
        }
        this.game.addEntity(crown);
    }
    Entity.prototype.update.call(this);
}

MiniBoss.prototype.draw = function (ctx) {

    if(this.amountHit > 150  && this.back) {
        this.spikeShootRev.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x + 50, this.y - this.game.camera.y );

    } else if (this.amountHit > 150  && this.back === false ) {
        this.spikeShoot.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x + 50, this.y - this.game.camera.y );
        
    } else if (this.attack === true  && this.back) {

        this.attackSlashRev.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x - 115, this.y - this.game.camera.y - 100);
      

    } else if ( this.stillFighting && this.back ) {
        this.fightingAniRev.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x + 30, this.y - this.game.camera.y + 25);
    
            
    } else if (this.attack  && this.back === false) {
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