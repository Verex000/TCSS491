/**
 * Map level manager.
 * Default starting level is 1.
 */
function MapLevel(game) {
    this.game = game;
    this.map = new Array(250);

    for (var i = 0; i < 250; i++) {
        this.map[i] = new Array();
    }
    this.sprites = new Array(12);
    var A = 10;
    var B = 11;
    
    // starting map 1 (DEFAULT)
    this.currentLevel = 1;
    this.map = level_1_map;
    this.currentBoss = null;
    this.defeatedBoss = false;

    if(this.game.onWhichDifficulty  == 2) {
        damageMult = 2;
        hpMult = 1.5;
    }
    else if(this.game.onWhichDifficulty == 3) {
        damageMult = 4;
        hpMult = 3;
    }
    else if(this.game.onWhichDifficulty == 4) {
        damageMult = 0;
    }
    // map 1 storyline
    this.game.cosmeticEntities.push(new Story1_1(this.game));
    this.game.cosmeticEntities.push(new Story1_2(this.game));

    createLevel_1(game, this);
    
    this.sprites[0] = null;
    this.sprites[1] = 1;
    this.sprites[2] = 2;
    this.sprites[3] = 3;
    this.sprites[4] = 4;
    this.sprites[5] = 5;
    this.sprites[6] = 6;
    this.sprites[7] = 7;
    this.sprites[8] = 8;
    this.sprites[9] = 9;
    this.sprites[A] = 10;
    this.sprites[B] = 11;

    this.createLevel();
    
    Entity.call(this, game, 0, 0);
}

MapLevel.prototype = new Entity();
MapLevel.prototype.constructor = MapLevel;

MapLevel.prototype.update = function() {   

    var that = this;

    if (that.currentBoss) {
        if (that.currentBoss.hp <= 0) {
            that.defeatedBoss = true;
        }
    }

    // if defeated boss for the level, load new level
    if (that.defeatedBoss && that.currentLevel < 3) {
        that.currentLevel++;
        that.defeatedBoss = false;
        that.currentBoss = null;
        that.game.openNext = false;

        // remove all previous level entities
        for (var i = 0; i < that.game.cosmeticEntities.length; i++) {
            that.game.cosmeticEntities[i].removeFromWorld = true;
        }
        for (var i = 0; i < that.game.platforms.length; i++) {
            that.game.platforms[i].removeFromWorld = true;
        }
        for (var i = 1; i < that.game.entities.length; i++) {
            that.game.entities[i].removeFromWorld = true;
        }
        for (var i = 0; i < that.game.enemies.length; i++) {
            that.game.enemies[i].removeFromWorld = true;
        }

        // load new level
        var mc = that.game.entities.Character;
        switch(that.currentLevel) {
            case 1:
                that.map = level_1_map;
                that.createLevel();
                createLevel_1(that.game, that);
                mc.x = 64;
                mc.y = 544;
                break;
            case 2:
                that.map = level_2_map;
                that.createLevel();
                createLevel_2(that.game, that);
                this.game.cosmeticEntities.push(new Story2_1(this.game));
                this.game.cosmeticEntities.push(new Story2_2(this.game));
                mc.x = 64;
                mc.y = 544;
                break;
            case 3:
                that.map = level_3_map;
                that.createLevel();
                createLevel_3(that.game, that);
                this.game.cosmeticEntities.push(new Story3_1(this.game));
                mc.x = 64;
                mc.y = 544;
                break;
            default:
                console.log("Not a valid map."); 
        }
        that.createLevel();
        var healthbar = new HealthBar(that.game);
        that.game.cosmeticEntities.push(healthbar);
    }

    if (that.currentLevel == 2) {
        var mc = that.game.entities.Character;
        if (that.currentBoss == null) {
            if (mc.x > 7676 && mc.y < 0) {
                that.game.enemies.push(new GhostWolf(that.game, 7000, -30, 7910, 7000));
                that.game.enemies.push(new GhostWolf(that.game, 7200, -30, 7910, 7000));
                
                var boss = new SkeleBoss(that.game, 7676, -125);
                that.game.enemies.push(boss);
                that.currentBoss = boss;
            }
        }
    }

    Entity.prototype.update.call(that);
};

MapLevel.prototype.draw = function (ctx) {
}

MapLevel.prototype.createLevel = function() {
    for (var i = 0; i < 250; i++) {
        for (var j = 0; j < 35; j++) {
            // check if sprite is null, if not, draw it
            var sprite = this.sprites[this.map[j][i]];
            var currentLevel = this.currentLevel;
            if (sprite) {
                if(sprite == 1) {
                    this.game.platforms.push(new Platform(this.game, i * 32, j * 32 - 416));
                }
                else if(sprite == 2) {
                    if (currentLevel == 1) {
                        this.game.platforms.push(new WallPlatform(this.game, i * 32, j * 32 - 416, ASSET_MANAGER.getAsset("./img/level1brick.png"), true, true));
                    }
                    else if (currentLevel == 2) {
                        this.game.platforms.push(new WallPlatform(this.game, i * 32, j * 32 - 416, ASSET_MANAGER.getAsset("./img/purpleBrick.png"), true, true));
                    }
                    else if (currentLevel == 3) {
                        this.game.platforms.push(new WallPlatform(this.game, i * 32, j * 32 - 416, ASSET_MANAGER.getAsset("./img/greenBrick.png"), true, true));
                    }
                }
                else if(sprite == 3) {
                    if (currentLevel == 1) {
                        this.game.platforms.push(new Wall(this.game, i * 32, j * 32 - 416, ASSET_MANAGER.getAsset("./img/level1brick.png")));
                    }
                    else if (currentLevel == 2) {
                        this.game.platforms.push(new Wall(this.game, i * 32, j * 32 - 416, ASSET_MANAGER.getAsset("./img/purpleBrick.png")));
                    }
                    else if (currentLevel == 3) {
                        this.game.platforms.push(new Wall(this.game, i * 32, j * 32 - 416, ASSET_MANAGER.getAsset("./img/greenBrick.png")));
                    }
                }
                else if(sprite == 4) {
                    if (currentLevel == 1) {
                        this.game.cosmeticEntities.push(new WallPlatform(this.game, i * 32, j * 32 - 416, ASSET_MANAGER.getAsset("./img/level1brick.png")));
                    }
                    else if (currentLevel == 2) {
                        this.game.cosmeticEntities.push(new WallPlatform(this.game, i * 32, j * 32 - 416, ASSET_MANAGER.getAsset("./img/purpleBrick.png")));
                    }
                    else if (currentLevel == 3) {
                        this.game.cosmeticEntities.push(new WallPlatform(this.game, i * 32, j * 32 - 416, ASSET_MANAGER.getAsset("./img/greenBrick.png")));
                    }
                }
                else if(sprite == 5) {
                    if (currentLevel == 1) {
                        this.game.platforms.push(new WallPlatform(this.game, i * 32, j * 32 - 416, ASSET_MANAGER.getAsset("./img/level1brick.png"), false, true));
                    }
                    else if (currentLevel == 2) {
                        this.game.platforms.push(new WallPlatform(this.game, i * 32, j * 32 - 416, ASSET_MANAGER.getAsset("./img/purpleBrick.png"), false, true));
                    }
                    else if (currentLevel == 3) {
                        this.game.platforms.push(new WallPlatform(this.game, i * 32, j * 32 - 416, ASSET_MANAGER.getAsset("./img/greenBrick.png"), false, true));
                    }
                }
                else if(sprite == 6) {
                    if (currentLevel == 1) {
                        this.game.platforms.push(new WallPlatform(this.game, i * 32, j * 32 - 416, ASSET_MANAGER.getAsset("./img/level1brick.png"), true, false));
                    }
                    else if (currentLevel == 2) {
                        this.game.platforms.push(new WallPlatform(this.game, i * 32, j * 32 - 416, ASSET_MANAGER.getAsset("./img/purpleBrick.png"), true, false));
                    }
                    else if (currentLevel == 3) {
                        this.game.platforms.push(new WallPlatform(this.game, i * 32, j * 32 - 416, ASSET_MANAGER.getAsset("./img/greenBrick.png"), true, false));
                    }
                }
                else if (sprite == 7) {
                    if (currentLevel == 1) {
                        this.game.platforms.push(new WallPlatform(this.game, i * 32, j * 32 - 416, ASSET_MANAGER.getAsset("./img/level1brick.png"), true, true, true));
                    }
                    else if (currentLevel == 2) {
                        this.game.platforms.push(new WallPlatform(this.game, i * 32, j * 32 - 416, ASSET_MANAGER.getAsset("./img/purpleBrick.png"), true, true, true));
                    }
                    else if (currentLevel == 3) {
                        this.game.platforms.push(new WallPlatform(this.game, i * 32, j * 32 - 416, ASSET_MANAGER.getAsset("./img/greenBrick.png"), true, true, true));
                    }
                }
                else if (sprite == 8) {
                    if (currentLevel == 1) {
                        this.game.platforms.push(new BreakingPlatform(this.game, i * 32, j * 32 - 416, ASSET_MANAGER.getAsset("./img/fallingbrick.png"), true));
                    }
                    else if (currentLevel == 2) {
                        this.game.platforms.push(new BreakingPlatform(this.game, i * 32, j * 32 - 416, ASSET_MANAGER.getAsset("./img/breakingFall2.png"), true));
                    }
                    else if (currentLevel == 3) {
                        this.game.platforms.push(new BreakingPlatform(this.game, i * 32, j * 32 - 416, ASSET_MANAGER.getAsset("./img/breakingBrick3.png"), true));
                    }
                }
                else if (sprite == 9) {
                    if (currentLevel == 1) {
                        this.game.platforms.push(new MovingPlatform(this.game, i*32, j*32 - 416, i*32 + 128, i*32, ASSET_MANAGER.getAsset("./img/level1brick.png"), 150, false));
                    }
                    else if (currentLevel == 2) {
                        this.game.platforms.push(new MovingPlatform(this.game, i*32, j*32 - 416, i*32 + 128, i*32, ASSET_MANAGER.getAsset("./img/purpleBrick.png"), 150, false));
                    }
                    else if (currentLevel == 3) {
                        this.game.platforms.push(new MovingPlatform(this.game, i*32, j*32 - 416, i*32 + 128, i*32, ASSET_MANAGER.getAsset("./img/greenBrick.png"), 150, false));
                    }
                }
                else if (sprite == 10) {
                    if (currentLevel == 1) {
                        this.game.platforms.push(new MovingPlatform(this.game, i*32, j*32 - 416, i*32 + 128, i*32, ASSET_MANAGER.getAsset("./img/level1brick.png"), 150, true));
                    }
                    else if (currentLevel == 2) {
                        this.game.platforms.push(new MovingPlatform(this.game, i*32, j*32 - 416, i*32 + 128, i*32, ASSET_MANAGER.getAsset("./img/purpleBrick.png"), 150, true));
                    }
                    else if (currentLevel == 3) {
                        this.game.platforms.push(new MovingPlatform(this.game, i*32, j*32 - 416, i*32 + 128, i*32, ASSET_MANAGER.getAsset("./img/greenBrick.png"), 150, true));
                    }
                }
                else if (sprite == 11) {
                    if (currentLevel == 1) {
                        this.game.platforms.push(new VerticalPlatform(this.game, i*32, j*32- 416, j * 32 - 220, j*32 - 416, ASSET_MANAGER.getAsset("./img/level1brick.png"), 150, false));
                    }
                    else if (currentLevel == 2) {
                        this.game.platforms.push(new VerticalPlatform(this.game, i*32, j*32- 416, j * 32 - 220, j*32 - 416, ASSET_MANAGER.getAsset("./img/purpleBrick.png"), 150, false));
                    }
                    else if (currentLevel == 3) {
                        this.game.platforms.push(new VerticalPlatform(this.game, i*32, j*32- 416, j * 32 - 220, j*32 - 416, ASSET_MANAGER.getAsset("./img/greenBrick.png"), 150, false));
                    }
                }
            }
        }
    }
}