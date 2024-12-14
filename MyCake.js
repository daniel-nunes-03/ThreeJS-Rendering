import * as THREE from 'three';

class Cake {
    constructor(radius, height, sideTexturePath, topTexturePath) {
        this.radius = radius;
        this.height = height;
        this.sideTexturePath = sideTexturePath;
        this.topTexturePath = topTexturePath;
        this.samples = 9;

        // Load side texture
        this.sideTexture = new THREE.TextureLoader().load( sideTexturePath );
        this.sideTexture.wrapS = THREE.MirroredRepeatWrapping;
        this.sideTexture.wrapT = THREE.MirroredRepeatWrapping;

        // Load top texture
        this.topTexture = new THREE.TextureLoader().load( topTexturePath );
        this.topTexture.wrapS = THREE.MirroredRepeatWrapping;
        this.topTexture.wrapT = THREE.MirroredRepeatWrapping;
        this.topTexture.repeat.set( 2, 6 );

        // Cake material
        this.sideMaterial = new THREE.MeshPhongMaterial({
            color: "#ffffff",
            shininess: 0,
            specular: new THREE.Color( "#444444" ),
            map: this.sideTexture
        });

        this.topMaterial = new THREE.MeshPhongMaterial({
            color: "#ffffff",
            shininess: 10,
            specular: new THREE.Color("#777777"),
            map: this.topTexture
        });

        // Group to hold both parts
        this.cakeGroup = new THREE.Group();

        this.createCakeSide();
        this.createCakeTop();
    }

    // Function to create the base shape using Bézier curves
    generateCakeShape() {
        const shape = new THREE.Shape();

        // Start angle of the 7/8 circle
        const startAngle = -Math.PI / 4;
        const angleIncrement = ( 7 / 8 ) * Math.PI * 2 / this.samples;

        // Define points for the 7/8 circle shape
        const points = Array.from( { length: this.samples }, ( _, i ) => {
            const angle = startAngle + i * angleIncrement;
            return {
                start: new THREE.Vector2(
                    this.radius * Math.cos( angle ),
                    this.radius * Math.sin( angle )
                ),
                control1: new THREE.Vector2(
                    this.radius * Math.cos( angle + angleIncrement / 3 ),
                    this.radius * Math.sin( angle + angleIncrement / 3 )
                ),
                control2: new THREE.Vector2(
                    this.radius * Math.cos( angle + ( 2 * angleIncrement ) / 3 ),
                    this.radius * Math.sin( angle + ( 2 * angleIncrement ) / 3 )
                ),
                end: new THREE.Vector2(
                    this.radius * Math.cos( angle + angleIncrement ),
                    this.radius * Math.sin( angle + angleIncrement )
                )
            };
        });

        // Start from the origin
        shape.moveTo( 0, 0 );

        // Draw the Bézier curves to complete the shape
        points.forEach( segment => {
            shape.lineTo( segment.start.x, segment.start.y );
            shape.bezierCurveTo(
                segment.control1.x, segment.control1.y,
                segment.control2.x, segment.control2.y,
                segment.end.x, segment.end.y
            );
        });

        // Close the shape by returning to the center
        shape.lineTo( 0, 0 );

        return shape;
    }

    // Function to create the cake side
    createCakeSide() {
        const shape = this.generateCakeShape();

        // Extrude the shape to create volume for the side
        const extrudeSettings = {
            depth: this.height,
            bevelEnabled: false,
            curveSegments: this.samples
        };

        const sideGeometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
        this.sideMesh = new THREE.Mesh( sideGeometry, this.sideMaterial );
        this.sideMesh.rotation.x = -Math.PI / 2;

        // Enable shadow casting
        this.sideMesh.castShadow = true;
        this.sideMesh.receiveShadow = true;

        // Add the side mesh to the group
        this.cakeGroup.add( this.sideMesh );
    }

    // Function to create the cake top
    createCakeTop() {
        const shape = this.generateCakeShape();

        // Create the top geometry based on the shape
        const topGeometry = new THREE.ShapeGeometry( shape );
        this.topMesh = new THREE.Mesh( topGeometry, this.topMaterial );

        // Position the top just above the side with a small offset
        this.topOffsetY = 0.001;
        this.topMesh.position.y = this.height + this.topOffsetY;
        this.topMesh.rotation.x = -Math.PI / 2;

        // Enable shadows for the top
        this.topMesh.castShadow = true;
        this.topMesh.receiveShadow = true;

        // Add the top mesh to the group
        this.cakeGroup.add( this.topMesh );
    }

    // Method to update the number of samples and recreate the cake geometry
    updateSamples(samples) {
        this.samples = samples;
        this.cakeGroup.clear();
        this.createCakeSide();
        this.createCakeTop();
    }

    /*
    // Method to add the cake to the scene
    addToScene(scene, positionY) {
        this.mesh.position.y = positionY - this.height / 2;
        // Rotate the cake to make it parallel to the plate
        this.mesh.rotation.x = -Math.PI / 2;
        scene.add( this.mesh );
    }
    */

    // Method to add the cake to the scene
    addToScene( scene, positionY ) {
        this.cakeGroup.position.y = positionY - this.height / 2;
        scene.add(this.cakeGroup);
    }
}

export { Cake };