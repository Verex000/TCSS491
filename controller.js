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
        this.gameEngine.onWhichDifficulty--;
        if(this.gameEngine.onWhichDifficulty === 0) {
            this.gameEngine.onWhichDifficulty = 4;
        }

        if(this.gameEngine.onWhichDifficulty === 1) {
        var easyHigh = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/easyHigh.png"), 100, 200);
        var normal= new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/normal.png"), 80, 300);
        var godMode = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/godMode.png"), 75, 500);
        var hard = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/hard.png"), 95, 400);

        this.gameEngine.addEntity(easyHigh);
        this.gameEngine.addEntity(normal);
        this.gameEngine.addEntity(godMode);
        this.gameEngine.addEntity(hard);
        } else if(this.gameEngine.onWhichDifficulty === 2) {
        var easy = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/easy.png"), 100, 200);
        var normalHigh= new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/normalHigh.png"), 80, 300);
        var godMode = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/godMode.png"), 75, 500);
        var hard = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/hard.png"), 95, 400);

        this.gameEngine.addEntity(easy);
        this.gameEngine.addEntity(normalHigh);
        this.gameEngine.addEntity(godMode);
        this.gameEngine.addEntity(hard);
        } else if( this.gameEngine.onWhichDifficulty === 3) {
            var easy = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/easy.png"), 100, 200);
            var normal= new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/normal.png"), 80, 300);
            var godMode = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/godMode.png"), 75, 500);
            var hardHigh = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/hardHigh.png"), 95, 400);

            this.gameEngine.addEntity(easy);
            this.gameEngine.addEntity(normal);
            this.gameEngine.addEntity(godMode);
            this.gameEngine.addEntity(hardHigh);
        }else if( this.gameEngine.onWhichDifficulty === 4) {
        var easy = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/easy.png"), 100, 200);
        var normal= new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/normal.png"), 80, 300);
        var godModeHigh = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/godModeHigh.png"), 75, 500);
        var hard = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/hard.png"), 95, 400);

        this.gameEngine.addEntity(easy);
        this.gameEngine.addEntity(normal);
        this.gameEngine.addEntity(godModeHigh);
        this.gameEngine.addEntity(hard);
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
        this.gameEngine.onWhichDifficulty++;
        if(this.gameEngine.onWhichDifficulty === 5) {
            this.gameEngine.onWhichDifficulty = 1;
        }

        if(this.gameEngine.onWhichDifficulty === 1) {
        var easyHigh = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/easyHigh.png"), 100, 200);
        var normal= new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/normal.png"), 80, 300);
        var godMode = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/godMode.png"), 75, 500);
        var hard = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/hard.png"), 95, 400);

        this.gameEngine.addEntity(easyHigh);
        this.gameEngine.addEntity(normal);
        this.gameEngine.addEntity(godMode);
        this.gameEngine.addEntity(hard);
        } else if(this.gameEngine.onWhichDifficulty === 2) {
        var easy = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/easy.png"), 100, 200);
        var normalHigh= new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/normalHigh.png"), 80, 300);
        var godMode = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/godMode.png"), 75, 500);
        var hard = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/hard.png"), 95, 400);

        this.gameEngine.addEntity(easy);
        this.gameEngine.addEntity(normalHigh);
        this.gameEngine.addEntity(godMode);
        this.gameEngine.addEntity(hard);
        } else if( this.gameEngine.onWhichDifficulty === 3) {
            var easy = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/easy.png"), 100, 200);
            var normal= new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/normal.png"), 80, 300);
            var godMode = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/godMode.png"), 75, 500);
            var hardHigh = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/hardHigh.png"), 95, 400);

            this.gameEngine.addEntity(easy);
            this.gameEngine.addEntity(normal);
            this.gameEngine.addEntity(godMode);
            this.gameEngine.addEntity(hardHigh);
        }else if( this.gameEngine.onWhichDifficulty === 4) {
        var easy = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/easy.png"), 100, 200);
        var normal= new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/normal.png"), 80, 300);
        var godModeHigh = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/godModeHigh.png"), 75, 500);
        var hard = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/hard.png"), 95, 400);

        this.gameEngine.addEntity(easy);
        this.gameEngine.addEntity(normal);
        this.gameEngine.addEntity(godModeHigh);
        this.gameEngine.addEntity(hard);
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

        var easyHigh = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/easyHigh.png"), 100, 200);
        var normal= new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/normal.png"), 80, 300);
        var hard= new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/hard.png"), 95, 400);
        var godMode = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/godMode.png"), 75, 500);

        this.gameEngine.addEntity(easyHigh);
        this.gameEngine.addEntity(normal);
        this.gameEngine.addEntity(godMode);
        this.gameEngine.addEntity(hard);


    }

    if((this.gameEngine.onLevelChooser  && this.gameEngine.pressedTwiceforControl === 3 ) || this.gameEngine.startToPickedLevel){
        //----------------------------- SET LEVEL -----------------------
        this.gameEngine.startToPickedLevel = false;
        this.gameEngine.onLevelChooser = false;
        this.gameEngine.startTheGame = true;

    }


if(this.gameEngine.startTheGame)  { //-------------- START THE GAME < ADD ENTITIES
    //console.log('Hello');
    this.gameEngine.startTheGame = false;
    
    
    
    this.gameEngine.camera = new Camera();

    this.gameEngine.entities = [];
            // var bg = new Background(that);
            var map = new MapLevel(this.gameEngine);
            var healthbar = new HealthBar(this.gameEngine);

            // that.entities.Map = new MapLevel();
            // console.log(that.entities.length);
            this.gameEngine.entities.unshift(map);

            var maincharacter = new MainCharacter(this.gameEngine);
            this.gameEngine.entities.Character = maincharacter;

            this.gameEngine.cosmeticEntities.push(healthbar);
    
    
    
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
        this.gameEngine.onWhichDifficulty--;
        if(this.gameEngine.onWhichDifficulty === 0) {
            this.gameEngine.onWhichDifficulty = 4;
        }

        if(this.gameEngine.onWhichDifficulty === 1) {
        var easyHigh = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/easyHigh.png"), 100, 200);
        var normal= new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/normal.png"), 80, 300);
        var godMode = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/godMode.png"), 75, 500);
        var hard = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/hard.png"), 95, 400);

        this.gameEngine.addEntity(easyHigh);
        this.gameEngine.addEntity(normal);
        this.gameEngine.addEntity(godMode);
        this.gameEngine.addEntity(hard);
        } else if(this.gameEngine.onWhichDifficulty === 2) {
        var easy = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/easy.png"), 100, 200);
        var normalHigh= new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/normalHigh.png"), 80, 300);
        var godMode = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/godMode.png"), 75, 500);
        var hard = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/hard.png"), 95, 400);

        this.gameEngine.addEntity(easy);
        this.gameEngine.addEntity(normalHigh);
        this.gameEngine.addEntity(godMode);
        this.gameEngine.addEntity(hard);
        } else if( this.gameEngine.onWhichDifficulty === 3) {
            var easy = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/easy.png"), 100, 200);
            var normal= new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/normal.png"), 80, 300);
            var godMode = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/godMode.png"), 75, 500);
            var hardHigh = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/hardHigh.png"), 95, 400);

            this.gameEngine.addEntity(easy);
            this.gameEngine.addEntity(normal);
            this.gameEngine.addEntity(godMode);
            this.gameEngine.addEntity(hardHigh);
        }else if( this.gameEngine.onWhichDifficulty === 4) {
        var easy = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/easy.png"), 100, 200);
        var normal= new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/normal.png"), 80, 300);
        var godModeHigh = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/godModeHigh.png"), 75, 500);
        var hard = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/hard.png"), 95, 400);

        this.gameEngine.addEntity(easy);
        this.gameEngine.addEntity(normal);
        this.gameEngine.addEntity(godModeHigh);
        this.gameEngine.addEntity(hard);
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
        this.gameEngine.onWhichDifficulty++;
        if(this.gameEngine.onWhichDifficulty === 5) {
            this.gameEngine.onWhichDifficulty = 1;
        }

        if(this.gameEngine.onWhichDifficulty === 1) {
        var easyHigh = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/easyHigh.png"), 100, 200);
        var normal= new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/normal.png"), 80, 300);
        var godMode = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/godMode.png"), 75, 500);
        var hard = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/hard.png"), 95, 400);

        this.gameEngine.addEntity(easyHigh);
        this.gameEngine.addEntity(normal);
        this.gameEngine.addEntity(godMode);
        this.gameEngine.addEntity(hard);
        } else if(this.gameEngine.onWhichDifficulty === 2) {
        var easy = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/easy.png"), 100, 200);
        var normalHigh= new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/normalHigh.png"), 80, 300);
        var godMode = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/godMode.png"), 75, 500);
        var hard = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/hard.png"), 95, 400);

        this.gameEngine.addEntity(easy);
        this.gameEngine.addEntity(normalHigh);
        this.gameEngine.addEntity(godMode);
        this.gameEngine.addEntity(hard);
        } else if( this.gameEngine.onWhichDifficulty === 3) {
            var easy = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/easy.png"), 100, 200);
            var normal= new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/normal.png"), 80, 300);
            var godMode = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/godMode.png"), 75, 500);
            var hardHigh = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/hardHigh.png"), 95, 400);

            this.gameEngine.addEntity(easy);
            this.gameEngine.addEntity(normal);
            this.gameEngine.addEntity(godMode);
            this.gameEngine.addEntity(hardHigh);
        }else if( this.gameEngine.onWhichDifficulty === 4) {
        var easy = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/easy.png"), 100, 200);
        var normal= new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/normal.png"), 80, 300);
        var godModeHigh = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/godModeHigh.png"), 75, 500);
        var hard = new Menu(this.gameEngine, ASSET_MANAGER.getAsset("./img/hard.png"), 95, 400);

        this.gameEngine.addEntity(easy);
        this.gameEngine.addEntity(normal);
        this.gameEngine.addEntity(godModeHigh);
        this.gameEngine.addEntity(hard);
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

//SHOOT ATTACK
this.gamepad.on('press', 'shoulder_bottom_left', () => {
    this.gameEngine.r = true;
    });
    this.gamepad.on('release', 'shoulder_bottom_left', () => {
    this.gameEngine.r = false;
    });


//INTERACT WITH OBJECTS
this.gamepad.on('press', 'button_2', () => {
this.gameEngine.e = true;

});
this.gamepad.on('release', 'button_2', () => {
this.gameEngine.e = false;
});

};