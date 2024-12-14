import * as THREE from 'three';

class CakeSpotlight {
    constructor(
        color = "#7d7d7d",
        intensity = 5,
        position = { x: 0, y: 5, z: 0 },
        targetPosition = { x: 0, y: 0, z: 0 },
        texturePath
    ) {
        // Initialize spotlight properties
        this.color = color;
        this.intensity = intensity;
        this.position = position;
        this.texturePath = texturePath;

        // Texture setup
        this.texture = new THREE.TextureLoader().load( texturePath );
        this.texture.wrapS = THREE.MirroredRepeatWrapping;
        this.texture.wrapT = THREE.MirroredRepeatWrapping;

        // Set spotlight parameters
        this.distance = parseFloat( ( position.y * 1.07 ).toFixed( 1 ) );
        this.angleDegrees = 16;
        this.angleRadians = this.degreesToRads( this.angleDegrees );
        this.penumbra = 0.2;
        this.decay = 0;

        // Create the spotlight
        this.spotlight = new THREE.SpotLight(
            this.color,
            this.intensity,
            this.distance,
            this.angleRadians,
            this.penumbra,
            this.decay
        );
        this.spotlight.position.set( position.x, position.y, position.z );

        // Enable shadow casting for the spotlight
        this.mapSize = 4096;
        this.spotlight.castShadow = true;
        this.spotlight.shadow.mapSize.width = this.mapSize;
        this.spotlight.shadow.mapSize.height = this.mapSize;

        this.spotlight.shadow.camera.near = 0.5;
        this.spotlight.shadow.camera.far = 27;
        this.spotlight.shadow.camera.left = -15;
        this.spotlight.shadow.camera.right = 15;
        this.spotlight.shadow.camera.bottom = -15;
        this.spotlight.shadow.camera.top = 15;

        // Create the spotlight target
        this.target = new THREE.Object3D();
        this.target.position.set( targetPosition.x, targetPosition.y, targetPosition.z );
        this.spotlight.target = this.target;

        // Create spotlight helper for visualization
        //this.helper = new THREE.SpotLightHelper( this.spotlight );

        // Radial segments for lamp and wire
        this.lampRadialSegments = 16;
        this.wireRadialSegments = 8;

        // Setup lamp and wire
        this.lampRadius = 0.5;
        this.lampHeight = 1;
        this.wireRadius = 0.05;
        this.ceilingHeight = 10;
        this.wireHeight = this.ceilingHeight - position.y - this.lampHeight;

        // Create group for lamp and wire
        this.lampAndWireGroup = new THREE.Group();

        this.createLampMesh();
        this.createWireMesh();
    }

    /**
     * Helper function to create lamp mesh with updated radial segments
     */
    createLampMesh() {
        const lampGeometry = new THREE.CylinderGeometry(
            this.lampRadius,
            this.lampRadius,
            this.lampHeight,
            this.lampRadialSegments
        );
        const lampMaterial = new THREE.MeshPhongMaterial({
            color: "#ffffff",
            shininess: 0,
            specular: new THREE.Color( "#444444" ),
            map: this.texture
        });

        this.lampMesh = new THREE.Mesh( lampGeometry, lampMaterial );
        this.lampMesh.position.set( this.position.x, this.position.y + this.lampHeight / 2, this.position.z );
        this.lampMesh.castShadow = true;
    }

    /**
     * Helper function to create wire mesh with updated radial segments
     */
    createWireMesh() {
        const wireGeometry = new THREE.CylinderGeometry(
            this.wireRadius,
            this.wireRadius,
            this.wireHeight,
            this.wireRadialSegments
        );
        const wireMaterial = new THREE.MeshBasicMaterial( { color: "#333333" } );

        this.wireMesh = new THREE.Mesh( wireGeometry, wireMaterial );
        this.wireMesh.position.set( this.position.x, this.ceilingHeight - this.wireHeight / 2, this.position.z );
        this.wireMesh.castShadow = true;
    }

    /**
     * Clears the group and re-adds updated lamp and wire meshes
     */
    updateLampAndWire() {
        // Clear previous meshes from the group
        this.lampAndWireGroup.clear();

        // Create new meshes and add them to the group
        this.createLampMesh();
        this.createWireMesh();
        this.lampAndWireGroup.add( this.lampMesh );
        this.lampAndWireGroup.add( this.wireMesh );
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
     * Updates the spotlight color and helper
     * @param {THREE.Color} color
     */
    updateColor(value) {
        this.color = value;
        this.spotlight.color.set( value );
        //this.helper.update();
    }

    /**
     * Updates the spotlight intensity and helper
     * @param {number} intensity
     */
    updateIntensity(value) {
        this.intensity = value;
        this.spotlight.intensity = value;
        //this.helper.update();
    }

    /**
     * Updates the spotlight distance and helper
     * @param {number} distance
     */
    updateDistance(value) {
        this.distance = value;
        this.spotlight.distance = value;
        //this.helper.update();
    }

    /**
     * Updates the spotlight angle in degrees and helper
     * @param {number} angleDegrees
     */
    updateAngle(value) {
        this.angleDegrees = value;
        this.angleRadians = this.degreesToRads( value );
        this.spotlight.angle = this.angleRadians;
        //this.helper.update();
    }

    /**
     * Updates the spotlight penumbra and helper
     * @param {number} penumbra
     */
    updatePenumbra(value) {
        this.penumbra = value;
        this.spotlight.penumbra = value;
        //this.helper.update();
    }

    /**
     * Updates the spotlight decay and helper
     * @param {number} decay
     */
    updateDecay(value) {
        this.decay = value;
        this.spotlight.decay = value;
        //this.helper.update();
    }

    /**
     * Update radial segments for lamp and recreate geometry
     * @param {number} segments
     */
    updateLampRadialSegments(segments) {
        this.lampRadialSegments = segments;
        this.updateLampAndWire();
    }

    /**
     * Update radial segments for wire and recreate geometry
     * @param {number} segments
     */
    updateWireRadialSegments(segments) {
        this.wireRadialSegments = segments;
        this.updateLampAndWire();
    }

    /**
     * Adds the spotlight and helper to the scene
     * @param {THREE.Scene} scene
     */
    addToScene(scene) {
        scene.add( this.spotlight );
        scene.add( this.lampAndWireGroup );
        scene.add( this.target );
        // scene.add( this.helper );
        //this.helper.update();
        // Runs once when first added to the scene
        this.updateLampAndWire();
    }
}

export { CakeSpotlight };