function Platform(game, theX, theY) {
    this.idle = new Animation(ASSET_MANAGER.getAsset("./img/yellowplat28x16.png"), 0, 0, 28, 16, 1, 1, true, false);
    Entity.call(this, game, theX, theY);
    this.platform = true;
    this.boundingbox = new BoundingBox(theX,theY,32,32);
}
Platform.prototype = new Entity();
Platform.prototype.constructor = Platform;

Platform.prototype.update = function () {
    Entity.prototype.update.call(this);
}
Platform.prototype.draw = function(ctx) {
    this.idle.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    Entity.prototype.draw.call(this);
}

function Wall(game, theX, theY) {
    this.idle = new Animation(ASSET_MANAGER.getAsset("./img/brickMed.png"), 16, 32, 32, 32, 1, 1, true, false);
    Entity.call(this, game, theX, theY);
    this.platform = false;
    this.wall = true;
    this.boundingbox = new BoundingBox(theX, theY, 32, 32);
}

// this.idle = new Animation(ASSET_MANAGER.getAsset("./img/yellowplat28x16.png"), 0, 0, 28, 16, 1, 1, true, false);

Wall.prototype = new Entity();
Wall.prototype.constructor = Wall;

Wall.prototype.update = function () {
    Entity.prototype.update.call(this);
}

Wall.prototype.draw = function(ctx) {
    this.idle.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    Entity.prototype.draw.call(this);
}

function WallPlatform(game, theX, theY, collideBot, isPlatform, isGate) {
    this.game = game;
    this.idle = new Animation(ASSET_MANAGER.getAsset("./img/brickMed.png"), 16, 32, 32, 32, 1, 1, true, false);
    Entity.call(this, game, theX, theY);
    this.platform = isPlatform;
    this.wall = true;
    this.isGate = isGate;
    this.collideBottom = collideBot;
    this.boundingbox = new BoundingBox(theX,theY,28,16);
}

WallPlatform.prototype = new Entity();
WallPlatform.prototype.constructor = WallPlatform;

WallPlatform.prototype.update = function () {
    if (this.game.openNext && this.isGate) {
        this.removeFromWorld = true;
    } 
    Entity.prototype.update.call(this);
}

WallPlatform.prototype.draw = function(ctx) {
    this.idle.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    Entity.prototype.draw.call(this);
}

function DartTrap(game, theX, theY) {
    this.idle = new Animation(ASSET_MANAGER.getAsset("./img/darttrap.png"), 0, 0, 32, 32, 1, 1, true, false);
    Entity.call(this, game, theX, theY);
}

DartTrap.prototype = new Entity();
DartTrap.prototype.constructor = DartTrap;

DartTrap.prototype.update = function () {
    Entity.prototype.update.call(this);
}

DartTrap.prototype.draw = function(ctx) {
    this.idle.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    Entity.prototype.draw.call(this);
}

function Dart(game, theX, theY, minX) {
    this.game = game;
    this.fly = new Animation(ASSET_MANAGER.getAsset("./img/dart.png"), 0, 0, 27, 8, 1, 1, true, false);
    this.boundingbox = new BoundingBox(theX, theY, 27, 8);
    this.minX = minX;
    this.maxX = theX;
    Entity.call(this, game, theX, theY);
}

Dart.prototype = new Entity();
Dart.prototype.constructor = Dart;

Dart.prototype.update = function () {
    this.x = this.x - 200 * this.game.clockTick;
    if(this.x < this.minX) {
        this.x = this.maxX;
    }
    var mc = this.game.entities.Character;
    this.boundingbox = new BoundingBox(this.x, this.y, 27, 8);
    if (collided(this.boundingbox, mc.boundingbox)) {
        mc.damage(5, 0, 0);
    }
    Entity.prototype.update.call(this);
}

Dart.prototype.draw = function(ctx) {
    this.fly.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    Entity.prototype.draw.call(this);
}





//#region Falling Spike Trap
function FallingSpike(game, theX, theY) {
    this.game = game;
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/traps.png"), 13, 62, 30, 25, 0.3, 1, true, true);
    this.radius = 28;
    this.boundingbox = new BoundingBox(theX, theY, 30, 20);
    this.falling = false;
    Entity.call(this, game, theX, theY);
}
FallingSpike.prototype = new Entity();
FallingSpike.prototype.constructor = FallingSpike;
FallingSpike.prototype.collidePlat = function() {
    collide = false;
    for (var i = 0; i < this.game.platforms.length; i++) {
        collide = this.boundingbox.collide(this.game.platforms[i].boundingbox);
        if (collide) {
            return true;
        }
    }
    return collide;
}
FallingSpike.prototype.update = function() {
    this.boundingbox = new BoundingBox(this.x, this.y, 30, 20);
    var mc = this.game.entities.Character;
    if (this.falling) {
        this.y += 3;
    }
    else if (!this.collidePlat() && Math.abs(mc.x - this.x) <= 64 && Math.abs(mc.y - this.y) <= 224) {
        this.falling = true;
    }
    if (this.collidePlat() || this.y > 700) {
        this.removeFromWorld = true;
    }
    var mc = this.game.entities.Character;
    if (collided(mc.boundingbox, this.boundingbox)) {
        mc.damage(10, 0);
        // if (mc.back) {
        //     mc.x += 15;
        // } else {
        //     mc.x -= 15;
        // }
    }

    Entity.prototype.update.call(this);
}
FallingSpike.prototype.draw = function(ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    Entity.prototype.draw.call(this);
}
// #endregion

//#region Spike Trap
function Spike(game, theX, theY) {
    this.game = game;
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/spike30x24.png"), 0, 0, 30, 24, 0.3, 1, true, true);
    this.radius = 28;
    this.boundingbox = new BoundingBox(theX, theY, 28, 24);
    Entity.call(this, game, theX, theY);
}
Spike.prototype = new Entity();
Spike.prototype.constructor = Spike;
Spike.prototype.collidePlat = function() {
    collide = false;
    for (var i = 0; i < this.game.platforms.length; i++) {
        collide = this.boundingbox.collide(this.game.platforms[i].boundingbox);
        if (collide) {
            return true;
        }
    }
    return collide;
}
Spike.prototype.update = function() {
    this.boundingbox = new BoundingBox(this.x, this.y, 28, 24);
    if (!this.collidePlat()) {
        this.y += 2;
    }
    var mc = this.game.entities.Character;
    if (collided(mc.boundingbox, this.boundingbox)) {
        mc.damage(5, 0);
        // if (mc.back) {
        //     mc.x += 15;
        // } else {
        //     mc.x -= 15;
        // }
    }

    Entity.prototype.update.call(this);
}
Spike.prototype.draw = function(ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    Entity.prototype.draw.call(this);
}

//#region Turkey
function Turkey(game, x, y) {
    this.game = game;
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/turkey_32.png"), 0, 0, 32, 32, 0.3, 3, true, true);
    this.radius = 32;
    this.ground = y;
    this.boundingbox = new BoundingBox(this.x, this.y, 32, 32);
    Entity.call(this, game, x, y);
}

Turkey.prototype = new Entity();
Turkey.prototype.constructor = Turkey;
Turkey.prototype.collidePlat = function() {
    collide = false;
    for (var i = 0; i < this.game.platforms.length; i++) {
        collide = this.boundingbox.collide(this.game.platforms[i].boundingbox);
        if (collide) {
            return true;
        }
    }
    return collide;
}

// Check if collided with MC; return true if collided, false, otherwise
Turkey.prototype.collided = function() {
    var charact = this.game.entities.Character;
    return distance(this, charact) <= this.radius / 1.9 + charact.radius / 1.9;
}

Turkey.prototype.update = function() {
    this.boundingbox = new BoundingBox(this.x, this.y, 32, 36);
    if (!this.collidePlat()) {
        this.y += 2;
    }
    if (this.collided()) {
        this.removeFromWorld = true;
        if (this.game.entities.Character.hp + 30 >= this.game.entities.Character.maxHP) {
            this.game.entities.Character.hp = this.game.entities.Character.maxHP;
        } else {
            this.game.entities.Character.hp += 40;
        }
    }
    Entity.prototype.update.call(this);
}

Turkey.prototype.draw = function(ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    Entity.prototype.draw.call(this);
}
//#endregion

function Sword(game, x, y) {
    this.game = game;
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/sword40x39.png"), 0, 0, 40, 39, 1, 1, true, false);
    this.radius = 36;
    this.ground = y;
    Entity.call(this, game, x, y);
}
Sword.prototype = new Entity();
Sword.prototype.constructor = Sword;

// Check if collided with MC; return true if collided, false, otherwise
Sword.prototype.collided = function() {
    var charact = this.game.entities.Character;
    return distance(this, charact) <= this.radius / 1.9 + charact.radius / 1.9;
}

Sword.prototype.update = function() {
    if (this.collided()) {
        this.game.entities.Character.attackPower += 5;
        this.removeFromWorld = true;
    }
    Entity.prototype.update.call(this);
}

Sword.prototype.draw = function(ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    Entity.prototype.draw.call(this);
}

//#region Slime
function Slime(game, theX, theY, minX, maxX) {
    this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/slimeEnemy.png"), 0, 0, 64, 64, 0.15, 5, false, true);
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/slimeEnemy.png"), 0, 64, 64, 64, 0.3, 3, true, true);
    this.walkRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/slimeEnemy.png"), 192, 64, 64, 64, 0.3, 3, true, true);
    this.deathAnimation = new Animation(ASSET_MANAGER.getAsset("./img/slimeEnemy.png"), 64, 128, 64, 64, 0.35, 3, false, false);
    this.jumping = false;
    this.speed = 100;
    this.radius = 40;
    this.width = 40;
    this.height = 40;
    this.ground = theY;
    this.walkLeft = true;
    this.walkRight = false;
    this.jumpTime = 0;
    this.game = game;
    this.hp = 15;
    this.maxX = maxX;
    this.minX = minX;
    this.damagedTimer = 0;
    this.boundingbox = new BoundingBox(theX + 16, theY + 16, 32, 32);
    this.knockedBackTicks = 0;
    this.knockback = 0;
    Entity.call(this, game, theX, theY);
    // Entity.call(this, game, 2800, 700);
}

Slime.prototype = new Entity();
Slime.prototype.constructor = Slime;

Slime.prototype.update = function() {
    this.boundingbox = new BoundingBox(this.x + 16, this.y + 16, 32, 32);
    var mc = this.game.entities.Character;
    if (this.hp <= 0 && this.deathAnimation.isDone()) {
        this.removeFromWorld = true;
    }

    if(this.y > this.ground ) {
        this.hp = -1;
    }

    if (collided(mc.boundingbox, this.boundingbox) && this.hp > 0) {
        if (mc.x > this.x) {
            mc.damage(10, 1);
        } else {
            mc.damage(10, -1);
        }
    }
    if (mc.attack) {
        if ((collided(mc.hitBoxBack, this.boundingbox) && mc.back) || (collided(mc.hitBoxFront, this.boundingbox) && !mc.back)) {
            if(this.damagedTimer <= 0) {
                this.hp -= mc.attackPower;
                if(mc.x > this.x) {
                    this.knockedBackTicks = .3
                    this.knockback = -3;
                }
                else {
                    this.knockedBackTicks = .3
                    this.knockback = 3;
                }
                this.damagedTimer = mc.attackForwardAnim.totalTime;
            }
            else {
                this.damagedTimer -= this.game.clockTick;
            }
        }
    }

    if(this.knockedBackTicks <= 0) {
        if(this.jumpTime >= 100) {
            this.jumping = true;
        }
        if(mc.x < this.x && this.x > this.minX && Math.abs(this.x - mc.x) <= 100) {
            this.walkLeft = true;
            this.walkRight = false;
        }
        if(mc.x > this.x && this.x < this.maxX && Math.abs(this.x - mc.x) <= 100) {
            this.walkRight = true;
            this.walkLeft = false;
        }
        if(mc.x < this.x && this.x > this.leftBoundX) {
            this.walkLeft = true;
            this.walkRight = false;
        }
        else if(mc.x > this.x && this.x < this.rightBoundX ) {
            this.walkLeft = false;
            this.walkRight = true;
        }
        if(this.jumping && this.hp > 0) {
            if(this.jumpAnimation.isDone()) {
                this.jumpAnimation.elapsedTime = 0;
                this.jumping = false;
            }
            var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
            var totalHeight = 50;
            if (jumpDistance > 0.5) {
                jumpDistance = 1 - jumpDistance;
            }
            var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));
            this.y = this.ground - height;
            this.jumpTime = 0;
            if(this.walkLeft) {
                this.x -= this.game.clockTick * this.speed;
                if(this.x <= this.minX) {
                    this.walkLeft = false;
                    this.walkRight = true;
                }
            }
            else {
                this.x += this.game.clockTick * this.speed;
                if(this.x >= this.maxX) {
                }
             }
        }
        else if(this.hp > 0) {
            if(this.walkLeft) {
                this.x -= this.game.clockTick * this.speed;
                if(this.x <= this.minX) {
                    this.walkLeft = false;
                    this.walkRight = true;
                }
            }
            else if(this.walkRight && this.hp > 0) {
                this.x += this.game.clockTick * this.speed;
                if(this.x >= this.maxX) {
                    this.walkRight = false;
                    this.walkLeft = true;
                }
            }
        }
        this.jumpTime++;
    }
    else {
        this.x = this.x + this.knockback;
        knockedBack(this);
        this.knockedBackTicks = this.knockedBackTicks - this.game.clockTick;

    }

    Entity.prototype.update.call(this);

}

Slime.prototype.draw = function (ctx) {
    if(this.hp <= 0) {
        this.deathAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else {
        if (this.jumping) {
            this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
        }
        else {
            if(this.walkLeft) {
                this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
            }
            else {
                this.walkRightAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
            }
        }
    }
    Entity.prototype.draw.call(this);
}
//#endregion

//#region Bat
function Bat(game, spawnX, spawnY, leftBound, rightBound, amplitude) {
    this.flyRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/bat.png"), 32, 32, 32, 32, 0.05, 3, true, true);
    this.flyLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/bat.png"), 32, 96, 32, 32, 0.05, 3, true, true);
    this.amplitude = amplitude;
    this.speed = 225;
    this.flyRight = true;
    this.radius = 32;
    this.hp = 5;
    this.width = 32;
    this.height = 32;
    this.leftBound = leftBound;
    this.rightBound = rightBound;
    this.spawnY = spawnY;
    this.boundingbox = new BoundingBox(spawnX + 8, spawnY, this.width - 4, this.height);
    Entity.call(this, game, spawnX, spawnY);
}

Bat.prototype = new Entity();
Bat.prototype.constructor = Bat;

Bat.prototype.update = function () {
    this.boundingbox = new BoundingBox(this.x + 8, this.y, this.width - 4, this.height);
    var mc = this.game.entities.Character;
    if (this.hp <= 0) {
        this.removeFromWorld = true;
    }

    var mc = this.game.entities.Character;
    if (collided(mc.boundingbox, this.boundingbox) && this.hp > 0) {

        if (mc.x > this.x) {
            mc.damage(10, 2);
        } else {
            mc.damage(10, -2);
        }
    }
    if (mc.attack) {
        if ((collided(mc.hitBoxBack, this.boundingbox) && mc.back) || (collided(mc.hitBoxFront, this.boundingbox) && !mc.back)) {
            this.hp -= mc.attackPower;
        }
    }

    if(!this.flyRight) {
        if(this.x > this.leftBound) {
            this.x -= this.game.clockTick * this.speed;
        }
        else {
            this.flyRight = true;
        }
    }
    else {
        if(this.x < this.rightBound) {
            this.x += this.game.clockTick * this.speed;
        }
        else {
            this.flyRight = false;
        }
    }
    this.y = this.spawnY - Math.sin(this.x / 25) * this.amplitude;
    this.boundingbox = new BoundingBox(this.x + 8, this.y, this.width - 4, this.height);
    Entity.prototype.update.call(this);
}

Bat.prototype.draw = function(ctx) {
    if(!this.flyRight) {
        this.flyLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, 1.5);
    }
    else {
        this.flyRightAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, 1.5);
    }
    Entity.prototype.draw.call(this);
}
//#endregion

//#region Skeleton
function Skeleton(game, spawnX, spawnY, minX, maxX) {
    this.walkLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/skeleton.png"), 0, 0, 64, 64, 0.25, 4, true, true);
    this.walkRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/skeleton.png"), 0, 64, 64, 64, 0.25, 4, true, true);
    this.attackLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/skeleton.png"), 64, 192, 64, 64, 0.15, 3, false, true);
    this.attackRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/skeleton.png"), 0, 256, 64, 64, 0.15, 3, false, true);
    this.deathAnimation = new Animation(ASSET_MANAGER.getAsset("./img/skeleton.png"), 0, 128, 64, 64, 0.15, 5, false, false );
    this.startAnimation = new Animation(ASSET_MANAGER.getAsset("./img/skeleton.png"), 0, 128, 64, 64, 0.3, 5, false, true );
    this.idleAnimation = new Animation(ASSET_MANAGER.getAsset("./img/skeleton.png"), 0, 192, 64, 64, 0.3, 1, true, true);
    this.attacking = false;
    this.attackTime = 0;
    this.attackLeft = false;
    this.attackRight = true;
    this.walkLeft = false;
    this.walkRight = true;
    this.speed = 80;
    this.radius = 55;
    this.width = 64;
    this.height = 64;
    this.ground = spawnY;
    this.hp = 25;
    this.inRange = false;
    this.idle = true;
    this.startX = spawnX;
    this.damagedTimer = 0;
    this.minX = minX;
    this.maxX = maxX;
    this.knockback = 0;
    this.knockedBackTicks = 0;
    this.boundingbox = new BoundingBox(spawnX + 25, spawnY + 24, 26, 56);
    Entity.call(this, game, spawnX, spawnY);
}
Skeleton.prototype = new Entity();
Skeleton.prototype.constructor = Skeleton;

Skeleton.prototype.update = function() {
    this.boundingbox = new BoundingBox(this.x + 25, this.y + 24, 26, 56);

    var mc = this.game.entities.Character;
    if (this.hp <= 0 && this.deathAnimation.isDone()) {
        this.removeFromWorld = true;
    }
    if (collided(mc.boundingbox, this.boundingbox) && this.hp > 0) {
        if (mc.x > this.x) {
            mc.damage(5, 1);
        } else {
            mc.damage(5,-1);
        }
    }
    //MC is in range
    if(Math.abs(this.x - mc.x) <= 300 && Math.abs(this.y - mc.y) <= 100) {
        this.inRange = true;
    }
    else {
        this.inRange = false;
    }
    if (mc.attack) {
        if ((collided(mc.hitBoxBack, this.boundingbox) && mc.back) || (collided(mc.hitBoxFront, this.boundingbox) && !mc.back)) {
            if(this.damagedTimer <= 0) {
                this.hp -= mc.attackPower;
                if(mc.x > this.x) {
                    this.knockedBackTicks = .15;
                    this.knockback = -5;
                }
                else {
                    this.knockedBackTicks = .15
                    this.knockback = 5;
                }
                this.damagedTimer = mc.attackForwardAnim.totalTime;
            }
            else {
                this.damagedTimer -= this.game.clockTick;
            }
        }
    }
    if(this.knockedBackTicks <= 0) {
        if (this.attackTime >= 100  && this.inRange) {
            this.attacking = true;
        }
        if(this.attacking) {
            var direction = true;
            if(mc.x <= this.x) {
                direction = false;
                this.attackLeft = true;
                this.attackRight = false;
            }
            else {
                direction = true;
                this.attackRight = true;
                this.attackLeft = false;
            }
            if(this.attackLeftAnimation.isDone() || this.attackRightAnimation.isDone()) {
               // range = Math.sqrt(Math.abs(this.x - mc.x)) / 100;
               range = 0;
                let bone = new SkeletonBone(this.game, this.x, this.y, direction, 1 + range);
                this.game.addEntity(bone);
                this.attackLeftAnimation.elapsedTime = 0;
                this.attackRightAnimation.elapsedTime = 0;
                this.attacking = false;
                this.attackTime = 0;
            }
        }
        else if(this.hp > 0) {
            if(this.walkLeft) {
                this.x -= this.game.clockTick * this.speed;
                if(this.x <= this.minX) {
                    this.walkLeft = false;
                    this.walkRight = true;
                }
            }
            else {
                this.x += this.game.clockTick * this.speed;
                if(this.x >= this.maxX) {
                    this.walkRight = false;
                    this.walkLeft = true;
                }
            }
        }
        this.attackTime++;
    }
    else {
        this.x = this.x + this.knockback
        this.knockedBackTicks = this.knockedBackTicks - this.game.clockTick;
        knockedBack(this);
    }
    
    this.boundingbox = new BoundingBox(this.x + 25, this.y + 24, 26, 56);
    Entity.prototype.update.call(this);

}

Skeleton.prototype.draw = function(ctx) {

    if(this.hp <= 0) {
        this.deathAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, 1.3);
    }
    else {
        if(this.attacking) {
            if(this.attackLeft) {
                this.attackLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, 1.3);
            }
            else {
                this.attackRightAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, 1.3);
            }
        }
        else {
            if(this.walkLeft) {
                this.walkLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, 1.3);
            }
            else {
                this.walkRightAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, 1.3);
            }
        }
    }

    Entity.prototype.draw.call(this);

}

function SkeletonBone(game, skeletonX, skeletonY, direction, range) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/skeleton.png"), 192, 256, 64, 64, 0.3, 3, true, true);
    this.speed = 300;
    this.ground = skeletonY + 100;
    this.radius = 16;
    this.width = 64;
    this.height = 64;
    this.direction = direction;
    this.range = range;
    this.x0 = skeletonX;
    this.y0 = skeletonY;
    this.boundingbox = new BoundingBox(skeletonX + 33, skeletonY + 30, 16, 16);
    Entity.call(this, game, skeletonX, skeletonY);
}

SkeletonBone.prototype = new Entity();
SkeletonBone.prototype.constructor = SkeletonBone;

SkeletonBone.prototype.update = function() {

    this.boundingbox = new BoundingBox(this.x + 33, this.y + 30, 16, 16);
    var mc = this.game.entities.Character;

    if (collided(mc.boundingbox, this.boundingbox)) {
        if (mc.x > this.x) {
            mc.damage(12, 2);
        } else {
            mc.damage(12, -2);
        }
        this.removeFromWorld = true;
    }

    // if(this.y >= 800) {
    //     this.removeFromWorld = true;
    // }
    if(this.x > this.x0 + 300 || this.x < this.x0 - 300) {
        this.removeFromWorld = true;
    }

    // let deltaX = this.animation.elapsedTime / this.animation.totalTime;
    // let totalHeight = this.y + 10;

    // let deltaY = totalHeight * (-4 * (deltaX * deltaX - deltaX));
    // this.y = this.ground - deltaY;
    if(this.direction) {
        this.x += this.game.clockTick * this.speed * this.range;
    }
    else {
        this.x -= this.game.clockTick * this.speed * this.range;
    }
    // this.x = 10 * Math.cos(Math.PI / 2) * this.game.clockTick;
    // this.y = 10 * Math.sin(Math.PI / 2) * this.game.clockTick - 0.5 * 4 * Math.exp(this.game.clockTick, 2);
    this.boundingbox = new BoundingBox(this.x + 33, this.y + 30, 16, 16);
    Entity.prototype.update.call(this);
}

SkeletonBone.prototype.draw = function(ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, 1.3);

}
//#endregion

//#region Chest
function Chest(game, theX, theY) {
    this.game = game;
    this.openingAnimation = new Animation(ASSET_MANAGER.getAsset("./img/chest.png"), 0, 0, 64, 64, 0.1, 6, false, false);
    this.closedAnimation = new Animation(ASSET_MANAGER.getAsset("./img/chest.png"), 0, 0, 64, 64, 1, 1, true, false);
    this.openedAnimation = new Animation(ASSET_MANAGER.getAsset("./img/chest.png"), 320, 0, 64, 64, 1, 1, true, false);
    this.ground = 613;
    this.radius = 42;
    this.open = false;
    this.opening = false;
    this.openTime = 0;
    this.boundingbox = new BoundingBox(theX, theY, 42, 64);
    Entity.call(this, game, theX, theY);
}

Chest.prototype = new Entity();
Chest.prototype.constructor = Chest;
Chest.prototype.collidePlat = function() {
    collide = false;
    for (var i = 0; i < this.game.platforms.length; i++) {
        collide = this.boundingbox.collide(this.game.platforms[i].boundingbox);
        if (collide) {
            return true;
        }
    }
    return collide;
}

Chest.prototype.update = function() {
    this.boundingbox = new BoundingBox(this.x, this.y, 42, 42);

    if (!this.collidePlat()) {
        this.y += 1;
    }

    let mc = this.game.entities.Character;
    if(this.game.e && Math.abs(mc.x - this.x) <= 50 && Math.abs(mc.y - this.y) <= 60) {
        this.opening = true;
    }
    if(this.opening && this.openingAnimation.isDone()) {
        this.opening = false;
        this.open = true;
    }
    if(this.open) {
        this.openTime++;
        if(this.openTime >= 80) {
            sword = new Sword(this.game, this.x, this.y);
            this.game.addEntity(sword);
            this.removeFromWorld = true;
        }
    }
    Entity.prototype.update.call(this)
}

Chest.prototype.draw = function(ctx) {
    if(this.opening && !this.open) {
        this.openingAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else if(this.open && this.open) {
        this.openedAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - 6 - this.game.camera.y);
    }
    else {
        this.closedAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
}
//#endregion

function BossWolf(game, theX, theY) {
    this.game = game;
    this.attack = false;
    this.walkBack = new Animation(ASSET_MANAGER.getAsset("./img/blackwolf.png"), 0, 420, 110, 75, .1, 9, true, false);
    this.walk = new Animation(ASSET_MANAGER.getAsset("./img/blackwolf.png"), 0, 960, 110, 75, .1, 9, true, false);
    this.attackF = new Animation(ASSET_MANAGER.getAsset("./img/blackwolf.png"), 0, 780, 110, 75, .1, 9, false, false);
    this.attackBack = new Animation(ASSET_MANAGER.getAsset("./img/blackwolf.png"), 0, 450, 110, 75, .1, 9, true, false);
    this.howl = new Animation(ASSET_MANAGER.getAsset("./img/blackwolf.png"), 0, 600, 110, 75, .4, 6, false, false);
    this.idle = new Animation(ASSET_MANAGER.getAsset("./img/blackwolf.png"), 0, 600, 110, 75, .1, 6, true, false);
    this.hp = 75;
    this.howling = true;
    this.timeSinceDamage = 0;
    this.boundingbox = new BoundingBox(theX + 15, theY + 33, 81, 42);
    Entity.call(this, game, theX, theY);
}

BossWolf.prototype = new Entity();
BossWolf.prototype.constructor = BossWolf;

BossWolf.prototype.update = function () {
    this.timeSinceDamage += this.game.clockTick;
    this.boundingbox = new BoundingBox(this.x + 15, this.y + 33, 81, 42);
    if(this.howling) {
        if(this.howl.elapsedTime + this.game.clockTick > this.howl.totalTime) {
            this.howling = false;
            this.game.enemies.push(new AttackWolf(this.game, 7500, 450));
            this.game.enemies.push(new AttackWolf(this.game, 7800, 450));
        }
    }
    var mc = this.game.entities.Character;
    if(mc.x > 7600 && mc.y < 390) {
        this.attack = true;
    }
    if (collided(mc.boundingbox, this.boundingbox)) {
        if (mc.x > this.x) {
            mc.damage(20, 2);
        } else {
            mc.damage(20, -2);
        }
    }
    if (mc.attack) {
        if ((collided(mc.hitBoxBack, this.boundingbox) && mc.back) || (collided(mc.hitBoxFront, this.boundingbox) && !mc.back)) {
            if(this.timeSinceDamage > 1) {
                this.hp -= mc.attackPower;
                this.timeSinceDamage = 0;
            }
        }
    }
    if (this.hp <= 0) {
        this.removeFromWorld = true;
    }
    Entity.prototype.update.call(this);
}

BossWolf.prototype.draw = function (ctx) {
    if(this.howling) {
        this.howl.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else if(this.attack) {
        this.attackBack.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else {
        this.idle.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    Entity.prototype.draw.call(this);
}


function AttackWolf(game, theX, theY) {
    this.timeSinceDamage = 0;
    this.walkBack = new Animation(ASSET_MANAGER.getAsset("./img/redwolf.png"), 0, 420, 88, 60, .1, 9, true, false);
    this.walk = new Animation(ASSET_MANAGER.getAsset("./img/redwolf.png"), 0, 960, 88, 60, .1, 9, true, false);
    this.attackF = new Animation(ASSET_MANAGER.getAsset("./img/redwolf.png"), 0, 780, 88, 60, .1, 9, false, false);
    this.attackBack = new Animation(ASSET_MANAGER.getAsset("./img/redwolf.png"), 0, 240, 88, 60, .1, 9, false, false);
    this.attack = false;
    this.back = false;
    this.width = 88;
    this.height = 60;
    this.hp = 30;
    this.boundingbox = new BoundingBox(theX + 15, theY + 29, 75, 31);
    Entity.call(this, game, theX, theY);
}

AttackWolf.prototype = new Entity();
AttackWolf.prototype.constructor = AttackWolf;
AttackWolf.prototype.collidePlat = function() {
    collide = false;
    for (var i = 0; i < this.game.platforms.length; i++) {
        collide = this.boundingbox.collide(this.game.platforms[i].boundingbox);
        if (collide) {
            return true;
        }
    }
    return collide;
}

AttackWolf.prototype.update = function () {
    this.timeSinceDamage += this.game.clockTick;
    this.boundingbox = new BoundingBox(this.x + 15, this.y + 29, 75, 31);
    if (!this.collidePlat()) {
        this.y += 5;
    }
    var mc = this.game.entities.Character;
    if (collided(mc.boundingbox, this.boundingbox)) {
        if (mc.x > this.x) {
            mc.damage(8, 1);
        } else {
            mc.damage(8, -1);
        }
    }
    if (mc.attack) {
        if ((collided(mc.hitBoxBack, this.boundingbox) && mc.back) || (collided(mc.hitBoxFront, this.boundingbox) && !mc.back)) {
            if(this.timeSinceDamage > 1) {
                this.hp -= mc.attackPower;
                this.timeSinceDamage = 0;
                if(mc.x > this.x) {
                    this.x = this.x - 20;
                    knockedBack(this);
                }
                else {
                    this.x = this.x + 20;
                    knockedBack(this);
                }
            }
        }
    
    }
    if (this.hp <= 0) {
        this.removeFromWorld = true;
    }

    if(this.game.entities.Character) {
        if(this.game.entities.Character.x - this.x > -32 && this.game.entities.Character.x - this.x < 0) {
            this.attack = true;
        }
        else {
            if(this.game.entities.Character.x - this.x > 38 && this.game.entities.Character.x - this.x < 70) {
                this.attack = true;
            }
            else {
                this.attack = false;
            }
        }
        
        if(this.game.entities.Character.x - this.x > 40) {
            this.back = false;
        }
        else {
            this.back = true;
        }
    
    }
    
    // if dead, remove from world
    if (this.hp <= 0) {
        this.removeFromWorld = true;
    }

    if(this.attackF.isDone()) {
        this.back = false;
        this.attackF.elapsedTime = 0;
        this.attackBack.elapsedTime = 0;
        this.attack = false;
    }
    else if(this.attackBack.isDone()) {
        this.back = true;
        this.attackF.elapsedTime = 0;
        this.attackBack.elapsedTime = 0;
        this.attack = false;
    }

    if(this.back) {
            this.x = this.x - this.game.clockTick * 80
        }
    else {
            this.x = this.x + this.game.clockTick * 80
     }
    Entity.prototype.update.call(this);
}

AttackWolf.prototype.draw = function (ctx) {
    if(this.attack && !this.back) {
        this.attackF.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else if(this.attack && this.back) {
        this.attackBack.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else if(this.back) {
        this.walkBack.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else {
        this.walk.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    Entity.prototype.draw.call(this);
}


function Lever(game, theX, theY) {
    this.game = game;
    this.openingAnimation = new Animation(ASSET_MANAGER.getAsset("./img/lever38x32.png"), 0, 0, 38, 32, 0.1, 2, false, false);
    this.closedAnimation = new Animation(ASSET_MANAGER.getAsset("./img/lever38x32.png"), 0, 0, 38, 32, 1, 1, true, false);
    this.openedAnimation = new Animation(ASSET_MANAGER.getAsset("./img/lever38x32.png"), 38, 0, 38, 32, 1, 1, true, false);
    // this.ground = 613;
    // this.radius = 42;
    this.open = false;
    this.opening = false;
    this.openTime = 0;
    this.boundingbox = new BoundingBox(theX, theY, 38, 32);
    Entity.call(this, game, theX, theY);
}

Lever.prototype = new Entity();
Lever.prototype.constructor = Chest;
Lever.prototype.collidePlat = function() {
    collide = false;
    for (var i = 0; i < this.game.platforms.length; i++) {
        collide = this.boundingbox.collide(this.game.platforms[i].boundingbox);
        if (collide) {
            return true;
        }
    }
    return collide;
}
Lever.prototype.update = function() {
    this.boundingbox = new BoundingBox(this.x, this.y, 38, 32);

    if (!this.collidePlat()) {
        this.y += 1;
    }

    let mcXPosition = this.game.entities.Character.x;
    if(Math.abs(mcXPosition - this.x) <= 60 && this.game.e) {
        this.opening = true;
    }
    if(this.opening && this.openingAnimation.isDone()) {
        this.opening = false;
        this.open = true;
        this.game.openNext = true;
    }
    Entity.prototype.update.call(this)
}

Lever.prototype.draw = function(ctx) {
    if(this.opening && !this.open) {
        this.openingAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else if(this.open && this.open) {
        this.openedAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
    else {
        this.closedAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
}

// Begin mini Boss
function MiniBoss(game, spawnX, spawnY) {
    this.attackSlashRev = new Animation(ASSET_MANAGER.getAsset("./img/miniBossAttackSlashRev.png"), 0, 0, 4480 / 8, 408, .2, 7, false, false);
    this.attackSlash = new Animation(ASSET_MANAGER.getAsset("./img/miniBossAttackSlash.png"), 0, 0, 4480 / 8, 408, .2, 7, false, false);
    this.idle = new Animation(ASSET_MANAGER.getAsset("./img/miniBossIdle.png"), 0, 0, 729 / 3, 234, .1, 3, true, false);
    this.idleRev = new Animation(ASSET_MANAGER.getAsset("./img/miniBossIdleRev.png"), 0, 0, 729 / 3, 234, .5, 3, true, false);
    this.hitRev = new Animation(ASSET_MANAGER.getAsset("./img/miniBossHitRev.png"), 0, 0, 222, 280, .5, 1, false, false);
    this.hit = new Animation(ASSET_MANAGER.getAsset("./img/miniBossHit.png"), 0, 0, 222, 280, .5, 1, false, false);
    this.fightingAniRev = new Animation(ASSET_MANAGER.getAsset("./img/miniBossFightingRev.png"), 0, 0, 220, 206, .5, 2, true, false);
    this.fightingAni = new Animation(ASSET_MANAGER.getAsset("./img/miniBossFighting.png"), 0, 0, 220, 206, .5, 2, true, false);
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
    this.hp = 250;
    this.timeSinceDamage = 0;
    this.boundingbox = new BoundingBox(spawnX + 40, spawnY + 30, this.width - 80, this.height - 110);
    Entity.call(this, game, spawnX, spawnY);
    //Entity.call(this, game, theX, 600);
}

MiniBoss.prototype = new Entity();
MiniBoss.prototype.constructor = MiniBoss;

MiniBoss.prototype.update = function () {
    this.timeSinceDamage += this.game.clockTick;
   

    var mc = this.game.entities.Character;


    if (collided(mc.boundingbox, this.boundingbox)) {
        if (this.attack && this.attackTime === 0) {
            if(mc.x > this.x) {
                mc.damage(14, 2);
            }
            else {
                mc.damage(14, -2);
            }
        }
        if (mc.attack) {
            if(this.attackTime < 0) {
                this.attackTime = 10;
                this.attack = true;
            } else {
                this.attackTime -= 1;
            }
        } 
    }
    if((collided(mc.hitBoxBack, this.boundingbox) && mc.back) || (collided(mc.hitBoxFront, this.boundingbox) && !mc.back)) {
        if (mc.attack && this.timeSinceDamage > 1) {
            this.hp -= mc.attackPower;
            this.timeSinceDamage = 0;
            if(mc.x < this.x) {
                this.x += 5;
                knockedBack(this);
            }
            else {
                this.x -= 5;
                knockedBack(this);
            }
            if(this.attackTime < 0) {
                this.attackTime = 10;
                this.attack = true;
            } else {
                this.attackTime -= 1;
            }
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
        if (this.back) {
            this.x = this.x - this.game.clockTick * 100;
        } else {
            this.x = this.x + this.game.clockTick * 100;
        }
    }
    this.boundingbox = new BoundingBox(this.x + 40, this.y + 30, this.width - 80, this.height - 110);
    // if(this.game.entities.Character) {
    //     if(this.game.entities.Character.x - this.x > -32 && this.game.entities.Character.x - this.x < 0) {
    //         this.found = true;
    //     }
    //     else {
    //         if(this.game.entities.Character.x - this.x > 38 && this.game.entities.Character.x - this.x < 70) {
    //             this.found = true;
    //         }
    //         else {
    //         }
    //     }
        
    //     if(this.game.entities.Character.x - this.x > 40) {
    //         this.back = false;
    //     }
    //     else {
    //         this.back = true;
    //     }
    
    // }


    if(this.hitRev.isDone()) {
        this.hitRev.elapsedTime = 0;
        this.attack = true;
    }

    if(this.hit.isDone()) {
        this.hitRev.elapsedTime = 0;
        this.attack = true;
    }

    if(this.attackSlashRev.elapsedTime + this.game.clockTick > this.attackSlashRev.totalTime  ) {
        
        this.attackSlashRev.elapsedTime = 0;
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
        this.game.cosmeticEntities.push(new GameWonScreen(this.game));
    }
//     if(this.found) {
//     if(this.back) {
//         this.x = this.x - this.game.clockTick * 100
//     }
// else {
//         this.x = this.x + this.game.clockTick * 100
//  }
// }
    Entity.prototype.update.call(this);
}

MiniBoss.prototype.draw = function (ctx) {

    if(this.gotHit  && this.back) {
        this.hitRev.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x + 50, this.y - this.game.camera.y - 50);
        
    } else if (this.attack === true  && this.back) {
        this.attackSlashRev.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x - 115, this.y - this.game.camera.y - 100);

        

    } else if ( this.stillFighting && this.back ) {
        this.fightingAniRev.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x + 30, this.y - this.game.camera.y + 25);
    
    }else if(this.gotHit  && this.back === false) {
        this.hit.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x + 50, this.y - this.game.camera.y - 50);
            //this.gotHit = false;
            
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



function MapLevel(game) {
    this.game = game;
    Entity.call(this, game, 0, 0);
    this.map = new Array(250);

    for (var i = 0; i < 250; i++) {
        this.map[i] = new Array();
    }
    this.sprites = new Array(7);
    
    var testMap = 
    [[3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3],
    [3,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,1,0,0,0,1,1,1,1,0,0,0,5,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,5,0,0,0,0,0,0,0,6,2,2,2,2,2,7,7,7,7,7,7,5,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,2,2,2,2,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,2,2,2,2,2,2,2,2,2,2,2,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,4,4,4,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,5,0,0,1,1,1,1,1,1,1,1,1,5,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,6,0,0,5,0,0,0,5,2,2,5,0,0,5,2,2,2,2,6,0,0,0,0,5,2,2,2,5,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,3,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,6,2,2,3,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,6,2,2,2,2,2,2,5,0,0,0,0,0,0,5,5,5,2,2,2,2,4,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,3,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,6,2,3,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,3,3,4,4,4,4,4,4,4,4,4,3,0,0,0,0,5,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,5,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,0,0,3,0,0,1,1,1,3,3,0,0,0,0,0,0,0,0,0,0,0,6,3,0,1,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,5,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,3,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,3,0,0,0,0,0,3,3,0,0,0,0,0,1,1,1,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [4,5,0,0,5,5,5,2,2,2,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,2,2,2,2,2,2,2,4,4,4,4,4,4,4,4,4,4,3,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,3,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [4,3,0,0,3,5,4,3,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,2,2,2,2,2,2,2,2,2,2,2,2,4,4,4,4,3,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,3,1,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,1,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [4,3,0,0,3,5,4,3,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,3,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,1,3,0,0,0,0,0,3,3,0,0,0,5,0,0,0,0,0,0,1,1,3,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [4,3,1,1,3,2,2,2,2,2,2,2,2,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,3,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,3,0,0,0,0,0,3,3,0,0,0,3,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [4,3,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,5,1,1,1,0,0,0,3,4,4,4,4,3,1,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,3,0,0,0,0,1,3,3,0,0,0,3,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,5,2,2,2,5,1,1,1,1,5,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3],
    [4,3,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,3,0,0,0,0,0,0,3,4,4,4,4,3,0,0,0,6,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,0,0,0,0,0,3,0,1,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,3,0,0,0,3,0,0,0,0,0,3,3,0,0,0,3,1,1,0,0,0,0,0,0,3,0,0,1,0,0,0,0,0,0,0,0,3,3,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [2,2,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,3,0,0,0,0,0,0,3,4,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,3,1,0,0,3,1,0,0,0,0,6,2,2,2,2,6,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,3,0,0,0,0,1,1,3,4,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,2,2,2,2,2,2,2,2,3,4,4,4,4,3,0,0,0,0,0,0,3,4,4,4,4,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,5,0,0,0,0,0,1,1,3,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,0,0,0,0,0,0,0,0,0,0,6,2,1,1,1,1,2,6,0,0,0,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,3,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,0,0,0,0,0,0,0,3,0,0,1,0,0,0,0,0,0,0,3,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,6,2,2,2,2,2,6,0,0,0,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [3,2,2,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,3,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,3,1,1,0,0,0,0,3,4,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,6,1,1,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,0,0,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,6,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3],
    [4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,2,2,2,2,2,2,2,2,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,2,2,2,2,6,7,7,7,7,7,7,6,2,2,2,2,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3,2,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,3,2,2,5,0,0,0,0,0,0,0,6,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,6,7,7,2,2,2,2,2,2,2,2,2,2,2,2,3],
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,2,2,2,2,2,2,2,2,2,2,2,2,5,7,7,7,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,3,4,4,4,4,4,4,4,4,4,4,4,4,3,0,0,0,3,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,0,0,0,3,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,4,4,4,3,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,2,2,2,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,1,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,2,2,2,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,3,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,3,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,5,2,2,1,1,1,1,1,1,1,1,2,2,2,0,0,0,5,2,2,0,0,0,0,3,4,4,3,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,2,2,2,3,7,7,7,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [3,0,0,0,0,0,0,0,0,0,0,0,5,3,4,3,0,0,0,0,0,0,0,0,3,4,3,0,0,0,3,4,3,0,0,0,0,3,4,4,3,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [3,0,0,0,0,0,0,0,0,0,0,5,3,4,4,3,0,0,0,0,0,0,0,0,4,4,3,0,0,0,3,4,3,0,0,0,0,3,4,4,3,0,0,0,0,5,2,2,2,2,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,4,4,4,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [3,2,2,2,2,2,2,2,2,2,2,3,4,4,4,3,0,0,0,0,0,0,0,0,4,4,3,0,0,0,3,4,3,0,0,0,0,3,4,4,3,0,0,0,0,3,4,4,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,2,2,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4]];

    
    this.map = testMap;

    this.sprites[0] = null;
    this.sprites[1] = 1;
    this.sprites[2] = 2;
    this.sprites[3] = 3;
    this.sprites[4] = 4;
    this.sprites[5] = 5;
    this.sprites[6] = 6;
    this.sprites[7] = 7;

    for (var i = 0; i < 250; i++) {
        for (var j = 0; j < 35; j++) {
            // check if sprite is null, if not, draw it
            var sprite = this.sprites[this.map[j][i]];
            if (sprite) {
                if(sprite == 1) {
                    // this.game.platforms.push(new Platform(this.game, i * 32, j * 32 - 640));
                    this.game.platforms.push(new Platform(this.game, i * 32, j * 32 - 416));
                }
                else if(sprite == 2) {
                    this.game.platforms.push(new WallPlatform(this.game, i * 32, j * 32 - 416, true, true));
               }
                else if(sprite == 3) {
                    this.game.platforms.push(new Wall(this.game, i * 32, j * 32 - 416));
                }
                else if(sprite == 4) {
                    this.game.cosmeticEntities.push(new WallPlatform(this.game, i * 32, j * 32 - 416));
               //     Makes it so the character doesnt have to check if they are colliding.
                }
                else if(sprite == 5) {
                    this.game.platforms.push(new WallPlatform(this.game, i * 32, j * 32 - 416, false, true));
                }
                else if(sprite == 6) {
                    this.game.platforms.push(new WallPlatform(this.game, i * 32, j * 32 - 416, true, false));
                }
                else if (sprite == 7) {
                    this.game.platforms.push(new WallPlatform(this.game, i * 32, j * 32 - 416, true, true, true));
                }
            }
        }
    }
}

MapLevel.prototype = new Entity();
MapLevel.prototype.constructor = MapLevel;

MapLevel.prototype.update = function() {
    Entity.prototype.update.call(this);
}

MapLevel.prototype.draw = function (ctx) {
}
