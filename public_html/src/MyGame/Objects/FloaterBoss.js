/* global gEngine: false, GameObject: false, SpriteAnimateRenderable: false,
   vec2: false, BoundingBox: false, Boss: false */
"use strict";

function FloaterBoss(spriteSheet, posX, posY, initialState) {
    this.mTimer = 0;
    this.mEventTime = 0;
    this.mOGX = posX;
    this.mOGY = posY;
    this.mOGSpeed = .6;
    
    this.mSpeed = .6;
    
    // Hit Points
    this.mMaxHP = 150;
    this.mHP = this.mMaxHP;
    
    // I-frames
    this.mDamageTimer = null;
    this.mInvincible = false;
    
    this.eDirs = Object.freeze({
        idle:0,
        left:1,
        right:2
    });
    
    this.eStates = Object.freeze({
        idle:0,
        setUpLeftDive:1,
        leftDive:2,
        setUpRightDive:3,
        rightDive:4,
        spawnMinions:5
    });
    
    this.mState = initialState;
    this.mNextState = initialState;
    this.mPastState = -1;
    
    this.mDir = this.eDirs.idle;
    this.mPrevDir = -1;
    
    // Renderable
    var ren = new SpriteAnimateRenderable(spriteSheet);
    ren.setColor([1, 1, 1, 0]);
    ren.getXform().setPosition(posX, posY);
    var width = 10;
    var height = 20;
    ren.getXform().setSize(width, height);
    // Default, might want to change this
    ren.setSpriteSequence(256, 0, 32, 64, 0, 0);
    ren.setAnimationType(
        SpriteAnimateRenderable.eAnimationType.eAnimateRight
    );
    ren.setAnimationSpeed(8);
    GameObject.call(this, ren);
    
    // Bounding Box
    this.mBoundBox = new BoundingBox(
        vec2.fromValues(posX, posY),
        width / 2,
        height
    );
    
    this.setState(0);
    
    // Standing on a Platform (being "on the ground")
    this.mOnGround = false;
    // Walking
    this.mPrevLeftWalking = false;
    this.mPrevRightWalking = false;
    this.mLeftWalking = false;
    this.mRightWalking = false;
}
gEngine.Core.inheritPrototype(FloaterBoss, GameObject);

FloaterBoss.prototype._setDir = function(dir) {
    this.mPrevDir = this.mDir;
    this.mDir = dir;
};

// Sets which sprite or animated sequence to use on the sprite sheet
FloaterBoss.prototype._setSprite = function() {
    switch (this.mDir) {
        case this.eDirs.idle:
            if (this.mPrevDir !== this.eDirs.idle) {
                this.mRenderComponent.setSpriteSequence(128, 0, 48, 64, 3, 0);
            }
            break;       
        case this.eDirs.left:
            if (this.mPrevDir !== this.eDirs.left) {
                this.mRenderComponent.setSpriteSequence(64, 0, 48, 64, 3, 0);
            }
            break;
        case this.eDirs.right:
            if (this.mPrevDir !== this.eDirs.right) {
                this.mRenderComponent.setSpriteSequence(192, 0, 48, 64, 3, 0);
            }
            break;
        default:
            return;
    }
};

// Register that the boss has taken damage
FloaterBoss.prototype.registerDamage = function(damageTaken) {
    if (!this.mInvincible) {
        this.mHP -= damageTaken;
        this.mDamageTimer = 0;
        this.mInvincible = true;
        this.mRenderComponent.setColor([1, 0, 0, .5]);
    }
};

FloaterBoss.prototype.setNextState = function(state) {
    this.mNextState = state;
};

FloaterBoss.prototype.setState = function(state) {
    this.mState = state;
};

FloaterBoss.prototype.setEventTime = function(seconds) {
    this.mEventTime = this.mTimer + (seconds * 60);
};

FloaterBoss.prototype.isDead = function() {
    return this.mHP <= 0;
};

FloaterBoss.prototype.getHealth = function() {
  return this.mHP;  
};

FloaterBoss.prototype.update = function(minionset, minionSheet, hero) {
    //GameObject.prototype.update.call(this);
    var xform = this.getXform();
    // Bounding box
    this.mBoundBox.setPosition(xform.getPosition());
    
    // Check if the invincibility period should be over
    if (this.mInvincible) {
        this.mDamageTimer++;
        if(this.mDamageTimer >= 30){
            this.mDamageTimer = 0;
            this.mInvincible = false;
            this.mRenderComponent.setColor([1, 1, 1, 0]);
        }
    }
    this.mTimer++;
    this.executeState(minionset, minionSheet, hero);
    this._setSprite();
    this.mRenderComponent.updateAnimation();
};

FloaterBoss.prototype.executeState = function(minionset, minionSheet, hero) {
    if (this.mTimer > this.mEventTime) {
        this.mPastState = this.mState;
        this.mState = this.mNextState;
        this.setEventTime(4);
    }
    switch (this.mState) {
        case this.eStates.idle:
            this.idle();
            break;
        case this.eStates.setUpLeftDive:
            this.setUpLeftDive(hero);
            break;
        case this.eStates.leftDive:
            this.leftDive();
            break;
        case this.eStates.setUpRightDive:
            this.setUpRightDive(hero);
            break;
        case this.eStates.rightDive:
            this.rightDive();
            break;
        case this.eStates.spawnMinions:
            if (this.mState !== this.mPastState) {
                this.mPastState = this.mState;
                this.spawnMinions(this.getXform(), minionset, minionSheet);
            }
            break;
        default:
            break;
    }
};

FloaterBoss.prototype.idle = function() {
    if (this.mSpeed !== this.mOGSpeed) {
        this.mSpeed = this.mOGSpeed;
        this.mRenderComponent.getXform().incRotationByRad(1);
    }
    this.setNextState(this.eStates.spawnMinions);
    this.moveTowards(this.mOGX, this.mOGY);
};

FloaterBoss.prototype.setUpLeftDive = function(hero) {
    if (this.mSpeed !== this.mOGSpeed) {
        this.mSpeed = this.mOGSpeed;
    }
    this._setDir(this.eDirs.left);
    this.setNextState(this.eStates.leftDive);
    this.moveTowards(285, 75);
    //this.moveTowards(hero.getXform().getXPos() + 25, hero.getXform().getYPos());
};

FloaterBoss.prototype.leftDive = function() {
    if (this.mSpeed === this.mOGSpeed) {
        this.mSpeed *= 2;
        this.mRenderComponent.getXform().incRotationByRad(1);
    }
    this.setNextState(this.eStates.setUpRightDive);
    this.moveTowards(15, 75);
    //this.moveTowards(this.getXform().getXPos() - 25, this.getXform().getYPos());
};

FloaterBoss.prototype.setUpRightDive = function(hero) {
    if (this.mSpeed !== this.mOGSpeed) {
        this.mSpeed = this.mOGSpeed;
        this.mRenderComponent.getXform().incRotationByRad(-1);
    }
    this._setDir(this.eDirs.right);
    this.setNextState(this.eStates.rightDive);
    this.moveTowards(15, 135);
    //this.moveTowards(hero.getXform().getXPos() + 25, hero.getXform().getYPos());
};

FloaterBoss.prototype.rightDive = function() {
    if (this.mSpeed === this.mOGSpeed) {
        this.mSpeed *= 2;
        this.mRenderComponent.getXform().incRotationByRad(-1);
    }
    this.setNextState(this.eStates.idle);
    this.moveTowards(285, 135);
    //this.moveTowards(this.getXform().getXPos() + 25, this.getXform().getYPos());
};

FloaterBoss.prototype.spawnMinions = function(xform, minionset, minionSheet) {
    //console.log("Max hp: " + this.maxHP + " Current hp: " + this.mHP);
    for (var i = 0; i < 1 + ((this.mMaxHP - this.mHP) / 5); i++) {
       var xRand = Math.random() * 60;
       var yRand = Math.random() * 40;
       var m = new SphereMinion(minionSheet, (xform.getXPos() - 30) + xRand, xform.getYPos() - 20 + yRand);
       minionset.addToSet(m); 
    }
    this.setNextState(this.eStates.setUpLeftDive);
};

FloaterBoss.prototype.moveTowards = function(x, y) {
    var xform = this.getXform();
    if (xform.getXPos() < x) {
        xform.setXPos(xform.getXPos() + this.mSpeed);
    };
    if (xform.getXPos() > x) {
        xform.setXPos(xform.getXPos() - this.mSpeed);
    };
    if (xform.getYPos() < y) {
        xform.setYPos(xform.getYPos() + this.mSpeed);
    };
    if (xform.getYPos() > y) {
        xform.setYPos(xform.getYPos() - this.mSpeed);
    };
};

FloaterBoss.prototype.bounceBack = function() {
    return;
};