import * as THREE from 'three';

class Table {
    /**
     * Constructs the table object
     * @param {string} legTexturePath - Path to the texture for the table legs.
     * @param {string} topTexturePath - Path to the texture for the table top.
     */
    constructor(legTexturePath, topTexturePath) {
        // Table leg related attributes
        this.legDimensions = new THREE.Vector3( 0.3, 1.5, 0.3 );
        this.legTexturePath = legTexturePath;

        // Table leg texture setup
        this.legTexture = new THREE.TextureLoader().load( this.legTexturePath );
        this.legTexture.wrapS = THREE.MirroredRepeatWrapping;
        this.legTexture.wrapT = THREE.MirroredRepeatWrapping;

        // Table leg material setup
        this.legMaterial = new THREE.MeshPhongMaterial({
            color: "#808080",
            specular: "#000000",
            emissive: "#000000",
            shininess: 0,
            map: this.legTexture,
        });
        this.legRadialSegments = 24;
        this.legPositions = [
            { x: -this.legDimensions.x * 4, z: -this.legDimensions.x * 3 },
            { x: this.legDimensions.x * 4, z: -this.legDimensions.x * 3 },
            { x: -this.legDimensions.x * 4, z: this.legDimensions.x * 3 },
            { x: this.legDimensions.x * 4, z: this.legDimensions.x * 3 },
        ];

        // Table top related attributes
        this.topDimensions = new THREE.Vector3( 4, this.legDimensions.y / 6, 3 );
        this.topTexturePath = topTexturePath;
        this.topTexture = new THREE.TextureLoader().load( this.topTexturePath );
        this.topTexture.wrapS = THREE.MirroredRepeatWrapping;
        this.topTexture.wrapT = THREE.MirroredRepeatWrapping;
        this.topTexture.repeat.set( 5, ( this.topDimensions.y / this.topDimensions.x ) * ( 720 / 960 ) );
        this.topMaterial = new THREE.MeshPhongMaterial({
            color: "#676767",
            specular: "#000000",
            emissive: "#000000",
            shininess: 0,
            map: this.topTexture,
        });

        // Create table mesh
        this.tableGroup = this.createTable();
    }

    // Getter for leg radius
    get legRadius() {
        return this.legDimensions.x;
    }

    // Getter for leg height
    get legHeight() {
        return this.legDimensions.y;
    }

    get topDimensionX() {
        return this.topDimensions.x;
    }

    get topDimensionZ() {
        return this.topDimensions.z;
    }

    // Getter for top height
    get topHeight() {
        return this.topDimensions.y;
    }

    /**
     * Creates the table legs and top and groups them
     * @returns {THREE.Group} - Group containing the table legs and top
     */
    createTable() {
        const tableGroup = new THREE.Group();

        // Create table legs
        const legGeometry = new THREE.CylinderGeometry(
            this.legDimensions.x,
            this.legDimensions.z,
            this.legDimensions.y,
            this.legRadialSegments
        );

        this.legPositions.forEach(legPos => {
            const legMesh = new THREE.Mesh( legGeometry, this.legMaterial );
            legMesh.position.set( legPos.x, this.legDimensions.y / 2, legPos.z );

            // Enable casting and receiving shadows for the legs
            legMesh.castShadow = true;
            legMesh.receiveShadow = true;

            tableGroup.add( legMesh );
        });

        // Create table top
        const topGeometry = new THREE.BoxGeometry(
            this.topDimensions.x,
            this.topDimensions.y,
            this.topDimensions.z
        );
        const topMesh = new THREE.Mesh( topGeometry, this.topMaterial );
        topMesh.position.set( 0, this.legDimensions.y, 0 );

        // Enable casting and receiving shadows for the top
        topMesh.castShadow = true;
        topMesh.receiveShadow = true;

        tableGroup.add( topMesh );

        return tableGroup;
    }

    /**
     * Adds the table to the scene
     * @param {THREE.Scene} scene - The scene to which the table is added
     */
    addToScene(scene) {
        scene.add( this.tableGroup );
    }
}

export { Table };