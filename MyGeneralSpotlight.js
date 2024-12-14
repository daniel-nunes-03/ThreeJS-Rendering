import * as THREE from 'three';

class GeneralSpotlight {
    constructor(color = "#ffffff", intensity = 4, position = { x: 0, y: 20, z: 0 }) {
        // Initialize spotlight properties
        this.color = color;
        this.intensity = intensity;
        this.position = position;

        // Set spotlight parameters
        this.distance = this.position.y * 5;
        this.angleDegrees = 45;
        this.angleRadians = this.degreesToRads( this.angleDegrees );
        this.penumbra = 1;
        this.decay = 0.1;

        // Create the spotlight
        this.spotlight = new THREE.SpotLight(
            this.color,
            this.intensity,
            this.distance,
            this.angleRadians,
            this.penumbra,
            this.decay
        );
        this.spotlight.position.set( this.position.x, this.position.y, this.position.z );

        // Enable shadow casting for the spotlight
        this.spotlight.castShadow = true;

        // Configure shadow map settings (optional but improves quality)
        this.mapSize = 4096;
        this.spotlight.shadow.mapSize.width = this.mapSize;
        this.spotlight.shadow.mapSize.height = this.mapSize;
        this.spotlight.shadow.camera.near = 0.5;
        this.spotlight.shadow.camera.far = this.distance;

        // Create the spotlight target
        this.target = new THREE.Object3D();
        this.target.position.set( 0, 0, 0 );
        this.spotlight.target = this.target;

        // Create spotlight helper for visualization
        //this.helper = new THREE.SpotLightHelper( this.spotlight );
    }

    /**
     * Converts degrees to radians
     * @param {number} degrees The angle in degrees
     * @returns {number} The angle in radians
     */
    degreesToRads(degrees) {
        return degrees * Math.PI / 180.0;
    }

    /**
     * Adds the spotlight and helper to the scene
     * @param {THREE.Scene} scene The scene object
     */
    addToScene(scene) {
        scene.add( this.spotlight );
        scene.add( this.target );
        //scene.add( this.helper );
        //this.helper.update();
    }

    /**
     * Updates the spotlight color and helper
     * @param {THREE.Color} color The new color
     */
    updateColor(color) {
        this.color = color;
        this.spotlight.color.set( this.color );
        //this.helper.update();
    }

    /**
     * Updates the spotlight intensity and helper
     * @param {number} intensity The new intensity
     */
    updateIntensity(intensity) {
        this.intensity = intensity;
        this.spotlight.intensity = this.intensity;
        //this.helper.update();
    }

    /**
     * Updates the spotlight distance and helper
     * @param {number} distance The new distance
     */
    updateDistance(distance) {
        this.distance = distance;
        this.spotlight.distance = this.distance;
        //this.helper.update();
    }

    /**
     * Updates the spotlight angle in degrees and helper
     * @param {number} angleDegrees The new angle in degrees
     */
    updateAngle(angleDegrees) {
        this.angleDegrees = angleDegrees;
        this.angleRadians = this.degreesToRads( this.angleDegrees );
        this.spotlight.angle = this.angleRadians;
        //this.helper.update();
    }

    /**
     * Updates the spotlight penumbra and helper
     * @param {number} penumbra The new penumbra value
     */
    updatePenumbra(penumbra) {
        this.penumbra = penumbra;
        this.spotlight.penumbra = this.penumbra;
        //this.helper.update();
    }

    /**
     * Updates the spotlight decay and helper
     * @param {number} decay The new decay value
     */
    updateDecay(decay) {
        this.decay = decay;
        this.spotlight.decay = this.decay;
        //this.helper.update();
    }
}

export { GeneralSpotlight };