/**
 * Synchronously load contents of file
 * Returns contents as string
 * NOTE:
 *   NOT FOR USE IN PRODUCTION
 *   Use asynchronous loading in production.
 */
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

var goal_gem_to_world = function(position) {
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
    this.type = 'diamond';
    var diamondVertexShaderText = $('#diamond-vertex-shader').text();
    var diamondFragmentShaderText = $('#diamond-fragment-shader').text();
    
    var diamondMaterial = new THREE.ShaderMaterial({
                                              vertexShader: diamondVertexShaderText,
                                              fragmentShader: diamondFragmentShaderText
                                              });
    this.figure = null;
    
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load('models/diamondGem.js', function(geometry) {
    	
    				if(that.figure !== 'empty'){
                    that.figure = new THREE.Mesh(geometry, diamondMaterial);
                    that.figure.scale.set(40, 40, 40);
                    that.figure.rotation.y = 55;
                    that.figure.rotation.z = 100;
                    scene.add(that.figure);
                    that.figure.position = diamond_gem_to_world(position);
                   }
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
    this.type = 'cubegem';
    var cubeVertexShaderText = $('#cube-vertex-shader').text();
    var cubeFragmentShaderText = $('#cube-fragment-shader').text();
    
    var cubeMaterial = new THREE.ShaderMaterial({
                                              vertexShader:
                                                  cubeVertexShaderText,
                                              fragmentShader: cubeFragmentShaderText
                                              });
    this.figure = null;
    
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load('models/cubeGem.js', function(geometry) {
                    that.figure = new THREE.Mesh(geometry, cubeMaterial);
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
    var sphereVertexShaderText = $('#sphere-vertex-shader').text();
    var sphereFragmentShaderText = $('#sphere-fragment-shader').text();
    
    var sphereMaterial = new THREE.ShaderMaterial({
                                              vertexShader: sphereVertexShaderText,
                                              fragmentShader: sphereFragmentShaderText
                                              });
    var that = this;
    this.isEmpty = false;
    this.boardPosition = position || {
        x : 0,
        y : 0
    };
    this.type = 'spheregem';

    this.figure = null;
        
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load('models/sphereGem.js', function(geometry) {
                    that.figure = new THREE.Mesh(geometry, sphereMaterial);
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
    this.type = 'isogem';
    var isoVertexShaderText = $('#iso-vertex-shader').text();
    var isoFragmentShaderText = $('#iso-fragment-shader').text();
    
    var isoMaterial = new THREE.ShaderMaterial({
                                              vertexShader:
                                                  isoVertexShaderText,
                                              fragmentShader: isoFragmentShaderText
                                              });
    this.figure = null;
    
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load('models/isoGem.js', function(geometry) {
                    that.figure = new THREE.Mesh(geometry, isoMaterial);
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

var goalGem = function(position, scene){
    var that = this;
    this.isEmpty = false;
    this.boardPosition = position || {
        x : 0,
        y : 0
    };
    this.type = 'gem';
    
    // Camera to draw reflections
    var sphereCamera = new THREE.CubeCamera(75, 4.0 / 3.0, 1);
    //scene.add(sphereCamera);
    //sphereCamera.updateCubeMap(this.renderer, this.scene);
    //this.sphere.visible = true;
    
    var perlinText = loadFile('shaders/perlin.glsl');
    var goalVertexShaderText = $('#goal-vertex-shader').text();
    var goalFragmentShaderText = $('#goal-fragment-shader').text();
    
    var goalMaterial = new THREE.MeshBasicMaterial({ envMap: sphereCamera.renderTarget });

    this.figure = null;
    
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load('models/isoGem.js', function(geometry) {
                    that.figure = new THREE.Mesh(geometry, goalMaterial);
                    that.figure.scale.set(40, 40, 40);
                    that.figure.rotation.x = 40;
                    that.figure.rotation.y = 55;
                    that.figure.rotation.z = 100;
                    scene.add(that.figure);
                    that.figure.position = goal_gem_to_world(position);
                    });
    
}
goalGem.prototype.moveTo = function(position) {
    this.boardPosition = position;
    this.updateBoardPosition();
};

goalGem.prototype.updateBoardPosition = function() {
    this.object.position = goal_gem_to_world(this.boardPosition);
};