import * as THREE from 'three';
import { WindowFrame } from './MyWindow.js';

class Wall {
    constructor() {
        // Define wall dimensions
        this.wallX = 20;
        this.wallY = 10;

        // Frame properties for the window
        this.gapWidth = this.wallX / 3;
        this.gapHeight = this.wallY / 3;
        this.frameThickness = 0.1;

        // Setup wall texture
        this.wallTexturePath = "textures/wall_wood_texture_360x360.jpg";
        this.wallTexture = new THREE.TextureLoader().load( this.wallTexturePath );
        this.wallTexture.wrapS = THREE.MirroredRepeatWrapping;
        this.wallTexture.wrapT = THREE.MirroredRepeatWrapping;
        this.wallUVRate = this.wallY / this.wallX;
        this.wallTextureUVRate = 360 / 360;
        this.wallTextureRepeatU = 5;
        this.wallTextureRepeatV = this.wallTextureRepeatU * this.wallUVRate * this.wallTextureUVRate;
        this.wallTexture.repeat.set( this.wallTextureRepeatU, this.wallTextureRepeatV );
        this.wallTexture.rotation = 0;
        this.wallTexture.offset = new THREE.Vector2( 0, 0 );
        
        // Setup wall material
        this.diffuseWallColor = "#ffffff";
        this.specularWallColor = "#ffffff";
        this.wallShininess = 0;
        this.wallMaterial = new THREE.MeshPhongMaterial({
            color: this.diffuseWallColor,
            specular: this.specularWallColor,
            emissive: "#000000",
            shininess: this.wallShininess,
            map: this.wallTexture
        });

        // Create a group to hold all wall sections
        this.wallGroup = new THREE.Group();

        // Set up textures and materials for the left wall subdivisions
        this.setupLeftWallSubdivisions();

        // Add the frame around the window gap in the left wall
        this.windowFrame = new WindowFrame( this.gapWidth, this.gapHeight, this.frameThickness );
    }

    setupLeftWallSubdivisions() {
        // Setup texture for top and bottom subdivisions of the left wall
        this.wallTextureLeft_TopBottom = new THREE.TextureLoader().load( this.wallTexturePath );
        this.wallTextureLeft_TopBottom.wrapS = THREE.MirroredRepeatWrapping;
        this.wallTextureLeft_TopBottom.wrapT = THREE.MirroredRepeatWrapping;
        this.wallTextureLeft_TopBottom_RepeatU = 5;
        this.wallTextureLeft_TopBottom_RepeatV =
            this.wallTextureLeft_TopBottom_RepeatU * this.wallUVRate * this.wallTextureUVRate / 3;
        this.wallTextureLeft_TopBottom.repeat.set( this.wallTextureLeft_TopBottom_RepeatU, this.wallTextureLeft_TopBottom_RepeatV );
        // Setup material for top and bottom subdivisions of the left wall
        this.wallMaterial_TopBottomSubdivisions = new THREE.MeshPhongMaterial({
            color: this.diffuseWallColor,
            specular: this.specularWallColor,
            emissive: "#000000",
            shininess: this.wallShininess,
            map: this.wallTextureLeft_TopBottom
        });

        // Setup texture for left and right subdivisions of the left wall
        this.wallTextureLeft_LeftRight = new THREE.TextureLoader().load( this.wallTexturePath );
        this.wallTextureLeft_LeftRight.wrapS = THREE.MirroredRepeatWrapping;
        this.wallTextureLeft_LeftRight.wrapT = THREE.MirroredRepeatWrapping;
        this.wallTextureLeft_LeftRight_RepeatU = 5 / 3;
        this.wallTextureLeft_LeftRight_RepeatV =
            this.wallTextureLeft_LeftRight_RepeatU * this.wallUVRate * this.wallTextureUVRate;
        this.wallTextureLeft_LeftRight.repeat.set( this.wallTextureLeft_LeftRight_RepeatU, this.wallTextureLeft_LeftRight_RepeatV );
        // Setup material for left and right subdivisions of the left wall
        this.wallTextureLeft_LeftRightSubdivisions = new THREE.MeshPhongMaterial({
            color: this.diffuseWallColor,
            specular: this.specularWallColor,
            emissive: "#000000",
            shininess: this.wallShininess,
            map: this.wallTextureLeft_LeftRight
        });
    }

    /**
     * Creates the wall group with all the wall components.
     * @returns {THREE.Group} wallGroup
     */
    createWallGroup() {
        // Setup geometry for the wall
        const wallGeometry = new THREE.PlaneGeometry( this.wallX, this.wallY );

        // Create and position the front wall mesh
        const frontWallMesh = new THREE.Mesh( wallGeometry, this.wallMaterial );
        frontWallMesh.position.set( 0, this.wallY / 2, -this.wallX / 2 );
        this.wallGroup.add( frontWallMesh );

        // Create and position the back wall mesh
        const backWallMesh = new THREE.Mesh( wallGeometry, this.wallMaterial );
        backWallMesh.position.set( 0, this.wallY / 2, this.wallX / 2 );
        backWallMesh.rotation.y = Math.PI;
        this.wallGroup.add( backWallMesh );

        // Add left wall with subdivisions
        this.addLeftWall();

        // Create and position the right wall mesh
        const rightWallMesh = new THREE.Mesh( wallGeometry, this.wallMaterial );
        rightWallMesh.position.set( this.wallX / 2, this.wallY / 2, 0 );
        rightWallMesh.rotation.y = -Math.PI / 2;
        // Enable shadow receiving
        rightWallMesh.receiveShadow = true;
        this.wallGroup.add( rightWallMesh );
    }

    /**
     * Adds the subdivided left wall components to the wall group.
     * @param {THREE.Group} wallGroup - The group to which left wall components are added.
     */
    addLeftWall() {
        // Setup geometry for the top and bottom subdivisions of the left wall
        const leftWallTopBottomGeometry = new THREE.PlaneGeometry( this.wallX, this.wallY / 3 );

        // Create and position the top subdivision of the left wall
        const leftWallMesh_Top = new THREE.Mesh( leftWallTopBottomGeometry, this.wallMaterial_TopBottomSubdivisions );
        leftWallMesh_Top.position.set( -this.wallX / 2, this.wallY * 5 / 6, 0 );
        leftWallMesh_Top.rotation.y = Math.PI / 2;
        this.wallGroup.add( leftWallMesh_Top );

        // Create and position the bottom subdivision of the left wall
        const leftWallMesh_Bottom = new THREE.Mesh( leftWallTopBottomGeometry, this.wallMaterial_TopBottomSubdivisions );
        leftWallMesh_Bottom.position.set( -this.wallX / 2, this.wallY / 6, 0 );
        leftWallMesh_Bottom.rotation.y = Math.PI / 2;
        // Enable shadow casting
        leftWallMesh_Bottom.castShadow = true;
        this.wallGroup.add( leftWallMesh_Bottom );

        // Setup geometry for the left and right subdivisions of the left wall
        const leftWallLeftRightGeometry = new THREE.PlaneGeometry( this.wallX / 3, this.wallY / 3 );

        // Create and position the left subdivision of the left wall
        const leftWallMesh_Left = new THREE.Mesh( leftWallLeftRightGeometry, this.wallTextureLeft_LeftRightSubdivisions );
        leftWallMesh_Left.position.set( -this.wallX / 2, this.wallY / 2, this.wallX / 3 );
        leftWallMesh_Left.rotation.y = Math.PI / 2;
        // Enable shadow casting
        leftWallMesh_Left.castShadow = true;
        this.wallGroup.add( leftWallMesh_Left );

        // Create and position the right subdivision of the left wall
        const leftWallMesh_Right = new THREE.Mesh( leftWallLeftRightGeometry, this.wallTextureLeft_LeftRightSubdivisions );
        leftWallMesh_Right.position.set( -this.wallX / 2, this.wallY / 2, -this.wallX / 3 );
        leftWallMesh_Right.rotation.y = Math.PI / 2;
        // Enable shadow casting
        leftWallMesh_Right.castShadow = true;
        this.wallGroup.add( leftWallMesh_Right );

        // Add the frame around the gap
        this.windowFrame.addToScene(
            this.wallGroup,
            new THREE.Vector3( -this.wallX / 2, this.wallY / 2, 0 )
        );
    }

    /**
     * Adds the wall group to the scene
     * @param {THREE.Scene} scene
     */
    addToScene(scene) {
        this.createWallGroup();
        scene.add(this.wallGroup);
    }
}

export { Wall };