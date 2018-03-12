/* global gEngine: false, GameObject: false, SpriteAnimateRenderable: false,
   vec2: false, BoundingBox: false */
"use strict";

function Hobbes(spriteSheet, posX, posY) {

    // Hit Points
    this.mHP = 3;
    
    this.damageTimer = null;
    this.mInvincible = false;
    
    this.mRen = new SpriteAnimateRenderable(spriteSheet);
    this.mRen.setColor([1, 1, 1, 0]);
    this.mRen.getXform().setPosition(posX, posY);
    var width = 10;
    var height = 20;
    this.mRen.getXform().setSize(width, height);
    this.mRen.setSpriteSequence(256, 0, 32, 64, 0, 0);
    this.mRen.setAnimationType(
        SpriteAnimateRenderable.eAnimationType.eAnimateRight
    );
    this.mRen.setAnimationSpeed(15);

    GameObject.call(this, this.mRen);
    
    // Rigid body
    // Width and height of rigid body
    var mainRBWidth = width / 2;
    var mainRBHeight = height;
    // Rigid body
    var mainRB = new RigidRectangle(this.getXform(), mainRBWidth, mainRBHeight);
    mainRB.setRestitution(0);
    this.addRigidBody(mainRB);
    
    // Bounding box: hitbox for collision with enemies
    this.mBoundBox = new BoundingBox(
        vec2.fromValues(posX, posY),
        width / 2,
        height
    );
    // Bounding box for floor collision
    var floorBBoxWidth = width - 7;
    var floorBBoxHeight = .15;
    this.mFloorBBox = new BoundingBox(
        vec2.fromValues(posX, posY - (height / 2)),
        floorBBoxWidth,
        floorBBoxHeight
    );
    
    // Status flags
    // standing on a Platform (being "on the ground")
    this.mOnGround = false;
    this.mJumpTime = null;
    this.mNumJumps = 0;
    
    // Facing left or right
    this.eFacing = Object.freeze({
        left:0,
        right:1
    });
    this.mFacing = this.eFacing.left;
    // Walking
    this.mPrevLeftWalking = false;
    this.mPrevRightWalking = false;
    this.mLeftWalking = false;
    this.mRightWalking = false;
    
    //Water balloon and timer
    this.mHasBalloon = true;
    this.balloonTimer = null;
    this.squirtGunTimer = 0;
}
gEngine.Core.inheritPrototype(Hobbes, GameObject);

Hobbes.prototype.getHealth = function () {
    return this.mHP;
};

Hobbes.prototype._setOnGroundState = function(platformSet) {
    for (var i = 0; i < platformSet.size(); ++i) {
        if (this.mFloorBBox.intersectsBound(platformSet.getObjectAt(i).getBBox())) {
            this.mOnGround = true;
            this.mNumJumps = 0;
            var velocity = this.mRigidBodies[0].getVelocity();
            velocity[1] = 0;
            return;
        }
    }
    // Test failed, not on a Platform
    this.mOnGround = false;
};

// Sets which sprite or animated sequence to use on the sprite sheet
Hobbes.prototype._setSprite = function() {
    switch (this.mFacing) {
        case this.eFacing.left:
            if (this.mOnGround) {
                if (this.mLeftWalking) {
                    // Left walking (only set if not previously walking)
                    if (!this.mPrevLeftWalking) {
                        this.mRen.setSpriteSequence(255, 0, 32, 64, 2, 0);
                    }
                }
                else {
                    // Left standing
                    this.mRen.setSpriteSequence(255, 0, 32, 64, 0, 0);
                }
            }
            else {
                // Left jumping
                this.mRen.setSpriteSequence(127, 0, 32, 64, 0, 0);
            }
            break;
        case this.eFacing.right:
            if (this.mOnGround) {
                if (this.mRightWalking) {
                    // Right walking (only set if not previously walking)
                    if (!this.mPrevRightWalking) {
                        this.mRen.setSpriteSequence(191, 0, 32, 64, 2, 0);
                    }
                }
                else {
                    // Right standing
                    this.mRen.setSpriteSequence(191, 0, 32, 64, 0, 0);
                }
            }
            else {
                // Right jumping
                this.mRen.setSpriteSequence(127, 32, 32, 64, 0, 0);
            }
            break;
        default:
            return;
    }
};

Hobbes.prototype.registerDamage = function () {
    this.mHP--;
    this.damageTimer = Date.now();
    this.mInvincible = true;
    this.mRen.setColor([1, 0, 0, .5]);
};

Hobbes.prototype.update = function(
    platformSet, enemySet, 
    squirtGunShots, squirtGunShotSprite, waterBalloonSprite) {
    // Check if Hobbes is on ground by checking collisions with Platforms
    this._setOnGroundState(platformSet);
    
    // Left and right arrow keys for movement
    this.mPrevLeftWalking = this.mLeftWalking;
    this.mPrevRightWalking = this.mRightWalking;
    var delta = 0.5;
    var xform = this.getXform();
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
        xform.incXPosBy(-delta);
        if (this.mOnGround) {
            this.mLeftWalking = true; 
        }
        else {
            this.mLeftWalking = false;
        }
        this.mRightWalking = false;
        this.mFacing = this.eFacing.left;
    }
    else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        xform.incXPosBy(delta);
        if (this.mOnGround) {
            this.mRightWalking = true;
        }
        else {
            this.mRightWalking = false;
        }
        this.mLeftWalking = false;
        this.mFacing = this.eFacing.right;
    }
    else {
        this.mLeftWalking = false;
        this.mRightWalking = false;
    }
    // Up arrow key for jump
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space) &&
        (this.mOnGround || (!this.mOnGround && this.mNumJumps === 1))) {
        var velocity = this.mRigidBodies[0].getVelocity();
        velocity[1] = 45;
        this.mOnGround = false;
        this.mNumJumps++;
        this.mJumpTime = Date.now();
    }
    
    this.mRigidBodies[0].setAngularVelocity(0);
    GameObject.prototype.update.call(this);
    
    // Check for turning invincibility time over
    if(this.mInvincible) {
        var currentTime = Date.now();
        if(currentTime - this.damageTimer > 2000)   {
            this.mInvincible = false;
            this.mRen.setColor([1, 1, 1, 0]);
        }
    }
    
    for(var i = 0; i < enemySet.size(); i++) {
        if (this.pixelTouches(enemySet.getObjectAt(i), [])) {
            if (!this.mInvincible) {
                this.registerDamage();
            }
            enemySet.getObjectAt(i).bounceBack();
        }
    }
    
    // Fire squirt gun shots
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.J)) {

        if(Date.now() - this.squirtGunTimer >= 150) {
            this.squirtGunTimer = Date.now();
            if (this.mFacing === this.eFacing.left) {
                var xPos = this.getXform().getPosition()[0] - 5;
                var yPos = this.getXform().getPosition()[1] +
                    (this.getXform().getHeight() / 4);
                var shot = new SquirtGunShot(
                    squirtGunShotSprite, xPos, yPos, true);
                squirtGunShots.addToSet(shot);
            }
            else { // facing right
                var xPos = this.getXform().getPosition()[0] + 5;
                var yPos = this.getXform().getPosition()[1] +
                    (this.getXform().getHeight() / 4);
                var shot = new SquirtGunShot(
                    squirtGunShotSprite, xPos, yPos, false);
                squirtGunShots.addToSet(shot);
            }
        }
    }
    
    // Throw water balloon
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.K))   {
        if(this.mHasBalloon) {
            if (this.mFacing === this.eFacing.left) {
                var xPos = this.getXform().getPosition()[0] - 5;
                var yPos = this.getXform().getPosition()[1] +
                           (this.getXform().getHeight() / 4);
                var shot = new WaterBalloon(
                        waterBalloonSprite, xPos, yPos, true);
                squirtGunShots.addToSet(shot);
            }
            else { //facing right
                var xPos = this.getXform().getPosition()[0] + 5;
                var yPos = this.getXform().getPosition()[1] +
                           (this.getXform().getHeight() / 4);
                var shot = new WaterBalloon(
                        waterBalloonSprite, xPos, yPos, false);
                squirtGunShots.addToSet(shot);
            }
            this.balloonTimer = Date.now();
            this.mHasBalloon = false;
        }
    }
    
    // Check if Balloon is ready
    if(!this.mHasBalloon) {
        if(Date.now() - this.balloonTimer >= 3000) {
            this.mHasBalloon = true;
        }
    }
    
    // Update sprite
    this._setSprite();
    this.mRen.updateAnimation();
    
    // If Hobbes is falling, increase speed at a smooth rate
    // until you reach terminal velocity
    if(this.mOnGround === false && this.mJumpTime !== null) {
        xform.incYPosBy(((Date.now() - this.mJumpTime)/3000) * -1.3);
    }
    
    // Bounding boxes
    var position = xform.getPosition();
    this.mBoundBox.setPosition(position);
    var floorXpos = position[0];
    var floorYpos = position[1] - (xform.getHeight() / 2);
    this.mFloorBBox.setPosition(vec2.fromValues(floorXpos, floorYpos));
    
    // Return true if Hobbes is dead
    if (this.mHP <= 0) {
        return true;
    }
    else {
        return false;
    }
};