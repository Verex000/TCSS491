function Story1_1(game) {
    this.read = false;
    this.game = game;
    this.doneRead = false;
    this.readTime = 0;
    this.anim = new Animation(ASSET_MANAGER.getAsset("./img/story1_1.png"), 0, 0, 1000, 239, 15, 1, false, false);

    this.x = 100;
    this.y = 700 - 250;
}

Story1_1.prototype = new Entity();
Story1_1.prototype.constructor = Story1_1;

Story1_1.prototype.update = function() {


    if (!this.read && this.game.entities.Character.x > 70) {
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

Story1_1.prototype.draw = function(ctx) {
    if (this.read) {
        this.anim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
}

