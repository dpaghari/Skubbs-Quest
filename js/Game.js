var Game = function() {
    // A Game object is the highest level object representing entire game
    // Container div
    this.container = document.getElementById('gameArea');
    this.container.style.position = 'relative';
    this.clock = new THREE.Clock();
};

Game.prototype.init = function() {
    this.scene = new THREE.Scene();
    var that = this;
    this.boardSize = 9;
    this.offset = 4;
    this.facing = 'up';
    
    // Visible canvas area on top of 3D rendering area
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = 0;
    this.canvas.style.left = 0;
    this.canvas.width = 800;
    this.canvas.height = 600;
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    
    /* Skybox texture from:
     http://www.keithlantz.net/2011/10/rendering-a-skybox-using-a-cube-map-with-opengl-and-glsl/
     * Code for skybox inspired by:
     http://stemkoski.github.io/Three.js/Skybox.html
     */
    //console.log("get materials");
    
    this.panes = [];
	
   // console.log("get skybox textures");
	var directions  = ["skybox1", "skybox2", "skybox3", "skybox4", "skybox5", "skybox6"];
	var imageSuffix = ".png";
	var skyGeometry = new THREE.CubeGeometry( 5000, 5000, 5000 );
	
	var materialArray = [];
	for (var i = 0; i < directions.length; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
                                                        map: THREE.ImageUtils.loadTexture(directions[i] + imageSuffix),
                                                        side: THREE.BackSide
                                                        }));
	var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
	var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
	//this.scene.add(skyBox);

    
    this.robot = new Robot({
                           x : -2,
                           y : -3
                           }, this.scene);
    
    this.virtualBoard = new Array(this.boardSize);
    for (var i = 0; i < this.boardSize; i++) {
        this.virtualBoard[i] = [];
        for(var j = 0; j < this.boardSize; j++){
            this.virtualBoard[i].push({});
        }
        
    }
    
    this.startingBoard = [['0', '0', '0', '0', '0', '0', '0', '0', '0'], // create a board where true = occupied by a block
                          ['0', '0', '0', '0', '0', '0', '0', '0', '0'], // and where '0' = empty spot
                          ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
                          ['0', '0', '0', '0', '0', '0', '0', '0', '1'],
                          ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
                          ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
                          ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
                          ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
                          ['0', '0', '0', '0', '0', '0', '0', '0', '0']];
    
    
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
                this.virtualBoard[y][x] = new goalGem({
                                                     x : (x - this.offset),
                                                     y : -(y - this.offset)
                                                     }, this.scene);
            }
        }
    }
    
    this.camera = new THREE.PerspectiveCamera(75, 4.0 / 3.0, 1, 10000);
    this.camera.position.z = 800;
 
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
    var bgTexture = new THREE.ImageUtils.loadTexture( 'images/checkerboard.jpg' );
    var bgMaterial = new THREE.MeshBasicMaterial( { map: bgTexture, side: THREE.DoubleSide } );
    var bgplane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 900), bgMaterial);
    bgplane.translateZ(-100);
    this.scene.add(bgplane);
    
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
    
    this.timeRemaining = 60;
    this.time = this.clock.getElapsedTime() * 10;
    this.NextGeom = new THREE.TextGeometry( "Next: ",
                                           {
                                           size: 100, height: 4, curveSegments: 3,
                                           face: "helvetiker", weight: "normal", style: "normal",
                                           bevelThickness: 5, bevelSize: 2, bevelEnabled: true,
                                           material: 5, extrudeMaterial: 5
                                           });
    this.NextMesh = new THREE.Mesh(this.NextGeom, this.TextMaterial);
    
    this.NextGeom.computeBoundingBox();
    this.NextWidth = this.NextGeom.boundingBox.max.x - this.NextGeom.boundingBox.min.x;
    
    this.NextMesh.position.x = 575;
    this.NextMesh.position.y = 200;
    this.NextMesh.rotation.x = -100;
    this.scene.add(this.NextMesh);
    
    this.nextPosition = { x : 575, y : 100};
    console.log(this.nextPosition);
    
    // Load the timer
    // Add 3D text
    this.timeRemaining = 60;
    this.time = this.clock.getElapsedTime() * 10;
    this.TimeGeom = new THREE.TextGeometry( "Time remaining: " + (this.clock.getDelta * 10),
                                           {
                                           size: 100, height: 4, curveSegments: 3,
                                           face: "helvetiker", weight: "normal", style: "normal",
                                           bevelThickness: 5, bevelSize: 2, bevelEnabled: true,
                                           material: 5, extrudeMaterial: 5
                                           });
    // font: helvetiker, gentilis, droid sans, droid serif, optimer
    // weight: normal, bold
    
    this.TextMaterial = new THREE.MeshBasicMaterial(this.materialFront, this.materialSide);
    this.TimeMesh = new THREE.Mesh(this.TimeGeom, this.TextMaterial);
    
    this.TimeGeom.computeBoundingBox();
    this.TimeWidth = this.TimeGeom.boundingBox.max.x - this.TimeGeom.boundingBox.min.x;
    
    this.TimeMesh.position.x = -575;
    this.TimeMesh.position.y = 700;
    this.TimeMesh.rotation.x = -100;
    this.scene.add(this.TimeMesh);
    
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

Game.prototype.render = function(t, canvas, ctx) {
    if(this.virtualBoard.isEmpty === false){
        for (var i = 0; i < this.boardSize; i++){
            for (var j = 0; j < this.boardSize; j++){
                this.startingBoard[i][j].rotation.x += 0.05;
                this.startingBoard[i][j].rotation.y += 0.004;
            }
        }
    }
    
    // Bob the camera a bit
    this.camera.position.x = 0;
    this.camera.position.y = -400;
    this.camera.lookAt(this.scene.position);
  
    
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
        //canvas.width = canvas.width;
        // Render pane overlay
        pane.overlay(ctx);
    }
    
    this.renderer.render(this.scene, this.camera);
};

/**
 * Add pane to Game object
 * Any existing panes are push down on stack
 */

/**
 * Pop off top pane
 * Reveals lower panes on stack
 */
Game.prototype.popPane = function() {
    this.panes.pop();
};

Game.prototype.legalMove = function(position) {
	/* True = allows movement
	 * False = hinders movement
	 *
	 * Check if desired position is off of the edge of the board horizontally
	 */
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

// Function for creating a gem
Game.prototype.createGem = function(position) {
    // If the random number is between 0 and 20 create a Diamond
    if(this.randNum >= 0.0 && this.randNum <= 20.0){
        this.nextGem = new diamondGem(this.nextPosition, this.scene);
    }
    // If the random number is between 20 and 40 create a Sphere
    if(this.randNum > 20.0 && this.randNum <= 40.0){
        this.nextGem = new sphereGem(this.nextPosition, this.scene);
    }
    // If the random number is between 40 and 60 create an Isometric Gem
    if(this.randNum > 40.0 && this.randNum <= 60.0){
        this.nextGem = new isoGem(this.nextPosition, this.scene);
    }
    // If the random number is between 60 and 100 create a Cube Gem
    if(this.randNum > 60.0 && this.randNum <= 100.0){
        this.nextGem = new cubeGem(this.nextPosition, this.scene);
    }
    
    /*
	// Add the next gem
    this.nextGem = new THREE.Mesh(
                                  new THREE.CubeGeometry(100, 100, 100),
                                  new THREE.MeshLambertMaterial({
                                                                color: new THREE.Color(0xff8000)
                                                                }));
    this.nextGem.position.x = 650;
    this.nextGem.rotation.x += 0.004;
    this.nextGemPosition = { x : 575, y : 100 };
    this.scene.add(this.nextGem);
    */
    
	if(this.legalPosition(position)){
		if (this.virtualBoard[-position.y + this.offset][position.x + this.offset].isEmpty) {
	
			// Calculate a random number between 0-100 to determine what gem you are shooting next
			this.randNum = Math.floor(Math.random() * (101));
			var newPosition = {
				x : position.x,
				y : position.y
			};
	
			// If the random number is between 0 and 20 create a Diamond
			if(this.randNum >= 0.0 && this.randNum <= 20.0){
                this.virtualBoard[-position.y + this.offset][position.x + this.offset] = new diamondGem(position, this.scene);
                //this.nextGem = this.virtualBoard[-position.y + this.offset][position.x + this.offset];
			  }
			 // If the random number is between 20 and 40 create a Sphere
			 if(this.randNum > 20.0 && this.randNum <= 40.0){
                 this.virtualBoard[-position.y + this.offset][position.x + this.offset]= new sphereGem(position, this.scene);
                 //this.nextGem = this.virtualBoard[-position.y + this.offset][position.x + this.offset];
			 }
			 // If the random number is between 40 and 60 create an Isometric Gem
			 if(this.randNum > 40.0 && this.randNum <= 60.0){
                 this.virtualBoard[-position.y + this.offset][position.x + this.offset]= new isoGem(position, this.scene);
                 //this.nextGem = this.virtualBoard[-position.y + this.offset][position.x + this.offset];
			 }
			 // If the random number is between 60 and 100 create a Cube Gem
			 if(this.randNum > 60.0 && this.randNum <= 100.0){
                 this.virtualBoard[-position.y + this.offset][position.x + this.offset] = new cubeGem(position, this.scene);
                 //this.nextGem = this.virtualBoard[-position.y + this.offset][position.x + this.offset];
			 }
			 
			
			this.virtualBoard[-position.y + this.offset][position.x + this.offset].isEmpty = false;
		
			this.checkRow(position, this.facing);
	
		}
	}
	
	

};



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
Game.prototype.threeRow = function(position, direction) {
	// Check if there is three in a row of a gem from the given position going to the right
	// Returns true or false
	// If off the board return false
	
	
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
				//console.log(this.virtualBoard[-position.y + this.offset][position.x + this.offset]);
				if (this.threeRow(newPosition, this.facing)) {
					
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

Game.prototype.handleInput = function() {

	// Left (A Key)
	if (this.keys[65] === true) {
		this.keys[65] = 'triggered';
		var newPosition = {
			x : this.robot.boardPosition.x - 1,
			y : this.robot.boardPosition.y
		};
		// check neighbors if there's a block
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
	// Spacebar
	if (this.keys[32] === true) {
		this.keys[32] = 'triggered';
		that = this;

		// determine what direction character is facing
		
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
			//console.log(moveSpaces);

			if (!moveSpaces == 0) {
				if (this.legalPosition(newPosition)) {
					this.createGem(newPosition);

				}
			}
		}
		if (this.facing == 'left') {
			var moveSpaces = this.countSpaces(newPosition, this.facing);
			newPosition.x -= moveSpaces;
			//console.log(moveSpaces);

			if (!moveSpaces == 0) {
				if (this.legalPosition(newPosition)) {
					this.createGem(newPosition);

				}
			}

		}
		if (this.facing == 'down') {
			var moveSpaces = this.countSpaces(newPosition, this.facing);
			newPosition.y -= moveSpaces;
			//console.log(moveSpaces);

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
