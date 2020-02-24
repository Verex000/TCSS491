function Controller(gameEngine) {
    this.gameEngine = gameEngine;
    this.gamepad = new Gamepad();
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

//UP W
this.gamepad.on('press', 'd_pad_up', () => {
this.gameEngine.w = true;
});
this.gamepad.on('release', 'd_pad_up', () => {
this.gameEngine.w = false;
});

//DOWN S
this.gamepad.on('press', 'd_pad_down', () => {
this.gameEngine.s = true;       
});
this.gamepad.on('release', 'd_pad_down', () => {
this.gameEngine.s = false;
});

//ENTER
this.gamepad.on('press', 'button_3 ', () => {
this.gameEngine.enter = true;
});
this.gamepad.on('release', 'button_3 ', () => {
this.gameEngine.enter = false;
});

//JUMP
this.gamepad.on('press', 'button_1', () => {
this.gameEngine.space = true;
});
this.gamepad.on('release', 'button_1', () => {
this.gameEngine.space = false;
});


//SWORD ATTACK
this.gamepad.on('press', 'shoulder_bottom_right', () => {
this.gameEngine.l = true;
});
this.gamepad.on('release', 'shoulder_bottom_right', () => {
this.gameEngine.l = false;
});

//INTERACT WITH OBJECTS
this.gamepad.on('press', 'button_2', () => {
this.gameEngine.e = true;

});
this.gamepad.on('release', 'button_2', () => {
this.gameEngine.e = false;
});

};