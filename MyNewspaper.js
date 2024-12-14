import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

class Newspaper {
    constructor(texturePath) {
        this.texturePath = texturePath;

        // Load texture for the newspaper
        this.texture = new THREE.TextureLoader().load( this.texturePath );
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.RepeatWrapping;
        this.texture.repeat.set( 1, 1 );

        // Material setup
        this.material = new THREE.MeshLambertMaterial({
            map: this.texture,
            side: THREE.DoubleSide
        });

        this.builder = new MyNurbsBuilder();

        // Define parameters for NURBS surfaces
        this.orderU = 2;
        this.orderV = 1;
        this.samplesU = 16;
        this.samplesV = 1;

        // Group to hold both newspaper surfaces
        this.group = new THREE.Group();
    }

    createSpine(beginZ, endZ) {
        const spineHeight = -beginZ;
        // Spine thickness to fill the gap from -Z to +Z
        const spineDepth = -endZ * 2;
        const spineWidth = spineDepth * 0.1;

        // Setup geometry for the spine
        const spineGeometry = new THREE.BoxGeometry( spineWidth, spineHeight, spineDepth );

        // Setup the mesh
        const spineMaterial = new THREE.MeshLambertMaterial({
            map: this.texture
        });
        const spine = new THREE.Mesh( spineGeometry, spineMaterial );

        // Center the spine along the gap between left and right pages
        spine.position.set( 0.05, 0, 0 );

        // Add the spine to the group
        this.group.add( spine );
    }

    createSurfaces() {
        // Clear previous meshes
        this.group.clear();

        // X constant numbers
        const endX = 0.05;
        // Y constant numbers
        const Y = 0.25;
        // Z constant numbers
        const beginZ = -0.5;
        const middleZ = -0.25;
        const endZ = -0.001;
        // Weight constant
        const W = 1;

        // X numbers for leftBottom
        const leftBottomX_P1 = 0.0475;
        const leftBottomX_P2 = 0.375;

        // Control points for left side (bottom page)
        const leftBottomControlPoints = [
            // U = 0
            [ // V = ​​0..1;
                [ leftBottomX_P1, -Y, beginZ, W ],
                [ leftBottomX_P1,  Y, beginZ, W ]
            ],

            // U = 1
            [ // V = ​​0..1
                [ leftBottomX_P2, -Y, middleZ, W ],
                [ leftBottomX_P2,  Y, middleZ, W ]
            ],

            // U = 2
            [ // V = ​​0..1
                [ endX, -Y, endZ, W ],
                [ endX,  Y, endZ, W ]
            ]

        ];

        const leftBottomSurface = this.builder.build(
            leftBottomControlPoints,
            this.orderU,
            this.orderV,
            this.samplesU,
            this.samplesV,
            this.material
        );

        // X numbers for leftMiddle
        const leftMiddleX_P1 = 0.0675;
        const leftMiddleX_P2 = 0.3875;

        // Control points for left side (middle page)
        const leftMiddleControlPoints = [
            // U = 0
            [ // V = ​​0..1;
                [ leftMiddleX_P1, -Y, beginZ, W ],
                [ leftMiddleX_P1,  Y, beginZ, W ]
            ],

            // U = 1
            [ // V = ​​0..1
                [ leftMiddleX_P2, -Y, middleZ, W ],
                [ leftMiddleX_P2,  Y, middleZ, W ]
            ],

            // U = 2
            [ // V = ​​0..1
                [ endX, -Y, endZ, W ],
                [ endX,  Y, endZ, W ]
            ]

        ];

        const leftMiddleSurface = this.builder.build(
            leftMiddleControlPoints,
            this.orderU,
            this.orderV,
            this.samplesU,
            this.samplesV,
            this.material
        );

        // X numbers for leftTop
        const leftTopX_P1 = 0.1;
        const leftTopX_P2 = 0.4;

        // Control points for left side (top page)
        const leftTopControlPoints = [
            // U = 0
            [ // V = ​​0..1;
                [ leftTopX_P1, -Y, beginZ, W ],
                [ leftTopX_P1,  Y, beginZ, W ]
            ],

            // U = 1
            [ // V = ​​0..1
                [ leftTopX_P2, -Y, middleZ, W ],
                [ leftTopX_P2,  Y, middleZ, W ]
            ],

            // U = 2
            [ // V = ​​0..1
                [ endX, -Y, endZ, W ],
                [ endX,  Y, endZ, W ]
            ]

        ];

        const leftTopSurface = this.builder.build(
            leftTopControlPoints,
            this.orderU,
            this.orderV,
            this.samplesU,
            this.samplesV,
            this.material
        );

        // Function to mirror the left surfaces to create right side surfaces
        const mirrorControlPoints = controlPoints => controlPoints.map( row =>
            row.map( ( [ x, y, z, w ] ) => [ x, y, -z, w ] )
        );

        const rightBottomControlPoints = mirrorControlPoints( leftBottomControlPoints );
        const rightBottomSurface = this.builder.build(
            rightBottomControlPoints,
            this.orderU,
            this.orderV,
            this.samplesU,
            this.samplesV,
            this.material
        );

        const rightMiddleControlPoints = mirrorControlPoints( leftMiddleControlPoints );
        const rightMiddleSurface = this.builder.build(
            rightMiddleControlPoints,
            this.orderU,
            this.orderV,
            this.samplesU,
            this.samplesV,
            this.material
        );

        const rightTopControlPoints = mirrorControlPoints( leftTopControlPoints );
        const rightTopSurface = this.builder.build(
            rightTopControlPoints,
            this.orderU,
            this.orderV,
            this.samplesU,
            this.samplesV,
            this.material
        );

        // If receiveShadow is set to "true", the newspaper texture starts glitching
        const leftBottomMesh = new THREE.Mesh( leftBottomSurface, this.material );
        leftBottomMesh.castShadow = true;
        //leftBottomMesh.receiveShadow = true;
        const leftMiddleMesh = new THREE.Mesh( leftMiddleSurface, this.material );
        leftMiddleMesh.castShadow = true;
        //leftMiddleMesh.receiveShadow = true;
        const leftTopMesh = new THREE.Mesh( leftTopSurface, this.material );
        leftTopMesh.castShadow = true;
        //leftTopMesh.receiveShadow = true;
        const rightBottomMesh = new THREE.Mesh( rightBottomSurface, this.material );
        rightBottomMesh.castShadow = true;
        //rightBottomMesh.receiveShadow = true;
        const rightMiddleMesh = new THREE.Mesh( rightMiddleSurface, this.material );
        rightMiddleMesh.castShadow = true;
        //rightMiddleMesh.receiveShadow = true;
        const rightTopMesh = new THREE.Mesh( rightTopSurface, this.material );
        rightTopMesh.castShadow = true;
        //rightTopMesh.receiveShadow = true;

        // Add meshes to the group
        this.group.add( leftBottomMesh );
        this.group.add( leftMiddleMesh );
        this.group.add( leftTopMesh );
        this.group.add( rightBottomMesh );
        this.group.add( rightMiddleMesh );
        this.group.add( rightTopMesh );

        this.createSpine( beginZ, endZ );
    }

    // Method to get the current position of the group
    get position() {
        return this.group.position.clone();
    }

    // Method to get the current rotation of the group
    get rotation() {
        return this.group.rotation.clone();
    }

    // Method to set the position of the entire group
    setPosition(position) {
        const newPosition = new THREE.Vector3(
            position.x,
            position.y,
            position.z
        )
        this.group.position.copy( newPosition );
    }

    // Method to set the rotation of the entire group
    setRotation(x, y, z) {
        const rotation = new THREE.Euler( x, y, z );
        this.group.rotation.copy( rotation );
    }

    // Methods to set sampling for U
    setSamplesU(samples) {
        this.samplesU = samples;
        this.createSurfaces();
    }

    // Method to set sampling for V
    /* Not needed: V is a line, not a curve, sampling isnt necessary.
    setSamplesV(samples) {
        this.samplesV = samples;
        this.createSurfaces();
    }
    */

    // Method to add the newspaper to the scene
    addToScene(scene, position) {
        this.createSurfaces();
        // Y offset = 0.05 when added to the scene so it lays on the table
        const positionWithOffsetY = new THREE.Vector3(
            position.x,
            position.y + 0.05,
            position.z
        );
        this.setPosition( positionWithOffsetY );
        // Rotation in Z = Math.PI / 2, to align it with the table given the surface control points
        this.setRotation( 0, 0, Math.PI / 2 );
        scene.add( this.group );
    }
}

export { Newspaper };