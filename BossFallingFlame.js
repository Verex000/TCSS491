function BossFallingFlame(game, theX, theY) {
    this.time = 0;
    this.game = game;
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/blueFlame.png"), 0, 0, 640/10, 384/6, 0.1, 60, true, true);
    this.radius = 28;
    this.boundingbox = new BoundingBox(theX, theY, 30, 20);
    this.falling = true;
    this.flameTime = 0;
    Entity.call(this, game, theX, -400);
}
BossFallingFlame.prototype = new Entity();
BossFallingFlame.prototype.constructor = BossFallingFlame;
BossFallingFlame.prototype.collidePlat = function() {
    collide = false;
    for (var i = 0; i < this.game.platforms.length; i++) {
        collide = this.boundingbox.collide(this.game.platforms[i].boundingbox);
        if (collide) {
            return true;
        }
    }
    return collide;
}
BossFallingFlame.prototype.update = function() {
    this.flameTime++;
    this.boundingbox = new BoundingBox(this.x, this.y, 30, 20);
    
    var mc = this.game.entities.Character;
    console.log(mc.x);
    if (this.falling) {
        this.y += 5;
    }
    else if (!this.collidePlat() && Math.abs(mc.x - this.x) <= 64 && Math.abs(mc.y - this.y) <= 224 && this.y < -25) {
        this.falling = true;
    }
    if( this.y > -25 ) {
        this.falling = false;
    }
    if ( this.flameTime > 500) {
        this.removeFromWorld = true;
    }

    var mc = this.game.entities.Character;
    if (collided(mc.boundingbox, this.boundingbox)) {
        mc.damage(5, 0);
    }

    Entity.prototype.update.call(this);
}
BossFallingFlame.prototype.draw = function(ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    Entity.prototype.draw.call(this);
}