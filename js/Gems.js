var sphere_gem_to_world = function(position) {
    return {
        x : (100 * position.x) + 130,
        y : (100 * position.y) - 30,
        z : 0
    };
};

var iso_gem_to_world = function(position) {
    return {
        x : (100 * position.x) + 100,
        y : (100 * position.y) - 50,
        z : 0
    };
};

var cube_gem_to_world = function(position) {
    return {
        x : (100 * position.x) + 20,
        y : (100 * position.y),
        z : 0
    };
};

var diamond_gem_to_world = function(position) {
    return {
        x : (100 * position.x) + 115,
        y : (100 * position.y) - 30,
        z : 0
    };
};

var diamondGem = function(position, scene){
    var that = this;
    this.isEmpty = false;
    this.boardPosition = position || {
        x : 0,
        y : 0
    };
    this.type = 'gem';
    this.material = new THREE.MeshLambertMaterial({
                                                  color : 0xff0000
                                                  });
    this.figure = null;
    
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load('models/diamondGem.js', function(geometry) {
                    that.figure = new THREE.Mesh(geometry, that.material);
                    that.figure.scale.set(40, 40, 40);
                    that.figure.rotation.y = 55;
                    that.figure.rotation.z = 100;
                    scene.add(that.figure);
                    that.figure.position = diamond_gem_to_world(position);
                    });
    
}

diamondGem.prototype.moveTo = function(position) {
    this.boardPosition = position;
    this.updateBoardPosition();
};

diamondGem.prototype.updateBoardPosition = function() {
    this.object.position = gem_to_world(this.boardPosition);
};

var cubeGem = function(position, scene){
    var that = this;
    this.isEmpty = false;
    this.boardPosition = position || {
        x : 0,
        y : 0
    };
    this.type = 'gem';
    this.material = new THREE.MeshLambertMaterial({
                                                  color : 0xff0000
                                                  });
    this.figure = null;
    
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load('models/cubeGem.js', function(geometry) {
                    that.figure = new THREE.Mesh(geometry, that.material);
                    that.figure.scale.set(40, 40, 40);
                    that.figure.rotation.x = 10;
                    that.figure.rotation.y = 55;
                    that.figure.rotation.z = 100;
                    scene.add(that.figure);
                    that.figure.position = cube_gem_to_world(position);
                    });
    
}

cubeGem.prototype.moveTo = function(position) {
    this.boardPosition = position;
    this.updateBoardPosition();
};

cubeGem.prototype.updateBoardPosition = function() {
    this.object.position = gem_to_world(this.boardPosition);
};

var sphereGem = function(position, scene){
    var that = this;
    this.isEmpty = false;
    this.boardPosition = position || {
        x : 0,
        y : 0
    };
    this.type = 'gem';
    this.material = new THREE.MeshLambertMaterial({
                                                  color : 0xff0000
                                                  });
    this.figure = null;
    
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load('models/sphereGem.js', function(geometry) {
                    that.figure = new THREE.Mesh(geometry, that.material);
                    that.figure.scale.set(40, 40, 40);
                    that.figure.rotation.y = 55;
                    that.figure.rotation.z = 100;
                    scene.add(that.figure);
                    that.figure.position = sphere_gem_to_world(position);
                    });
    
}

sphereGem.prototype.moveTo = function(position) {
    this.boardPosition = position;
    this.updateBoardPosition();
};

sphereGem.prototype.updateBoardPosition = function() {
    this.object.position = gem_to_world(this.boardPosition);
};

var isoGem = function(position, scene){
    var that = this;
    this.isEmpty = false;
    this.boardPosition = position || {
        x : 0,
        y : 0
    };
    this.type = 'gem';
    this.material = new THREE.MeshLambertMaterial({
                                                  color : 0xff0000
                                                  });
    this.figure = null;
    
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load('models/isoGem.js', function(geometry) {
                    that.figure = new THREE.Mesh(geometry, that.material);
                    that.figure.scale.set(40, 40, 40);
                    that.figure.rotation.x = 40;
                    that.figure.rotation.y = 55;
                    that.figure.rotation.z = 100;
                    scene.add(that.figure);
                    that.figure.position = iso_gem_to_world(position);
                    });
    
}

isoGem.prototype.moveTo = function(position) {
    this.boardPosition = position;
    this.updateBoardPosition();
};

isoGem.prototype.updateBoardPosition = function() {
    this.object.position = gem_to_world(this.boardPosition);
};