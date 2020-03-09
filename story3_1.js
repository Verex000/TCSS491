function Story3_1(game) {
    this.read = false;
    this.game = game;
    this.doneRead = false;
    this.readTime = 0;
    this.anim = new Animation(ASSET_MANAGER.getAsset("./img/story3_1.png"), 0, 0, 1000, 239, 12, 1, false, false);

    this.x = 100;
    this.y = 700 - 250;
}

Story3_1.prototype = new Entity();
Story3_1.prototype.constructor = Story3_1;

Story3_1.prototype.update = function() {


    if (!this.read && this.game.entities.Character.x > 50) {
        this.read = true;
    }

    if(this.anim.isDone()) {
        this.removeFromWorld = true;
    }

    Entity.prototype.update.call(this);
}

Story3_1.prototype.draw = function(ctx) {
    if (this.read) {
        this.anim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
}