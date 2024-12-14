import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

class Flower {
    constructor() {
        this.group = new THREE.Group();

        this.builder = new MyNurbsBuilder();

        this.createStem();
        this.createCenter();
        this.createPetals();
    }

    // Method to create the flower stem
    createStem() {
        // Setup the curve
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3( 0, 0, 0 ),
            new THREE.Vector3( 0.1, 0.5, 0 ),
            new THREE.Vector3( 0.2, 1.0, 0.1 ),
            new THREE.Vector3( 0, 1.5, 0 )
        ]);

        // Setup the geometry
        const tubeGeometry = new THREE.TubeGeometry(
            curve,
            20,     // tubular segments
            0.02,   // radius
            8,      // radial segments
            true
        );
        const stemMaterial = new THREE.MeshBasicMaterial( { color: "#006400" } ); // rgb(0,100,0)
        const stem = new THREE.Mesh( tubeGeometry, stemMaterial );
        // Enable shadow casting
        stem.castShadow = true;
        this.group.add( stem );
    }

    // Method to create the center of the flower
    createCenter() {
        const centerMaterial = new THREE.MeshLambertMaterial({
            color: "#ffff00",
            side: THREE.DoubleSide
        });
    
        const centerGroup = new THREE.Group();
    
        // Radius of the semi-circle
        const radius = 0.2;
        // Thickness of the extrusion
        const thickness = 0.04;
    
        // Surface control points
        const centerControlPoints = [
            [
                [ 0, 0, thickness / 2, 1 ],
                [ radius * Math.cos( -Math.PI / 4 ), radius * Math.sin( -Math.PI / 4 ), thickness / 2, 1 ],
                [ radius, 0, thickness / 2, 1 ]
            ],
            [
                [ 0, 0, thickness / 2, 1 ],
                [ 0, 0, thickness / 2, 1 ],
                [ 0, 0, thickness / 2, 1 ]
            ],
            [
                [ 0, 0, thickness / 2, 1 ],
                [ radius * Math.cos( Math.PI / 4 ), radius * Math.sin( Math.PI / 4 ), thickness / 2, 1 ],
                [ radius, 0, thickness / 2, 1 ]
            ]
        ];
    
        // Mirrored surface control points (for the other side)
        const mirroredControlPoints = centerControlPoints.map(row =>
            row.map( ( [ x, y, z, w ] ) => [ x, y, -z, w ] )
        );
    
        // Build center and mirrored surfaces
        const centerSurface = this.builder.build(
            centerControlPoints,
            2, 2, 16, 16, centerMaterial
        );
    
        const mirroredSurface = this.builder.build(
            mirroredControlPoints,
            2, 2, 16, 16, centerMaterial
        );
    
        // Create side surfaces to connect their edges
        const sideSurfaces = [];
        for (let i = 0; i < 3; i++) {
            const sideControlPoints = [
                [ centerControlPoints[ i ][ 0 ], mirroredControlPoints[ i ][ 0 ] ],
                [ centerControlPoints[ i ][ 1 ], mirroredControlPoints[ i ][ 1 ] ],
                [ centerControlPoints[ i ][ 2 ], mirroredControlPoints[ i ][ 2 ] ]
            ];
    
            const sideSurface = this.builder.build(
                sideControlPoints,
                2, 1, 8, 16, centerMaterial
            );
    
            sideSurfaces.push( new THREE.Mesh( sideSurface, centerMaterial ) );
        }
    
        // Add all surfaces to the group
        const centerMesh = new THREE.Mesh( centerSurface, centerMaterial );
        const mirroredMesh = new THREE.Mesh( mirroredSurface, centerMaterial );

        // Enable shadow casting
        centerMesh.castShadow = true;
        mirroredMesh.castShadow = true;
    
        centerGroup.add( centerMesh );
        centerGroup.add( mirroredMesh );
        sideSurfaces.forEach( sideMesh => {
            // Enable shadow casting
            sideMesh.castShadow = true;
            centerGroup.add( sideMesh );
        });
    
        // Position and rotation adjustments
        centerGroup.position.set( -0.05, 1.4, 0.025 );
        centerGroup.rotation.x = Math.PI / 2;
        centerGroup.rotation.y = Math.PI * 0.15;
        this.group.add( centerGroup );
    }    

    // Method to create flower petals
    createPetals() {
        const petalMaterial = new THREE.MeshLambertMaterial({
            color: "#ff0000",
            side: THREE.DoubleSide
        });

        const middleX_P1 = 0.1;
        const endX_P1 = middleX_P1 * 2;
        const endX = endX_P1 * 2;
        const Yoffset_P2 = 0.1;
        const Yoffset_P3 = Yoffset_P2 * 2;
        const Zoffset = 0.01;

        // Setup control points
        const petalControlPoints = [
            [
                [ 0, 0, Zoffset, 1 ],
                [ middleX_P1, 0, Zoffset, 1 ],
                [ endX_P1, 0, Zoffset, 1 ]
            ],
            [
                [ 0, 0, 0, 1 ],
                [ endX_P1, Yoffset_P2, 0, 1 ],
                [ endX, 0, 0, 1 ]
            ],
            [
                [ 0, 0, 0, 1 ],
                [ endX_P1, Yoffset_P3, 0, 1 ],
                [ endX, 0, 0, 1 ]
            ]
        ];

        // Build the NURBS surface for the petal
        const petalSurface = this.builder.build(
            petalControlPoints,
            2, // Order in U
            2, // Order in V
            16, // Samples in U
            16, // Samples in V
            petalMaterial
        );

        // Mirrored surface control points (for the other side)
        const mirroredPetalControlPoints = petalControlPoints.map(row =>
            row.map( ( [ x, y, z, w ] ) => [ x, -y, z, w ] )
        );

        // Build the NURBS surface for the petal
        const mirroredPetalSurface = this.builder.build(
            mirroredPetalControlPoints,
            2, // Order in U
            2, // Order in V
            16, // Samples in U
            16, // Samples in V
            petalMaterial
        );
    
        // Offset to align petals along the center's perimeter
        const petalOffset = 0.05;

        for (let i = 0; i < 6; i++) {
            const petalMesh = new THREE.Mesh( petalSurface, petalMaterial );
            const mirroredPetalMesh = new THREE.Mesh( mirroredPetalSurface, petalMaterial )

            // Calculate the angle for the current petal
            const angle = ( i / 6 ) * Math.PI * 2;

            // Position each petal on the perimeter of the center
            petalMesh.position.set(
                petalOffset * Math.cos( angle ) + 0.0255, // Offset center x
                1.44,
                petalOffset * Math.sin( angle ) + 0.018 // Offset center z
            );

            // Rotate each petal to face outward from the center
            petalMesh.rotation.z = angle;
            petalMesh.rotation.x = Math.PI / 2;
            
            // Slight adjustments for the first and the forth petals (extreme top and bottom)
            if (i == 0) {
                petalMesh.translateZ( -0.012 );
            } else if (i == 3) {
                petalMesh.translateZ( 0.012 );
            }

            petalMesh.rotation.y = Math.PI * 0.25;

            // Copy position and rotation from petalMesh to mirroredPetalMesh
            mirroredPetalMesh.position.copy( petalMesh.position );
            mirroredPetalMesh.rotation.copy( petalMesh.rotation );

            // Enable shadow casting
            petalMesh.castShadow = true;
            mirroredPetalMesh.castShadow = true;

            this.group.add( petalMesh );
            this.group.add( mirroredPetalMesh );
        }
    }

    // Method to set the position of the entire group
    setPosition(position) {
        const newPosition = new THREE.Vector3(
            position.x,
            position.y + 0.1,
            position.z
        )
        this.group.position.copy( newPosition );
    }

    // Method to set the rotation of the entire group
    setRotation(x, y, z) {
        const rotation = new THREE.Euler( x, y, z );
        this.group.rotation.copy( rotation );
    }

    addToScene(scene, position) {
        this.group.position.copy( position );
        this.group.scale.set( 1, 0.9, 0.9 );
        scene.add( this.group );
    }
}

export { Flower };