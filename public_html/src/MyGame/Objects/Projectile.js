/* File: Projectile.js 
 *
 * Creates and initializes a simple DyePack
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, Renderable, vec2, BoundingBox, NonPhysicsGameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

Projectile.kSpeed = 100 / (0.8 * 60);
        // across the entire screen in 0.5 seconds
        
Projectile.kTexture = null;

function Projectile(x, y) {
    this.kRefWidth = 1.5;
    this.kRefHeight = 1.5;
            
    this.kDetectThreshold = 10;
    this.kChaseThreshold = 2 * this.kDetectThreshold;
    
    var r = new TextureRenderable(Projectile.kTexture);
    r.setColor([0.8, 1, 0.8, 0.1]);
    r.getXform().setPosition(x, y);
    r.getXform().setSize(this.kRefWidth, this.kRefHeight);
    GameObject.call(this, r);
    
    this.setCurrentFrontDir([1, 0]);
    this.setSpeed(Projectile.kSpeed);
    
    // Expired to remove
    this.mExpired = false;
    this.mParticles = null;
}
gEngine.Core.inheritPrototype(Projectile, NonPhysicsGameObject);

Projectile.prototype.setExpired = function(hit) {
    this.mExpired = true;
    
    // create an emitter to start emitting particles
    if (hit) {
        this.mParticles = new ParticleGameObjectSet();
        this.mParticles.addEmitterAt(
                this.getXform().getPosition(), 200, 
        this.createParticle);
        this.mParticles.update(); // start emit immediately
    }
};

Projectile.prototype.hasExpired = function() {
    return ((this.mExpired) && (this.mParticles === null));
};

Projectile.prototype.update = function(dyes, aCamera) {
    NonPhysicsGameObject.prototype.update.call(this);
    
    if (this.mExpired) {
        this.setSpeed(this.getSpeed() * 0.7); // slow down the projectile
        // check and update the particle system
        if (this.mParticles !== null) {
            this.mParticles.update();  // this will remove expired particles
            if (this.mParticles.size() === 0) // all gone
                this.mParticles = null;
        }
        return;
    }
    var hit = false;
    
    if (aCamera.collideWCBound(this.getXform(), 1.1) !== 
            BoundingBox.eboundCollideStatus.eInside)
            this.setExpired(false);
    
    var i, obj;
    var p = vec2.fromValues(0, 0);
    for (i=0; i<dyes.size(); i++) {
        obj = dyes.getObjectAt(i);
        if (this.pixelTouches(obj, p)) {
            this.setExpired(true);
            obj.setExpired();
            hit = true;
        }
    }
    
    return hit;
};

Projectile.prototype.createParticle = function(atX, atY) {
    var life = 30 + Math.random() * 200;
    var p = new ParticleGameObject("assets/particle.png", atX, atY, life);
    p.getRenderable().setColor([1, 0, 0, 1]);
    
    // size of the particle
    var r = 3.5 + Math.random() * 2.5;
    p.getXform().setSize(r, r);
    
    // final color
    var fr = 3.5 + Math.random();
    var fg = 0.4 + 0.1 * Math.random();
    var fb = 0.3 + 0.1 * Math.random();
    p.setFinalColor([fr, fg, fb, 0.6]);
    
    // velocity on the particle
    var fx = 10 * Math.random() - 20 * Math.random();
    var fy = 10 * Math.random();
    p.getParticle().setVelocity([fx, fy]);
    
    // size delta
    p.setSizeDelta(0.98);
    
    return p;
};

// must override draw to draw the particles when there are there
Projectile.prototype.draw = function(aCamera) {
    // draw the projectile only if it has some interesting speed
    if (this.mParticles !== null) {
        this.mParticles.draw(aCamera);
        if (this.getSpeed() > 2)
            NonPhysicsGameObject.prototype.draw.call(this, aCamera);
    } else
        NonPhysicsGameObject.prototype.draw.call(this, aCamera);
};