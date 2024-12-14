import * as THREE from 'three';

class Chair {
    constructor(texturePath) {
        this.texturePath = texturePath;

        // Define chair dimensions
        this.seatWidth = 1;
        this.seatDepth = 1;
        this.seatHeight = 0.2;
        this.legHeight = 1;
        this.backrestHeight = 1.2;

        // Load texture
        this.texture = new THREE.TextureLoader().load( this.texturePath );
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.RepeatWrapping;

        // Material for the chair
        this.material = new THREE.MeshPhongMaterial( { map: this.texture } );

        // Group to hold all chair parts
        this.chairGroup = new THREE.Group();

        // Create chair parts and add them to the group
        this.createChair();
    }

    createChair() {
        // Create the seat
        const seatGeometry = new THREE.BoxGeometry( this.seatWidth, this.seatHeight, this.seatDepth );
        const seatMesh = new THREE.Mesh( seatGeometry, this.material );
        seatMesh.position.y = this.legHeight;
        // Enable shadow casting and receiving
        seatMesh.castShadow = true;
        seatMesh.receiveShadow = true;
        this.chairGroup.add( seatMesh );

        // Create the backrest
        const backrestGeometry = new THREE.BoxGeometry(
            this.seatWidth,
            this.backrestHeight,
            this.seatHeight / 4
        );
        const backrestMesh = new THREE.Mesh( backrestGeometry, this.material );
        backrestMesh.position.set(
            0,
            this.legHeight + this.backrestHeight / 2 + this.seatHeight / 2,
            -this.seatDepth / 2 + this.seatHeight / 8
        );
        // Enable shadow casting and receiving
        backrestMesh.castShadow = true;
        backrestMesh.receiveShadow = true;
        this.chairGroup.add( backrestMesh );

        // Create the legs
        const legGeometry = new THREE.CylinderGeometry( 0.1, 0.1, this.legHeight, 16 );
        const positions = [
            [ this.seatWidth / 2 - 0.1, this.legHeight / 2, this.seatDepth / 2 - 0.1 ],
            [ -this.seatWidth / 2 + 0.1, this.legHeight / 2, this.seatDepth / 2 - 0.1 ],
            [ this.seatWidth / 2 - 0.1, this.legHeight / 2, -this.seatDepth / 2 + 0.1 ],
            [ -this.seatWidth / 2 + 0.1, this.legHeight / 2, -this.seatDepth / 2 + 0.1 ]
        ];

        positions.forEach( ( [ x, y, z ] ) => {
            const legMesh = new THREE.Mesh( legGeometry, this.material );
            legMesh.position.set( x, y, z );
            // Enable shadow casting and receiving
            legMesh.castShadow = true;
            legMesh.receiveShadow = true;
            this.chairGroup.add( legMesh );
        });
    }

    // Set the chair position
    setPosition(position) {
        this.chairGroup.position.copy(position);
    }

    // Add the chair to the scene in the given position
    addToScene(scene, position) {
        this.chairGroup.position.copy( position );
        // Turn the chair to face the window
        this.chairGroup.rotation.y = -Math.PI / 2;
        scene.add( this.chairGroup );
    }
}

export { Chair };