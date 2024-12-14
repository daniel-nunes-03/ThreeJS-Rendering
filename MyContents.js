import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { Plane } from './MyPlane.js';
import { Wall } from './MyWall.js';
import { Painting } from './MyPainting.js';
import { WindowPainting } from './MyWindowPainting.js';
import { Table } from './MyTable.js';
import { Plate } from './MyPlate.js';
import { Cake } from './MyCake.js';
import { Candle } from './MyCandle.js';
import { CandleFlame } from './MyCandleFlame.js';
import { GeneralSpotlight } from './MyGeneralSpotlight.js';
import { CakeSpotlight } from './MyCakeSpotlight.js';
import { PointLight } from './MyPointlight.js';
import { AmbientLight } from './MyAmbientlight.js';
import { Ceiling } from './MyCeiling.js';
import { BeetlePainting } from './MyBeetlePainting.js';
import { Spring } from './MySpring.js';
import { Newspaper } from './MyNewspaper.js';
import { Jar } from './MyJar.js';
import { Flower } from './MyFlower.js';
import { Chair } from './MyChair.js';

/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app;
        this.axis = null;

        // Create plane (floor) instance
        this.plane = new Plane()

        // Create wall (4 "subwalls" in total, to form a squared room) instance
        this.wall = new Wall();

        // Variables for managing window door animation
        this.leftDoorCurrentRotation = Math.PI * 0.8;
        this.rightDoorCurrentRotation = Math.PI * 0.8;
        // Fully open
        this.doorOpenRotation = Math.PI * 0.8;
        // Fully closed
        this.doorClosedRotation = 0;
        this.doorAnimationInProgress = false;
        // Track door state
        this.doorOpen = true;
        // Animation duration (in milliseconds)
        this.animationDuration = 1000;

        // Create window painting instance
        this.windowPainting = new WindowPainting(
            this.wall.wallX,
            this.wall.wallY,
            "textures/window_view_texture_960x538.png"
        );

        // Create spotlight centered on the window painting
        this.createWindowSpotlight();

        // Create ceiling
        this.ceiling = new Ceiling(
            this.wall.wallX,
            this.wall.wallX,
            this.wall.wallY,
            "textures/texture_ceiling_1500x1000.jpg"
        );

        // Painting textures
        this.paintingTextures = [
            "textures/student1_photo.jpg",
            "textures/student2_photo.jpg"
        ];

        // Create painting instances
        this.paintings = this.paintingTextures.map( ( texturePath ) => {
            const painting = new Painting( this.wall.wallX, this.wall.wallY, texturePath );
            return painting;
        });

        // Create the beetle painting
        this.beetlePainting = new BeetlePainting( this.wall.wallX, this.wall.wallY / 2 );

        // Create table instance
        this.table = new Table(
            "textures/tableLeg_stone_texture_479x320.jpg",
            "textures/tableTop_wood_texture_360x480.jpg"
        );

        // Create plate instance
        this.plate = new Plate(
            this.table.legRadius * 2,
            this.table.legRadius * 1.5 / 10,
            "textures/plate_texture_720x481.jpg"
        );

        // Create cake instance
        this.cake = new Cake(
            this.plate.radius * 0.8,
            /*this.plate.height * 1.8,*/
            this.plate.height * 3.96,
            "textures/cake_texture_371x255.png",
            "textures/cake_top_texture_609x404.jpg"
        );

        // Create candle and candle flame instances
        const candleRadius = this.cake.radius * 0.05;
        const candleHeight = this.cake.height * 1 + this.cake.topOffsetY;
        this.candle = new Candle(
            candleRadius,
            candleHeight,
            "textures/candle_texture_360x640.jpg"
        );
        this.candleFlame = new CandleFlame(
            candleRadius * 0.4,
            candleHeight * 0.2,
            "textures/candle_fire_texture_210x769.png"
        );

        // Create spring instance
        this.spring = new Spring(
            0.2,    // Radius of the spring
            0.1,    // Height of each turn
            3       // Number of turns
        );

        // Create newspapper instance
        this.newspaper = new Newspaper(
            "textures/newspapper_texture_480x319.png"
        );

        // Create flower instance
        this.flower = new Flower();

        // Create jar instance
        this.jar = new Jar();

        // Create chair instance
        this.chair = new Chair( "textures/frame_wood_texture_120x69.png" );

        // Create general spotlight instance
        //this.generalSpotlight = new GeneralSpotlight( "#ffffff", 18, { x: 0, y: 10, z: 0 } );
        //this.generalSpotlight = new GeneralSpotlight( "#ffffff", 1, { x: 0, y: 10, z: 0 } );

        // Create custom pointlight instance
        this.pointLight = new PointLight( "#FFE8C1", 8, { x: 0, y: 10, z: 0 } );

        // Create cake spotlight instance
        this.cakeSpotlight = new CakeSpotlight(
            "#7d7d7d",
            3,
            { x: 0, y: 5, z: 0 },
            { x: 0, y: 0, z: 0 },
            "textures/lamp_texture_360x281.png"
        );

        // Create custom ambientlight instance
        this.ambientLight = new AmbientLight( "#555555", 3 );

        // Variables to manage visibility and animations
        this.windowSpotlightEnabled = true;
        this.cakeSpotlightEnabled = true;
        // this.candleFlameEnabled and this.candleFlame.light.visible
        // set to "false" because it might harm the framerate
        this.candleFlameEnabled = false;
        this.candleFlame.light.visible = false;
        this.candleFlameFlickerEnabled = true;
    }

    /**
     * initializes the contents
     */
    init() {
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis( this );
            this.app.scene.add( this.axis );
        }
        
        // Add a general spotlight on the ceiling
        //this.generalSpotlight.addToScene( this.app.scene );

        // Add a pointlight on top of the cake
        this.pointLight.addToScene( this.app.scene );

        // Add a cake spotlight on top of the cake
        this.cakeSpotlight.addToScene( this.app.scene );

        // Add an ambient light
        this.ambientLight.addToScene( this.app.scene );

        // Add the plane to the scene
        this.plane.addToScene( this.app.scene )

        // Add wall group to the scene
        this.wall.addToScene( this.app.scene );
        // Setup the default rotation for open window doors
        const initialDoorRotation = Math.PI * 0.8;
        this.updateWindowLeftDoorRotation( -initialDoorRotation );
        this.updateWindowRightDoorRotation( -initialDoorRotation );

        // Add the window painting to the scene
        this.windowPainting.addToScene( this.app.scene );

        // Add the spotlight to the scene
        this.windowSpotlight.addToScene( this.app.scene );

        // Add ceiling to the scene
        this.ceiling.addToScene( this.app.scene );

        // Positioning for paintings on the wall
        const paintingPositions = [
            new THREE.Vector3( -this.wall.wallX / 4, this.wall.wallY / 2, -this.wall.wallX / 2 + 0.01 ),
            new THREE.Vector3( this.wall.wallX / 4, this.wall.wallY / 2, -this.wall.wallX / 2 + 0.01 )
        ];

        const lightPositions = [
            new THREE.Vector3( -this.wall.wallX / 4, this.wall.wallY * 0.9, -this.wall.wallX / 2 + 0.2 ),
            new THREE.Vector3( this.wall.wallX / 4, this.wall.wallY * 0.9, -this.wall.wallX / 2 + 0.2 )
        ];

        // Add paintings to the wall
        this.paintings.forEach( ( painting, index ) => {
            painting.addToScene( this.app.scene, paintingPositions[ index ], lightPositions[ index ] );
        });

        // Add beetle painting to the wall
        const beetlePaintingPosition = new THREE.Vector3(
            0,
            this.wall.wallY * 5/8,
            -this.wall.wallX / 2 + 0.01
        );
        this.beetlePainting.addToScene( this.app.scene, beetlePaintingPosition );

        // Add the table to the scene
        this.table.addToScene( this.app.scene );

        // Add the plate to the scene, placing it on the table
        const plateYPosition = this.table.legHeight + this.table.topHeight / 2 + this.plate.height / 2;
        this.plate.addToScene( this.app.scene, plateYPosition );

        // Add the cake to the scene, placing it on top of the plate
        const cakeYPosition = plateYPosition + this.plate.height / 2 + this.cake.height / 2;
        this.cake.addToScene( this.app.scene, cakeYPosition );

        // Add the cake candle to the scene, placing it above the cake
        const candleYPosition = cakeYPosition + this.cake.height / 2 + this.candle.height / 2;
        this.candle.addToScene(
            this.app.scene,
            { x: this.cake.radius / 20, y: candleYPosition, z: -this.cake.radius / 20 }
        );

        // Add the flame to the scene, placing it above the cake candle
        const flameYPosition = candleYPosition + this.candle.height / 2 + this.candleFlame.height / 2;
        
        this.candleFlame.addToScene(
            this.app.scene,
            { x: this.cake.radius / 20, y: flameYPosition, z: -this.cake.radius / 20 }
        );

        // Add the spring to the scene, placing it on the table
        const springPosition = new THREE.Vector3(
            -( this.table.topDimensionX - this.spring.radius ) / 3,    // x position on the table
            plateYPosition, // y position on top of the plate
            ( this.table.topDimensionZ - this.spring.radius ) / 3,    // z position on the table
        );
        this.spring.addToScene( this.app.scene, springPosition );

        // Add newspaper to the scene, placing it on the table
        const newspaperPosition = new THREE.Vector3(
            this.table.topDimensionX * 0.35,
            this.table.legHeight + this.table.topHeight / 10, // Slightly above the table
            0
        );
        this.newspaper.addToScene( this.app.scene, newspaperPosition );

        // Add jar to the scene, placing it on the table
        const jarPosition = new THREE.Vector3(
            -this.table.topDimensionX / 2.5,
            this.table.legHeight + this.table.topHeight / 10, // Slightly above the table
            -this.table.topDimensionX / 5
        );
        this.jar.addToScene( this.app.scene, jarPosition );

        // Add flower to the scene, placing it on the jar
        const flowerPosition = new THREE.Vector3(
            jarPosition.x * 0.95,
            jarPosition.y * ( 1 + this.table.topHeight * 0.3 ),
            jarPosition.z
        );
        this.flower.addToScene( this.app.scene, flowerPosition );

        // Add flower and jar to a group, so its possible to move them together without the
        // translation being affected by their respective rotations since it would not be intuitive
        // to move them around like that
        this.flowerAndJarGroup = new THREE.Group();
        this.flowerAndJarGroup.add( this.flower.group );
        this.flowerAndJarGroup.add( this.jar.group );
        this.app.scene.add( this.flowerAndJarGroup );

        // Add chair to the scene, placing it next to the table
        const chairPosition = new THREE.Vector3(
            this.table.topDimensionX / 2,
            0,
            0
        );
        this.chair.addToScene( this.app.scene, chairPosition );
    }

    /**
     * converts degrees to radians
     */
    degreesToRads(value) {
        return ( value * Math.PI / 180.0 );
    }

    /**
     * creates a spotlight centered on the window painting
     */
    createWindowSpotlight() {
        // Calculate the position of the spotlight
        const spotlightX = -this.wall.wallX / 1.5;
        const spotlightY = this.wall.wallY / 1.5;
        const spotlightZ = 0;

        // Create an instance of GeneralSpotlight in the middle of the windowPainting
        this.windowSpotlight = new GeneralSpotlight( "#ffffff", 3, { x: spotlightX, y: spotlightY, z: spotlightZ } );
    }
    
    /**
     * updates the general spotlight color and the material, and updates the helper
     * @param {THREE.Color} value 
     */
    updateGeneralSpotlightColor(value) {
        this.generalSpotlight.updateColor( value );
    }
    /**
     * updates the general spotlight intensity and the material, and updates the helper
     * @param {number} value 
     */
    updateGeneralSpotlightIntensity(value) {
        this.generalSpotlight.updateIntensity( value );
    }
    /**
     * updates the general spotlight distance and the material, and updates the helper
     * @param {number} value 
     */
    updateGeneralSpotlightDistance(value) {
        this.generalSpotlight.updateDistance( value );
    }
    /**
     * updates the general spotlight angle (both degrees and radians) and the material, and updates the helper
     * @param {number} value 
     */
    updateGeneralSpotlightAngle(value) {
        this.generalSpotlight.updateAngle( value );
    }
    /**
     * updates the general spotlight penumbra and the material, and updates the helper
     * @param {number} value 
     */
    updateGeneralSpotlightPenumbra(value) {
        this.generalSpotlight.updatePenumbra( value );
    }
    /**
     * updates the general spotlight decay and the material, and updates the helper
     * @param {number} value 
     */
    updateGeneralSpotlightDecay(value) {
        this.generalSpotlight.updateDecay( value );
    }

    /**
     * updates the cake spotlight color and the material, and updates the helper
     * @param {THREE.Color} value 
     */
    updateCakeSpotlightColor(value) {
        this.cakeSpotlight.updateColor( value );
    }
    /**
     * updates the cake spotlight intensity and the material, and updates the helper
     * @param {number} value 
     */
    updateCakeSpotlightIntensity(value) {
        this.cakeSpotlight.updateIntensity( value );
    }
    /**
     * updates the cake spotlight distance and the material, and updates the helper
     * @param {number} value 
     */
    updateCakeSpotlightDistance(value) {
        this.cakeSpotlight.updateDistance( value );
    }
    /**
     * updates the cake spotlight angle (both degrees and radians) and the material, and updates the helper
     * @param {number} value 
     */
    updateCakeSpotlightAngle(value) {
        this.cakeSpotlight.updateAngle( value );
    }
    /**
     * updates the cake spotlight penumbra and the material, and updates the helper
     * @param {number} value 
     */
    updateCakeSpotlightPenumbra(value) {
        this.cakeSpotlight.updatePenumbra( value );
    }
    /**
     * updates the cake spotlight decay and the material, and updates the helper
     * @param {number} value 
     */
    updateCakeSpotlightDecay(value) {
        this.cakeSpotlight.updateDecay( value );
    }
    /**
     * updates radial segments for the lamp in CakeSpotlight
     * @param {number} value
     */
    updateCakeSpotlightLampRadialSegments(value) {
        this.cakeSpotlight.updateLampRadialSegments( value );
    }
    /**
     * updates radial segments for the wire in CakeSpotlight
     * @param {number} value
     */
    updateCakeSpotlightWireRadialSegments(value) {
        this.cakeSpotlight.updateWireRadialSegments( value );
    }

    /**
     * updates the pointlight color and the material, and updates the helper
     * @param {THREE.Color} value 
     */
    updatePointlightColor(value) {
        this.pointLight.updateColor( value );
    }
    /**
     * updates the pointlight intensity and the material, and updates the helper
     * @param {number} value 
     */
    updatePointlightIntensity(value) {
        this.pointLight.updateIntensity( value );
    }
    /**
     * updates the pointlight distance and the material, and updates the helper
     * @param {number} value 
     */
    updatePointlightDistance(value) {
        this.pointLight.updateDistance( value );
    }
    /**
     * updates the pointlight decay and the material, and updates the helper
     * @param {number} value 
     */
    updatePointlightDecay(value) {
        this.pointLight.updateDecay( value );
    }

    /**
     * updates left window door rotation
     * @param {number} angle
     */
    updateWindowLeftDoorRotation(angle) {
        this.wall.windowFrame.setLeftDoorRotation( angle );
    }
    /**
     * updates right window door rotation
     * @param {number} angle
     */
    updateWindowRightDoorRotation(angle) {
        this.wall.windowFrame.setRightDoorRotation( angle );
    }

    /**
     * Method to smoothly toggle door open/close
     * @param {function(param) => {}} updateSliderCallback
     * @param {function(param) => {}} toggleSliders
     * Sources:
     * 1) "requestAnimationFrame()": https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
     * 1.1) "animate" argument: https://developer.mozilla.org/en-US/docs/Web/API/Element/animate
     * 2) "startTime = performance.now()": https://developer.mozilla.org/en-US/docs/Web/API/Performance/now
     */
    toggleDoorAnimation(updateSliderCallback, toggleSliders) {
        // Prevent multiple toggles
        if (this.doorAnimationInProgress) return;

        this.doorAnimationInProgress = true;
        // Disable sliders at the start
        toggleSliders(false);

        const targetRotation = this.doorOpen ? this.doorClosedRotation : this.doorOpenRotation;
        // Start from current rotation
        const startRotation = this.leftDoorCurrentRotation;
        const startTime = performance.now();

        const animate = ( time ) => {
            const elapsedTime = time - startTime;
            const progress = Math.min( elapsedTime / this.animationDuration, 1 );

            const currentRotation = startRotation + ( targetRotation - startRotation ) * progress;
            // Update rotation variables and slider
            this.leftDoorCurrentRotation = currentRotation;
            this.rightDoorCurrentRotation = currentRotation;
            this.updateWindowLeftDoorRotation( -currentRotation );
            this.updateWindowRightDoorRotation( -currentRotation );
            updateSliderCallback( currentRotation );

            // Check if animation is complete
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // End the animation
                this.doorAnimationInProgress = false;
                // Toggle door state
                this.doorOpen = !this.doorOpen;
                // Re-enable sliders after animation completes
                toggleSliders(true);
            }
        };

        requestAnimationFrame(animate);
    }

    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value 
     */
    updateDiffusePlaneColor(value) {
        this.plane.updateDiffuseColor( value );
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value 
     */
    updateSpecularPlaneColor(value) {
        this.plane.updateSpecularColor( value );
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value 
     */
    updatePlaneShininess(value) {
        this.plane.updateShininess( value );
    }

    /**
     * updates the chair position
     * @param {THREE.Vector3} position
     */
    updateChairPosition(position) {
        this.chair.setPosition(position);
    }
    
    /**
     * updates the plate diffuse color
     * @param {THREE.Color} value
     */
    updatePlateDiffuseColor(value) {
        this.plate.updateDiffuseColor( value );
    }
    /**
     * updates the plate radial segments
     * @param {number} value
     */
    updatePlateRadialSegments(value) {
        this.plate.updateRadialSegments( value );
    }

    /**
     * updates the beetle number of samples
     * @param {number} value 
     */
    updateBeetleSamples(value) {
        this.beetlePainting.updateSamples( value );
    }

    /**
     * updates the cake number of samples
     * @param {number} value 
     */
    updateCakeSamples(value) {
        this.cake.updateSamples( value );
    }

    /**
     * updates the spring radius
     * @param {number} value 
     */
    updateSpringRadius(value) {
        this.spring.setRadius( value );
    }
    /**
     * updates the spring radius
     * @param {number} value 
     */
    updateSpringThicknessCoefficient(value) {
        this.spring.setThicknessCoefficient( value );
    }
    /**
     * updates the spring height per turn
     * @param {number} value 
     */
    updateSpringHeightPerTurn(value) {
        this.spring.setHeightPerTurn( value );
    }
    /**
     * updates the spring number of turns
     * @param {number} value 
     */
    updateSpringTurns(value) {
        this.spring.setTurns( value );
    }
    /**
     * updates the spring number of points per turn
     * @param {number} value 
     */
    updateSpringPointsPerTurn(value) {
        this.spring.setPointsPerTurn( value );
    }
    /**
     * updates the spring radial segments
     * @param {number} value 
     */
    updateSpringRadialSegments(value) {
        this.spring.setRadialSegments( value );
    }

    /**
     * updates newspaper position
     * @param {THREE.Vector3} position
     */
    updateNewspaperPosition(position) {
        this.newspaper.setPosition( position );
    }
    /**
     * updates newspaper rotation
     * @param {number, number, number} rotation
     */
    updateNewspaperRotation(x, y, z) {
        this.newspaper.setRotation( x, y, z );
    }
    /**
     * updates the newspaper samples in U
     * @param {number} value 
     */
    updateNewspaperSamplesU(value) {
        this.newspaper.setSamplesU( value );
    }
    /**
     * updates the newspaper samples in V
     * @param {number} value 
     */
    
    /* Not needed: V is a line, not a curve, sampling isnt necessary.
    updateNewspaperSamplesV(value) {
        this.newspaper.setSamplesV( value );
    }
    */

    /**
     * updates flower and jar position
     * @param {THREE.Vector3} position
     */
    updateFlowerAndJarPosition(position) {
        this.flowerAndJarGroup.position.copy( position );
    }
    /**
     * updates flower and jar rotation
     * @param {number, number, number}
     */
    updateFlowerAndJarRotation(x, y, z) {
        this.flower.setRotation(x, y, z);
        this.jar.setRotation(x, y, z);
    }

    // Method to toggle window spotlight
    toggleWindowSpotlight(enabled) {
        this.windowSpotlight.spotlight.visible = enabled;
        this.windowSpotlightEnabled = enabled;
    }

    // Method to toggle cake spotlight
    toggleCakeSpotlight(enabled) {
        this.cakeSpotlight.spotlight.visible = enabled;
        this.cakeSpotlightEnabled = enabled;
    }

    // Method to toggle candle flame flicker animation
    toggleCandleFlameFlicker(enabled) {
        this.candleFlameFlickerEnabled = enabled;
    }

    // Method to toggle candle flame light
    toggleCandleFlameLight(enabled) {
        this.candleFlame.light.visible = enabled;
        this.candleFlameEnabled = enabled;
    }


    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        if (this.candleFlameFlickerEnabled) {
            this.candleFlame.flicker();
        }
    }
}

export { MyContents };