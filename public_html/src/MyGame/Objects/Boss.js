/* global gEngine: false, GameObject: false, SpriteAnimateRenderable: false,
   vec2: false, BoundingBox: false */
"use strict";

/*
 * Class: Boss.js
 * 
 * -generic class to represent our boss
 * If you want to add more states use the addState() method which takes a state
 * function as the parameter
 * It is important that the method updates nextState and sets it to the what the
 * next state should be
 * 
 * @param spriteSheet: bosses spritesheet used for animations
 * @param posX: posX in world coordinates
 * @param posY: posY in world coordinates
 * @param hp: the hp the boss has
 *** NOTE: Child classes should override _setSprite() method
 */
function Boss(spriteSheet, posX, posY, hp) {
    this.mTimer = 0;
    this.mEventTime = 0;
    
    this.mState = 0;
    this.mNextState = 0;
    this.mPastState = -1;
    
    // Hit Points
    this.mMaxHP = hp;
    this.mHP = hp;

    // Boss I-frames
    this.mDamageTimer = null;
    this.mInvincible = false;
    
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
    ren.setAnimationSpeed(5);
    
    GameObject.call(this, ren);
    
    // Bounding Box
    this.mBoundBox = new BoundingBox(
        vec2.fromValues(posX, posY),
        width / 2,
        height
    );
}
gEngine.Core.inheritPrototype(Boss, GameObject);

// Sets which sprite or animated sequence to use on the sprite sheet
//Prolly want to rewrite manually for each boss
Boss.prototype._setSprite = function() {
    //Override in child classes
};

//Register that the boss has taken damage
Boss.prototype.registerDamage = function(damageTaken) {
    if (!this.mInvincible) {
        this.mHP -= damageTaken;
        this.mDamageTimer = Date.now();
        this.mInvincible = true;
        this.mRen.setColor([1, 0, 0, .5]);
    }
};

Boss.prototype.setNextState = function(state) {
    this.mNextState = state;
};

Boss.prototype.setState = function(state) {
    this.mCurrentState = state;
};

Boss.prototype.setEventTime = function(seconds) {
    this.mEventTime = this.mTimer + (seconds * 60);
};

Boss.prototype.isDead = function() {
    return this.mHP <= 0;
};

Boss.prototype.getHealth = function() {
  return this.mHP;  
};
