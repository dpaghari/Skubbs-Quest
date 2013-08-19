var TitlePane = function() {
  this.camera = new THREE.PerspectiveCamera(75, 4.0/3.0, 1, 10000);
  this.camera.position.z += 1000;
  this.camera.position.x -= 1000;
  this.camera.position.y += 1000;
  
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
  
  // Add single cube
  this.cube = new THREE.Mesh(
    new THREE.CubeGeometry(500, 500, 500),
    new THREE.MeshLambertMaterial({
      color: new THREE.Color(0xff8000)
    }));
  this.scene.add(this.cube);

  // Add a light source
  var light = new THREE.PointLight(0xffffff);
  light.position.set(700, 1300, 1000);
  this.scene.add(light);
  
  // Look at cube
  this.camera.lookAt(this.cube.position);
};

/**
 * Update BoringPane's state to time t
 * Do nothing
 */
TitlePane.prototype.update = function(t, renderer) {
  // be boring, do nothing
};

/**
 * Handle input inside BoringPane
 * keyboard has method 'pressed'
 */
TitlePane.prototype.handleInput = function(keyboard, game) {
	if (this.keys[13] === true) {
		this.keys[13] = 'triggered';
		 game.pushPane(new GamePane());
	}	
};