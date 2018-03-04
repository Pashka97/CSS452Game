/*
 * Handles displaying a character's health in a meter. The character
 * object must provide a getHealth() method.
 */
/* global vec2: false */
"use strict";

function HealthBar(relPos, width, height, character) {
    // Position relative to camera center position
    this.mRelPos = relPos;
    // Character to follow
    this.mCharacter = character;
    // Black rectangle for background
    this.mBackground = new Renderable();
    var xform = this.mBackground.getXform();
    xform.setSize(width, height);
    this.mBackground.setColor([0, 0, 0, 1]);
    // Set up meter bars
    this.mBars = [];
    // Width of bar: 2/3 of meter width
    var barWidth = 2/3 * width;
    // Height of bar:
    // (meter height - ( 1/6 of meter width * ( maxHealth + 1 ) ) ) / maxHealth
    var maxHealth = this.mCharacter.getHealth();
    this.mBarHeight = (height - (1/6 * width * (maxHealth + 1))) / maxHealth;
    for (var i = 0; i < this.mCharacter.getHealth(); ++i) {
        var bar = new Renderable();
        xform = bar.getXform();
        xform.setSize(barWidth, this.mBarHeight);
        bar.setColor([0, 1, 0, 1]);
        this.mBars.push(bar);
    }
}

HealthBar.prototype.draw = function (camera) {
    // Background
    this.mBackground.draw(camera);
    // Bars
    for (var i = 0; i < this.mCharacter.getHealth(); ++i) {
        this.mBars[i].draw(camera);
    }
};

HealthBar.prototype.update = function(camera) {
    // Update positions of Renderables
    var xform = this.mBackground.getXform();
    var cameraPos = camera.getWCCenter();
    var xPos = cameraPos[0] + this.mRelPos[0];
    var yPos = cameraPos[1] + this.mRelPos[1];
    xform.setPosition(xPos, yPos);
    // For bars, start at the bottom of the background and work up
    var gap = xform.getWidth() / 6;
    yPos -= (xform.getHeight() / 2);
    yPos += gap + (this.mBarHeight / 2);
    var currentPos = vec2.fromValues(xPos, yPos);
    for (var i = 0; i < this.mBars.length; ++i) {
        xform = this.mBars[i].getXform();
        xform.setPosition(currentPos[0], currentPos[1]);
        // Increment position
        currentPos[1] += this.mBarHeight + gap;
    }
};