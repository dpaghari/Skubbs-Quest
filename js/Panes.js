/**
 * Pane
 *
 * A Pane object represents a playable view in the game
 *
 * Code inspired by: 
 http://nathansuniversity.com/cmps179/presentations/demo/transition3.html
 *
 * Required methods:
 *   update(t, [render])
 *   handleInput(keyboard, [game])
 *   overlay(canvas)
 * Required attributes:
 *   scene
 *   camera
 */

/**
 * Keyboard object keeps track of keyboard state
 * Inspired by code at:
 * http://learningthreejs.com/data/THREEx/docs/THREEx.KeyboardState.html
 */
var Keyboard = function() {
    var that = this;
    this.ALIAS = {
        'left': 37,
        'up': 38,
        'right': 39,
        'down': 40,
        'space': 32,
        'enter': 13,
        'pageup': 33,
        'pagedown': 34,
        'tab': 9,
        'esc': 27
    };
    this.keys = {};
    this.modifiers = {};
    var onChange = function(event, down) {
        if(that.keys[event.keyCode] === 'triggered' && down === true) return;
        that.keys[event.keyCode] = down;
    };
    document.addEventListener('keydown', function(event) {
                              onChange(event, true);
                              }, false);
    document.addEventListener('keyup', function(event) {
                              onChange(event, false);
                              }, false);
};

/**
 * See if key is pressed
 * key may be single character, or alias like 'left'
 * singleRepeat is optional argument, if true will only say key
 * was pressed once
 */
Keyboard.prototype.pressed = function(key, singleRepeat) {
    var k = '';
    var pressed = false;
    // See if key is an alias
    if(Object.keys(this.ALIAS).indexOf(key) != -1) {
        k = this.ALIAS[key];
    } else {
        k = key.toUpperCase().charCodeAt(0);
    }
    pressed = this.keys[k];
    if(singleRepeat) {
        if(pressed === true) {
            // Turn off repeat
            this.keys[k] = 'triggered';
            return true;
        }
        if(pressed === 'triggered') {
            return false;
        }
        return false;
    } else {
        if(!pressed) return false;
        return true;
    }
};

/**
 * MenuPane
 * Show the main menu pane
 */

var MenuPane = function() {
    var that = this;
    this.camera = new THREE.PerspectiveCamera(75, 4.0/3.0, 1, 10000);
    this.camera.position.z += 1000;
    this.camera.position.x += 1000;
    this.camera.position.y += 1000;
    console.log("draw scene in MenuPane");
    this.scene = new THREE.Scene();
    
    this.container = document.getElementById('gameArea');
    this.container.style.position = 'relative';
    
    // Visible canvas area on top of 3D rendering area
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = 0;
    this.canvas.style.left = 0;
    this.canvas.width = 800;
    this.canvas.height = 600;
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    
    // Add a light source
    var light = new THREE.PointLight(0xffffff);
    light.position.set(700, 1300, 1000);
    this.scene.add(light);
    
    // Add single diamond gem
    var diamondMaterial = new THREE.MeshLambertMaterial({
                                                        color: new THREE.Color(0x00ff00)
                                                        });
    this.figure = null;
    
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load('models/diamondGem.js', function(geometry) {
                    console.log("creating figure");
                    that.figure = new THREE.Mesh(geometry, diamondMaterial);
                    console.log("scaling figure");
                    that.figure.scale.set(1000, 1000, 1000);
                    that.figure.rotation.y = 55;
                    that.figure.rotation.z = 100;
                    that.scene.add(that.figure);
                    that.figure.position = that.cube.position;
                    });
    
    this.cube = new THREE.Mesh(
                               new THREE.CubeGeometry(500, 500, 500),
                               new THREE.MeshLambertMaterial({
                                                             color: new THREE.Color(0x00ff00)
                                                             }));
    this.scene.add(this.cube);
    console.log(this.cube.position.x);
    
    // Look at cube
    this.camera.lookAt(this.cube.position);
     
    // Add 3D text
	var materialFront = new THREE.MeshBasicMaterial( { color: 0xDF2BF0 } );
	var materialSide = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
	var textGeom = new THREE.TextGeometry( "Skubb's Quest!",
                                          {
                                          size: 550, height: 4, curveSegments: 3,
                                          face: "helvetiker", weight: "normal", style: "normal",
                                          bevelThickness: 5, bevelSize: 2, bevelEnabled: true,
                                          material: 5, extrudeMaterial: 5
                                          });
	// font: helvetiker, gentilis, droid sans, droid serif, optimer
	// weight: normal, bold
	
	var textMaterial = new THREE.MeshBasicMaterial(materialFront, materialSide);
	var textMesh = new THREE.Mesh(textGeom, textMaterial);
	
	textGeom.computeBoundingBox();
	var textWidth = textGeom.boundingBox.max.x - textGeom.boundingBox.min.x;
	
	textMesh.position.x = -4000;
    textMesh.position.y = 30;
    textMesh.position.y = 55;
    textMesh.rotation.y = -100;
    textMesh.rotation.z = 0.04;
	this.scene.add(textMesh);
    
    this.panes = [];
    
    // If there is no active pane do nothing
    if(this.panes.length > 0) {
        var pane = this.panes[this.panes.length - 1];
        // Handle player input
        pane.handleInput(this.keyboard, this);
        // Update pane
        // Pass renderer so it can do cubemaps for reflections
        pane.update(t, this.renderer);
        // Pass canvas so it can decide on its own overlay
        // Render the pane
        this.renderer.render(pane.scene, pane.camera);
        // Clear pane overlay
        // Touching width of a canvas always clears it
        this.canvas.width = this.canvas.width;
        // Render pane overlay
        pane.overlay(this.ctx);
    }
};

/**
 * Update BoringPane's state to time t
 * Do nothing
 */
MenuPane.prototype.update = function(t, renderer) {
    // be boring, do nothing
};

/** 
 * Handle input inside BoringPane
 * keyboard has method 'pressed' 
 */


MenuPane.prototype.handleInput = function(keyboard, game) {
    if(keyboard.pressed('enter', true)) {
        game.pushPane(new GamePane());
    }
};
 


/** 
 * Draw menu overlay
 */
MenuPane.prototype.overlay = function() {
    this.ctx.fillStyle = '#00ff00';
    this.ctx.fillRect(100, 100, 100, 100);
    this.ctx.font = 'bold 18px sans-serif';
    this.ctx.fillStyle = '#000000';
    this.ctx.fillText('Next', 130, 150);
};