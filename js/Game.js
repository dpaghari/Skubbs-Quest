var Game = function() {
    // A Game object is the highest level object representing entire game
};

Game.prototype.init = function() {
    this.scene = new THREE.Scene();
    var that = this;
    this.boardSize = 9;
    this.offset = 4;
    this.facing = 'up';
    
    this.virtualBoard = new Array(this.boardSize);
    for (var i = 0; i < this.boardSize; i++) {
        this.virtualBoard[i] = [];
        for(var j = 0; j < this.boardSize; j++){
            this.virtualBoard[i].push({});
        }
        
    }
    
    this.startingBoard = [['1', '0', '1', '0', '1', '0', '1', '0', '1'], // create a board where true = occupied by a block
                          ['0', '0', '0', '0', '0', '0', '0', '0', '0'], // and where '0' = empty spot
                          ['2', '0', '2', '0', '2', '0', '2', '0', '2'],
                          ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
                          ['3', '0', '3', '0', '3', '0', '3', '0', '3'],
                          ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
                          ['4', '0', '4', '0', '4', '0', '4', '0', '4'],
                          ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
                          ['1', '0', '1', '0', '1', '0', '1', '0', '1']];
    
    
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
        }
    }
    
    this.robot = new Robot({
                           x : -2,
                           y : -3
                           });
    // create a new robot
    
    this.camera = new THREE.PerspectiveCamera(75, 4.0 / 3.0, 1, 10000);
    this.camera.position.z = 800;
    
    for (var x = 0; x < this.boardSize; x++) {
        for (var y = 0; y < this.boardSize; y++) {
            
            if (this.startingBoard[x][y] == '1' || this.startingBoard[x][y] == '2') {
                that.scene.add(this.virtualBoard[x][y].object);
            }
        }
    }
    
    this.material = new THREE.MeshLambertMaterial({
                                                  color : 0xff0000
                                                  });
    this.figure = null;
    
    this.scene.add(this.robot.object);
    // add robot to scene
    
    // Spotlight
    var spotlight = new THREE.PointLight(0xffffff, 1, 1000);
    spotlight.position.set(0, -100, 400);
    this.scene.add(spotlight);
    // Ambient light
    var ambient_light = new THREE.AmbientLight(0x202020);
    this.scene.add(ambient_light);
    // Background plane
    var bgplane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 900), new THREE.MeshLambertMaterial());
    bgplane.translateZ(-100);
    this.scene.add(bgplane);
    
    this.renderer = new THREE.WebGLRenderer({
                                            antialias : true
                                            });
    this.renderer.setSize(800, 600);
    this.renderer.setClearColor(0xeeeeee, 1.0);
    document.body.appendChild(this.renderer.domElement);
    
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

Game.prototype.render = function(t) {
    // Bob the camera a bit
    this.camera.position.x = 0;
    this.camera.position.y = -400;
    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);
};


Game.prototype.legalRobotMove = function(position) {
    if (position.x < -this.offset || position.x > this.offset) {// check if position that you want to move to is the edge of the board horizontally
        return false;
    }
    if (position.y < -this.offset || position.y > this.offset) {// check if position that you want to move to is the edge of the board vertically
        return false;
    }
    if (this.virtualBoard[-position.y + this.offset][position.x + this.offset].isEmpty) {
        return true;
    } else {
        return false;
    }
    if(this.virtualBoard[-position.y + this.offset][position.x + this.offset].type = 'gem') {
        return false;
    } else{
        return true;
    }
    return true;
};

Game.prototype.createGem = function(position){
    
    if(this.virtualBoard[-position.y + this.offset][position.x + this.offset].isEmpty){
        this.virtualBoard[-position.y + this.offset][position.x + this.offset]= new Gem(position, this.scene);
        //this.startingBoard[position.y][position.x] = '2';
        this.virtualBoard[-position.y + this.offset][position.x + this.offset].isEmpty = false;
        this.scene.add(this.virtualBoard[-position.y + this.offset][position.x + this.offset].object);
        
    }
};

Game.prototype.handleInput = function() {
    
    // Left
    if (this.keys[65] === true) {
        this.keys[65] = 'triggered';
        var newPosition = {
            x : this.robot.boardPosition.x - 1,
            y : this.robot.boardPosition.y
        };
        
        if (this.legalRobotMove(newPosition)) {
            this.robot.moveTo(newPosition);
            // check neighbors if there's a block
        }
    }
    // Right
    if (this.keys[68] === true) {
        this.keys[68] = 'triggered';
        var newPosition = {
            x : this.robot.boardPosition.x + 1,
            y : this.robot.boardPosition.y
        };
        if (this.legalRobotMove(newPosition)) {
            this.robot.moveTo(newPosition);
        }
    }
    // Up
    if (this.keys[87] === true) {
        this.keys[87] = 'triggered';
        var newPosition = {
            x : this.robot.boardPosition.x,
            y : this.robot.boardPosition.y + 1
        };
        if (this.legalRobotMove(newPosition)) {
            this.robot.moveTo(newPosition);
        }
    }
    // Down
    if (this.keys[83] === true) {
        this.keys[83] = 'triggered';
        var newPosition = {
            x : this.robot.boardPosition.x,
            y : this.robot.boardPosition.y - 1
        };
        if (this.legalRobotMove(newPosition)) {
            this.robot.moveTo(newPosition);
        }
    }
    // Spacebar
    if (this.keys[32] === true){
        this.keys[32] = 'triggered';
        that = this;
        
        // determine what direction character is facing
        var newPosition;
        if(this.facing == 'right'){
            newPosition = {
            x: this.robot.boardPosition.x + 1,
            y: this.robot.boardPosition.y
            };
        }
        if(this.facing == 'up'){
            newPosition = {
            x: this.robot.boardPosition.x,
            y: this.robot.boardPosition.y + 1
            };
        }
        if(this.facing == 'left'){
            newPosition = {
            x: this.robot.boardPosition.x - 1,
            y: this.robot.boardPosition.y
            };
        }
        if(this.facing == 'down'){
            newPosition = {
            x: this.robot.boardPosition.x,
            y: this.robot.boardPosition.y - 1
            };
        }
        
        console.log(this.facing);
        // create a gem where character is facing
        this.createGem(newPosition);
        
        
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
