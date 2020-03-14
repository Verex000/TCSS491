function FallingCrown(game, theX, theY) {

    this.game = game;
    this.pickedUp = false;
    this.canBePickedUp = false;
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/crown.png"), 0, 0,50, 37, 0.3, 1, true, false);
    //this.radius = 28;
    this.boundingbox = new BoundingBox(theX, theY, 30, 20);
    this.falling = true;
    Entity.call(this, game, theX + 35, theY - 415);
}
FallingCrown.prototype = new Entity();
FallingCrown.prototype.constructor = FallingCrown;
FallingCrown.prototype.collidePlat = function() {
    collide = false;
    if (this.y > -30) {
        collide = true;
    }
    return collide;
}
FallingCrown.prototype.update = function() {
    this.boundingbox = new BoundingBox(this.x, this.y, 30, 20);

    var mc = this.game.entities.Character;
    console.log(mc.x);
    if (this.falling) {
        this.y += 5;
    }
    else if (!this.collidePlat() && Math.abs(mc.x - this.x) <= 64 && Math.abs(mc.y - this.y) <= 224) {
        this.falling = true;
    }
    if( this.y > 0) {
        this.falling = false;
    }
    if(this.game.e && Math.abs(mc.x - this.x) <= 50 && Math.abs(mc.y - this.y) <= 60) {
        this.canBePickedUp = true;
    }
    if(this.canBePickedUp) {
        this.game.cosmeticEntities.push(new GameWonScreen(this.game));
    }

    Entity.prototype.update.call(this);
}
FallingCrown.prototype.draw = function(ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    Entity.prototype.draw.call(this);
}