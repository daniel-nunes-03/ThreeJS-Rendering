import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

class Jar {
    constructor() {
        this.material = new THREE.MeshLambertMaterial({
            color: "#e5e5e5",
            side: THREE.DoubleSide
        });

        this.materialBottom = new THREE.MeshLambertMaterial({
            color: "#a68b71",  // rgb(166,139,113) to simulate soil
            side: THREE.DoubleSide
        });

        // Define parameters for NURBS surfaces
        this.orderU = 2;
        this.orderV = 2;
        this.samplesU = 16;
        this.samplesV = 16;

        this.builder = new MyNurbsBuilder();
        this.group = new THREE.Group();
    }

    createJarSurfaces() {
        this.group.clear();

        const leftMiddleX_P1 = 0.2;
        const leftEndX_P1 = leftMiddleX_P1 * 2;
        const leftXoffset = 0.05;
        const leftMiddleX_P2 = leftMiddleX_P1 - leftXoffset;
        const leftEndX_P2 = leftMiddleX_P2 * 2;
        const leftMiddleX_P3 = leftMiddleX_P2 - leftXoffset;
        // For a more pointy ending on the top of the jar
        const leftEndX_P3 = leftMiddleX_P3 * 5;
        const leftMiddleY_P1 = 0.2;
        const leftMiddleY_P2 = leftMiddleY_P1 * 3/4;
        const leftZoffset_P2 = 0.5;
        const leftMiddleY_P3 = leftMiddleX_P1 * 2;
        const leftZoffset_P3 = leftZoffset_P2 * 2;

        // Left curve control points
        const leftControlPoints = [
            [ // Base of the jar
                // Bottom left ; Bottom center ; Top left
                [ 0, 0, 0, 1 ],
                [ leftMiddleX_P1, leftMiddleY_P1, 0, 1 ],
                [ leftEndX_P1, 0, 0, 1 ]
            ],
            [ // Middle of the jar
                [ 0, 0, leftZoffset_P2, 1 ],
                [ leftMiddleX_P2, leftMiddleY_P2, leftZoffset_P2, 1 ],
                [ leftEndX_P2, 0, leftZoffset_P2, 1 ]
            ],
            [ // Top of the jar opening
                [ 0, 0, leftZoffset_P3, 1 ],
                [ leftMiddleX_P3, leftMiddleY_P3, leftZoffset_P3, 1 ],
                [ leftEndX_P3, 0, leftZoffset_P3, 1 ]
            ]
        ];

        const leftSurface = this.builder.build(
            leftControlPoints,
            this.orderU,
            this.orderV,
            this.samplesU,
            this.samplesV,
            this.material
        );


        // Right curve control points
        const rightControlPoints = leftControlPoints.map( row => 
            row.map( ( [ x, y, z, w ] ) => [ x, -y, z, w ] )
        );

        const rightSurface = this.builder.build(
            rightControlPoints,
            this.orderU,
            this.orderV,
            this.samplesU,
            this.samplesV,
            this.material
        );

        const bottomMiddleX_P1 = 0.1;
        const bottomEndX_P1 = bottomMiddleX_P1 * 2;
        const bottomEndX = bottomEndX_P1 * 2;
        const bottomYoffset_P2 = 0.1;
        const bottomYoffset_P3 = bottomYoffset_P2 * 2;
        const bottomZoffset = 0.01;

        // Left jar foundation control points
        const bottomLeftControlPoints = [
            [
                [ 0, 0, bottomZoffset, 1 ],
                [ bottomMiddleX_P1, 0, bottomZoffset, 1 ],
                [ bottomEndX_P1, 0, bottomZoffset, 1 ]
            ],
            [
                [ 0, 0, 0, 1 ],
                [ bottomEndX_P1, bottomYoffset_P2, 0, 1 ],
                [ bottomEndX, 0, 0, 1 ]
            ],
            [
                [ 0, 0, 0, 1 ],
                [ bottomEndX_P1, bottomYoffset_P3, 0, 1 ],
                [ bottomEndX, 0, 0, 1 ]
            ]
        ];

        const bottomLeftSurface = this.builder.build(
            bottomLeftControlPoints,
            this.orderU,
            this.orderV,
            this.samplesU,
            this.samplesV,
            this.materialBottom
        );

        // Right jar foundation control points
        const bottomRightControlPoints = bottomLeftControlPoints.map( row =>
            row.map( ( [ x, y, z, w ] ) => [ x, -y, z, w ] )
        );

        const bottomRightSurface = this.builder.build(
            bottomRightControlPoints,
            this.orderU,
            this.orderV,
            this.samplesU,
            this.samplesV,
            this.materialBottom
        );

        const leftMesh = new THREE.Mesh( leftSurface, this.material );
        leftMesh.castShadow = true;
        leftMesh.receiveShadow = true;
        const rightMesh = new THREE.Mesh( rightSurface, this.material );
        rightMesh.castShadow = true;
        rightMesh.receiveShadow = true;
        const bottomLeftMesh = new THREE.Mesh( bottomLeftSurface, this.material );
        bottomLeftMesh.castShadow = true;
        bottomLeftMesh.receiveShadow = true;
        const bottomRightMesh = new THREE.Mesh( bottomRightSurface, this.material );
        bottomRightMesh.castShadow = true;
        bottomRightMesh.receiveShadow = true;

        this.group.add( leftMesh );
        this.group.add( rightMesh );
        this.group.add( bottomLeftMesh );
        this.group.add( bottomRightMesh );
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
            position.y + 0.1,
            position.z
        )
        this.group.position.copy( newPosition );
    }

    // Method to set the rotation of the entire group
    setRotation(x, y, z) {
        // Preserves initial rotation in Z = -Math.PI / 2,
        // to align it with the table given the surface control points
        const rotation = new THREE.Euler(
            -Math.PI / 2 + x,
            z,
            y
        );
        this.group.rotation.copy( rotation );
    }
    
    // Method to add the newspaper to the scene
    addToScene(scene, position) {
        this.createJarSurfaces();
        this.setPosition( position );
        this.setRotation( 0, 0, 0 );
        scene.add( this.group );
    }
}

export { Jar };