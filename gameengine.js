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
    this.enter = null;
    this.w = null;
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


    this.onStartScreen = true;
    this.onStartGameOption = true;
    this.onControlScreen = false;
    this.pressedTwiceforControl = 0;
    this.onLevelChooser = false;
    this.startTheGame = false;
    this.startToLevelChooser = false;
    this.startToPickedLevel = false;
    


    this.firstStartMove = 0;

    this.onWhichLevel = 1; //INDICATES WHICH DIFFICULTY THE USER HAS CHOSEN

}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.startInput();
    this.timer = new Timer();
}

GameEngine.prototype.start = function () {
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.startInput = function () {
    var that = this;

    this.ctx.canvas.addEventListener("click", function (e) {
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

    

//     this.ctx.canvas.addEventListener("keydown", function (e) {
//         if (String.fromCharCode(e.which) === 'D') that.d = true;
//         e.preventDefault();
//     }, false);

//     this.ctx.canvas.addEventListener("keyup", function (e) {
//         if (String.fromCharCode(e.which) === 'D') that.d = false;
//         e.preventDefault();
//     }, false);

//     this.ctx.canvas.addEventListener("keydown", function (e) {
//         if (String.fromCharCode(e.which) === 'A') that.a = true;
//         e.preventDefault();
//     }, false);

//     this.ctx.canvas.addEventListener("keyup", function (e) {
//         if (String.fromCharCode(e.which) === 'A') that.a = false;
//         e.preventDefault();
//     }, false);

//     this.ctx.canvas.addEventListener("keydown", function (e) {
//         if (e.key === 'Enter') {
//             if((that.startGame === false || that.controlScreen === true || that.startScreenCount === 0) && that.startGameCount === 0)  {
//                 that.startGameCount++;
//                 that.startScreenCount++;
//                 that.controlScreen = true;
//                 that.startGame = false;
//                 that.temp = 100;

//                 that.count++;

//                 that.camera = new Camera();

//             that.entities = [];
//             // var bg = new Background(that);
//             var map = new MapLevel(that);
//             var healthbar = new HealthBar(that);

//             // that.entities.Map = new MapLevel();
//             // console.log(that.entities.length);
//             that.entities.unshift(map);

//             var maincharacter = new MainCharacter(that);
//             that.entities.Character = maincharacter;

//             that.cosmeticEntities.push(healthbar);

//             } else if ( that.controlScreen === false){
//                 that.startScreenCount++;
//                 var controlScreen = new StartScreen(that, ASSET_MANAGER.getAsset("./img/controlScreen.jpg"));
//                 that.entities = [];
//                 that.addEntity(controlScreen);
//                 that.controlScreen = true;
//             }
//         }
//         e.preventDefault();
//     }, false);


//     this.ctx.canvas.addEventListener("keydown", function (e) {
//         var start = new Menu(that, ASSET_MANAGER.getAsset("./img/startGame.png"), 90, 400);
//         var control = new Menu(that, ASSET_MANAGER.getAsset("./img/controlsHigh.png"), 100, 500);
//         var start2 = new Menu(that, ASSET_MANAGER.getAsset("./img/startGameHigh.png"), 90, 400);
//         var control2 = new Menu(that, ASSET_MANAGER.getAsset("./img/controls.png"), 100, 500);
//         if (String.fromCharCode(e.which) === 'W') {
//             that.startScreenCount++;
//             if(that.startGame === false && that.temp === 0) {
//                 that.addEntity(start);
//                 that.addEntity(control);
//                 that.temp++;
//                 that.startGame = true;
//             } else if (that.startGame === true && that.temp === 1) {
//                 that.addEntity(start2);
//                 that.addEntity(control2);
//                 that.temp--;
//                 that.startGame = false;
// >>>>>>> master
                
    //     //     }
    //     // } 
    //     e.preventDefault();
    // }, false);

    // this.ctx.canvas.addEventListener("keyup", function (e) {
    //     if (String.fromCharCode(e.which) === 'W') that.w = false;
    //     e.preventDefault();
    // }, false);

    // this.ctx.canvas.addEventListener("keydown", function (e) {
    //     // var start = new Menu(that, ASSET_MANAGER.getAsset("./img/startGame.png"), 90, 400);
    //     // var control = new Menu(that, ASSET_MANAGER.getAsset("./img/controlsHigh.png"), 100, 500);
    //     // var start2 = new Menu(that, ASSET_MANAGER.getAsset("./img/startGameHigh.png"), 90, 400);
    //     // var control2 = new Menu(that, ASSET_MANAGER.getAsset("./img/controls.png"), 100, 500);
    //     // if (String.fromCharCode(e.which) === 'S' ) {
    //     //     this.s = true;
    //     //     that.startScreenCount++;
    //     //     if(that.startGame === false && that.temp === 0) {
    //     //         that.addEntity(start);
    //     //         that.addEntity(control);
    //     //         that.temp++;
    //     //         that.startGame = true;
    //     //     } else if (that.startGame === true && that.temp === 1)  {
    //     //         that.addEntity(start2);
    //     //         that.addEntity(control2);
    //     //         that.temp--;
    //     //         that.startGame = false;
                
    //     //     }
    //     // } 
    //     e.preventDefault();
    // }, false);

    // this.ctx.canvas.addEventListener("keyup", function (e) {
    //     if (String.fromCharCode(e.which) === 'S') that.s = false;
    //     e.preventDefault();
    // }, false);

    // this.ctx.canvas.addEventListener("keydown", function (e) {
    //     if (String.fromCharCode(e.which) === 'C') that.c = true;
    //     e.preventDefault();
    // }, false);

    // this.ctx.canvas.addEventListener("keyup", function (e) {
    //     if (String.fromCharCode(e.which) === 'C') that.c = false;
    //     e.preventDefault();
    // }, false);


    this.ctx.canvas.addEventListener("keyup", function (e) {
        if (String.fromCharCode(e.which) === 'R') that.r = true;
        e.preventDefault();
    }, false);

    // this.ctx.canvas.addEventListener("keydown", function (e) {
    //     if (String.fromCharCode(e.which) === 'R') that.r = false;
    //     e.preventDefault();
    // }, false);

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

    // this.ctx.canvas.addEventListener("keydown", function (e) {
    //     if (String.fromCharCode(e.which) === ' ') that.space = true;
    //     e.preventDefault();
    // }, false);

    // this.ctx.canvas.addEventListener("keyup", function (e) {
    //     if (String.fromCharCode(e.which) === ' ') that.space = false;
    //     e.preventDefault();
    // }, false);

    this.ctx.canvas.addEventListener("keydown", function (e) {
        if (String.fromCharCode(e.which) === "P") {
            that.togglePlay();
            e.preventDefault();
        }
    }, false);
}

/**
 * Toggle the play/pause feature when the play clicks the P key.
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
    // if(this.s) {
        
    //     var start = new Menu(this, ASSET_MANAGER.getAsset("./img/startGame.png"), 90, 400);
    //     var control = new Menu(this, ASSET_MANAGER.getAsset("./img/controlsHigh.png"), 100, 500);
    //     var start2 = new Menu(this, ASSET_MANAGER.getAsset("./img/startGameHigh.png"), 90, 400);
    //     var control2 = new Menu(this, ASSET_MANAGER.getAsset("./img/controls.png"), 100, 500);
    //     this.startScreenCount++;
    //         if(this.startGame === false && this.temp === 0) {
    //             this.addEntity(start);
    //             this.addEntity(control);
    //             this.temp++;
    //             this.startGame = true;
    //         } else if (this.startGame === true && this.temp === 1)  {
    //             this.addEntity(start2);
    //             this.addEntity(control2);
    //             this.temp--;
    //             this.startGame = false;
                
    //         }
    // }

    // if(this.w) {
    //     var start = new Menu(this, ASSET_MANAGER.getAsset("./img/startGame.png"), 90, 400);
    //     var control = new Menu(this, ASSET_MANAGER.getAsset("./img/controlsHigh.png"), 100, 500);
    //     var start2 = new Menu(this, ASSET_MANAGER.getAsset("./img/startGameHigh.png"), 90, 400);
    //     var control2 = new Menu(this, ASSET_MANAGER.getAsset("./img/controls.png"), 100, 500);

    //         this.startScreenCount++;
    //         if(this.startGame === false && this.temp === 0) {
    //             this.addEntity(start);
    //             this.addEntity(control);
    //             this.temp++;
    //             this.startGame = true;
    //         } else if (this.startGame === true && this.temp === 1) {
    //             this.addEntity(start2);
    //             this.addEntity(control2);
    //             this.temp--;
    //             this.startGame = false;
                
    //         }
        
    // }

    if(this)
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
        for (var i = this.cosmeticEntities.length - 1; i >= 0; --i) {
            if (this.cosmeticEntities[i].removeFromWorld) {
                this.cosmeticEntities.splice(i, 1);
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
    this.prevX = x;
    this.removeFromWorld = false;
}

Entity.prototype.update = function () {
    this.prevX = this.x;
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