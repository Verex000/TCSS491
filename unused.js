
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



