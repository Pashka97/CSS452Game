/**
 * BossLevel
 *
 * This defines the (somewhat placeholder) boss level for the playtest demo
 */

"use strict";

function BossLevel()
{
    Level.call(this);

    // tile sprites
    this.kTile128 = "assets/tile128x128.png";
    this.kTile256 = "assets/tile256x256.png";
    this.kTile256x128 = "assets/tile256x128.png";
    this.kBackground = "assets/background_circuits.png";
    this.kBackgroundNormal = "assets/background_circuits_normal.png";

    // set the camera center
    this.setCameraCenterXY(150, 105);
    this.setWorldBounds(vec2.fromValues(150, 105), 300, 210);

    // set the background to use a normal map
    this.setBackgroundNormalMap(this.kBackground, this.kBackgroundNormal);
    this.mBackgroundFixedToCamera = true;

    // create a red light in the pits
    this.mTrackedLight = new Light();
    this.mTrackedLight.setColor([1, 0, 0, 1]);
    this.mTrackedLight.set2DPosition([45, 5]);
    this.mTrackedLight.setZPos(5);
    this.mTrackedLight.setDirection(vec3.fromValues(0, 1, -0.5));
    this.mTrackedLight.setLightType(Light.eLightType.ePointLight);
    this.mTrackedLight.setNear(1);
    this.mTrackedLight.setFar(20);
    this.mTrackedLight.setDropOff(1);
    this.mTrackedLight.setIntensity(10);

    this.addLight(
        this.mTrackedLight
    );

    // set the spawnpoint
    this.setPlayerSpawnXY(175, 90);

    // add the borders

    this.addPlatform(new Platform(
        this.kTile256x128, 150, 207.5, 288, 5, 0
    ));

    this.addPlatform(new Platform(
        this.kTile256, 2.5, 135, 5, 150, 0
    ));
    this.addPlatform(new Platform(
        this.kTile256, 297.5, 135, 5, 150, 0
    ));

    this.addPlatform(new Platform(
        this.kTile256x128, 45, 55, 10, 5, 0
    ));
    this.addPlatform(new Platform(
        this.kTile256x128, 105, 55, 10, 5, 0
    ));
    this.addPlatform(new Platform(
        this.kTile256x128, 195, 55, 10, 5, 0
    ));
    this.addPlatform(new Platform(
        this.kTile256x128, 255, 55, 10, 5, 0
    ));

    // add the side platforms
    this.addPlatform(new Platform(
        this.kTile256x128, 22.5, 87.5, 7.5, 5, 0
    ));
    this.addPlatform(new Platform(
        this.kTile256x128, 22.5, 60 + 87.5, 7.5, 5, 0
    ));

    this.addPlatform(new Platform(
        this.kTile256x128, 285, 87.5, 7.5, 5, 0
    ));
    this.addPlatform(new Platform(
        this.kTile256x128, 285, 60 + 87.5, 7.5, 5, 0
    ));

    // add some center platforms
    this.addPlatform(new Platform(
        this.kTile256x128, 90, 120, 60, 5, 0
    ));
    this.addPlatform(new Platform(
        this.kTile256x128, 210, 120, 60, 5, 0
    ));

    // top platforms
    this.addPlatform(new Platform(
        this.kTile256x128, 45, 180, 30, 5, 0
    ));

    this.addPlatform(new Platform(
        this.kTile256x128, 300 - 45, 180, 30, 5, 0
    ));

    // floor bottom most layer
    this.addPlatform(
        new Platform(
        this.kTile256,
        15, 15, // x y
        30, 30, // width, height
        0 // rot
        )
    );
    this.addPlatform(
        new Platform(
        this.kTile256,
        75, 15, // x y
        30, 30, // width, height
        0 // rot
        )
    );
    this.addPlatform(
        new Platform(
        this.kTile256,
        135, 15, // x y
        30, 30, // width, height
        0 // rot
        )
    );
    this.addPlatform(
        new Platform(
        this.kTile256,
        165, 15, // x y
        30, 30, // width, height
        0 // rot
        )
    );
    this.addPlatform(
        new Platform(
        this.kTile256,
        225, 15, // x y
        30, 30, // width, height
        0 // rot
        )
    );
    this.addPlatform(
        new Platform(
        this.kTile256,
        285, 15, // x y
        30, 30, // width, height
        0 // rot
        )
    );

    // floor next layer
    // this is why I can not wait to get the level parsing implemented
    this.addPlatform(
        new Platform(
        this.kTile256,
        15, 45, // x y
        30, 30, // width, height
        0 // rot
        )
    );
    this.addPlatform(
        new Platform(
        this.kTile256,
        75, 45, // x y
        30, 30, // width, height
        0 // rot
        )
    );
    this.addPlatform(
        new Platform(
        this.kTile256,
        135, 45, // x y
        30, 30, // width, height
        0 // rot
        )
    );
    this.addPlatform(
        new Platform(
        this.kTile256,
        165, 45, // x y
        30, 30, // width, height
        0 // rot
        )
    );
    this.addPlatform(
        new Platform(
        this.kTile256,
        225, 45, // x y
        30, 30, // width, height
        0 // rot
        )
    );
    this.addPlatform(
        new Platform(
        this.kTile256,
        285, 45, // x y
        30, 30, // width, height
        0 // rot
        )
    );

};

gEngine.Core.inheritPrototype(BossLevel, Level);

BossLevel.prototype.update = function()
{
    Level.prototype.update.call(this);
};