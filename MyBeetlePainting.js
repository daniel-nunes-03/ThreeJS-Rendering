import * as THREE from 'three';

class BeetlePainting {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.beetleSamples = 16;

        // Create the group for the painting to keep everything organized
        this.group = new THREE.Group();

        // Adjust z position to protrude the lines from the wall
        this.protrusion = 0.05;

        // Frame properties
        this.frameThickness = 0.1;
        this.frameDepth = 0.05;
        this.frameTexturePath = "textures/frame_wood_texture_120x69.png";
        this.frameTexture = new THREE.TextureLoader().load( this.frameTexturePath );
        this.frameTexture.wrapS = THREE.MirroredRepeatWrapping;
        this.frameTexture.wrapT = THREE.MirroredRepeatWrapping;
        
        this.frameColor = "#9b6100";
        this.frameMaterial = new THREE.MeshPhongMaterial({
            color: this.frameColor,
            emissive: "#000000",
            map: this.frameTexture,
        });

        // Initialize an empty array to store frame meshes
        this.frameMeshes = [];

        // Create beetle shape, background, and frame
        this.createBackground();
        this.createBeetleShape();
        this.createFrame();
    }

    // Helper method to clear the current beetle shape from the group
    clearBeetleShape() {
        // Remove all children that are not the background or frame
        for (let i = this.group.children.length - 1; i >= 0; i--) {
            const child = this.group.children[ i ];
            if (child !== this.backgroundMesh && !this.frameMeshes.includes( child )) {
                this.group.remove( child );
            }
        }
    }

    // Create a background plane
    createBackground() {
        const backgroundGeometry = new THREE.PlaneGeometry( this.width * 0.2, this.height * 0.5 );
        const backgroundMaterial = new THREE.MeshPhongMaterial({
            color: "#ffffff",
            emissive: "#a1a1a1" // rgb(161,161,161)
        });
        this.backgroundMesh = new THREE.Mesh( backgroundGeometry, backgroundMaterial );
        this.group.add( this.backgroundMesh );
    }

    // Create the beetle shape using Cubic Bezier curves
    createBeetleShape() {
        const material = new THREE.LineBasicMaterial( { color: "#000000" } );

        // Define the left part of the "roof" curve of the beetle
        const leftRoofStart = new THREE.Vector3( -1.5, -0.5, this.protrusion );
        const leftRoofControl1 = new THREE.Vector3( -1.5, -0.25, this.protrusion );
        const leftRoofControl2 = new THREE.Vector3( -1.5, 1.0, this.protrusion );
        const leftRoofEnd = new THREE.Vector3( 0, 1.0, this.protrusion );
        const leftRoofCurve = new THREE.CubicBezierCurve3(
            leftRoofStart,
            leftRoofControl1,
            leftRoofControl2,
            leftRoofEnd
        );
        const leftRoofGeometry = new THREE.BufferGeometry().setFromPoints(
            leftRoofCurve.getPoints( this.beetleSamples )
        );
        const leftRoofLine = new THREE.Line( leftRoofGeometry, material );
        this.group.add( leftRoofLine );

        // Define the middle part of the "roof" curve of the beetle
        const middleRoofStart = new THREE.Vector3( 0, 1.0, this.protrusion );
        const middleRoofControl1 = new THREE.Vector3( 0.75, 1.0, this.protrusion );
        const middleRoofControl2 = new THREE.Vector3( 0.75, 0.25, this.protrusion );
        const middleRoofEnd = new THREE.Vector3( 0.75, 0.25, this.protrusion );

        const middleRoofCurve = new THREE.CubicBezierCurve3(
            middleRoofStart,
            middleRoofControl1,
            middleRoofControl2,
            middleRoofEnd
        );
        const middleRoofGeometry = new THREE.BufferGeometry().setFromPoints(
            middleRoofCurve.getPoints( this.beetleSamples )
        );
        const middleRoofLine = new THREE.Line( middleRoofGeometry, material );
        this.group.add( middleRoofLine );

        // Define the right part of the "roof" curve of the beetle
        const rightRoofStart = new THREE.Vector3( 0.75, 0.25, this.protrusion );
        const rightRoofControl1 = new THREE.Vector3( 1.5, 0.25, this.protrusion );
        const rightRoofControl2 = new THREE.Vector3( 1.5, -0.5, this.protrusion );
        const rightRoofEnd = new THREE.Vector3( 1.5, -0.5, this.protrusion );

        const rightRoofCurve = new THREE.CubicBezierCurve3(
            rightRoofStart,
            rightRoofControl1,
            rightRoofControl2,
            rightRoofEnd
        );
        const rightRoofGeometry = new THREE.BufferGeometry().setFromPoints(
            rightRoofCurve.getPoints( this.beetleSamples )
        );
        const rightRoofLine = new THREE.Line( rightRoofGeometry, material );
        this.group.add( rightRoofLine );

        // Define the left wheel curve
        const leftWheelStart = new THREE.Vector3( -1.5, -0.5, this.protrusion );
        const leftWheelControl1 = new THREE.Vector3( -1.5, 0.25, this.protrusion );
        const leftWheelControl2 = new THREE.Vector3( -0.5, 0.25, this.protrusion );
        const leftWheelEnd = new THREE.Vector3( -0.5, -0.5, this.protrusion);
        const leftWheelCurve = new THREE.CubicBezierCurve3(
            leftWheelStart,
            leftWheelControl1,
            leftWheelControl2,
            leftWheelEnd
        );
        const leftWheelGeometry = new THREE.BufferGeometry().setFromPoints(
            leftWheelCurve.getPoints( this.beetleSamples )
        );
        const leftWheelLine = new THREE.Line( leftWheelGeometry, material );
        this.group.add( leftWheelLine );

        // Define the right wheel curve
        const rightWheelStart = new THREE.Vector3( 1.5, -0.5, this.protrusion );
        const rightWheelControl1 = new THREE.Vector3( 1.5, 0.25, this.protrusion );
        const rightWheelControl2 = new THREE.Vector3( 0.5, 0.25, this.protrusion );
        const rightWheelEnd = new THREE.Vector3( 0.5, -0.5, this.protrusion );
        const rightWheelCurve = new THREE.CubicBezierCurve3(
            rightWheelStart,
            rightWheelControl1,
            rightWheelControl2,
            rightWheelEnd
        );
        const rightWheelGeometry = new THREE.BufferGeometry().setFromPoints(
            rightWheelCurve.getPoints( this.beetleSamples )
        );
        const rightWheelLine = new THREE.Line( rightWheelGeometry, material );
        this.group.add( rightWheelLine );
    }

    // Create a frame around the background
    createFrame() {
        const frameMaterial = new THREE.MeshPhongMaterial({
            color: "#9b6100",
            emissive: "#000000",
            map: this.frameTexture
        });

        const backgroundWidth = this.width * 0.2;
        const backgroundHeight = this.height * 0.5;

        // Top frame
        const topFrameGeometry = new THREE.BoxGeometry(
            backgroundWidth + this.frameThickness,
            this.frameThickness,
            this.frameDepth
        );
        const topFrameMesh = new THREE.Mesh( topFrameGeometry, frameMaterial );
        topFrameMesh.position.set( 0, backgroundHeight / 2 + this.frameThickness / 2, this.frameDepth / 2 );
        this.frameMeshes.push( topFrameMesh );

        // Bottom frame
        const bottomFrameGeometry = new THREE.BoxGeometry(
            backgroundWidth + this.frameThickness,
            this.frameThickness,
            this.frameDepth
        );
        const bottomFrameMesh = new THREE.Mesh( bottomFrameGeometry, frameMaterial );
        bottomFrameMesh.position.set( 0, -backgroundHeight / 2 - this.frameThickness / 2, this.frameDepth / 2 );
        this.frameMeshes.push( bottomFrameMesh );

        // Left frame
        const leftFrameGeometry = new THREE.BoxGeometry( this.frameThickness, backgroundHeight, this.frameDepth );
        const leftFrameMesh = new THREE.Mesh( leftFrameGeometry, frameMaterial );
        leftFrameMesh.position.set( -backgroundWidth / 2 - this.frameThickness / 2, 0, this.frameDepth / 2 );
        this.frameMeshes.push( leftFrameMesh );

        // Right frame
        const rightFrameGeometry = new THREE.BoxGeometry( this.frameThickness, backgroundHeight, this.frameDepth );
        const rightFrameMesh = new THREE.Mesh( rightFrameGeometry, frameMaterial );
        rightFrameMesh.position.set( backgroundWidth / 2 + this.frameThickness / 2, 0, this.frameDepth / 2 );
        this.frameMeshes.push( rightFrameMesh );

        // Add all frame meshes to the group
        this.frameMeshes.forEach( ( frameMesh ) => {
            this.group.add( frameMesh );
        });
    }

    // Method to update the sample count and remake the beetle shape
    updateSamples(samples) {
        this.beetleSamples = samples;
        this.clearBeetleShape();
        this.createBeetleShape();
    }

    // Method to add the painting to the scene
    addToScene(scene, position) {
        this.group.position.set( position.x, position.y, position.z );
        scene.add( this.group );
    }
}

export { BeetlePainting };