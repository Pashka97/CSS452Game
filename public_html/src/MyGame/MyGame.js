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
    // Assets
    this.kProjectileTexture = "assets/particle.png";
    this.kSphereMinion = "assets/sphere_enemy.png";
    this.kHobbesSpriteSheet = "assets/hobbes.png";
    this.kPlatformTexture = "assets/platform.png";
    this.kSquirtGunShotSprite = "assets/squirtgunshot.png";
    this.kBackground = "assets/Background.png";
    // World Bounds
    this.mWorldBounds = null;
    // Camera
    this.mCamera = null;
    // Background
    this.mBG = null;
    // Objects
    this.mObjects = null;
    this.mPlatforms = null;
    this.mMinions = null;
    this.mSquirtGunShots = null;
    this.mHobbes = null;
    this.mHobbesHealthBar = null;
    this.mFloor = null;
    // Next Scene to go to
    this.mNextScene = null;
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function() {
    gEngine.Textures.loadTexture(this.kProjectileTexture);
    gEngine.Textures.loadTexture(this.kSphereMinion);
    gEngine.Textures.loadTexture(this.kHobbesSpriteSheet);
    gEngine.Textures.loadTexture(this.kPlatformTexture);
    gEngine.Textures.loadTexture(this.kSquirtGunShotSprite);
    gEngine.Textures.loadTexture(this.kBackground);
};

MyGame.prototype.unloadScene = function() {
    gEngine.Textures.unloadTexture(this.kProjectileTexture);
    gEngine.Textures.unloadTexture(this.kSphereMinion);
    gEngine.Textures.unloadTexture(this.kHobbesSpriteSheet);
    gEngine.Textures.unloadTexture(this.kPlatformTexture);
    gEngine.Textures.unloadTexture(this.kSquirtGunShotSprite);
    gEngine.Textures.unloadTexture(this.kBackground);
    
    gEngine.Core.startScene(this.mNextScene);
};

MyGame.prototype.initialize = function () {
    // World Bounds
    var centerPos = vec2.fromValues(50, 40);
    var width = 100;
    var height = 75;
    this.mWorldBounds = new WorldBounds(centerPos, width, height);
    // Camera
    this.mCamera = new Camera(centerPos, width, [0, 0, 800, 600]);
    this.mCamera.setBackgroundColor([0, 0, 1, 1]);
    // Hobbes
    this.mHobbes = new Hobbes(this.kHobbesSpriteSheet, 50, 35);
    // Hobbes' health bar
    this.mHobbesHealthBar = new HealthBar(
        vec2.fromValues(-45, 20),
        2,
        20,
        this.mHobbes
    );
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
    //Set to store enemies
    this.mMinions = new GameObjectSet();
    // Squirt gun shot set
    this.mSquirtGunShots = new GameObjectSet();
    //Initialize enemies
    var y = 70;
    var x = 10;
    for (var i = 1; i<=5; i++) {
        var m = new SphereMinion(this.kSphereMinion, x, y);
        x += 20;
       this.mMinions.addToSet(m); //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    }
    
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    
    this.mObjects.draw(this.mCamera);
    this.mMinions.draw(this.mCamera);
    this.mSquirtGunShots.draw(this.mCamera);
    // Health bar
    this.mHobbesHealthBar.draw(this.mCamera);
};

MyGame.prototype.update = function () {
    this.mCamera.update();  // to ensure proper interpolated movement effects

    if (this.mHobbes.update(
        this.mPlatforms, this.mMinions, this.mSquirtGunShots,
        this.kSquirtGunShotSprite)) {
        this.mNextScene = new GameOver();
        gEngine.GameLoop.stop();   
    }
    
    this.mMinions.update(this.mCamera, this.mHobbes);
    this.mSquirtGunShots.update(this.mCamera);
    this.mFloor.update();
    gEngine.Physics.processCollision(this.mObjects, []);
    
    // Destroy Spheres if hit by a shot
    for (var i = 0; i < this.mSquirtGunShots.size(); ++i) {
        for (var j = 0; j < this.mMinions.size(); ++j) {
            var shot = this.mSquirtGunShots.getObjectAt(i);
            var minion = this.mMinions.getObjectAt(j);
            if (shot.pixelTouches(minion, [])) {
                this.mSquirtGunShots.removeFromSet(shot);
                this.mMinions.removeFromSet(minion);
            }
        }
    }
    if(this.mMinions.size() <= 0) {
        this.mNextScene = new WinScreen();
        gEngine.GameLoop.stop();
    }
    // If Hobbes goes out of the world bounds, game over
    if (this.mWorldBounds.outsideBounds(this.mHobbes)) {
        this.mNextScene = new GameOver();
        gEngine.GameLoop.stop();
    }
    
    this.mHobbesHealthBar.update(this.mCamera);
};


