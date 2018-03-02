/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function WinScreen() {
    this.kBackground = "assets/Background.png";
    this.mCamera = null;
    this.mBG = null;
    this.messageArray = [];
}

gEngine.Core.inheritPrototype(WinScreen, Scene);

WinScreen.prototype.loadScene = function() {
    gEngine.Textures.loadTexture(this.kBackground);
};

WinScreen.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kBackground);
    
    var restart = new MyGame();
    gEngine.Core.startScene(restart);
};

WinScreen.prototype.initialize = function () {
    // camera
    this.mCamera = new Camera(
        vec2.fromValues(50, 40), // position of the camera
        100,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0, 0, 1, 1]);
    
    // Background
 
    
    this.mMsg = new FontRenderable("");
    this.mMsg.setColor([1, 1, 1, 1]);
    this.mMsg.getXform().setPosition(30, 50);
    this.mMsg.setTextHeight(6);
    
    var msg = new FontRenderable("A winner is you!");
    msg.setColor([1, 1, 1, 1]);
    msg.getXform().setPosition(25, 50);
    msg.setTextHeight(6);
    
    this.messageArray.push(msg);
    
    var msg3 = new FontRenderable("Press R to restart");
    msg3.setColor([1, 1, 1, 1]);
    msg3.getXform().setPosition(20,30);
    msg3.setTextHeight(6);

    this.messageArray.push(msg3);
    
    //this.mMsg.setText(txt);
    
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
}; 
        
WinScreen.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    
    //Draw the game over message
    for(var i = 0; i < this.messageArray.length; i++){
        this.messageArray[i].draw(this.mCamera);
    }
};

WinScreen.prototype.update = function () {
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.R)){
        gEngine.GameLoop.stop();
    }
};

