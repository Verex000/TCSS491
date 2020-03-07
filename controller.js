function Controller(gameEngine) {
    this.gameEngine = gameEngine;
    this.gamepad = new Gamepad();
    const THRESHHOLD = 0.1;
}
Controller.prototype.init = function () {
    this.gamepad.on('connect', e => {
console.log(`controller ${e.index} connected!`);
});

this.gamepad.on('disconnect', e => {
});

//LEFT
this.gamepad.on('press', 'd_pad_left', () => {
this.gameEngine.a = true;
});
this.gamepad.on('release', 'd_pad_left', () => {
this.gameEngine.a = false;
});

//RIGHT
this.gamepad.on('press', 'd_pad_right', () => {
this.gameEngine.d = true;
});
this.gamepad.on('release', 'd_pad_right', () => {
this.gameEngine.d = false;
});

//RIGHT //STICK
this.gamepad.on('hold', 'stick_axis_left', e => {
    //console.log("x :" + e.value[0]  +  " y : " + e.value[1])
    if(e.value[0] >= 0.70 && e.value[1] >= - 0.80 && e.value[1] <= 0.80) {
        this.gameEngine.d = true;
    } else {
        this.gameEngine.d = false;
    }
});
this.gamepad.on('release', 'stick_axis_left', e => {
        this.gameEngine.d = false;
    });

// LEFT STICK
this.gamepad.on('hold', 'stick_axis_left', e => {
    //console.log("x :" + e.value[0]  +  " y : " + e.value[1])
    if(e.value[0] <= - 0.70 && e.value[1] >= - 0.80 && e.value[1] <= 0.80) {
        this.gameEngine.a = true;
    } else {
        this.gameEngine.a = false;
    }
});
this.gamepad.on('release', 'stick_axis_left', e => {
    this.gameEngine.a = false;
});

//UP STICK
this.gamepad.on('press', 'stick_axis_left', e => {
    if(e.value[1] <= -0.35 && e.value[0] >= -0.77 && e.value[0] <= 0.77) {
    this.gameEngine.w = true; 
    this.gameEngine.firstStartMove++;

        //--------------------------------IF ON START SCREEN  ------------------------------
        if(this.gameEngine.onStartScreen && this.gameEngine.firstStartMove > 1) {

        var start = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/startGame.png"), 90, 400);
        var control = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/controlsHigh.png"), 100, 500);
        var start2 = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/startGameHigh.png"), 90, 400);
        var control2 = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/controls.png"), 100, 500);
        if(this.gameEngine.onStartGameOption) {
            this.gameEngine.addEntity(start);
            this.gameEngine.addEntity(control);
        } else  {
            this.gameEngine.addEntity(start2);
            this.gameEngine.addEntity(control2);        
        } 

        //CHANGE VALUE OF STARTGAME or on CONTROL:
        if(this.gameEngine.onStartGameOption) {
            this.gameEngine.onStartGameOption = false;
        } else {
            this.gameEngine.onStartGameOption = true;
        }
        }

        //--------------------------IF ON LEVEL CHOOSER ------------------------
        if(this.gameEngine.onLevelChooser) {
            this.gameEngine.startToPickedLevel = true;
            console.log("hello");
            this.gameEngine.onWhichLevel--;
            if(this.gameEngine.onWhichLevel === -1) {
                this.gameEngine.onWhichLevel = 3;
            }

            if(this.gameEngine.onWhichLevel === 1) {
            var easyHigh = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/easyHigh.png"), 100, 300);
            var normal= new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/normal.png"), 85, 400);
            var godMode = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/godMode.png"), 80, 500);

            this.gameEngine.addEntity(easyHigh);
            this.gameEngine.addEntity(normal);
            this.gameEngine.addEntity(godMode);
            } else if(this.gameEngine.onWhichLevel === 2) {
            var easy = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/easy.png"), 100, 300);
            var normalHigh= new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/normalHigh.png"), 85, 400);
            var godMode = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/godMode.png"), 80, 500);

            this.gameEngine.addEntity(easy);
            this.gameEngine.addEntity(normalHigh);
            this.gameEngine.addEntity(godMode);
            } else if( this.gameEngine.onWhichLevel === 3) {
                var easy = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/easy.png"), 100, 300);
                var normal= new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/normal.png"), 85, 400);
                var godModeHigh = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/godModeHigh.png"), 80, 500);

                this.gameEngine.addEntity(easy);
                this.gameEngine.addEntity(normal);
                this.gameEngine.addEntity(godModeHigh);
            }
        }


    } else {
        this.gameEngine.w = false;
    }

});
this.gamepad.on('release', 'stick_axis_left', e => {
    this.gameEngine.w = false;
});

//DOWN STICK
this.gamepad.on('press', 'stick_axis_left', e => {
    if(e.value[1] >=  0.35 && e.value[0] >= -0.77 && e.value[0] <= 0.77) {
        this.gameEngine.s = true; 
        this.gameEngine.firstStartMove++;

        //--------------------------------IF ON START SCREEN  ------------------------------
        if(this.gameEngine.onStartScreen && this.gameEngine.firstStartMove > 1) {

        var start = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/startGame.png"), 90, 400);
        var control = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/controlsHigh.png"), 100, 500);
        var start2 = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/startGameHigh.png"), 90, 400);
        var control2 = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/controls.png"), 100, 500);
        if(this.gameEngine.onStartGameOption) {
            this.gameEngine.addEntity(start);
            this.gameEngine.addEntity(control);
        } else  {
            this.gameEngine.addEntity(start2);
            this.gameEngine.addEntity(control2);        
        } 

        //CHANGE VALUE OF STARTGAME or on CONTROL:
        if(this.gameEngine.onStartGameOption) {
            this.gameEngine.onStartGameOption = false;
        } else {
            this.gameEngine.onStartGameOption = true;
        }
        }

        //--------------------------IF ON LEVEL CHOOSER ------------------------
        if(this.gameEngine.onLevelChooser) {
            this.gameEngine.startToPickedLevel = true;
            console.log("hello");
            this.gameEngine.onWhichLevel++;
            if(this.gameEngine.onWhichLevel === 4) {
                this.gameEngine.onWhichLevel = 1;
            }

            if(this.gameEngine.onWhichLevel === 1) {
            var easyHigh = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/easyHigh.png"), 100, 300);
            var normal= new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/normal.png"), 85, 400);
            var godMode = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/godMode.png"), 80, 500);

            this.gameEngine.addEntity(easyHigh);
            this.gameEngine.addEntity(normal);
            this.gameEngine.addEntity(godMode);
            } else if(this.gameEngine.onWhichLevel === 2) {
            var easy = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/easy.png"), 100, 300);
            var normalHigh= new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/normalHigh.png"), 85, 400);
            var godMode = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/godMode.png"), 80, 500);

            this.gameEngine.addEntity(easy);
            this.gameEngine.addEntity(normalHigh);
            this.gameEngine.addEntity(godMode);
            } else if( this.gameEngine.onWhichLevel === 3) {
                var easy = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/easy.png"), 100, 300);
                var normal= new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/normal.png"), 85, 400);
                var godModeHigh = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/godModeHigh.png"), 80, 500);

                this.gameEngine.addEntity(easy);
                this.gameEngine.addEntity(normal);
                this.gameEngine.addEntity(godModeHigh);
            }
        }
        





    } else {
        this.gameEngine.s = false;
    }
});
this.gamepad.on('release', 'stick_axis_left', e => {
    this.gameEngine.s = false;
});

//JUMP / enter
this.gamepad.on('press', 'button_1', () => {
    this.gameEngine.space = true;
    this.gameEngine.pressedTwiceforControl++;
    //-----------ON START SCREEN-------------------------------
    if(this.gameEngine.onStartScreen) {
        this.gameEngine.onStartScreen = false;
        if(this.gameEngine.onStartGameOption) {
            this.gameEngine.startToLevelChooser = true;
        } else {
            this.gameEngine.onControlScreen = true;
            
        }

    }

    //--------------IF ON CONTROL SCREEN-----------------------
    if(this.gameEngine.onControlScreen && this.gameEngine.pressedTwiceforControl === 1) {
        var controlScreen = new StartScreen(this.gameEngine, ASSET_MANAGER.getAsset("./img/controlScreen2.png"));
        this.gameEngine.addEntity(controlScreen);
        this.gameEngine.onLevelChooser = true;
    }

    //--------------LEVEL CHOOSER SCREEN --------------------------
    if((this.gameEngine.onLevelChooser && this.gameEngine.pressedTwiceforControl === 2) || this.gameEngine.startToLevelChooser){
        this.gameEngine.startToLevelChooser = false;
        this.gameEngine.onLevelChooser = true;
        var LevelScreen = new StartScreen(this.gameEngine, ASSET_MANAGER.getAsset("./img/controlScreen3.png"));
        this.gameEngine.addEntity(LevelScreen);

        var easyHigh = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/easyHigh.png"), 100, 300);
        var normal= new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/normal.png"), 85, 400);
        var godMode = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/godMode.png"), 80, 500);

        this.gameEngine.addEntity(easyHigh);
        this.gameEngine.addEntity(normal);
        this.gameEngine.addEntity(godMode);


    }

    if((this.gameEngine.onLevelChooser  && this.gameEngine.pressedTwiceforControl === 3 ) || this.gameEngine.startToPickedLevel){
        //----------------------------- SET LEVEL -----------------------
        this.gameEngine.startToPickedLevel = false;
        this.gameEngine.onLevelChooser = false;
        this.gameEngine.startTheGame = true;

    }


if(this.gameEngine.startTheGame)  {
    //console.log('Hello');
    this.gameEngine.startTheGame = false;
    
    
    
    this.gameEngine.camera = new Camera();
    
    this.gameEngine.entities = [];
    var bg = new Background(this.gameEngine);
    var map = new MapLevel(this.gameEngine);
    var healthbar = new HealthBar(this.gameEngine);
    
    // enemies
    var slime = new Slime(this.gameEngine, 1700, 632, 1700, 2400);
    var slime2 = new Slime(this.gameEngine, 2000, 632, 1700, 2400);
    var slime3 = new Slime(this.gameEngine, 2200, 632, 1700, 2400);
    var slime4 = new Slime(this.gameEngine, 1450, 600, 1445, 1500);
    var slime5 = new Slime(this.gameEngine, 3712, 600, 3712, 4288);
    var slime6 = new Slime(this.gameEngine, 416, -170, 416, 1140);
    var slime7 = new Slime(this.gameEngine, 700, -170, 416, 1140);
    var slime8 = new Slime(this.gameEngine, 900, -170, 416, 1140);
    var slime9 = new Slime(this.gameEngine, 4288, 600, 3712, 4288);
    
    
    var bat = new Bat(this.gameEngine, 7232, 544, 5026, 7200, 64);
    var bat2 = new Bat(this.gameEngine, 5026, 544, 5026, 7200, 64);
    var bat3 = new Bat(this.gameEngine, 1932, 60, 1088, 1856, 64);
    var bat4 = new Bat(this.gameEngine, 192, 192, 192, 768, 96);
    
    
    // 64 - 84 = -20
    var skeleton = new Skeleton(this.gameEngine, 3000, -20, 3000, 3300);
    var skeleton2 = new Skeleton(this.gameEngine, 4200, 555, 3648, 4288);
    var skeleton3 = new Skeleton(this.gameEngine, 750, 236, 192, 704);
    var skeleton4 = new Skeleton(this.gameEngine, 4608, 555, 4608, 5000);
    var skeleton5 = new Skeleton(this.gameEngine, 5000, 555, 4608, 5000);
    var skeleton6 = new Skeleton(this.gameEngine, 4320, -340, 4320, 4864);
    
    
    //var dino = new Dino(this.gameEngine);
    var nightmare = new Nightmare(this.gameEngine, 200, true);
    var ghost = new Ghost(this.gameEngine, 600, 600);
    var attackWolf = new AttackWolf(this.gameEngine, 200);
    
    var miniBoss = new MiniBoss(this.gameEngine, 7725, -200);
    
    
    
    //var lever = new Lever(this.gameEngine, )
    
    // items
    var turkey1 = new Turkey(this.gameEngine, 2540, 540);
    var turkey2 = new Turkey(this.gameEngine, 2670, 450);
    var turkey3 = new Turkey(this.gameEngine, 224, -288);
    var turkey4 = new Turkey(this.gameEngine, 6650, 200);
    var turkey5 = new Turkey(this.gameEngine, 7136, -224);
    var turkey6 = new Turkey(this.gameEngine, 4870, -330);
    var turkey7 = new Turkey(this.gameEngine, 2272, -332);
    var turkey8 = new Turkey(this.gameEngine, 4512, 476);
    var turkey9 = new Turkey(this.gameEngine, 5472, 60);
    
    // traps
    var fallingspike1 = new FallingSpike(this.gameEngine, 512, 480);
    var fallingspike2 = new FallingSpike(this.gameEngine, 544, 480);
    var fallingspike3 = new FallingSpike(this.gameEngine, 576, 480);
    var fallingspike4 = new FallingSpike(this.gameEngine, 608, 480);
    var fallingspike5 = new FallingSpike(this.gameEngine, 640, 480);
    var fallingspike6 = new FallingSpike(this.gameEngine, 672, 480);
    var fallingspike7 = new FallingSpike(this.gameEngine, 704, 480);
    var fallingspike8 = new FallingSpike(this.gameEngine, 736, 480);
    
    var fallingspike9 = new FallingSpike(this.gameEngine, 864, 320);
    var fallingspike10 = new FallingSpike(this.gameEngine, 928, 320);
    var fallingspike11 = new FallingSpike(this.gameEngine, 960, 320);
    var fallingspike12 = new FallingSpike(this.gameEngine, 1024, 320);
    var fallingspike13 = new FallingSpike(this.gameEngine, 1056, 320);
    
    // level 2
    var fallingspike14 = new FallingSpike(this.gameEngine, 1728, -224);
    var fallingspike15 = new FallingSpike(this.gameEngine, 1536, -96);
    var fallingspike16 = new FallingSpike(this.gameEngine, 1376, -96);
    var fallingspike17 = new FallingSpike(this.gameEngine, 1344, -96);
    
    // var fallingspike18 = new FallingSpike(this.gameEngine, 2816, -384);
    // var fallingspike19 = new FallingSpike(this.gameEngine, 2912, -384);
    // var fallingspike20 = new FallingSpike(this.gameEngine, 3008, -384);
    // var fallingspike21 = new FallingSpike(this.gameEngine, 3104, -384);
    // var fallingspike22 = new FallingSpike(this.gameEngine, 3200, -384);
    // var fallingspike23 = new FallingSpike(this.gameEngine, 3296, -384);
    
    var spike = new Spike(this.gameEngine, 320, 620);
    
    // level 2
    var spike2 = new Spike(this.gameEngine, 3936, 288);
    var spike3 = new Spike(this.gameEngine, 3968, 288);
    
    // items
    var chest = new Chest(this.gameEngine, 1560, 590);
    var chest2 = new Chest(this.gameEngine, 2575, 510);
    var chest3 = new Chest(this.gameEngine, 7910, 310);
    var chest4 = new Chest(this.gameEngine, 1485, -224);
    var chest5 = new Chest(this.gameEngine, 4896, -320);
    var chest6 = new Chest(this.gameEngine, 4992, 132);
    
    var lever = new Lever(this.gameEngine, 7910, 450);
    
    // ADD ENTITIES
    this.gameEngine.addEntity(bg);
    this.gameEngine.addEntity(map);
    
    var maincharacter = new MainCharacter(this.gameEngine);
    this.gameEngine.entities.Character = maincharacter;
    
    // items
    this.gameEngine.addEntity(turkey1);
    this.gameEngine.addEntity(turkey2);
    this.gameEngine.addEntity(turkey3);
    this.gameEngine.addEntity(turkey4);
    this.gameEngine.addEntity(turkey5);
    this.gameEngine.addEntity(turkey6);
    this.gameEngine.addEntity(turkey7);
    this.gameEngine.addEntity(turkey8);
    this.gameEngine.addEntity(turkey9);
    
    this.gameEngine.addEntity(chest);
    this.gameEngine.addEntity(chest2);
    this.gameEngine.addEntity(chest3);
    this.gameEngine.addEntity(chest4);
    this.gameEngine.addEntity(chest5);
    this.gameEngine.addEntity(chest6);
    
    this.gameEngine.addEntity(lever);
    
    // traps
    this.gameEngine.addEntity(fallingspike1);
    this.gameEngine.addEntity(fallingspike2);
    this.gameEngine.addEntity(fallingspike3);
    this.gameEngine.addEntity(fallingspike4);
    this.gameEngine.addEntity(fallingspike5);
    this.gameEngine.addEntity(fallingspike6);
    this.gameEngine.addEntity(fallingspike7);
    this.gameEngine.addEntity(fallingspike8);
    
    this.gameEngine.addEntity(fallingspike9);
    this.gameEngine.addEntity(fallingspike10);
    this.gameEngine.addEntity(fallingspike11);
    this.gameEngine.addEntity(fallingspike12);
    this.gameEngine.addEntity(fallingspike13);
    
    this.gameEngine.addEntity(fallingspike14);
    this.gameEngine.addEntity(fallingspike15);
    this.gameEngine.addEntity(fallingspike16);
    this.gameEngine.addEntity(fallingspike17);
    
    // this.gameEngine.addEntity(fallingspike18);
    // this.gameEngine.addEntity(fallingspike19);
    // this.gameEngine.addEntity(fallingspike20);
    // this.gameEngine.addEntity(fallingspike21);
    // this.gameEngine.addEntity(fallingspike22);
    // this.gameEngine.addEntity(fallingspike23);
    
    this.gameEngine.addEntity(spike);
    this.gameEngine.addEntity(spike2);
    this.gameEngine.addEntity(spike3);
    
    // dart trap on level 1
    this.gameEngine.addEntity(new Dart(this.gameEngine, 2614, 500, 1664));
    this.gameEngine.cosmeticEntities.push(new DartTrap(this.gameEngine, 2624, 480));
    
    this.gameEngine.addEntity(new Dart(this.gameEngine, 3500, 490, 2784));
    this.gameEngine.addEntity(new Dart(this.gameEngine, 3500, 522, 2784));
    this.gameEngine.cosmeticEntities.push(new DartTrap(this.gameEngine, 3520, 480));
    this.gameEngine.cosmeticEntities.push(new DartTrap(this.gameEngine, 3520, 512));
    
    // dart trap on level 2
    this.gameEngine.addEntity(new Dart(this.gameEngine, 396, -118, 32));
    this.gameEngine.cosmeticEntities.push(new DartTrap(this.gameEngine, 416, -128));
    
    this.gameEngine.addEntity(new Dart(this.gameEngine, 2188, -278, 1984));
    this.gameEngine.cosmeticEntities.push(new DartTrap(this.gameEngine, 2208, -288));
    
    this.gameEngine.addEntity(new Dart(this.gameEngine, 2380, -182, 2208));
    this.gameEngine.cosmeticEntities.push(new DartTrap(this.gameEngine, 2400, -192));
    
    this.gameEngine.addEntity(new Dart(this.gameEngine, 4854, 84, 3936));
    this.gameEngine.cosmeticEntities.push(new DartTrap(this.gameEngine, 4864, 64));
    this.gameEngine.addEntity(new Dart(this.gameEngine, 4854, 116, 3936));
    this.gameEngine.cosmeticEntities.push(new DartTrap(this.gameEngine, 4864, 96));
    this.gameEngine.addEntity(new Dart(this.gameEngine, 4854, 148, 3936));
    this.gameEngine.cosmeticEntities.push(new DartTrap(this.gameEngine, 4864, 128));
    
    this.gameEngine.addEntity(new Dart(this.gameEngine, 5056, -86, 3936));
    this.gameEngine.cosmeticEntities.push(new DartTrap(this.gameEngine, 5056, -96));
    this.gameEngine.addEntity(new Dart(this.gameEngine, 5056, -54, 3936));
    this.gameEngine.cosmeticEntities.push(new DartTrap(this.gameEngine, 5056, -64));
    this.gameEngine.addEntity(new Dart(this.gameEngine, 5056, -22, 3936));
    this.gameEngine.cosmeticEntities.push(new DartTrap(this.gameEngine, 5056, -32));
    
    this.gameEngine.addEntity(new Dart(this.gameEngine, 5356, 106, 5216));
    this.gameEngine.cosmeticEntities.push(new DartTrap(this.gameEngine, 5376, 96));
    
    this.gameEngine.addEntity(new Dart(this.gameEngine, 5814, 106, 5568));
    this.gameEngine.cosmeticEntities.push(new DartTrap(this.gameEngine, 5824, 96));
    
    this.gameEngine.cosmeticEntities.push(healthbar);
    
    
    // enemies
    this.gameEngine.enemies.push(slime);
    this.gameEngine.enemies.push(slime2);
    this.gameEngine.enemies.push(slime3);
    this.gameEngine.enemies.push(slime4);
    this.gameEngine.enemies.push(slime5);
    this.gameEngine.enemies.push(slime6);
    this.gameEngine.enemies.push(slime7);
    this.gameEngine.enemies.push(slime8);
    this.gameEngine.enemies.push(slime9);
    // this.gameEngine.enemies.push(slime10);
    
    this.gameEngine.enemies.push(bat);
    this.gameEngine.enemies.push(bat2);
    this.gameEngine.enemies.push(bat3);
    this.gameEngine.enemies.push(bat4);
    
    this.gameEngine.enemies.push(skeleton);
    this.gameEngine.enemies.push(skeleton2);
    this.gameEngine.enemies.push(skeleton3);
    this.gameEngine.enemies.push(skeleton4);
    this.gameEngine.enemies.push(skeleton5);
    this.gameEngine.enemies.push(skeleton6);
    
    this.gameEngine.enemies.push(miniBoss);
    
    this.gameEngine.enemies.push(miniBoss);
    
    } 

    });
    
    this.gamepad.on('release', 'button_4', () => {
    this.gameEngine.enter = true;
    });
    
    //UP W
    this.gamepad.on('press', 'd_pad_up', () => {
    
        this.gameEngine.w = true; 
        this.gameEngine.firstStartMove++;
    
            //--------------------------------IF ON START SCREEN  ------------------------------
            if(this.gameEngine.onStartScreen && this.gameEngine.firstStartMove > 0) {
    
            var start = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/startGame.png"), 90, 400);
            var control = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/controlsHigh.png"), 100, 500);
            var start2 = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/startGameHigh.png"), 90, 400);
            var control2 = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/controls.png"), 100, 500);
            if(this.gameEngine.onStartGameOption) {
                this.gameEngine.addEntity(start);
                this.gameEngine.addEntity(control);
            } else  {
                this.gameEngine.addEntity(start2);
                this.gameEngine.addEntity(control2);        
            } 
    
            //CHANGE VALUE OF STARTGAME or on CONTROL:
            if(this.gameEngine.onStartGameOption) {
                this.gameEngine.onStartGameOption = false;
            } else {
                this.gameEngine.onStartGameOption = true;
            }
            }
    
            //--------------------------IF ON LEVEL CHOOSER ------------------------
            if(this.gameEngine.onLevelChooser) {
                this.gameEngine.startToPickedLevel = true;
                console.log("hello");
                this.gameEngine.onWhichLevel--;
                if(this.gameEngine.onWhichLevel === 0) {
                    this.gameEngine.onWhichLevel = 3;
                }
    
                if(this.gameEngine.onWhichLevel === 1) {
                var easyHigh = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/easyHigh.png"), 100, 300);
                var normal= new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/normal.png"), 85, 400);
                var godMode = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/godMode.png"), 80, 500);
    
                this.gameEngine.addEntity(easyHigh);
                this.gameEngine.addEntity(normal);
                this.gameEngine.addEntity(godMode);
                } else if(this.gameEngine.onWhichLevel === 2) {
                var easy = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/easy.png"), 100, 300);
                var normalHigh= new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/normalHigh.png"), 85, 400);
                var godMode = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/godMode.png"), 80, 500);
    
                this.gameEngine.addEntity(easy);
                this.gameEngine.addEntity(normalHigh);
                this.gameEngine.addEntity(godMode);
                } else if( this.gameEngine.onWhichLevel === 3) {
                    var easy = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/easy.png"), 100, 300);
                    var normal= new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/normal.png"), 85, 400);
                    var godModeHigh = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/godModeHigh.png"), 80, 500);
    
                    this.gameEngine.addEntity(easy);
                    this.gameEngine.addEntity(normal);
                    this.gameEngine.addEntity(godModeHigh);
                }
            }  
    });
    this.gamepad.on('release', 'button_1', () => {
        this.gameEngine.w = false;
        });

//DOWN S
this.gamepad.on('press', 'd_pad_down', () => {
    this.gameEngine.s = true; 
    this.gameEngine.firstStartMove++;

    //--------------------------------IF ON START SCREEN  ------------------------------
    if(this.gameEngine.onStartScreen && this.gameEngine.firstStartMove > 0) {

    var start = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/startGame.png"), 90, 400);
    var control = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/controlsHigh.png"), 100, 500);
    var start2 = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/startGameHigh.png"), 90, 400);
    var control2 = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/controls.png"), 100, 500);
    if(this.gameEngine.onStartGameOption) {
        this.gameEngine.addEntity(start);
        this.gameEngine.addEntity(control);
    } else  {
        this.gameEngine.addEntity(start2);
        this.gameEngine.addEntity(control2);        
    } 

    //CHANGE VALUE OF STARTGAME or on CONTROL:
    if(this.gameEngine.onStartGameOption) {
        this.gameEngine.onStartGameOption = false;
    } else {
        this.gameEngine.onStartGameOption = true;
    }
    }

    //--------------------------IF ON LEVEL CHOOSER ------------------------
    if(this.gameEngine.onLevelChooser) {
        this.gameEngine.startToPickedLevel = true;
        console.log("hello");
        this.gameEngine.onWhichLevel++;
        if(this.gameEngine.onWhichLevel === 4) {
            this.gameEngine.onWhichLevel = 1;
        }

        if(this.gameEngine.onWhichLevel === 1) {
        var easyHigh = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/easyHigh.png"), 100, 300);
        var normal= new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/normal.png"), 85, 400);
        var godMode = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/godMode.png"), 80, 500);

        this.gameEngine.addEntity(easyHigh);
        this.gameEngine.addEntity(normal);
        this.gameEngine.addEntity(godMode);
        } else if(this.gameEngine.onWhichLevel === 2) {
        var easy = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/easy.png"), 100, 300);
        var normalHigh= new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/normalHigh.png"), 85, 400);
        var godMode = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/godMode.png"), 80, 500);

        this.gameEngine.addEntity(easy);
        this.gameEngine.addEntity(normalHigh);
        this.gameEngine.addEntity(godMode);
        } else if( this.gameEngine.onWhichLevel === 3) {
            var easy = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/easy.png"), 100, 300);
            var normal= new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/normal.png"), 85, 400);
            var godModeHigh = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/godModeHigh.png"), 80, 500);

            this.gameEngine.addEntity(easy);
            this.gameEngine.addEntity(normal);
            this.gameEngine.addEntity(godModeHigh);
        }
    }
});
this.gamepad.on('release', 'd_pad_down', () => {
this.gameEngine.s = false;
});






//SWORD ATTACK
this.gamepad.on('press', 'shoulder_bottom_right', () => {
this.gameEngine.l = true;
});
this.gamepad.on('release', 'shoulder_bottom_right', () => {
this.gameEngine.l = false;
});

// //SHOOT ATTACK
// this.gamepad.on('press', 'shoulder_bottom_left', () => {
//     this.gameEngine.r = true;
//     });
//     this.gamepad.on('release', 'shoulder_bottom_left', () => {
//     this.gameEngine.r = false;
//     });


//INTERACT WITH OBJECTS
this.gamepad.on('press', 'button_2', () => {
this.gameEngine.e = true;

});
this.gamepad.on('release', 'button_2', () => {
this.gameEngine.e = false;
});

};