/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function SquirtGunShot(sprite, posX, posY, left) {
    this.mRen = new SpriteRenderable(sprite);
    this.mRen.setColor([1, 1, 1, 0]);
    this.mRen.getXform().setPosition(posX, posY);
    var width = 2;
    var height = 1;
    this.mRen.getXform().setSize(width, height);
    this.mRen.setElementPixelPositions(0, 31, 0, 15);
    
    //Simulate Water Particles
    this.mParticles = null;
    this.mParticles = new ParticleGameObjectSet();
    this.mParticles.addEmitterAt(
            this.mRen.getXform().getPosition(), 20, 
    this.createParticle);
    this.mParticles.update();
    
    
    Projectile.call(this, this.mRen);
    
    // Whether the shot is traveling left or right
    this.mLeft = left;
}
gEngine.Core.inheritPrototype(SquirtGunShot, Projectile);

SquirtGunShot.prototype.update = function() {
    var delta = 1.5;
    if (this.mLeft) {
        this.getXform().incXPosBy(-delta);
    } else {
        this.getXform().incXPosBy(delta);
    }
    this.mParticles.update();
};

SquirtGunShot.prototype.createParticle = function(atX, atY) {
    var life = 50;
    var p = new ParticleGameObject("assets/particle.png", atX, atY, life);
    p.getRenderable().setColor([0, 0, 1, 1]);
    
    // size of the particle
    var r = 1;
    p.getXform().setSize(r, r);
    
    // final color
    //var fr = 3.5 + Math.random();
    //var fg = 0.4 + 0.1 * Math.random();
    //var fb = 0.3 + 0.1 * Math.random();
    p.setFinalColor([0, 0, 1, 0.6]);
    
    // velocity on the particle
    var fx = 10 * Math.random() - 20 * Math.random();
    var fy = 10 * Math.random();
    p.getParticle().setVelocity([fx, fy]);
    
    // size delta
    p.setSizeDelta(0.98);
    
    return p;
};

// must override draw to draw the particles when there are there
SquirtGunShot.prototype.draw = function(aCamera) {
    // draw the projectile only if it has some interesting speed
    if (this.mParticles !== null) {
        this.mParticles.draw(aCamera);
    }
    this.mRen.draw(aCamera);
};

/**
 * Called when the squirt gun shot collides with another object
 * @param collided
 */
SquirtGunShot.prototype.onHit = function(collided)
{
    Projectile.prototype.onHit.call(this, collided);

    gEngine.Logger.info('squirt gun shot hit');
};