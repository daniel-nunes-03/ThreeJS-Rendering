import * as THREE from 'three';

class Spring {
    constructor(radius, heightPerTurn, turns) {
        this.radius = radius;
        this.heightPerTurn = heightPerTurn;
        this.turns = turns;
        // Default value for initial points per turn
        this.pointsPerTurn = 16;
        // Tube thickness coefficient
        this.thicknessCoefficient = 0.1;
        // Default value for radial segments
        this.radialSegments = 8

        this.material = new THREE.MeshPhongMaterial({
            color: "#000000",
            specular: "#ffffff",
            shininess: 100
        });

        this.updateSpringGeometry();
    }

    /**
        Method to create and update the spring geometry
        Source of the helix progression formula: https://physics.icalculator.com/helix-curve-calculator.html
    */
    updateSpringGeometry() {
        const points = [];
        const spiralStartAngle = 0;
        const totalHeight = this.heightPerTurn * this.turns;

        // Bottom floor turn (flat)
        for (let i = 0; i < this.pointsPerTurn; i++) {
            const angle = ( i / this.pointsPerTurn ) * Math.PI * 2;
            const x = this.radius * Math.cos( angle );
            const z = this.radius * Math.sin( angle );
            points.push( new THREE.Vector3( x, 0, z ) );
        }

        // Spiral with height progression
        for (let i = 0; i < this.turns * this.pointsPerTurn; i++) {
            const angle = ( spiralStartAngle + i / this.pointsPerTurn ) * Math.PI * 2;
            const x = this.radius * Math.cos( angle );
            const z = this.radius * Math.sin( angle );
            // Current point number / ( turn total number * ammount of points per turn [SAMPLING] ) * total height wanted
            const y = ( i / ( this.turns * this.pointsPerTurn ) ) * totalHeight;
            points.push( new THREE.Vector3( x, y, z ) );
        }

        // Top floor turn (flat)
        for (let i = 0; i < this.pointsPerTurn; i++) {
            const angle = ( i / this.pointsPerTurn ) * Math.PI * 2;
            const x = this.radius * Math.cos( angle );
            const z = this.radius * Math.sin( angle );
            points.push( new THREE.Vector3( x, totalHeight, z ));
        }

        // Generate CatmullRom curve and tube geometry
        this.path = new THREE.CatmullRomCurve3( points );
        this.geometry = new THREE.TubeGeometry(
            this.path,
            this.turns * this.pointsPerTurn, // tubular segments
            this.radius * this.thicknessCoefficient,
            this.radialSegments,
            false
        );

        // Create or update mesh
        if (!this.mesh) {
            this.mesh = new THREE.Mesh( this.geometry, this.material );
        } else {
            this.mesh.geometry.dispose();
            this.mesh.geometry = this.geometry;
        }

        // Enable casting and receiving shadows
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    }

    // Method to change radius
    setRadius(radius) {
        this.radius = radius;
        this.updateSpringGeometry();
    }

    // Method to change thickness coefficient
    setThicknessCoefficient(thicknessCoefficient) {
        this.thicknessCoefficient = thicknessCoefficient;
        this.updateSpringGeometry();
    }

    // Method to change height per turn
    setHeightPerTurn(heightPerTurn) {
        this.heightPerTurn = heightPerTurn;
        this.updateSpringGeometry();
    }

    // Method to change number of turns
    setTurns(turns) {
        this.turns = turns;
        this.updateSpringGeometry();
    }

    // Method to change points per turn
    setPointsPerTurn(pointsPerTurn) {
        this.pointsPerTurn = pointsPerTurn;
        this.updateSpringGeometry();
    }

    // Method to change radial segments
    setRadialSegments(radialSegments) {
        this.radialSegments = radialSegments;
        this.updateSpringGeometry();
    }

    // Add spring to the scene at specified position
    addToScene(scene, position) {
        this.mesh.position.copy( position );
        scene.add( this.mesh );
    }
}

export { Spring };