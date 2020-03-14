function Story1_2(game) {
    this.read = false;
    this.game = game;
    this.doneRead = false;
    this.readTime = 0;
    this.anim = new Animation(ASSET_MANAGER.getAsset("./img/story1_2.png"), 0, 0, 1000, 239, 10, 1, false, false);

    this.x = 5708;
    this.y = 700 - 250;
}

Story1_2.prototype = new Entity();
Story1_2.prototype.constructor = Story1_2;

Story1_2.prototype.update = function() {


    if (!this.read && this.game.entities.Character.x > 6208) {
        this.read = true;
        this.game.stopMc = true;
    }

    if(this.anim.isDone()) {
        this.removeFromWorld = true;
        this.game.stopMc = false;
    }
    if(this.anim.elapsedTime > .5 && this.game.e) {
        this.removeFromWorld = true;
        this.game.stopMc = false;
    }
    Entity.prototype.update.call(this);
}

Story1_2.prototype.draw = function(ctx) {
    if (this.read) {
        this.anim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
}

