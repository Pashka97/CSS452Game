/**
 * Projectile class
 *
 * A generic class that can collide with another class
 *
 * Adds the interface for onHit and isDead
 */

"use strict";

/**
 * Constructor
 * Sets the initial value of the is dead and is hit values to be both false
 *
 * @param renderable {Renderable} The renderable object to pass on to the game object
 * @constructor
 */
function Projectile(renderable)
{
    this.mIsDead = false;
    this.mIsHit = false;
};

gEngine.Core.inheritPrototype(Projectile, GameObject);

/**
 * Is the object dead? If so, then this object should be removed from the set of objects.
 * @returns {boolean}
 */
Projectile.prototype.isDead = function()
{
    return this.mIsDead;
};

/**
 * Has the object been hit? If so, do something
 * @returns {boolean}
 */
Projectile.prototype.isHit = function()
{
    return this.mIsHit;
};

/**
 * This function should be called when the projectile hits something
 * @parm collided The object that this object has collided with
 */
Projectile.prototype.onHit = function(collided)
{
    // default to doing nothing, let each object that subclasses this type deal with the implementation
    this.mIsHit = true;
};
