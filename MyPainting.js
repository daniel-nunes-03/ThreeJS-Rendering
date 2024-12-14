import * as THREE from 'three';

class Painting {
    /**
     * Constructs the painting object
     * @param {number} wallX - Width of the wall to position the painting.
     * @param {number} wallY - Height of the wall to position the painting.
     * @param {string} texturePath - Path to the painting texture.
     */
    constructor(wallX, wallY, texturePath) {
        // Painting size and position
        this.paintingRaise = 0.01;
        this.paintingWidth = wallX * 0.2;
        this.paintingHeight = wallY * 0.5;

        // Texture setup
        this.texturePath = texturePath;
        this.texture = new THREE.TextureLoader().load( texturePath );
        this.texture.wrapS = THREE.MirroredRepeatWrapping;
        this.texture.wrapT = THREE.MirroredRepeatWrapping;

        // Material setup
        this.diffuseColor = "#ffffff";
        this.specularColor = "#ffffff";
        this.shininess = 0;
        this.material = new THREE.MeshPhongMaterial({
            color: this.diffuseColor,
            specular: this.specularColor,
            emissive: "#000000",
            shininess: this.shininess,
            map: this.texture,
        });

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

        // Create painting and frame meshes
        this.mesh = this.createPaintingMesh();
        this.frameMeshes = this.createFrameMeshes();

        // Spotlight setup for painting
        this.light = new THREE.SpotLight( "#ffffff", 10, wallY * 0.6, this.degreesToRads( 22.5 ), 0, 0 );
        //this.lightHelper = new THREE.SpotLightHelper( this.light );

        // Add light fixture above the spotlight
        this.lightFixture = this.createLightFixture();
    }

    // Method to convert degrees to radians
    degreesToRads(value) {
        return ( value * Math.PI ) / 180.0;
    }

    // Create painting mesh
    createPaintingMesh() {
        const geometry = new THREE.PlaneGeometry( this.paintingWidth, this.paintingHeight );
        const mesh = new THREE.Mesh( geometry, this.material );
        return mesh;
    }

    // Create frame meshes around the painting
    createFrameMeshes() {
        const frameMeshes = [];
        const frameTopBottomWidth = this.paintingWidth + this.frameThickness;
        const frameLeftRightHeight = this.paintingHeight;
        
        // Top frame
        const topFrameGeometry = new THREE.BoxGeometry( frameTopBottomWidth, this.frameThickness, this.frameDepth );
        const topFrameMesh = new THREE.Mesh( topFrameGeometry, this.frameMaterial );
        topFrameMesh.position.set( 0, this.paintingHeight / 2 + this.frameThickness / 2, this.frameDepth / 2 );
        frameMeshes.push( topFrameMesh );
        
        // Bottom frame
        const bottomFrameGeometry = new THREE.BoxGeometry( frameTopBottomWidth, this.frameThickness, this.frameDepth );
        const bottomFrameMesh = new THREE.Mesh( bottomFrameGeometry, this.frameMaterial );
        bottomFrameMesh.position.set( 0, -this.paintingHeight / 2 - this.frameThickness / 2, this.frameDepth / 2 );
        frameMeshes.push( bottomFrameMesh );
        
        // Left frame
        const leftFrameGeometry = new THREE.BoxGeometry( this.frameThickness, frameLeftRightHeight, this.frameDepth );
        const leftFrameMesh = new THREE.Mesh( leftFrameGeometry, this.frameMaterial );
        leftFrameMesh.position.set( -this.paintingWidth / 2 - this.frameThickness / 2, 0, this.frameDepth / 2 );
        frameMeshes.push( leftFrameMesh );
        
        // Right frame
        const rightFrameGeometry = new THREE.BoxGeometry( this.frameThickness, frameLeftRightHeight, this.frameDepth );
        const rightFrameMesh = new THREE.Mesh( rightFrameGeometry, this.frameMaterial );
        rightFrameMesh.position.set( this.paintingWidth / 2 + this.frameThickness / 2, 0, this.frameDepth / 2 );
        frameMeshes.push( rightFrameMesh );

        return frameMeshes;
    }

    // Create light fixture box geometry above the spotlight
    createLightFixture() {
        const fixtureWidth = this.paintingWidth * 0.1;
        const fixtureHeight = 0.05;
        const fixtureDepth = 0.05;

        const fixtureGeometry = new THREE.BoxGeometry( fixtureWidth, fixtureHeight, fixtureDepth );
        const fixtureMaterial = new THREE.MeshPhongMaterial( { color: "#000000" } );
        const fixtureMesh = new THREE.Mesh( fixtureGeometry, fixtureMaterial );

        const offsetY = ( -this.frameDepth - this.frameThickness ) * 2.6;
        const offsetZ = fixtureDepth / 2 - this.frameDepth * 2 - this.frameThickness;

        fixtureMesh.position.set( 0, offsetY, offsetZ );
        return fixtureMesh;
    }

    // Adds painting and frames to the scene
    addToScene(scene, position, lightPosition) {
        // Set painting position
        this.mesh.position.copy( position );
        
        // Set frame positions relative to painting
        this.frameMeshes.forEach( frameMesh => {
            frameMesh.position.add( position );
            scene.add( frameMesh );
        });
        
        // Set light position and target
        this.light.position.copy( lightPosition );
        this.light.target = this.mesh;

        // Set light fixture position above light
        this.lightFixture.position.add( lightPosition );
        
        scene.add( this.mesh );
        scene.add( this.light );
        //scene.add( this.lightHelper );
        scene.add( this.lightFixture );
    }
}

export { Painting };