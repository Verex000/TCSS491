// This game shell was happily copied from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

// # All traps, items, enemies
var traps = [];

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();


function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now(); 
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

function GameEngine() {
    this.entities = [];
    this.openNext = false;
    this.entities.Character = null;
    this.showOutlines = false;
    this.a = null;
    this.d = null;
    this.s = null;
    this.c = null;
    this.r = null;
    this.l = null;
    this.p = null;
    this.controlScreen = false;
    this.startGame = true;
    this.enemies = [];
    this.camera = null;
    this.platforms = [];
    this.gates = [];
    this.cosmeticEntities = [];
    this.space = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.count = 0;
    this.music = false;
    this.pause =false;

    this.temp = 1;
    this.startGameCount = 0;
    this.startScreenCount = 0;
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.startInput();
    this.timer = new Timer();
    console.log('game initialized');
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.startInput = function () {
    var that = this;

    this.ctx.canvas.addEventListener("click", function (e) {
        // if (that.count === 0) {
        //     that.camera = new Camera();

        //     that.entities = [];
        //     var bg = new Background(that);
        //     var map = new MapLevel(that);
        //     var healthbar = new HealthBar(that);
        //     var slime = new Slime(that);
        //     var turkey = new Turkey(that, 200, 620);
        //     var turkey2 = new Turkey(that, 800, 620);
        //     var fallingspike = new FallingSpike(that, 200, 20);
        //     var spike = new Spike(that, 100, 620);
        //     var dino = new Dino(that);
        //     var bat = new Bat(that);
        //     var skeleton = new Skeleton(that);
        //     var chest = new Chest(that);
        //     var nightmare = new Nightmare(that, 200, true);
        //     var ghost = new Ghost(that, 600, 600);
        //     var attackWolf = new AttackWolf(that, 200);

        //     that.addEntity(bg);
        //     that.addEntity(map);
        //     that.cosmeticEntities.push(healthbar);

        //     var maincharacter = new MainCharacter(that);
        //     that.entities.Character = maincharacter;
        //     // that.addEntity(maincharacter);
        //     that.addEntity(slime);
        //     // that.addEntity(turkey);
        //     // that.addEntity(turkey2);
        //     that.addEntity(fallingspike);
        //     that.addEntity(spike);
        //     // that.addEntity(dino);
        //     // that.addEntity(bat);
        //     // that.addEntity(skeleton);
        //     // that.addEntity(chest);  
        //     // that.addEntity(nightmare);
        //     // that.addEntity(ghost);
        //     // that.addEntity(attackWolf);

        //     traps.push(fallingspike);
        //     traps.push(spike);
        //     that.addEntity(new Dart(that, 3500, 490));
        //     that.addEntity(new Dart(that, 3500, 522));
        //     that.cosmeticEntities.push(new DartTrap(that, 3520, 480));
        //     that.cosmeticEntities.push(new DartTrap(that, 3520, 512));
        // }

    }, false);

    this.ctx.canvas.addEventListener("keydown", function (e) {
        if (String.fromCharCode(e.which) === 'P') {
            that.p = false;
            e.preventDefault();


    }
    }, false);

    this.ctx.canvas.addEventListener("keyup", function (e) {
        if (String.fromCharCode(e.which) === 'P') {
            that.p = true;
            e.preventDefault();
    }
    }, false);

    
    this.ctx.canvas.addEventListener("keydown", function (e) {
        if (String.fromCharCode(e.which) === 'D') that.d = true;
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("keyup", function (e) {
        if (String.fromCharCode(e.which) === 'D') that.d = false;
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("keydown", function (e) {
        if (String.fromCharCode(e.which) === 'A') that.a = true;
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("keyup", function (e) {
        if (String.fromCharCode(e.which) === 'A') that.a = false;
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("keydown", function (e) {
        if (e.key === 'Enter') {
            if((that.startGame === false || that.controlScreen === true || that.startScreenCount === 0) && that.startGameCount === 0)  {
                that.startGameCount++;
                that.startScreenCount++;
                that.controlScreen = true;
                that.startGame = false;
                that.temp = 100;

                that.count++;



                that.camera = new Camera();

            that.entities = [];
            var bg = new Background(that);
            var map = new MapLevel(that);
            var healthbar = new HealthBar(that);

            // enemies
            var slime = new Slime(that, 1700, 632, 1700, 2400);
            var slime2 = new Slime(that, 2000, 632, 1700, 2400);
            var slime3 = new Slime(that, 2200, 632, 1700, 2400);
            var slime4 = new Slime(that, 1450, 600, 1450, 1578);
            var slime5 = new Slime(that, 3712, 600, 3712, 4288);
            var slime6 = new Slime(that, 416, -170, 416, 1140);
            var slime7 = new Slime(that, 700, -170, 416, 1140);
            var slime8 = new Slime(that, 900, -170, 416, 1140);
            var slime9 = new Slime(that, 4288, 600, 3712, 4288);

            var miniBoss = new MiniBoss(that);
            // var slime10 = new Slime(that, 2848, 100, 2848, 3290);


            var bat = new Bat(that, 7232, 544, 5026, 7200, 64);
            var bat2 = new Bat(that, 5026, 544, 5026, 7200, 64);
            var bat3 = new Bat(that, 1932, 60, 1088, 1856, 64);
            var bat4 = new Bat(that, 192, 192, 192, 768, 96);


            // 64 - 84 = -20
            var skeleton = new Skeleton(that, 3000, -20, 3000, 3300);
            var skeleton2 = new Skeleton(that, 4200, 555, 3648, 4288);
            var skeleton3 = new Skeleton(that, 750, 236, 192, 704);
            var skeleton4 = new Skeleton(that, 4608, 555, 4608, 5000);
            var skeleton5 = new Skeleton(that, 5000, 555, 4608, 5000);


            var dino = new Dino(that);
            var nightmare = new Nightmare(that, 200, true);
            var ghost = new Ghost(that, 600, 600);
            var attackWolf = new AttackWolf(that, 200);

            var miniBoss = new MiniBoss(that, 7725, -200);
            
            

            //var lever = new Lever(that, )

            // items
            var turkey1 = new Turkey(that, 2540, 540);
            var turkey2 = new Turkey(that, 2670, 450);
            var turkey3 = new Turkey(that, 224, -288);
            var turkey4 = new Turkey(that, 6650, 200);

            // traps
            var fallingspike1 = new FallingSpike(that, 512, 480);
            var fallingspike2 = new FallingSpike(that, 544, 480);
            var fallingspike3 = new FallingSpike(that, 576, 480);
            var fallingspike4 = new FallingSpike(that, 608, 480);
            var fallingspike5 = new FallingSpike(that, 640, 480);
            var fallingspike6 = new FallingSpike(that, 672, 480);
            var fallingspike7 = new FallingSpike(that, 704, 480);
            var fallingspike8 = new FallingSpike(that, 736, 480);

            var fallingspike9 = new FallingSpike(that, 864, 320);
            var fallingspike10 = new FallingSpike(that, 928, 320);
            var fallingspike11 = new FallingSpike(that, 960, 320);
            var fallingspike12 = new FallingSpike(that, 1024, 320);
            var fallingspike13 = new FallingSpike(that, 1056, 320);

            var fallingspike14 = new FallingSpike(that, 1728, -224);
            var fallingspike15 = new FallingSpike(that, 1536, -96);
            var fallingspike16 = new FallingSpike(that, 1376, -96);
            var fallingspike17 = new FallingSpike(that, 1344, -96);


            var spike = new Spike(that, 320, 620);

            var chest = new Chest(that, 1560, 590);
            var chest2 = new Chest(that, 2575, 510);
            var chest3 = new Chest(that, 7910, 310);
            var chest4 = new Chest(that, 1485, -224);
            
            var lever = new Lever(that, 7910, 450);

            // ADD ENTITIES
            that.addEntity(bg);
            that.addEntity(map);
            that.cosmeticEntities.push(healthbar);

            var maincharacter = new MainCharacter(that);
            that.entities.Character = maincharacter;

            // items
            that.addEntity(turkey1);
            that.addEntity(turkey2);
            that.addEntity(turkey3);
            that.addEntity(turkey4);

            that.addEntity(chest);
            that.addEntity(chest2);
            that.addEntity(chest3);
            that.addEntity(chest4);
            
            that.addEntity(lever);

            // traps
            that.addEntity(fallingspike1);
            that.addEntity(fallingspike2);
            that.addEntity(fallingspike3);
            that.addEntity(fallingspike4);
            that.addEntity(fallingspike5);
            that.addEntity(fallingspike6);
            that.addEntity(fallingspike7);
            that.addEntity(fallingspike8);

            that.addEntity(fallingspike9);
            that.addEntity(fallingspike10);
            that.addEntity(fallingspike11);
            that.addEntity(fallingspike12);
            that.addEntity(fallingspike13);

            that.addEntity(fallingspike14);
            that.addEntity(fallingspike15);
            that.addEntity(fallingspike16);
            that.addEntity(fallingspike17);

            that.addEntity(spike);

            // dart trap on level 1
            that.addEntity(new Dart(that, 2614, 500, 1664));
            that.cosmeticEntities.push(new DartTrap(that, 2624, 480));

            that.addEntity(new Dart(that, 3500, 490, 2784));
            that.addEntity(new Dart(that, 3500, 522, 2784));
            that.cosmeticEntities.push(new DartTrap(that, 3520, 480));
            that.cosmeticEntities.push(new DartTrap(that, 3520, 512));

            // dart trap on level 2
            that.addEntity(new Dart(that, 396, -118, 32));
            that.cosmeticEntities.push(new DartTrap(that, 416, -128));

            that.addEntity(new Dart(that, 2188, -278, 1984));
            that.cosmeticEntities.push(new DartTrap(that, 2208, -288));

            that.addEntity(new Dart(that, 2380, -182, 2208));
            that.cosmeticEntities.push(new DartTrap(that, 2400, -192));

            that.addEntity(new Dart(that, 5356, 106, 5216));
            that.cosmeticEntities.push(new DartTrap(that, 5376, 96));

            that.addEntity(new Dart(that, 5814, 106, 5568));
            that.cosmeticEntities.push(new DartTrap(that, 5824, 96));


            // enemies
            that.enemies.push(slime);
            that.enemies.push(slime2);
            that.enemies.push(slime3);
            that.enemies.push(slime4);
            that.enemies.push(slime5);
            that.enemies.push(slime6);
            that.enemies.push(slime7);
            that.enemies.push(slime8);
            that.enemies.push(slime9);
            // that.enemies.push(slime10);

            that.enemies.push(bat);
            that.enemies.push(bat2);
            that.enemies.push(bat3);
            that.enemies.push(bat4);

            that.enemies.push(skeleton);
            that.enemies.push(skeleton2);
            that.enemies.push(skeleton3);
            that.enemies.push(skeleton4);
            that.enemies.push(skeleton5);

            that.enemies.push(miniBoss);

            // that.addEntity(dino);
            // that.addEntity(skeleton);

            // that.addEntity(nightmare);
            // that.addEntity(ghost);
            // that.addEntity(attackWolf);

            // that.addEntity(miniBoss);
            // traps.push(fallingspike);
            // traps.push(spike);
            // that.addEntity(new Dart(that, 3500, 490));
            // that.addEntity(new Dart(that, 3500, 522));
            // that.cosmeticEntities.push(new DartTrap(that, 3520, 480));
            // that.cosmeticEntities.push(new DartTrap(that, 3520, 512));
            // traps.push(fallingspike);
            // traps.push(spike);

            // 

        


                // that.camera = new Camera();
    
                // that.entities = [];
                // var bg = new Background(that);
                // var maincharacter = new MainCharacter(that);
                // var healthbar = new HealthBar(that);
                // var slime = new Slime(that);
                // var turkey = new Turkey(that, 200, 620);
                // var turkey2 = new Turkey(that, 800, 620);
                // var spike = new Spike(that);
                // var dino = new Dino(that);
                // var bat = new Bat(that);
                // var skeleton = new Skeleton(that);
                // var chest = new Chest(that);
                // var nightmare = new Nightmare(that, 200, true);
                // var ghost = new Ghost(that, 600, 600);
                // var attackWolf = new AttackWolf(that, 200);

                // var miniBoss = new MiniBoss(that, 400);
    
                // var map = new MapLevel(that);
                // that.addEntity(bg);
                // that.addEntity(map);
                // that.addEntity(healthbar);
    
                // var plat = new Platform(that, 0, 668, 1);
                // that.addEntity(plat);
                // platforms.push(plat);
    
                // // Add floor level 0 platform
                // for (var i = 1; i * 32 <= 1216; i++) {
                //     plat = new Platform(that, 32 * i, 668, 1);
                //     that.addEntity(plat);
                //     platforms.push(plat);
                // }
    
                // for (var i = 1; i * 32 <= 608; i++) {
                //     plat = new Platform(that, (32 * i) + 1376, 668, 1);
                //     that.addEntity(plat);
                //     platforms.push(plat);
                // }
    
                // // // Add level 1 platform
                // // for (var i = 1; i < 5; i++) {
                // //     plat = new Platform(that, 32 * i, 636, 1);    // testing
                // //     that.addEntity(plat);
                // //     platforms.push(plat);
                // // }
    
    
                // that.entities.Character = maincharacter;
                // // that.addEntity(maincharacter);

                // that.addEntity(slime);
                // that.addEntity(turkey);
                // that.addEntity(turkey2);
                // that.addEntity(spike); 
                // //that.addEntity(dino);
                // that.addEntity(bat);
                // that.addEntity(skeleton);
                // that.addEntity(chest);  
                // that.addEntity(nightmare);
                // that.addEntity(ghost);
                // that.addEntity(attackWolf);

                // that.addEntity(miniBoss);
    
                // traps.push(spike);
            } else if ( that.controlScreen === false){
                that.startScreenCount++;
                var controlScreen = new StartScreen(that, ASSET_MANAGER.getAsset("./img/controlScreen.jpg"));
                that.entities = [];
                that.addEntity(controlScreen);
                that.controlScreen = true;
            }
        }
        e.preventDefault();
    }, false);


    this.ctx.canvas.addEventListener("keydown", function (e) {
        var start = new Menu(that, ASSET_MANAGER.getAsset("./img/startgame.png"), 90, 400);
        var control = new Menu(that, ASSET_MANAGER.getAsset("./img/controlsHigh.png"), 100, 500);
        var start2 = new Menu(that, ASSET_MANAGER.getAsset("./img/startgameHigh.png"), 90, 400);
        var control2 = new Menu(that, ASSET_MANAGER.getAsset("./img/controls.png"), 100, 500);
        if (String.fromCharCode(e.which) === 'W') {
            that.startScreenCount++;
            if(that.startGame === false && that.temp === 0) {
                that.addEntity(start);
                that.addEntity(control);
                that.temp++;
                that.startGame = true;
            } else if (that.startGame === true && that.temp === 1) {
                that.addEntity(start2);
                that.addEntity(control2);
                that.temp--;
                that.startGame = false;
                
            }
        } 
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("keydown", function (e) {
        var start = new Menu(that, ASSET_MANAGER.getAsset("./img/startgame.png"), 90, 400);
        var control = new Menu(that, ASSET_MANAGER.getAsset("./img/controlsHigh.png"), 100, 500);
        var start2 = new Menu(that, ASSET_MANAGER.getAsset("./img/startgameHigh.png"), 90, 400);
        var control2 = new Menu(that, ASSET_MANAGER.getAsset("./img/controls.png"), 100, 500);
        if (String.fromCharCode(e.which) === 'S') {
            that.startScreenCount++;
            if(that.startGame === false && that.temp === 0) {
                that.addEntity(start);
                that.addEntity(control);
                that.temp++;
                that.startGame = true;
            } else if (that.startGame === true && that.temp === 1)  {
                that.addEntity(start2);
                that.addEntity(control2);
                that.temp--;
                that.startGame = false;
                
            }
        } 
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("keyup", function (e) {
        if (String.fromCharCode(e.which) === 'S') that.s = false;
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("keydown", function (e) {
        if (String.fromCharCode(e.which) === 'C') that.c = true;
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("keyup", function (e) {
        if (String.fromCharCode(e.which) === 'C') that.c = false;
        e.preventDefault();
    }, false);


    this.ctx.canvas.addEventListener("keyup", function (e) {
        if (String.fromCharCode(e.which) === 'R') that.r = true;
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("keydown", function (e) {
        if (String.fromCharCode(e.which) === 'E') that.e = true;
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("keyup", function (e) {
        if (String.fromCharCode(e.which) === 'E') that.e = false;
        e.preventDefault();
    }, false);


    this.ctx.canvas.addEventListener("keydown", function (e) {
        if (String.fromCharCode(e.which) === 'L') that.l = true;
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("keyup", function (e) {
        if (String.fromCharCode(e.which) === 'L') that.l = false;
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("keydown", function (e) {
        if (String.fromCharCode(e.which) === ' ') that.space = true;
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("keyup", function (e) {
        if (String.fromCharCode(e.which) === ' ') that.space = false;
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("keydown", function (e) {
        if (String.fromCharCode(e.which) === "P") {
            console.log("paused")
            that.togglePlay();
            e.preventDefault();
        }
    }, false);
}

/**
 * Toggle the play/pause feature when the play clicks the ESCAPE key.
 */
GameEngine.prototype.togglePlay = function () {
    this.pause = !(this.pause);
}

GameEngine.prototype.addEntity = function (entity) {
    this.entities.push(entity);
}

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    for (var i = 0; i < this.enemies.length; i++) {
        this.enemies[i].draw(this.ctx);
    }
    if(this.entities.Character != null) {
        this.entities.Character.draw(this.ctx);
    }
    for(var x = 0; x < this.platforms.length; x++) {
        // var plat = this.platforms[x];
        this.platforms[x].draw(this.ctx);
    }
    for(var z = 0; z < this.gates.length; z++) {
        var gate = this.gates[z];
        gate.draw(this.ctx);
    }
    for(var z = 0; z < this.cosmeticEntities.length; z++) {
        var cosmetic = this.cosmeticEntities[z];
        cosmetic.draw(this.ctx);
    }
    this.ctx.restore();
}

GameEngine.prototype.update = function () {
    for(var x = 0; x < this.platforms.length; x++) {
        var plat = this.platforms[x];
        if(!plat.removeFromWorld) {
            plat.update();
        }
    }
        var entitiesCount = this.entities.length;
        if(this.entities.Character != null) {
            this.entities.Character.update();
        }
        for (var i = 0; i < entitiesCount; i++) {
            var entity = this.entities[i];
    
            if (!entity.removeFromWorld) {
                entity.update();
            }
        }
        for (var i = 0; i < this.enemies.length; i++) {
            var entity = this.enemies[i];
            if (!entity.removeFromWorld) {
                entity.update();
            }
        }
        for(var z = 0; z < this.cosmeticEntities.length; z++) {
            var cosmetic = this.cosmeticEntities[z];
            if(!cosmetic.removeFromWorld) {
                cosmetic.update();
            }
        }
        for (var i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i].removeFromWorld) {
                this.entities.splice(i, 1);
            }
        }
        for (var i = this.platforms.length - 1; i >= 0; --i) {
            if (this.platforms[i].removeFromWorld) {
                this.platforms.splice(i, 1);
            }
        }
        for (var i = this.enemies.length - 1; i >= 0; --i) {
            if (this.enemies[i].removeFromWorld) {
                this.enemies.splice(i, 1);
            }
        }
}

GameEngine.prototype.loop = function () {
    if (!this.pause) {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
        this.space = null;
    }
}


function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

Entity.prototype.update = function () {
}

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
}

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}