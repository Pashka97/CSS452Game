/* global gEngine: false, GameObject: false, SpriteAnimateRenderable: false,
   vec2: false, BoundingBox: false */
"use strict";

function Hobbes(spriteSheet, posX, posY) {

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
    
    var rigidBody = new RigidRectangle(this.getXform(), width / 2, height);
    this.setRigidBody(rigidBody);
    //this.toggleDrawRenderable();
    //this.toggleDrawRigidShape();
    
    this.mBoundBox = new BoundingBox(
        vec2.fromValues(posX, posY),
        width / 2,
        height
    );
    
    // Status flags
    // standing on a Platform (being "on the ground")
    this.mOnGround = false;
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
}
gEngine.Core.inheritPrototype(Hobbes, GameObject);

Hobbes.prototype._setOnGroundState = function(platformSet) {
    for (var i = 0; i < platformSet.size(); ++i) {
        var status = this.mBoundBox.boundCollideStatus(
                         platformSet.getObjectAt(i).getBBox()
                     );
        if (status & BoundingBox.eboundCollideStatus.eCollideBottom) {
            this.mOnGround = true;
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

Hobbes.prototype.update = function(platformSet) {
    // Check if hobbes is on ground by checking collisions with Platforms
    this._setOnGroundState(platformSet);
    
    // Left and right arrow keys for movement
    this.mPrevLeftWalking = this.mLeftWalking;
    this.mPrevRightWalking = this.mRightWalking;
    var delta = 0.5;
    var xform = this.getXform();
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
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
    else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
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
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Up) &&
        this.mOnGround) {
        var velocity = this.mRigidBody.getVelocity();
        velocity[1] = 25;
        this.mOnGround = false;
    }
    
    this.mRigidBody.setAngularVelocity(0);
    GameObject.prototype.update.call(this);
    
    // Bounding box
    this.mBoundBox.setPosition(xform.getPosition());
    // Update sprite
    this._setSprite();
    this.mRen.updateAnimation();
};