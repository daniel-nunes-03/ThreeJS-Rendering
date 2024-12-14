import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface  {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui =  new GUI();
        this.contents = null
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init() {      
        // Camera controls
        const cameraFolder = this.datgui.addFolder( 'Camera' );
        cameraFolder.add(
            this.app,
            'activeCameraName',
            [ 'Table', 'Paintings', 'Left', 'Top', 'Front', 'Right', 'Back' ]
        ).name( "Active Camera" );
        cameraFolder.close();

        // Pointlight controls
        const pointlightFolderData = {
            'Color': this.contents.pointLight.color,
            'Intensity': this.contents.pointLight.intensity,
            'Distance': this.contents.pointLight.distance,
            'Decay': this.contents.pointLight.decay,
        };

        const pointlightFolder = this.datgui.addFolder( 'Pointlight' );
        pointlightFolder.addColor( pointlightFolderData, 'Color' ).onChange( value =>
            this.contents.updatePointlightColor( value )
        );
        pointlightFolder.add( pointlightFolderData, 'Intensity', 0, 40 ).onChange( value =>
            this.contents.updatePointlightIntensity( value )
        );
        pointlightFolder.add( pointlightFolderData, 'Distance', 0, 100 ).onChange( value =>
            this.contents.updatePointlightDistance( value )
        );
        pointlightFolder.add( pointlightFolderData, 'Decay', 0, 3 ).onChange( value =>
            this.contents.updatePointlightDecay( value )
        );
        pointlightFolder.close();

        // Window Spotlight controls
        const windowSpotlightFolder = this.datgui.addFolder( 'Window Spotlight' );
        windowSpotlightFolder.add( this.contents, 'windowSpotlightEnabled' )
            .name( 'Toggle Window Spotlight' )
            .onChange( ( value ) => {
                this.contents.toggleWindowSpotlight( value );
            });
        windowSpotlightFolder.close();

        // Cake Spotlight controls
        const cakeSpotlightFolderData = {
            'Color': this.contents.cakeSpotlight.color,
            'Intensity': this.contents.cakeSpotlight.intensity,
            'Distance': this.contents.cakeSpotlight.distance,
            'Angle': this.contents.cakeSpotlight.angleDegrees,
            'Penumbra': this.contents.cakeSpotlight.penumbra,
            'Decay': this.contents.cakeSpotlight.decay
        };

        const cakeSpotlightFolder = this.datgui.addFolder( 'Cake Spotlight' );
        cakeSpotlightFolder.addColor( cakeSpotlightFolderData, 'Color' ).onChange( ( value ) => {
            this.contents.updateCakeSpotlightColor( value );
        });
        cakeSpotlightFolder.add( cakeSpotlightFolderData, 'Intensity', 0, 10 ).onChange( ( value ) => {
            this.contents.updateCakeSpotlightIntensity( value );
        });
        cakeSpotlightFolder.add( cakeSpotlightFolderData, 'Distance', 0, 10 ).onChange( ( value ) => {
            this.contents.updateCakeSpotlightDistance( value );
        });
        cakeSpotlightFolder.add( cakeSpotlightFolderData, 'Angle', 5, 45 ).onChange( ( value ) => {
            this.contents.updateCakeSpotlightAngle( value );
        });
        cakeSpotlightFolder.add( cakeSpotlightFolderData, 'Penumbra', 0, 1 ).onChange( ( value ) => {
            this.contents.updateCakeSpotlightPenumbra( value );
        });
        cakeSpotlightFolder.add( cakeSpotlightFolderData, 'Decay', 0, 3 ).onChange( ( value ) => {
            this.contents.updateCakeSpotlightDecay( value );
        });
        cakeSpotlightFolder.add( this.contents, 'cakeSpotlightEnabled' )
            .name( 'Toggle Cake Spotlight' )
            .onChange( ( value ) => {
                this.contents.toggleCakeSpotlight( value );
            });
        cakeSpotlightFolder.close();

        // Cake Spotlight Lamp and Wire controls
        const cakeSpotlightGeometryFolder = this.datgui.addFolder( 'Cake Spotlight Lamp' );
        cakeSpotlightGeometryFolder.add( this.contents.cakeSpotlight, 'lampRadialSegments', 3, 64, 1 )
            .name( 'Lamp Radial Segments' )
            .onChange( ( value ) => {
                this.contents.updateCakeSpotlightLampRadialSegments( value );
            });

        cakeSpotlightGeometryFolder.add( this.contents.cakeSpotlight, 'wireRadialSegments', 3, 64, 1 )
            .name( 'Wire Radial Segments' )
            .onChange( ( value ) => {
                this.contents.updateCakeSpotlightWireRadialSegments( value );
            });
        cakeSpotlightGeometryFolder.close();

        // Window Door controls
        const windowDoorFolder = this.datgui.addFolder( 'Window Doors' );
        // Setup the initial GUI value for the rotation (open window doors)
        const initialDoorRotation = Math.PI * 0.8;
        // Function to enable/disable the sliders
        const toggleSliders = (enabled) => {
            leftDoorRotationController.domElement.parentElement.style.pointerEvents = enabled ? 'auto' : 'none';
            rightDoorRotationController.domElement.parentElement.style.pointerEvents = enabled ? 'auto' : 'none';
        };
        // Function to update the sliders during animation
        const updateSlider = (rotation) => {
            leftDoorRotationController.setValue(rotation);
            rightDoorRotationController.setValue(rotation);
        };
        // Setup the slider controllers and link them to the update methods
        const leftDoorRotationController = windowDoorFolder
            .add( this.contents, 'leftDoorCurrentRotation', 0, initialDoorRotation )
            .name( 'Left Door Rotation' )
            .onChange( ( value ) => {
                this.contents.updateWindowLeftDoorRotation( -value );
                // Sync right door with left door
                this.contents.rightDoorCurrentRotation = value;
            });
        const rightDoorRotationController = windowDoorFolder
            .add( this.contents, 'rightDoorCurrentRotation', 0, initialDoorRotation )
            .name( 'Right Door Rotation' )
            .onChange( ( value ) => {
                this.contents.updateWindowRightDoorRotation( -value );
                // Sync left door with right door
                this.contents.leftDoorCurrentRotation = value;
            });
        // Animation duration (between 500 and 5000 ms)
        windowDoorFolder.add( this.contents, 'animationDuration', 500, 5000 ).name( 'Animation Duration (ms)' );
        windowDoorFolder
            .add( { toggle: () => this.contents.toggleDoorAnimation( updateSlider, toggleSliders ) }, 'toggle' )
            .name( 'Toggle Doors' );
        windowDoorFolder.close();

        // Plane controls
        const planeFolderData = {
            'Diffuse Color': this.contents.plane.planeDiffuseColor,
            'Specular Color': this.contents.plane.planeSpecularColor,
        };

        const planeFolder = this.datgui.addFolder( 'Plane' );
        planeFolder.addColor( planeFolderData, 'Diffuse Color' ).onChange( ( value ) => {
            this.contents.updateDiffusePlaneColor( value );
        });
        planeFolder.addColor( planeFolderData, 'Specular Color' ).onChange( ( value ) => {
            this.contents.updateSpecularPlaneColor( value );
        });
        planeFolder.add( this.contents.plane, 'planeShininess', 0, 100 ).name( "Shininess" ).onChange( ( value ) => {
            this.contents.updatePlaneShininess( value );
        });
        planeFolder.close();

        // Chair controls
        const chairFolder = this.datgui.addFolder( 'Chair' );
        const chairPosition = {
            x: this.contents.chair.chairGroup.position.x,
            z: this.contents.chair.chairGroup.position.z
        };

        chairFolder.add( chairPosition, 'x', 2, 3.5 ).name( 'Position X' ).onChange( value => {
            this.contents.updateChairPosition( new THREE.Vector3( value, chairPosition.y, chairPosition.z ) );
        });
        chairFolder.add( chairPosition, 'z', -0.5, 0.5 ).name( 'Position Z' ).onChange( value => {
            this.contents.updateChairPosition( new THREE.Vector3( chairPosition.x, chairPosition.y, value ) );
        });
        chairFolder.close();

        // Plate controls
        const plateFolder = this.datgui.addFolder('Plate');
        plateFolder.addColor( { color: this.contents.plate.plateDiffuseColor }, 'color' )
            .name( "Diffuse Color" )
            .onChange( ( value ) => {
                this.contents.updatePlateDiffuseColor( value );
            });
        plateFolder.add( this.contents.plate, 'radialSegments', 3, 64, 1 )
            .name( "Radial Segments" )
            .onChange( ( value ) => {
                this.contents.updatePlateRadialSegments( value );
            });
        plateFolder.close();

        // Beetle controls
        const beetleFolder = this.datgui.addFolder( 'Beetle' );
        beetleFolder.add( { samples: this.contents.beetlePainting.beetleSamples }, 'samples', 1, 64, 1 )
            .name( "Sample Count" )
            .onChange( value => {
                this.contents.updateBeetleSamples( value );
            });
        beetleFolder.close();

        // Cake controls
        const cakeFolder = this.datgui.addFolder( 'Cake' );
        cakeFolder.add( { samples: this.contents.cake.samples }, 'samples', 1, 64, 1 )
            .name( "Sample Count" )
            .onChange( ( value ) => {
                this.contents.updateCakeSamples( value );
            });
        cakeFolder.add( this.contents, 'candleFlameFlickerEnabled' )
            .name( 'Toggle Candle Flame Flicker' )
            .onChange( ( value ) => {
                this.contents.toggleCandleFlameFlicker( value );
            });
        cakeFolder.add( this.contents, 'candleFlameEnabled' )
            .name( 'Toggle Candle Flame Light' )
            .onChange( ( value ) => {
                this.contents.toggleCandleFlameLight( value );
            });
        cakeFolder.close();

        // Spring controls
        const springFolder = this.datgui.addFolder( 'Spring' );
        springFolder.add( this.contents.spring, 'radius', 0.1, 0.3 ).onChange( value => {
            this.contents.updateSpringRadius( value );
        });
        springFolder.add( this.contents.spring, 'thicknessCoefficient', 0.05, 0.2 ).onChange( value => {
            this.contents.updateSpringThicknessCoefficient( value );
        });
        springFolder.add( this.contents.spring, 'heightPerTurn', 0.1, 0.8 ).onChange( value => {
            this.contents.updateSpringHeightPerTurn( value );
        });
        springFolder.add( this.contents.spring, 'turns', 1, 10, 1 ).onChange( value => {
            this.contents.updateSpringTurns( value );
        });
        springFolder.add( this.contents.spring, 'pointsPerTurn', 4, 64, 1 ).onChange( value => {
            this.contents.updateSpringPointsPerTurn( value );
        });
        springFolder.add( this.contents.spring, 'radialSegments', 4, 64, 1 ).onChange( value => {
            this.contents.updateSpringRadialSegments( value );
        });
        springFolder.close();

        // Newspaper controls
        const newspaperFolder = this.datgui.addFolder( 'Newspaper' );
        const position = this.contents.newspaper.position;
        const rotation = this.contents.newspaper.rotation;

        newspaperFolder.add( position, 'x', 1.16, 1.6 ).name( "Position X" ).onChange( ( value ) => {
            const newPosition = new THREE.Vector3( value, position.y, position.z );
            this.contents.updateNewspaperPosition( newPosition );
        });
        newspaperFolder.add( position, 'z', -0.8, 0.8 ).name( "Position Z" ).onChange( ( value ) => {
            const newPosition = new THREE.Vector3( position.x, position.y, value );
            this.contents.updateNewspaperPosition( newPosition );
        });
        newspaperFolder.add( rotation, 'y', -3.14, 3.14 ).name( "Rotation Y" ).onChange( ( value ) => {
            this.contents.updateNewspaperRotation( rotation.x, value, rotation.z );
        });
        newspaperFolder.add( { samplesU: this.contents.newspaper.samplesU }, 'samplesU', 2, 64, 1 )
            .name( "Samples U" )
            .onChange( ( value ) => {
                this.contents.updateNewspaperSamplesU( value );
            }
        );
        newspaperFolder.close();

        // Flower and Jar controls
        const flowerAndJarFolder = this.datgui.addFolder( 'Flower Jar' );
        const flowerAndJarPosition = {
            x: this.contents.flowerAndJarGroup.position.x,
            y: this.contents.flowerAndJarGroup.position.y,
            z: this.contents.flowerAndJarGroup.position.z
        };
        flowerAndJarFolder.add( flowerAndJarPosition, 'x', -0.3, 0.5 ).name( "Position X" ).onChange( value => {
            this.contents.updateFlowerAndJarPosition( new THREE.Vector3( value, flowerAndJarPosition.y, flowerAndJarPosition.z ) );
        });
        flowerAndJarFolder.add( flowerAndJarPosition, 'y', 0, 0.1 ).name( "Position Y" ).onChange( value => {
            this.contents.updateFlowerAndJarPosition( new THREE.Vector3( flowerAndJarPosition.x, value, flowerAndJarPosition.z ) );
        });
        flowerAndJarFolder.add( flowerAndJarPosition, 'z', -0.5, 1.1 ).name( "Position Z" ).onChange( value => {
            this.contents.updateFlowerAndJarPosition( new THREE.Vector3( flowerAndJarPosition.x, flowerAndJarPosition.y, value ) );
        });
        const flowerAndJarRotation = {
            yIncrement: 0
        };
        flowerAndJarFolder.add( flowerAndJarRotation, 'yIncrement', -0.2, 0.2 ).name( "Rotate Y" ).onChange( value => {
            this.contents.updateFlowerAndJarRotation( 0, value, 0 );
        });
        flowerAndJarFolder.close();
    }
}

export { MyGuiInterface };