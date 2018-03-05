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
    this.kWaterBalloonSprite = "assets/Balloon.png";
    this.kBackground = "assets/background_circuits.png";
    this.kBackgroundNormal = "assets/background_circuits_normal.png";

    // World Bounds
    this.mWorldBounds = null;

    // tile sprites
    this.kTile128 = "assets/tile128x128.png";
    this.kTile256 = "assets/tile256x256.png";
    this.kTile256x128 = "assets/tile256x128.png";
    
    // camera
    this.mCamera = null;
    // Background
    this.mBG = null;

    this.mLevel = null;
    this.mGlobalLightSet = null;


    // objects

    this.mObjects = null;
    this.mMinions = null;
    this.mSquirtGunShots = null;
    this.mHobbes = null;
    this.mHobbesHealthBar = null;

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
    gEngine.Textures.loadTexture(this.kWaterBalloonSprite);
    gEngine.Textures.loadTexture(this.kBackground);
    gEngine.Textures.loadTexture(this.kBackgroundNormal);
    gEngine.Textures.loadTexture(this.kTile128);
    gEngine.Textures.loadTexture(this.kTile256);
    gEngine.Textures.loadTexture(this.kTile256x128);
};

MyGame.prototype.unloadScene = function() {
    gEngine.Textures.unloadTexture(this.kProjectileTexture);
    gEngine.Textures.unloadTexture(this.kSphereMinion);
    gEngine.Textures.unloadTexture(this.kHobbesSpriteSheet);
    gEngine.Textures.unloadTexture(this.kPlatformTexture);
    gEngine.Textures.unloadTexture(this.kSquirtGunShotSprite);
    gEngine.Textures.unloadTexture(this.kWaterBalloonSprite);
    gEngine.Textures.unloadTexture(this.kBackground);
    gEngine.Textures.unloadTexture(this.kBackgroundNormal);
    gEngine.Textures.unloadTexture(this.kTile128);
    gEngine.Textures.unloadTexture(this.kTile256);
    gEngine.Textures.unloadTexture(this.kTile256x128);
    
    gEngine.Core.startScene(this.mNextScene);
};

MyGame.prototype.initialize = function ()
{
    // Level
    this.mLevel = new BossLevel();

    this.mGlobalLightSet = this.mLevel.mLightSet;

    // World Bounds
    var centerPos = vec2.fromValues(this.mLevel.mCameraCenter[0], this.mLevel.mCameraCenter[1]);
    var width = 300;
    var height = 210;

    // camera
    this.mCamera = new Camera(
        centerPos, // position of the camera
        width,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0, 0, 0, 1]);

    this.mLevel.setActiveCamera(this.mCamera);

    // Hobbes
    this.mHobbes = new Hobbes(this.kHobbesSpriteSheet, this.mLevel.mPlayerSpawn[0], this.mLevel.mPlayerSpawn[1]);
    // Hobbes' health bar
    this.mHobbesHealthBar = new HealthBar(
        vec2.fromValues(-135, 60),
        2,
        20,
        "vertical",
        this.mHobbes
    );

    // Object set
    this.mObjects = new GameObjectSet();

    // add all objects of the boss level to objects
    this.mObjects.appendSet(this.mLevel.mPlatforms);

    this.mObjects.addToSet(this.mHobbes);
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
       this.mMinions.addToSet(m); 
    }
    
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();

    this.mLevel.mBackgroundRenderable.draw(this.mCamera);
    
    this.mObjects.draw(this.mCamera);
    this.mMinions.draw(this.mCamera);
    this.mSquirtGunShots.draw(this.mCamera);
    // Health bar
    this.mHobbesHealthBar.draw(this.mCamera);
};

MyGame.prototype.update = function () {

    this.mCamera.update();  // to ensure proper interpolated movement effects
    this.mLevel.update();

    if (this.mHobbes.update(
        this.mLevel.mPlatforms, this.mMinions, this.mSquirtGunShots,
        this.kSquirtGunShotSprite, this.kWaterBalloonSprite)) {
        this.mNextScene = new GameOver();
        gEngine.GameLoop.stop();   
    }

    this.mLevel.mTrackedLight.set2DPosition(this.mHobbes.getXform().getPosition());
    
    this.mMinions.update(this.mCamera, this.mHobbes);
    this.mSquirtGunShots.update(this.mCamera);

    gEngine.Physics.processCollision(this.mObjects, []);
    
    // process collisions
    for (var i = 0; i < this.mSquirtGunShots.size(); ++i) {
        var shot = this.mSquirtGunShots.getObjectAt(i);
        for (var j = 0; j < this.mMinions.size(); ++j) {
            var minion = this.mMinions.getObjectAt(j);
            if (shot.pixelTouches(minion, [])) {
                // call minion onhit and update its health
                minion.onHit(shot);
                // and then call shot on hit and set it to dead so that it will be removed later on
                shot.onHit(minion);
            }
        }
        // or if they collide with the bounding boxes of the world
        for(var j = 0; j < this.mLevel.mPlatforms.size(); j++)
        {
            var platform = this.mLevel.mPlatforms.getObjectAt(j);
            // check for a hit and remove the squirt gun shot if it was hit
            if(shot.pixelTouches(platform, []))
            {
                // call shot on hit and set it to dead so that it will be removed later on
                // don't need to call hit on the platform because that is not a hittable game object
                shot.onHit(platform);
            }
        }
    }

    // for all water balloons process their splash damage



    // remove all of the dead minions

    // remove all of the dead water shots and water balloons
    // list of all of the objects that need to be removed
    var toRemove = [ ];
    for(var i = 0; i < this.mSquirtGunShots.size(); i++)
    {
        var current = this.mSquirtGunShots.getObjectAt(i);
        if(current.isDead())
        {
            toRemove.push(current);
        }
    }
    // now actually remove the items
    for(var i = 0; i < toRemove; i++)
    {
        this.mSquirtGunShots.removeFromSet(toRemove[i]);
    }

    
    // Process
    if(this.mMinions.size() <= 0) {
        this.mNextScene = new WinScreen();
        gEngine.GameLoop.stop();
    }
    // If Hobbes goes out of the world bounds, game over
    if (this.mLevel.mWorldBounds.outsideBounds(this.mHobbes)) {
        this.mNextScene = new GameOver();
        gEngine.GameLoop.stop();
    }
    
    this.mHobbesHealthBar.update(this.mCamera);
};
