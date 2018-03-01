/* 
 *Platform object
 *  -used to represent simple platforms as a texture surrounded by a rigid body
 *  -Platform is a physics object with a mass of 0 making it immovable
 *  -child of gameObject
 *  -TODO: Time permitted replace rigid body with bounding box to allow player
 *         jump through platforms
 */
"use strict"; 
/*
 * @param spriteTexture: is the location of the platforms texture
 * @param x: x coordinate in world coordinates
 * @param y: y coordinate in world coordinates
 * @param w: width in world coordinates
 * @param rot: rotation of platform in degrees
 * @note: x and y coordinates are for the bottom left corner of the platform
 * Platform also has a height equal to 1/8 of the width
 */
function Platform(spriteTexture, x, y, w, rot) {
    
    var h = w / 8;
    this.pf = new TextureRenderable(spriteTexture);
    var xf = this.pf.getXform();
    xf.setSize(w, h);
    xf.setPosition(x, y);
    xf.setRotationInDegree(rot);
    
    GameObject.call(this, this.pf);
    
    var r = new RigidRectangle(xf, w, h);
        r.setMass(0);
    this.setRigidBody(r);
    //this.toggleDrawRenderable();
    //this.toggleDrawRigidShape();
   
    
}
gEngine.Core.inheritPrototype(Platform, GameObject);

Platform.prototype.update = function () {
    GameObject.prototype.update.call(this);
};