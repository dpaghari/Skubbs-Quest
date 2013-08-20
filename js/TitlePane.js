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



var TitlePane = function() {
	
  var that = this;
  this.camera = new THREE.PerspectiveCamera(75, 4.0/3.0, 1, 10000);
  this.camera.position.z = 1400;
  this.camera.position.x = 1000;
  this.camera.position.y = 500;

  
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
  
  // Add 3D text 
  // Add Materials
  this.materialFront = new THREE.MeshBasicMaterial( { color: 0xDF2BF0 } );
  this.materialSide = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
  this.TitleGeom = new THREE.TextGeometry( "Skubb's Quest ",
                                           {
                                           size: 350, height: 4, curveSegments: 3,
                                           face: "helvetiker", weight: "normal", style: "normal",
                                           bevelThickness: 5, bevelSize: 2, bevelEnabled: true,
                                           material: 5, extrudeMaterial: 5
                                           });
     
  // font: helvetiker, gentilis, droid sans, droid serif, optimer
  // weight: normal, bold
        
  this.TextMaterial = new THREE.MeshBasicMaterial(this.materialFront, this.materialSide);
  this.TitleMesh = new THREE.Mesh(this.TitleGeom, this.TextMaterial);
    
  this.TitleGeom.computeBoundingBox();
  this.TitleWidth = this.TitleGeom.boundingBox.max.x - this.TitleGeom.boundingBox.min.x;
    
  this.TitleMesh.position.x = -1600;
  this.TitleMesh.position.y = 900;
  //this.TitleMesh.rotation.x = -120;
  //this.Titl
  this.scene.add(this.TitleMesh);
  
  this.EnterGeom = new THREE.TextGeometry( "Press enter to play ",
                                           {
                                           size: 100, height: 4, curveSegments: 3,
                                           face: "helvetiker", weight: "normal", style: "normal",
                                           bevelThickness: 5, bevelSize: 2, bevelEnabled: true,
                                           material: 5, extrudeMaterial: 5
                                           });
     
  // font: helvetiker, gentilis, droid sans, droid serif, optimer
  // weight: normal, bold
        
  this.TextMaterial = new THREE.MeshBasicMaterial(this.materialFront, this.materialSide);
  this.EnterMesh = new THREE.Mesh(this.EnterGeom, this.TextMaterial);
    
  this.EnterGeom.computeBoundingBox();
  this.EnterWidth = this.EnterGeom.boundingBox.max.x - this.EnterGeom.boundingBox.min.x;
    
  this.EnterMesh.position.x = -650;
  this.EnterMesh.position.y = -900;
  //this.TitleMesh.rotation.x = -120;
  //this.Titl
  this.scene.add(this.EnterMesh);
  
    // Add Android figure
    var robotMaterial = new THREE.MeshPhongMaterial({
                                                color : 0x0000ff
                                                });
    /* Robot from http://opengameart.org/content/simple-character */
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load('models/android.js', function(geometry) {
                    that.figure = new THREE.Mesh(geometry, robotMaterial);
                    that.figure.scale.set(250, 250, 250);
                    that.figure.position.x = -50;
                    that.figure.position.y = - 200;
					that.figure.position.z = 400;
                    that.scene.add(that.figure);
                    // Look at cube
  					//that.camera.lookAt(that.figure.position);
                    });

  // Add a light source
  var light = new THREE.PointLight(0xffffff);
  light.position.set(700, 1300, 1000);
  this.scene.add(light);
};

/**
 * Update BoringPane's state to time t
 * Do nothing
 */
TitlePane.prototype.update = function(t, renderer) {
  // Bob the camera a bit
  
  this.camera.position.x = Math.sin(t / 1000.0) * 60;
  this.camera.position.y = -500 + Math.sin(t / 700.0) * 40;
  
  this.camera.lookAt(this.scene.position);
  
  //renderer.render(this.scene, this.camera);
};

/**
 * Handle input inside BoringPane
 * keyboard has method 'pressed'
 */
TitlePane.prototype.handleInput = function(game) {
	if (this.keys[13] === true) {
		this.keys[13] = 'triggered';
		 
		 game.pushPane(new GamePane());
		 
	}	
};