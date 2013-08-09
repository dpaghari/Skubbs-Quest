// Convert board position into world position
var robot_to_world = function(position) {
    
    return {
        x : (100 * position.x) - 40,
        y : (100 * position.y) + 120,
        z : 0
    };
    
};

var Robot = function(position, scene) {
    var that = this;
    //// A Robot is a game object
    // Default position if unspecified is at square 0, 0
    this.boardPosition = position || {
        x : 0,
        y : 0
    };
    
    this.type = 'robot';
    // Geometry should always be around origin
    // Make it blue
    var robotMaterial = new THREE.MeshPhongMaterial({
                                                color : 0x0000ff
                                                });
    /* Robot from http://opengameart.org/content/simple-character */
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load('models/character.js', function(geometry) {
                    that.figure = new THREE.Mesh(geometry, robotMaterial);
                    that.figure.scale.set(20, 20, 20);
                    that.figure.rotation.x = 120;
                    that.figure.rotation.y = 66;
                    that.figure.rotation.z = 100.5;
                    scene.add(that.figure);
                    console.log("past scene.add");
                    that.figure.position = robot_to_world(position);
                    });
    
    
};



Robot.prototype.updateBoardPosition = function() {
    this.figure.position = robot_to_world(this.boardPosition);
};

Robot.prototype.moveTo = function(position) {
    this.boardPosition = position;
    this.updateBoardPosition();
};