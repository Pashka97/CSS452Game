/* File: Hero.js 
 *
 * Creates and initializes the Hero (Dye)
 * overrides the update function of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, LightRenderable, vec2,NonPhysicsGameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Hero(spriteTexture, aPath, atX, atY) {
    this.kDelta = 0.6;
    
    this.mDye = new SpriteRenderable(spriteTexture);
    this.mDye.setColor([1, 1, 1, 0]);
    this.mDye.getXform().setPosition(atX, atY);
    this.mDye.getXform().setZPos(5);
    this.mDye.getXform().setSize(9, 12);
    this.mDye.setElementPixelPositions(0, 120, 0, 180);
    NonPhysicsGameObject.call(this, this.mDye);
    
    // Support for following the path
    this.mPath = aPath;
    this.mPathIndex = 0;
    this.mCurrentPathLength = 0;
    this.mCurrentStartPos = null;
    this._stopMovement();
    
    // Cover line segment in x-seconds
    this.mCoverInSeconds = 2;
    this.mHit = 0;
    this.mNumDestroy = 0;
    
    // Projectiles that the hero can shoot
    this.mProjectiles = new ProjectileSet();
}
gEngine.Core.inheritPrototype(Hero, NonPhysicsGameObject);


Hero.prototype.update = function(dyePackSet, aCamera) {
    this._moveByKeys(); // for now
    
    // adjust per-segment speed
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up))
        this.mCoverInSeconds -= this.kDelta;
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down))
        this.mCoverInSeconds += this.kDelta;
    
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        this.mProjectiles.newAt(this.getXform().getPosition());
    }
    
    // update Projectile
    var num = this.mProjectiles.update(dyePackSet, aCamera);
    this.mNumDestroy += num; 
    
    // update hero path
    this._updatePath();
};


Hero.prototype.draw = function(aCamera) {
    GameObject.prototype.draw.call(this, aCamera);
    this.mProjectiles.draw(aCamera);
};


Hero.prototype.hitOnce = function() {
    this.mHit++;
};

Hero.prototype.getStatus = function(){
    return  "Hero Hit: " + this.mHit + 
            "  Num Destroy: " + this.mNumDestroy +
            "  Projectile: " + this.mProjectiles.size();
};

Hero.prototype._moveByKeys = function() {
    var xf = this.getXform();
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.W))
        xf.incYPosBy(this.kDelta);
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A))
        xf.incXPosBy(-this.kDelta);
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S))
        xf.incYPosBy(-this.kDelta);
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D))
        xf.incXPosBy(this.kDelta);
};