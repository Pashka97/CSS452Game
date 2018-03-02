/**
 * Main Menu Scene
 *
 * Shows the splash screen
 * Has buttons for switching to the MyGame scene
 * Has buttons for selecting the difficulty
 */

"use strict";

function MainMenu()
{
    this.camera = null;
    this.placeholderText = null;
    this.placeholderText2 = null;
};

gEngine.Core.inheritPrototype(MainMenu, Scene);

MainMenu.prototype.initialize = function()
{
    this.camera = new Camera(
        vec2.fromValues(50, 50),
        100,
        [0, 0, 1000, 700],
        0 // new bound value
    );

    this.placeholderText = new FontRenderable("KELVIN 373 main menu");
    this.placeholderText.setColor([0,0,0,1]);
    this.placeholderText.getXform().setPosition(5, 80);
    this.placeholderText.setTextHeight(5);

    this.placeholderText2 = new FontRenderable("Press ENTER or SPACE");
    this.placeholderText2.setColor([1,0,0,1]);
    this.placeholderText2.getXform().setPosition(5, 20);
    this.placeholderText2.setTextHeight(2.0);

    this.camera.setBackgroundColor([80 / 255, 114 / 255, 201 / 255, 1.0]);
};


MainMenu.prototype.unloadScene = function() {
    var mainGame = new MyGame();
    gEngine.Core.startScene(mainGame);
};


MainMenu.prototype.goToMainGame = function()
{
    var mainGame = new MyGame();
    gEngine.Core.startScene(mainGame);
};

MainMenu.prototype.update = function()
{
    // check for the Enter or Space keys to start the game
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Space))
    {
        gEngine.GameLoop.stop();
    }
    
    // Enter Doesnt Work?
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Enter))
    {
        gEngine.GameLoop.stop();
    }
};

MainMenu.prototype.draw = function()
{
  this.camera.setupViewProjection();
  this.placeholderText.draw(this.camera);
  this.placeholderText2.draw(this.camera);
};
