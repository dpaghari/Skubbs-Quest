var loadFile = function(url) {
    var result = null;
    $.ajax({
           url: url,
           async: false
           }).done(function(data) {
                   result = data;
                   });
    return result;
};

/**
 * Beat object
 * Helps convert between seconds and beats
 */
var Beat = function(bpm) {
    this.bpm = bpm;
};

/**
 * Convert time to beatTime
 * BeatTime represents time measured in beats
 */
Beat.prototype.toBeatTime = function(t) {
    return t * this.bpm / 60.0;
};

/**
 * Convert time to beat value
 * Beat value is 0 to 1, hits 1 on the beat
 */
Beat.prototype.toBeat = function(t) {
    return 1.0 - Math.abs(Math.sin(this.toBeatTime(t) * 3.14159));
};

var TitlePane = function() {
  this.clock = new THREE.Clock();
  var that = this;
  this.beat = new Beat(120.0);
  this.camera = new THREE.PerspectiveCamera(75, 4.0/3.0, 1, 10000);
  this.camera.position.z = 1400;
  this.camera.position.x = 1000;
  this.camera.position.y = 500;
  this.panes = [];
    
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
  ctx = this.canvas.getContext('2d');

  
  this.keys = {};
    $('body').keydown(function(e) {
                      if (e.which) {
                      if (that.keys[e.which] !== 'triggered') {
                      that.keys[e.which] = true;
                      }
                      }
                      });
    $('body').keyup(function(e) {
                    if (e.which) {
                    that.keys[e.which] = false;
                    }
                    });

  this.scene = new THREE.Scene();
  
  // Add 3D text with custom shader applied to underside
  
  /* Shader code borrorwed from 
   * http://stemkoski.github.io/Three.js/Shader-Animate.html
   */
  
    // Cloud texture from http://goo.gl/ZqcHYU
    var noiseTexture = new THREE.ImageUtils.loadTexture( 'images/cloud.jpg' );
	noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;
    // Water texture from http://goo.gl/irCXM2
    var waterTexture = new THREE.ImageUtils.loadTexture( 'images/water.jpg' );
    waterTexture.wrapS = waterTexture.wrapT = THREE.RepeatWrapping;
    var waterVertexShader = loadFile('shaders/titleVert.glsl');
    var waterFragmentShader = loadFile('shaders/titleFrag.glsl');

    // use "this." to create global object
    this.customUniforms2 = {
    baseTexture: 	{ type: "t", value: waterTexture },
    baseSpeed: 		{ type: "f", value: 1.15 },
    noiseTexture: 	{ type: "t", value: noiseTexture },
    noiseScale:		{ type: "f", value: 0.2 },
    alpha: 			{ type: "f", value: 0.8 },
    time: 			{ type: "f", value: 1.0 }
    };

    // create custom material from the shader code above
    // that is within specially labeled script tags
    var customMaterial2 = new THREE.ShaderMaterial(
                                                   {
                                                   uniforms: this.customUniforms2,
                                                   vertexShader:   waterVertexShader,
                                                   fragmentShader: waterFragmentShader
                                                   }   );

    // other material properties
    customMaterial2.transparent = true;
	
  // Add Materials
  this.TitleGeom = new THREE.TextGeometry( "Skubb's Quest ",
                                           {
                                           size: 350, height: 4, curveSegments: 3,
                                           face: "helvetiker", weight: "normal", style: "normal",
                                           bevelThickness: 17, bevelSize: 2, bevelEnabled: true,
                                           material: 5, extrudeMaterial: 5
                                           });
     
  this.TitleMesh = new THREE.Mesh(this.TitleGeom, customMaterial2);
    
  this.TitleGeom.computeBoundingBox();
  this.TitleWidth = this.TitleGeom.boundingBox.max.x - this.TitleGeom.boundingBox.min.x;
    
  this.TitleMesh.position.x = -1675;
  this.TitleMesh.position.y = 900;

  this.scene.add(this.TitleMesh);
    
  // Create speaker material and speakers
  var perlinText = loadFile('shaders/perlin.glsl');
  var EnterVertexShaderText = loadFile('shaders/pulseVert.glsl');
  var EnterFragmentShaderText = loadFile('shaders/pulseFrag.glsl');

  this.EnterMaterial = new THREE.ShaderMaterial({
                                                    uniforms: {
                                                    'uTime': { type: 'f', value: 0.0 },
                                                    'uBeatTime': { type: 'f', value: 0.0 },
                                                    'uBeat': { type: 'f', value: 0.0 }
                                                    },
                                                    vertexShader: perlinText + EnterVertexShaderText,
                                                    fragmentShader: perlinText + EnterFragmentShaderText
                                                    });

  this.EnterGeom = new THREE.TextGeometry( "Press enter to play ",
                                           {
                                           size: 100, height: 4, curveSegments: 3,
                                           face: "helvetiker", weight: "normal", style: "normal",
                                           bevelThickness: 5, bevelSize: 2, bevelEnabled: true,
                                           material: 5, extrudeMaterial: 5
                                           });
        
  this.EnterMesh = new THREE.Mesh(this.EnterGeom, this.EnterMaterial);
    
  this.EnterGeom.computeBoundingBox();
  this.EnterWidth = this.EnterGeom.boundingBox.max.x - this.EnterGeom.boundingBox.min.x;
    
  this.EnterMesh.position.x = -650;
  this.EnterMesh.position.y = -900;

  this.scene.add(this.EnterMesh);
    
    var androidVertexShaderText = loadFile('shaders/androidVert.glsl');
    var androidFragmentShaderText = loadFile('shaders/androidFrag.glsl');
    
    /* Bumpy normal texture from:
     http://opengameart.org/sites/default/files/oga-textures/tunnel_ceiling.jpg
     and 
     http://opengameart.org/sites/default/files/oga-textures/siding1_n.jpg
     
     Android model and gun from
     http://rrpictureproductions.com/files/Android_Tutorial.zip
     http://opengameart.org/content/multi-gun
     
     */
    var bumpTexture = THREE.ImageUtils.loadTexture('images/android_normal.jpg');
    var androidTexture = loadFile('images/android.jpg');
    this.androidMaterial = new THREE.MeshBasicMaterial({ map: androidTexture });
  
    // Add Android figure
    var robotMaterial = new THREE.MeshPhongMaterial({
                                                color : 0x0000ff
                                                });
    /* Robot from http://opengameart.org/content/simple-character */
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load('models/android.js', function(geometry) {
                    that.figure = new THREE.Mesh(geometry, this.androidMaterial);
                    that.figure.scale.set(250, 250, 250);
                    that.figure.position.x = -50;
                    that.figure.position.y = - 200;
					that.figure.position.z = 400;
                    that.scene.add(that.figure);
                    });
    
    // Set up Skybox
    var axes = new THREE.AxisHelper(100);
	this.scene.add( axes );
	
	var directions  = ["skybox", "skybox", "skybox", "skybox", "skybox", "skybox"];
	var imageSuffix = ".jpg";
	var skyGeometry = new THREE.CubeGeometry( 5000, 5000, 5000 );
	
	var materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
                                                        map: THREE.ImageUtils.loadTexture(directions[i] + imageSuffix),
                                                        side: THREE.BackSide
                                                        }));
	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	var skyBox = new THREE.Mesh(skyGeometry, skyMaterial );
	this.scene.add( skyBox );

  // Add a light source
  var light = new THREE.PointLight(0xffffff);
  light.position.set(700, 1300, 1000);
  this.scene.add(light);
};

/**
 * Update TitlePane's state to time t 
 */
TitlePane.prototype.update = function(t, renderer) {
  var pane = this.panes[this.panes.length - 1];
  var delta = this.clock.getDelta();
  this.customUniforms2.time.value += delta;
  this.EnterMaterial.uniforms['uTime'].value = t;
  this.EnterMaterial.uniforms['uBeatTime'].value = this.beat.toBeatTime(t);
  this.EnterMaterial.uniforms['uBeat'].value = this.beat.toBeat(t);
  
  // Bob the camera a bit
  this.camera.position.x = Math.sin(t / 1000.0) * 60;
  this.camera.position.y = -500 + Math.sin(t / 700.0) * 40;
    
    if (this.figure) {
        this.figure.rotation.y += 0.01;
    }
    
  this.camera.lookAt(this.scene.position);
};

/**
 * Handle input inside BoringPane
 * keyboard has method 'pressed'
 */
TitlePane.prototype.handleInput = function(game) {
	if (this.keys[13] === true) {
		this.keys[13] = 'triggered';
		 
		 game.pushPane(new GamePane(game));
		 
	}	
};