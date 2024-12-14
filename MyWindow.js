import * as THREE from 'three';

class WindowFrame {
    /**
     * Constructs the window frame object
     * @param {number} gapWidth - Width of the gap in the wall.
     * @param {number} gapHeight - Height of the gap in the wall.
     * @param {number} frameThickness - Thickness of the frame.
     * @param {string} frameTexturePath - Path to the frame texture.
     */
    constructor(
        gapWidth,
        gapHeight,
        frameThickness = 0.1,
        frameDepth = 0.05,
        frameTexturePath = "textures/frame_wood_texture_120x69.png"
    ) {
        this.gapWidth = gapWidth;
        this.gapHeight = gapHeight;
        this.frameThickness = frameThickness;
        this.frameDepth = frameDepth;

        // Frame texture setup
        this.frameTexturePath = frameTexturePath;
        this.frameTexture = new THREE.TextureLoader().load( this.frameTexturePath );
        this.frameTexture.wrapS = THREE.MirroredRepeatWrapping;
        this.frameTexture.wrapT = THREE.MirroredRepeatWrapping;

        // Frame material setup
        this.frameColor = "#9b6100";
        this.frameMaterial = new THREE.MeshPhongMaterial({
            color: this.frameColor,
            emissive: "#000000",
            map: this.frameTexture,
        });

        // Create frame meshes
        this.frameMeshGroup = new THREE.Group();
        this.createFrameMeshes();

        // Create window door groups and meshes
        this.leftDoorGroup = new THREE.Group();
        this.rightDoorGroup = new THREE.Group();

        this.leftDoor = this.createDoor();
        this.leftDoor.position.set( this.gapWidth / 4, 0, 0.01 ); // Offset to make it rotate around left edge
        this.leftDoorGroup.position.set( -this.gapWidth / 2, 0, 0 ); // Position the group at the left edge
        this.leftDoorGroup.add( this.leftDoor );
        this.frameMeshGroup.add( this.leftDoorGroup );

        this.rightDoor = this.createDoor();
        this.rightDoor.position.set( -this.gapWidth / 4, 0, 0.01 ); // Offset to make it rotate around right edge
        this.rightDoorGroup.position.set( this.gapWidth / 2, 0, 0 ); // Position the group at the right edge
        this.rightDoorGroup.add( this.rightDoor );
        this.frameMeshGroup.add( this.rightDoorGroup );
    }

    // Create frame meshes around the gap
    createFrameMeshes() {
        const frameTopBottomWidth = this.gapWidth + this.frameThickness;
        const frameLeftRightHeight = this.gapHeight;

        // Top frame
        const topFrameGeometry = new THREE.BoxGeometry( frameTopBottomWidth, this.frameThickness, this.frameDepth );
        const topFrameMesh = new THREE.Mesh( topFrameGeometry, this.frameMaterial );
        topFrameMesh.position.set( 0, this.gapHeight / 2 + this.frameThickness / 2, this.frameDepth / 2 );
        this.frameMeshGroup.add( topFrameMesh );

        // Bottom frame
        const bottomFrameGeometry = new THREE.BoxGeometry( frameTopBottomWidth, this.frameThickness, this.frameDepth );
        const bottomFrameMesh = new THREE.Mesh( bottomFrameGeometry, this.frameMaterial );
        bottomFrameMesh.position.set( 0, -this.gapHeight / 2 - this.frameThickness / 2, this.frameDepth / 2 );
        this.frameMeshGroup.add( bottomFrameMesh );

        // Left frame
        const leftFrameGeometry = new THREE.BoxGeometry( this.frameThickness, frameLeftRightHeight, this.frameDepth );
        const leftFrameMesh = new THREE.Mesh( leftFrameGeometry, this.frameMaterial );
        leftFrameMesh.position.set( -this.gapWidth / 2 - this.frameThickness / 2, 0, this.frameDepth / 2 );
        this.frameMeshGroup.add( leftFrameMesh );

        // Right frame
        const rightFrameGeometry = new THREE.BoxGeometry( this.frameThickness, frameLeftRightHeight, this.frameDepth ) ;
        const rightFrameMesh = new THREE.Mesh( rightFrameGeometry, this.frameMaterial );
        rightFrameMesh.position.set( this.gapWidth / 2 + this.frameThickness / 2, 0, this.frameDepth / 2 );
        this.frameMeshGroup.add( rightFrameMesh );

        // Middle frame
        const middleFrameGeometry = new THREE.BoxGeometry( this.frameThickness, frameLeftRightHeight, this.frameDepth );
        const middleFrameMesh = new THREE.Mesh( middleFrameGeometry, this.frameMaterial );
        middleFrameMesh.position.set( 0, 0, this.frameDepth / 2 );
        this.frameMeshGroup.add( middleFrameMesh );
    }

    // Method to create a door mesh
    createDoor() {
        const doorGeometry = new THREE.BoxGeometry( this.gapWidth / 2, this.gapHeight, 0.001 );
        const doorMesh = new THREE.Mesh( doorGeometry, this.frameMaterial );
        doorMesh.castShadow = true;
        doorMesh.receiveShadow = true;
        return doorMesh;
    }

    // Methods to set door rotations
    setLeftDoorRotation(angle) {
        this.leftDoorGroup.rotation.y = angle;
    }

    setRightDoorRotation(angle) {
        this.rightDoorGroup.rotation.y = -angle;
    }

    // Adds frame around the gap to the scene
    addToScene(scene, position) {
        this.frameMeshGroup.position.add( position );
        this.frameMeshGroup.rotation.y = Math.PI / 2;
        scene.add( this.frameMeshGroup );
    }
}

export { WindowFrame };