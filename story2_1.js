function Story2_1(game) {
    this.read = false;
    this.game = game;
    this.doneRead = false;
    this.readTime = 0;
    this.anim = new Animation(ASSET_MANAGER.getAsset("./img/story2_1.png"), 0, 0, 1000, 239, 10, 1, false, false);

    this.x = 100;
    this.y = 700 - 250;
}

Story2_1.prototype = new Entity();
Story2_1.prototype.constructor = Story2_1;

Story2_1.prototype.update = function() {


    if (!this.read && this.game.entities.Character.x > 50) {
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

Story2_1.prototype.draw = function(ctx) {
    if (this.read) {
        this.anim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
}