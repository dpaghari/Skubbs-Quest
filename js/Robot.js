// Convert board position into world position
var board_to_world = function(position) {
    
    return {
        x : 100 * position.x,
        y : 100 * position.y,
        z : 0
    };
    
};

var Robot = function(position) {
    //// A Robot is a game object
    // Default position if unspecified is at square 0, 0
    this.boardPosition = position || {
        x : 0,
        y : 0
    };
    
    this.type = 'robot';
    this.geometry = new THREE.SphereGeometry(45, 20, 20);
    // Geometry should always be around origin
    // Make it blue
    this.material = new THREE.MeshPhongMaterial({
                                                color : 0x0000ff
                                                });
    this.object = new THREE.Mesh(this.geometry, this.material);
    
    // A mesh is an Object3D, change its position to move
    this.object.position = board_to_world(this.boardPosition);
    
};



Robot.prototype.updateBoardPosition = function() {
    this.object.position = board_to_world(this.boardPosition);
};

Robot.prototype.moveTo = function(position) {
    this.boardPosition = position;
    this.updateBoardPosition();
};