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



var GamePane = function(game) {
  // Initialize variables
    this.scene = new THREE.Scene();
    this.game = game;
    
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
    
    // Create speaker material and speakers
    var perlinText = loadFile('shaders/perlin.glsl');
    var speakerVertexShaderText = loadFile('shaders/pulseVert.glsl');
    var speakerFragmentShaderText = loadFile('shaders/pulseFrag.glsl');
    
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
    
     /*	Create a Board giving a visual representation of the level
     * 1 - Cube
     * 2 - Diamond
     * 3 - Sphere
     * 4 - Iso
     * 5 - Goal
     * 6 - Robot
     */
    
     	if(levelNum == 1){
	    this.startingBoard = [['0', '0', '1', '2', '1', '1', '0', '0', '3', '0', '5'], 
	                          ['1', '3', '1', '1', '3', '2', '1', '0', '3', '0', '0'], 
	                          ['2', '1', '2', '2', '3', '2', '1', '4', '1', '2', '2'],
	                          ['1', '1', '2', '3', '4', '3', '0', '4', '4', '2', '1'],
	                          ['0', '2', '3', '0', '2', '0', '0', '0', '0', '1', '1'],
	                          ['1', '2', '3', '1', '2', '0', '0', '3', '2', '0', '3'],
	                          ['1', '4', '4', '1', '0', '1', '1', '3', '2', '0', '3'],
	                          ['0', '3', '4', '0', '0', '3', '0', '0', '1', '1', '0'],
	                          ['0', '0', '0', '2', '3', '4', '1', '0', '2', '0', '0'],
	                          ['0', '0', '0', '2', '3', '2', '1', '0', '0', '1', '1'],
	                          ['0', '6', '0', '0', '2', '2', '0', '4', '4', '0', '0']];
                        }
        if(levelNum == 2){
	   this.startingBoard =   [['1', '1', '4', '4', '0', '4', '1', '2', '0', '6', '0'], 
	                           ['0', '4', '2', '2', '3', '4', '1', '2', '0', '0', '0'], 
	                           ['4', '4', '0', '0', '3', '0', '4', '4', '0', '0', '0'],
		                       ['3', '3', '1', '4', '4', '2', '0', '3', '3', '0', '1'],
		                       ['0', '0', '1', '0', '0', '2', '0', '0', '2', '0', '1'],
		                       ['2', '2', '0', '0', '0', '0', '1', '1', '4', '2', '2'],
		                       ['3', '1', '2', '1', '3', '3', '2', '3', '3', '0', '3'],
		                       ['3', '0', '3', '1', '0', '0', '2', '0', '0', '3', '3'],
		                       ['0', '0', '3', '4', '4', '2', '4', '4', '1', '2', '2'],
		                       ['0', '0', '2', '2', '0', '2', '0', '0', '1', '3', '1'],
		                       ['5', '0', '0', '2', '0', '0', '1', '1', '0', '3', '0']];
		                      }
	if(levelNum == 3){
	   this.startingBoard =   [['1', '1', '4', '4', '0', '4', '1', '2', '0', '5', '0'], 
	                           ['0', '4', '2', '2', '3', '4', '1', '2', '0', '0', '0'], 
	                           ['4', '4', '0', '0', '3', '0', '4', '4', '0', '0', '0'],
		                       ['3', '3', '1', '4', '4', '2', '0', '3', '3', '0', '1'],
		                       ['0', '0', '1', '0', '0', '2', '0', '0', '2', '0', '1'],
		                       ['2', '2', '0', '0', '0', '0', '1', '1', '4', '2', '2'],
		                       ['3', '1', '2', '1', '3', '3', '2', '3', '3', '0', '3'],
		                       ['3', '0', '3', '1', '0', '0', '2', '0', '0', '3', '3'],
		                       ['0', '0', '3', '4', '4', '2', '4', '4', '1', '2', '2'],
		                       ['0', '0', '2', '2', '0', '2', '0', '0', '1', '3', '1'],
		                       ['6', '0', '0', '2', '0', '0', '1', '1', '0', '3', '0']];
		                      }

    this.board = new Board(this.scene, this.camera, this.startingBoard, this.game);  
    if (levelNum == 1){
    	setTime(120);
    	//timeLeft = 90;
    }
    
    this.board.init();
    
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
    
    this.ScoreMesh.position.x = -1200;
    this.ScoreMesh.position.y = 800;
    this.ScoreMesh.rotation.x = -100;
    this.scene.add(this.ScoreMesh);


};

/**
 * Update CubePane's state to time t
 * Move camera around and keep pointed at mirrored sphere
 *
 * renderer is an optional argument, is the main Game's
 * renderer so we can update cubemaps
 */
GamePane.prototype.update = function(t, renderer,game) {
  this.camera.position.y = -400;
  this.camera.lookAt(this.scene.position);
  this.bgMaterial.uniforms['uTime'].value = (t);
  this.board.render(t);
  this.board.handleInput(this.game);
	
 
  this.speakerMaterial.uniforms['uTime'].value = t;
  this.speakerMaterial.uniforms['uBeatTime'].value = this.beat.toBeatTime(t);
  this.speakerMaterial.uniforms['uBeat'].value = this.beat.toBeat(t);
  this.time = time;
  
   if (checkTime()){
        // Remove the previous time 
    	this.scene.remove(this.NumberMesh);
        // Create a new mesh for the next second passed
    	this.NumberGeom = new THREE.TextGeometry(this.time,
                                        {
                                        size: 100, height: 4, curveSegments: 3,
                                        face: "helvetiker", weight: "normal", style: "normal",
                                        bevelThickness: 5, bevelSize: 2, bevelEnabled: true,
                                        material: 5, extrudeMaterial: 5
                                        });
    	this.NumberMaterial = new THREE.MeshBasicMaterial(this.materialFront, this.materialSide);
   	    this.NumberMesh = new THREE.Mesh(this.NumberGeom, this.NumberMaterial);
    
   		 this.NumberGeom.computeBoundingBox();
   		 this.NumberWidth = this.NumberGeom.boundingBox.max.x - this.NumberGeom.boundingBox.min.x;
    
   	 	this.NumberMesh.position.x = 500;
    	this.NumberMesh.position.y = 800;
   	    this.NumberMesh.rotation.x = -100;
   		this.scene.add(this.NumberMesh);
        // When time runs out
   		if (time <= 1){
            // Create losing text on screen
   			this.LoseGeom = new THREE.TextGeometry("Game over!",
                                                     {
                                                     size: 175, height: 4, curveSegments: 3,
                                                     face: "helvetiker", weight: "normal", style: "normal",
                                                     bevelThickness: 10, bevelSize: 2, bevelEnabled: true,
                                                     material: 5, extrudeMaterial: 5
                                                     });

            this.LoseMaterial = new THREE.MeshBasicMaterial(this.LoseMaterialFront, this.materialSide);
            this.LoseMesh = new THREE.Mesh(this.LoseGeom, this.LoseMaterial);

            this.LoseGeom.computeBoundingBox();
            this.LoseWidth = this.LoseGeom.boundingBox.max.x - this.LoseGeom.boundingBox.min.x;
            this.LoseMesh.position.x = -700;
            this.LoseMesh.position.y = 80;
            this.LoseMesh.position.z = 400;
            this.LoseMesh.rotation.x = -100;
            this.LoseMesh.rotation.z = 50;
            this.scene.add(this.LoseMesh);
            this.scene.remove(this.NumberMesh);
            // Remove player control
            
            this.board.gameOver = true;
   		}
    }
 
};

/**
 * Handle input in CubePane
 * left and right keys to rotate view
 */
GamePane.prototype.handleInput = function(keyboard, game) {

};