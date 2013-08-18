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


var Game = function() {
    // A Game object is the highest level object representing entire game
    // Container div
    this.container = document.getElementById('gameArea');
    this.container.style.position = 'relative';
    this.clock = new THREE.Clock();
};
    

Game.prototype.init = function() {
	// Initialize variables
    this.scene = new THREE.Scene();
    score = 0;
    var that = this;
    this.boardSize = 11;					
    this.offset = 5;						
    this.facing = 'up';
    scoreKeeper = false;
    
    /* Skybox texture from:
     http://www.keithlantz.net/2011/10/rendering-a-skybox-using-a-cube-map-with-opengl-and-glsl/
     * Code for skybox inspired by:
     http://stemkoski.github.io/Three.js/Skybox.html
     */
   
    
    this.panes = [];
	
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

    //this.scene.add(this.particleSystem);
   
   /* Create a board to keep track of collisions and legal moves
    * 
    */ 
    
    this.virtualBoard = new Array(this.boardSize);
    for (var i = 0; i < this.boardSize; i++) {
        this.virtualBoard[i] = [];
        for(var j = 0; j < this.boardSize; j++){
            this.virtualBoard[i].push({});
        }
        
    }
    /*	Create a Board giving a visual representation of the level
     * 1 - Cube
     * 2 - Diamond
     * 3 - Sphere
     * 4 - Iso
     * 5 - Goal
     * 6 - Robot
     */
     
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
    
   /* Add board elements(gems, character) to the 
    * board handling collision and legal moves
    */
     
    for (var x = 0; x < this.boardSize; x++) {
        for (var y = 0; y < this.boardSize; y++) {
            
            // If there is a 0 in startingBoard set the slot's isEmpty property to true'
            if (this.startingBoard[y][x] == '0') {
                // For every slot in the board create an object Slot
                this.virtualBoard[y][x].isEmpty = true;
            }
            
            // If there is a 1 in startingBoard create a barrier object
            if (this.startingBoard[y][x] == '1') {
                this.virtualBoard[y][x] = new cubeGem({
                                                      x : (x - this.offset),
                                                      y : -(y - this.offset)
                                                      }, this.scene);
            }
            
            // If there is a 2 in startingBoard create a gem object
            if (this.startingBoard[y][x] == '2') {
                this.virtualBoard[y][x] = new diamondGem({
                                                         x : (x - this.offset),
                                                         y : -(y - this.offset)
                                                         }, this.scene);
                console.log(this.figure);
            }
            
            if (this.startingBoard[y][x] == '3') {
                this.virtualBoard[y][x] = new sphereGem({
                                                        x : (x - this.offset),
                                                        y : -(y - this.offset)
                                                        }, this.scene);
            }
            
            if (this.startingBoard[y][x] == '4') {
                this.virtualBoard[y][x] = new isoGem({
                                                     x : (x - this.offset),
                                                     y : -(y - this.offset)
                                                     }, this.scene);
            }
            
            if (this.startingBoard[y][x] == '5') {
            	this.goalGemz = this.virtualBoard[y][x];
                this.goalGemz = new goalGem({
                                                     x : (x - this.offset),
                                                     y : -(y - this.offset)
                                                     }, this.scene);
                           this.virtualBoard[y][x].isEmpty = true;
            }
             if (this.startingBoard[y][x] == '6') {
                this.virtualBoard[y][x] = this.robot = new Robot({
                           x : (x - this.offset),
                           y : -(y - this.offset)
                           }, this.scene);
                           this.virtualBoard[y][x].isEmpty = true;
            }
        }
    }
    
    
    /*
     * Determine the initial first gem that the character can shoot when the level first loads
     */
    this.randNum = Math.floor(Math.random() * (101)); 
    this.nextGem = new nextGem(this.scene, this.randNum);
    
    
    this.camera = new THREE.PerspectiveCamera(75, 4.0 / 3.0, 1, 10000);
    this.camera.position.z = 850;
 
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
    // Background plane
    
    var perlinText = loadFile('shaders/perlin.glsl');
    var vertexShaderText = loadFile('shaders/woodVert.glsl');
    var fragmentShaderText = loadFile('shaders/woodFrag.glsl');
    
   // this.bgTexture = new THREE.ImageUtils.loadTexture( 'images/floor.jpg' );
    this.bgMaterial = new THREE.ShaderMaterial({
    	uniforms: {
    		'uTime': { type: 'f', value: 0.0},
    	},
    	vertexShader: perlinText + vertexShaderText,
    	fragmentShader: perlinText + fragmentShaderText });
     
    this.bgplane = new THREE.Mesh(new THREE.CubeGeometry(1150, 1100, 75), this.bgMaterial);
    this.bgplane.rotation.x = 0;
    this.bgplane.translateZ(-100);
    this.scene.add(this.bgplane);
    
    this.renderer = new THREE.WebGLRenderer({
                                            antialias : true
                                            });
    this.renderer.setSize(800, 600);
    this.renderer.setClearColor(0xeeeeee, 1.0);
    document.body.appendChild(this.renderer.domElement);
    
    // Load the 'Next' section
    // Add Materials
    this.materialFront = new THREE.MeshBasicMaterial( { color: 0xDF2BF0 } );
    this.materialSide = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    this.LoseMaterialFront = new THREE.MeshBasicMaterial( { color: 0xF50000 } );
    
    // Load the timer
    //var currentTime = 0;
    //var previousTime = 0;
    //var time = setTime();
    
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
    
    this.TimeTextMesh.position.x = -575;
    this.TimeTextMesh.position.y = 700;
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
    this.ScoreMesh.position.y = 700;
    this.ScoreMesh.rotation.x = -100;
    this.scene.add(this.ScoreMesh);
    
    // Load the time
    setTime(60);
    
    // Setup keyboard events
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
};

// Render function
Game.prototype.render = function(t, canvas, ctx) {
	this.bgMaterial.uniforms['uTime'].value = (t);
	this.goalGemz.goalMaterial.uniforms['uTime'].value = t;
  
   
    // Bob the camera a bit
    this.camera.position.x = 0;
    this.camera.position.y = -400;
    this.camera.lookAt(this.scene.position);
    
    if(scoreKeeper == true){
    	this.scene.remove(this.ScoreNumberMesh)
    	this.ScoreNumberGeom = new THREE.TextGeometry( score, 
    										{
    											size: 100, height: 4, curveSegments: 3,
    											face: "helvetiker", weight: "normal", 
    											style: "normal", bevelThickness: 5,
    											bevelSize: 2, bevelEnabled: true,
    											material: 5, extrudeMaterial: 5
    										});
    
    	this.ScoreNumberMesh = new THREE.Mesh(this.ScoreNumberGeom, this.TextMaterial);
    	this.ScoreNumberGeom.computeBoundingBox();
    	this.ScoreNumberWidth = this.ScoreNumberGeom.boundingBox.max.x - this.ScoreNumberGeom.boundingBox.min.x;
    
    	this.ScoreNumberMesh.position.x = -800;
   	 	this.ScoreNumberMesh.position.y = 700;
    	this.ScoreNumberMesh.rotation.x = -100;
    	this.scene.add(this.ScoreNumberMesh);
    }
    
    // Add counting timer
    if (checkTime()){
    	this.scene.remove(this.NumberMesh);
    	this.NumberGeom = new THREE.TextGeometry(time,
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
    
   	 	this.NumberMesh.position.x = 400;
    	this.NumberMesh.position.y = 700;
   	    this.NumberMesh.rotation.x = -100;
   		this.scene.add(this.NumberMesh);
   		if (time <= 1){
   			this.LoseGeom = new THREE.TextGeometry("Game over!",
                                                     {
                                                     size: 175, height: 4, curveSegments: 3,
                                                     face: "helvetiker", weight: "normal", style: "normal",
                                                     bevelThickness: 5, bevelSize: 2, bevelEnabled: true,
                                                     material: 5, extrudeMaterial: 5
                                                     });

            this.LoseMaterial = new THREE.MeshBasicMaterial(this.LoseMaterialFront, this.materialSide);
            this.LoseMesh = new THREE.Mesh(this.LoseGeom, this.LoseMaterial);

            this.LoseGeom.computeBoundingBox();
            this.LoseWidth = this.LoseGeom.boundingBox.max.x - this.LoseGeom.boundingBox.min.x;
            this.LoseMesh.position.x = -600;
            this.LoseMesh.position.y = 80;
            this.LoseMesh.position.z = 400;
            this.LoseMesh.rotation.x = -100;
            this.LoseMesh.rotation.z = 50;
            this.scene.add(this.LoseMesh);
            this.scene.remove(this.NumberMesh);

   		}
    }
   
    this.renderer.render(this.scene, this.camera);
};



/* Function that checks if the given position
 * is within the board's limits and if it is occupied
 * by a gem or not.
 */
Game.prototype.legalMove = function(position) {
	
	// Check if desired position is off of the edge of the board horizontally 
	if (position.x < -this.offset || position.x > this.offset) {
		return false;
	}
	// Check if desired position is off of the edge of the board horizontally
	if (position.y < -this.offset || position.y > this.offset) {
		return false;
	}
	// Check if desired position is filled with an object
	if (this.virtualBoard[-position.y + this.offset][position.x + this.offset].isEmpty) {
		return true;
	} else {
		return false;
	}
	return true;
};

/*
 * Function that checks if desired position is within
 * board's limits.
 */
Game.prototype.legalPosition = function(position) {
	// returns true or false if the move is within the board's limits
	if (position.x < -this.offset || position.x > this.offset) {
		return false;
	}
	// Check if desired position is off of the edge of the board horizontally
	if (position.y < -this.offset || position.y > this.offset) {
		return false;
	}
	return true;
};
/*
 * Function to generate a random number
 * between 0-100
 */
Game.prototype.detRand = function(){
	
	var randNum = Math.floor(Math.random() * (101));
	
	return randNum;
	
};


/*
 * Function that creates a gem at a position if it is within its limits.
 * Gem created is determined by a random number determined at creation.
 * Also checks for matches of three and calls the update to the next gem
 * that is shot.
 */
Game.prototype.createGem = function(position) {
    
	if(this.legalPosition(position)){
		if (this.virtualBoard[-position.y + this.offset][position.x + this.offset].isEmpty) {
				
			// If the random number is between 0 and 20 create a Diamond
			if(this.randNum >= 0.0 && this.randNum <= 25.0){
                this.virtualBoard[-position.y + this.offset][position.x + this.offset] = new diamondGem(position, this.scene);
                
			  }
			
			 // If the random number is between 20 and 40 create a Sphere
			 if(this.randNum > 25.0 && this.randNum <= 50.0){
                 this.virtualBoard[-position.y + this.offset][position.x + this.offset]= new sphereGem(position, this.scene);
                
			 }
			 // If the random number is between 40 and 60 create an Isometric Gem
			 if(this.randNum > 50.0 && this.randNum <= 75.0){
                 this.virtualBoard[-position.y + this.offset][position.x + this.offset]= new isoGem(position, this.scene);
               
			 }
			 // If the random number is between 60 and 100 create a Cube Gem
			 if(this.randNum > 75.0 && this.randNum <= 100.0){
                 this.virtualBoard[-position.y + this.offset][position.x + this.offset] = new cubeGem(position, this.scene);
               
			 }

			
			this.virtualBoard[-position.y + this.offset][position.x + this.offset].isEmpty = false;
			this.checkEntireRow(position, this.facing);
			
		}
	}
			
		
		
			this.destroyNextGem();

};


Game.prototype.checkEntireRow = function(position, direction){
	
	for(var i = -this.offset; i <= this.offset; i++){

			var newPosition = {
			x: i,
			y: position.y
			
			};

		var boardSlot = this.virtualBoard[-newPosition.y + this.offset][newPosition.x + this.offset];
		if(this.legalPosition(newPosition)){
		
				this.checkRow(newPosition, 'up');
				this.checkRow(newPosition, 'down');
				this.checkRow(newPosition, 'left');
				this.checkRow(newPosition, 'right');
				this.checkMidRow(newPosition, this.facing);
	
		}
			var newPosition = {
			x: position.x,
			y: i
			
			};
			
			if(this.legalPosition(newPosition)){
		
				this.checkRow(newPosition, 'up');
				this.checkRow(newPosition, 'down');
				this.checkRow(newPosition, 'left');
				this.checkRow(newPosition, 'right');
				this.checkMidRow(newPosition, this.facing);
		
		}
	}
	
	
};


/*
 * Function that returns true if position is not occupied by a gem
 * 
 */
Game.prototype.isEmptySquare = function(position) {
	// returns true or false if input position is empty
	if(this.legalPosition(position)){
		if (this.virtualBoard[-position.y + this.offset][position.x + this.offset].isEmpty) {
			return true;
		} else {
			return false;
		}
		
	}
};
/*
 * Function that checks the type of the object at the desired position.
 * Used to determine matches
 */
Game.prototype.checkType = function(position){
	// Check what type the object in the given position is
	// return a number depending on the type of object it is
	
	if(this.virtualBoard[-position.y + this.offset][position.x + this.offset].type == 'diamond'){
		return 1;
	}
	if(this.virtualBoard[-position.y + this.offset][position.x + this.offset].type == 'cubegem'){
		return 2;
	}
	if(this.virtualBoard[-position.y + this.offset][position.x + this.offset].type == 'spheregem'){
		return 3;
	}
	if(this.virtualBoard[-position.y + this.offset][position.x + this.offset].type == 'isogem'){
		return 4;
	}
	return 0;
	
	
};


Game.prototype.threeRow = function(position, direction, checkMid) {
	// Check if there is three in a row of a gem from the given position going to the right
	// Returns true or false
	// If off the board return false
	
	
		var newPosition = {
			x : position.x,
			y : position.y

		};
		if(this.facing == 'up'){
			
			if(checkMid == false){
				var newPosition2 = {
					x: position.x,
					y: position.y + 1
				};
				
				var newPosition3 = {
					x: position.x,
					y: position.y + 2
				};
			}
			else{
				var newPosition2 = {
					x: position.x - 1,
					y: position.y
				};
				
				var newPosition3 = {
					x: position.x + 1,
					y: position.y
				};
			}
		}
		if(this.facing == 'down'){
			if(checkMid == false){
				var newPosition2 = {
					x: position.x,
					y: position.y - 1
				};
				
				var newPosition3 = {
					x: position.x,
					y: position.y - 2
				};
			}
			else{
				var newPosition2 = {
					x: position.x - 1,
					y: position.y
				};
				
				var newPosition3 = {
					x: position.x + 1,
					y: position.y
				};
			}
		}
		if(this.facing == 'left'){
			if(checkMid == false){
				var newPosition2 = {
					x: position.x - 1,
					y: position.y
				};
				
				var newPosition3 = {
					x: position.x - 2,
					y: position.y
				};
			}
				else{
				var newPosition2 = {
					x: position.x,
					y: position.y + 1
				};
				
				var newPosition3 = {
					x: position.x,
					y: position.y - 1
				};
			}
		}
		if(this.facing == 'right'){
			
			if(checkMid == false){
				var newPosition2 = {
					x: position.x + 1,
					y: position.y
				};
				
				var newPosition3 = {
					x: position.x + 2,
					y: position.y
				};
			}
			else{
				var newPosition2 = {
					x: position.x,
					y: position.y + 1
				};
				
				var newPosition3 = {
					x: position.x,
					y: position.y - 1
				};
			}
		}


	if (this.legalPosition(newPosition) && this.legalPosition(newPosition2) && this.legalPosition(newPosition3)) {
		if((this.checkType(newPosition) == 1) && (this.checkType(newPosition2) == 1) && (this.checkType(newPosition3) == 1)){
			
			return true;
		}
		if((this.checkType(newPosition) == 2) && (this.checkType(newPosition2) == 2) && (this.checkType(newPosition3) == 2)){
			return true;
		}
		if((this.checkType(newPosition) == 3) && (this.checkType(newPosition2) == 3) && (this.checkType(newPosition3) == 3)){
			return true;
		}
		if((this.checkType(newPosition) == 4) && (this.checkType(newPosition2) == 4) && (this.checkType(newPosition3) == 4)){
			return true;
		}	
		if((this.checkType(newPosition) == 0) && (this.checkType(newPosition2) == 0) && (this.checkType(newPosition3) == 0)){
			return false;
		}
	}

	
	return false;

};
Game.prototype.checkRow = function(position, direction) {
	// Check a row for sets of three gems of the same type in a row
	// For every 3 gems found on a row in this row delete them

	var that = this;
	
		var newPosition = {
			x : position.x,
			y : position.y

		};
		if(this.facing == 'up'){
			
			var newPosition2 = {
				x: position.x,
				y: position.y + 1
			};
			
			var newPosition3 = {
				x: position.x,
				y: position.y + 2
			};		
		}
		if(this.facing == 'down'){
			
			var newPosition2 = {
				x: position.x,
				y: position.y - 1
			};
			
			var newPosition3 = {
				x: position.x,
				y: position.y - 2
			};
		}
		if(this.facing == 'left'){
			
			var newPosition2 = {
				x: position.x - 1,
				y: position.y
			};
			
			var newPosition3 = {
				x: position.x - 2,
				y: position.y
			};
		}
		if(this.facing == 'right'){
			
			var newPosition2 = {
				x: position.x + 1,
				y: position.y
			};
			
			var newPosition3 = {
				x: position.x + 2,
				y: position.y
			};
		}
		
		if(this.legalPosition(position)){
				
				if (this.threeRow(newPosition, this.facing, false)) {
					
					var boardSlot = this.virtualBoard[-newPosition.y + this.offset][newPosition.x + this.offset];
					var boardSlot2 = this.virtualBoard[-newPosition2.y + this.offset][newPosition2.x + this.offset];
					var boardSlot3 = this.virtualBoard[-newPosition3.y + this.offset][newPosition3.x + this.offset];
					
					if(boardSlot.figure === null){
						
						boardSlot.figure = 'empty';
					}
					else{
						this.scene.remove(boardSlot.figure);
					}
					
					if(boardSlot2.figure === null){
						
						boardSlot2.figure = 'empty';
					}
					else{
						this.scene.remove(boardSlot2.figure);
					}
					
					if(boardSlot3.figure === null){
						
						boardSlot3.figure = 'empty';
					}
					else{
						this.scene.remove(boardSlot3.figure);
					}
					
					
					this.virtualBoard[-newPosition.y + this.offset][newPosition.x + this.offset].isEmpty = true;
					this.virtualBoard[-newPosition2.y + this.offset][newPosition2.x + this.offset].isEmpty = true;
					this.virtualBoard[-newPosition3.y + this.offset][newPosition3.x + this.offset].isEmpty = true;
					score++;
					
					if(score !== scoreNext) {
						score = scoreNext;
						scoreKeeper = true;
						return scoreKeeper;
					}
					else {
						scoreKeeper = false;
						return scoreKeeper;
					}	
						
				}
		}
	

};

Game.prototype.checkMidRow = function(position, direction) {
	// Check a row for sets of three gems of the same type in a row
	// For every 3 gems found on a row in this row delete them

	var that = this;
	
		var newPosition = {
			x : position.x,
			y : position.y

		};
		if(this.facing == 'up'){
			
			var newPosition2 = {
				x: position.x - 1,
				y: position.y
			};
			
			var newPosition3 = {
				x: position.x + 1,
				y: position.y
			};
			
			
		}
		if(this.facing == 'down'){
			
			var newPosition2 = {
				x: position.x - 1,
				y: position.y
			};
			
			var newPosition3 = {
				x: position.x + 1,
				y: position.y
			};
		}
		if(this.facing == 'left'){
			
			var newPosition2 = {
				x: position.x,
				y: position.y + 1
			};
			
			var newPosition3 = {
				x: position.x,
				y: position.y - 1
			};
		}
		if(this.facing == 'right'){
			
			var newPosition2 = {
				x: position.x,
				y: position.y - 1
			};
			
			var newPosition3 = {
				x: position.x,
				y: position.y + 1
			};
		}
		
		if(this.legalPosition(position)){
				
				if (this.threeRow(newPosition, this.facing, true)) {
					
				
					var boardSlot = this.virtualBoard[-newPosition.y + this.offset][newPosition.x + this.offset];
					var boardSlot2 = this.virtualBoard[-newPosition2.y + this.offset][newPosition2.x + this.offset];
					var boardSlot3 = this.virtualBoard[-newPosition3.y + this.offset][newPosition3.x + this.offset];
					
					if(boardSlot.figure === null){
						
						boardSlot.figure = 'empty';
					}
					else{
						this.scene.remove(boardSlot.figure);
					}
					
					if(boardSlot2.figure === null){
						
						boardSlot2.figure = 'empty';
					}
					else{
						this.scene.remove(boardSlot2.figure);
					}
					
					if(boardSlot3.figure === null){
						
						boardSlot3.figure = 'empty';
					}
					else{
						this.scene.remove(boardSlot3.figure);
					}
					
					
					this.virtualBoard[-newPosition.y + this.offset][newPosition.x + this.offset].isEmpty = true;
					this.virtualBoard[-newPosition2.y + this.offset][newPosition2.x + this.offset].isEmpty = true;
					this.virtualBoard[-newPosition3.y + this.offset][newPosition3.x + this.offset].isEmpty = true;
			
		
				}
		}
	

};


// Function returns # of free spaces to the right
Game.prototype.countSpacesRight = function(position) {
	var spaces = 0;
	var newPosition = {
		x : position.x + 1,
		y : position.y
	};
	if (!this.legalPosition(position)) {
		return 0;
	}
	while (this.isEmptySquare(newPosition)) {

		newPosition.x++;
		spaces++;
	}

	return spaces;
};
// Function returns # of free spaces to the right
Game.prototype.countSpacesLeft = function(position) {
	var spaces = 0;
	var newPosition = {
		x : position.x - 1,
		y : position.y
	};
	if (!this.legalPosition(position)) {
		return 0;
	}
	while (this.isEmptySquare(newPosition)) {

		newPosition.x--;
		spaces++;
	}

	return spaces;
};
// Function returns # of free spaces up
Game.prototype.countSpacesUp = function(position) {
	var spaces = 0;
	var newPosition = {
		x : position.x,
		y : position.y + 1
	};
	if (!this.legalPosition(position)) {
		return 0;
	}
	while (this.isEmptySquare(newPosition)) {

		newPosition.y++;
		spaces++;
	}

	return spaces;
};
// Function returns # of free spaces down
Game.prototype.countSpacesDown = function(position) {
	var spaces = 0;
	var newPosition = {
		x : position.x,
		y : position.y - 1
	};
	if (!this.legalPosition(position)) {
		return 0;
	}
	while (this.isEmptySquare(newPosition)) {

		newPosition.y--;
		spaces++;
	}

	return spaces;
};

// Function that counts the free spaces in a direction
Game.prototype.countSpaces = function(position, direction) {
	var spaces = 0;

	if (direction == 'right') {

		return this.countSpacesRight(position);
	}
	if (direction == 'up') {

		return this.countSpacesUp(position);
	}
	if (direction == 'left') {

		return this.countSpacesLeft(position);
	}
	if (direction == 'down') {

		return this.countSpacesDown(position);
	}
	return spaces;
};

/*
 * Function that destroys the next Gem
 *  and updates with a new gem that 
 *  tells player what next gem to be fired will be
 */
Game.prototype.destroyNextGem = function() {
		
		this.randNum = this.detRand();
		this.scene.remove(this.nextGem);
		this.scene.remove(this.nextGem.figure);
		this.nextGem = new nextGem(this.scene, this.randNum);
		

	
};



/*
 * Function that handles player input using the keyboard
 * Controls:
 * W - Go Up a Space
 * A - Go Left a Space
 * S - Go Down a Space
 * D - Go Right a Space
 * Left Arrow Key - Turn Left(Set Direction to left)
 * Up Arrow Key - Turn Up(Set Direction to up)
 * Right Arrow Key - Turn Right
 * Down Arrow Key - Turn Down
 * Space - Shoot Next Gem
 */
Game.prototype.handleInput = function() {

if(this.robot.boardPosition == this.goalGemz.boardPosition){
	alert("You Win!");
}

// Character Movement
	// Left (A Key)
	if (this.keys[65] === true) {
		this.keys[65] = 'triggered';
		var newPosition = {
			x : this.robot.boardPosition.x - 1,
			y : this.robot.boardPosition.y
		};
		// check neighbors if there's a gem
		if (this.legalMove(newPosition)) {
			this.robot.moveTo(newPosition);

		}
	}
	// Right (D key)
	if (this.keys[68] === true) {
		this.keys[68] = 'triggered';
		var newPosition = {
			x : this.robot.boardPosition.x + 1,
			y : this.robot.boardPosition.y
		};
		if (this.legalMove(newPosition)) {
			this.robot.moveTo(newPosition);
		}
	}
	// Up (W key)
	if (this.keys[87] === true) {
		this.keys[87] = 'triggered';
		var newPosition = {
			x : this.robot.boardPosition.x,
			y : this.robot.boardPosition.y + 1
		};
		if (this.legalMove(newPosition)) {
			this.robot.moveTo(newPosition);
		}
	}
	// Down (S key)
	if (this.keys[83] === true) {
		this.keys[83] = 'triggered';
		var newPosition = {
			x : this.robot.boardPosition.x,
			y : this.robot.boardPosition.y - 1
		};
		if (this.legalMove(newPosition)) {
			this.robot.moveTo(newPosition);
		}
	}
	/* Spacebar
	 * 
	 * Creates a Gem where the character is facing 
	 * and places it in the furthest empty space 
	 * 
	 */
	if (this.keys[32] === true) {
		this.keys[32] = 'triggered';
		that = this;

		
		
		var newPosition = {
			x : this.robot.boardPosition.x,
			y : this.robot.boardPosition.y
		};
		if (this.facing == 'right') {
			var moveSpaces = this.countSpaces(newPosition, this.facing);
			newPosition.x += moveSpaces;

			if (!moveSpaces == 0) {
				if (this.legalPosition(newPosition)) {
					
					this.createGem(newPosition);
					

				}
			}
		}

		if (this.facing == 'up') {
			var moveSpaces = this.countSpaces(newPosition, this.facing);
			newPosition.y += moveSpaces;
			

			if (!moveSpaces == 0) {
				if (this.legalPosition(newPosition)) {
					this.createGem(newPosition);
					

				}
			}
		}
		if (this.facing == 'left') {
			var moveSpaces = this.countSpaces(newPosition, this.facing);
			newPosition.x -= moveSpaces;
			

			if (!moveSpaces == 0) {
				if (this.legalPosition(newPosition)) {
					this.createGem(newPosition);
					

				}
			}

		}
		if (this.facing == 'down') {
			var moveSpaces = this.countSpaces(newPosition, this.facing);
			newPosition.y -= moveSpaces;
			

			if (!moveSpaces == 0) {
				if (this.legalPosition(newPosition)) {
					this.createGem(newPosition);
					

				}
			}

		}

	}

	// Inputs for determining where the character is facing
	// Up arrow key
	if (this.keys[38] === true) {
		this.keys[38] = 'triggered';

		this.facing = 'up';
	}
	// Left arrow key
	if (this.keys[37] === true) {
		this.keys[37] = 'triggered';

		this.facing = 'left';
	}
	// Down arrow key
	if (this.keys[40] === true) {
		this.keys[40] = 'triggered';

		this.facing = 'down';
	}
	// Right arrow key
	if (this.keys[39] === true) {
		this.keys[39] = 'triggered';

		this.facing = 'right';
	}

};

Game.prototype.start = function() {
	var that = this;
	var time0 = new Date().getTime();
	// milliseconds since 1970
	var loop = function() {
		var time = new Date().getTime();
		// Render visual frame
		that.render(time - time0);
		// Respond to user input
		that.handleInput();
		// Loop
		requestAnimationFrame(loop, that.renderer.domElement);
	};
	loop();
}; 
