/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {
    // assets
    this.kHobbesSpriteSheet = "assets/hobbes.png";
    this.kPlatformTexture = "assets/platform.png";
    
    // camera
    this.mCamera = null;
    
    // objects
    this.mObjects = null;
    this.mPlatforms = null;
    this.mHobbes = null;
    this.mFloor = null;
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function() {
    gEngine.Textures.loadTexture(this.kHobbesSpriteSheet);
    gEngine.Textures.loadTexture(this.kPlatformTexture);
};

MyGame.prototype.unloadScene = function() {    
    gEngine.Textures.unloadTexture(this.kHobbesSpriteSheet);
    gEngine.Textures.unloadTexture(this.kPlatformTexture);
};

MyGame.prototype.initialize = function () {
    // camera
    this.mCamera = new Camera(
        vec2.fromValues(50, 40), // position of the camera
        100,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    // Hobbes
    this.mHobbes = new Hobbes(this.kHobbesSpriteSheet, 50, 35);
    // Floor
    var floorRen = new Renderable();
    floorRen.getXform().setPosition(50, 2.5);
    floorRen.getXform().setSize(100, 5);
    this.mFloor = new GameObject(floorRen);
    var floorRB = new RigidRectangle(floorRen.getXform(), 100, 5);
    floorRB.setMass(0);
    this.mFloor.setRigidBody(floorRB);
    // Platforms
    this.mPlatforms = new GameObjectSet();
    var pf = new Platform(this.kPlatformTexture, 20, 8, 30, 0);
    this.mPlatforms.addToSet(pf);
    this.mPlatforms.addToSet(this.mFloor);
    // Object set
    this.mObjects = new GameObjectSet();
    this.mObjects.addToSet(this.mHobbes);
    this.mObjects.addToSet(this.mFloor);
    this.mObjects.addToSet(pf);
    
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();  
    this.mObjects.draw(this.mCamera);
};

MyGame.prototype.update = function () {
    this.mCamera.update();  // to ensure proper interpolated movement effects
    this.mHobbes.update(this.mPlatforms);
    this.mFloor.update();
    gEngine.Physics.processCollision(this.mObjects, []);
};
