var GamePane = function() {
  // Initialize variables
    this.scene = new THREE.Scene();
    
    var that = this;
    this.beat = new Beat(120.0);
  
	var axes = new THREE.AxisHelper(100);
	this.scene.add( axes );
	
	// Set up Skybox
	var directions  = ["space", "space", "space", "space", "space", "space"];
	var imageSuffix = ".png";
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


    
    this.camera = new THREE.PerspectiveCamera(75, 4.0 / 3.0, 1, 10000);
    this.camera.position.z = 1000;
    
    
 
    this.material = new THREE.MeshLambertMaterial({
                                                  color : 0xff0000
                                                  });
    this.figure = null;
    
    // Spotlight
    var spotlight = new THREE.PointLight(0xffffff, 1, 1000);
    spotlight.position.set(0, -100, 400);
    this.scene.add(spotlight);
    
    // Ambient light
    var ambient_light = new THREE.AmbientLight(0x202020);
    this.scene.add(ambient_light);
    
    // Speakers
    var perlinText = loadFile('shaders/perlin.glsl');
    var speakerVertexShaderText = loadFile('shaders/speakerVert.glsl');
    var speakerFragmentShaderText = loadFile('shaders/speakerFrag.glsl');
    
    this.speakerMaterial = new THREE.ShaderMaterial({
                                               uniforms: {
                                               'uTime': { type: 'f', value: 0.0 },
                                               'uBeatTime': { type: 'f', value: 0.0 },
                                               'uBeat': { type: 'f', value: 0.0 }
                                               },
                                               vertexShader: perlinText + speakerVertexShaderText,
                                               fragmentShader: perlinText + speakerFragmentShaderText
                                               });
    this.speaker1 = new THREE.Mesh(
                               new THREE.SphereGeometry(200, 6, 6),
                               this.speakerMaterial);
    this.speaker1.position.x = -800;
    this.speaker1.position.y = 400;
    this.scene.add(this.speaker1);
    
    this.speaker2 = new THREE.Mesh(
                                   new THREE.SphereGeometry(200, 6, 6),
                                   this.speakerMaterial);
    this.speaker2.position.x = 800;
    this.speaker2.position.y = 400;
    this.scene.add(this.speaker2);

    // Board plane
    var perlinText = loadFile('shaders/perlin.glsl');
    var vertexShaderText = loadFile('shaders/woodVert.glsl');
    var fragmentShaderText = loadFile('shaders/woodFrag.glsl');

   
    this.bgMaterial = new THREE.ShaderMaterial({
    	uniforms: {
    		'uTime': { type: 'f', value: 0.0},
    	},
    	vertexShader: perlinText + vertexShaderText,
    	fragmentShader: perlinText + fragmentShaderText });
     
    this.bgplane = new THREE.Mesh(new THREE.CubeGeometry(1200, 1100, 75), this.bgMaterial);
    this.bgplane.rotation.x = 0;
    this.bgplane.translateZ(-100);
    this.scene.add(this.bgplane);
    
    this.renderer = new THREE.WebGLRenderer({
                                            antialias : true
                                            });
    this.renderer.setSize(800, 600);
    this.renderer.setClearColor(0xeeeeee, 1.0);
    document.body.appendChild(this.renderer.domElement);
    
    this.board = new Board(this.scene, this.camera, this.renderer);
    

    
    // Load the 'Next' section
    // Add Materials
    this.materialFront = new THREE.MeshBasicMaterial( { color: 0xDF2BF0 } );
    this.materialSide = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    this.LoseMaterialFront = new THREE.MeshBasicMaterial( { color: 0xF50000 } );
    
    // Set timer remaining text
    this.NextGeom = new THREE.TextGeometry( "Next : ",
                                           {
                                           size: 100, height: 4, curveSegments: 3,
                                           face: "helvetiker", weight: "normal", style: "normal",
                                           bevelThickness: 5, bevelSize: 2, bevelEnabled: true,
                                           material: 5, extrudeMaterial: 5
                                           });
    this.NextMesh = new THREE.Mesh(this.NextGeom, this.TextMaterial);
    
    this.NextGeom.computeBoundingBox();
    this.NextWidth = this.NextGeom.boundingBox.max.x - this.NextGeom.boundingBox.min.x;
    
    this.NextMesh.position.x = 615;
    this.NextMesh.position.y = 100;
    this.NextMesh.rotation.x = -100;
    this.scene.add(this.NextMesh);
    
    this.nextPosition = { x : 575, y : 100};
    
    // Add 3D text    
    this.TimeGeom = new THREE.TextGeometry( "Time remaining: ",
                                           {
                                           size: 100, height: 4, curveSegments: 3,
                                           face: "helvetiker", weight: "normal", style: "normal",
                                           bevelThickness: 5, bevelSize: 2, bevelEnabled: true,
                                           material: 5, extrudeMaterial: 5
                                           });
     
    // font: helvetiker, gentilis, droid sans, droid serif, optimer
    // weight: normal, bold
        
    this.TextMaterial = new THREE.MeshBasicMaterial(this.materialFront, this.materialSide);
    this.TimeTextMesh = new THREE.Mesh(this.TimeGeom, this.TextMaterial);
    
    this.TimeGeom.computeBoundingBox();
    this.TimeWidth = this.TimeGeom.boundingBox.max.x - this.TimeGeom.boundingBox.min.x;
    
    this.TimeTextMesh.position.x = -475;
    this.TimeTextMesh.position.y = 800;
    this.TimeTextMesh.rotation.x = -100;
    this.scene.add(this.TimeTextMesh);
    
    // Add 3D text for score
    this.ScoreGeom = new THREE.TextGeometry( "Score: ", 
    										{
    											size: 100, height: 4, curveSegments: 3,
    											face: "helvetiker", weight: "normal", 
    											style: "normal", bevelThickness: 5,
    											bevelSize: 2, bevelEnabled: true,
    											material: 5, extrudeMaterial: 5
    										});
    
    this.ScoreMesh = new THREE.Mesh(this.ScoreGeom, this.TextMaterial);
    this.ScoreGeom.computeBoundingBox();
    this.ScoreWidth = this.ScoreGeom.boundingBox.max.x - this.ScoreGeom.boundingBox.min.x;
    
    this.ScoreMesh.position.x = -1100;
    this.ScoreMesh.position.y = 800;
    this.ScoreMesh.rotation.x = -100;
    this.scene.add(this.ScoreMesh);
    
    // Load the time
    setTime(60);
    
    // Setup keyboard events

  
  

};

/**
 * Update CubePane's state to time t
 * Move camera around and keep pointed at mirrored sphere
 *
 * renderer is an optional argument, is the main Game's
 * renderer so we can update cubemaps
 */
GamePane.prototype.update = function(t, renderer) {
 
  this.camera.lookAt(this.scene.position);
 
};

/**
 * Handle input in CubePane
 * left and right keys to rotate view
 */
GamePane.prototype.handleInput = function(keyboard, game) {

};