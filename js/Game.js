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

/**
 * Beat object
 * Helps convert between seconds and beats
 */
var Beat = function(bpm) {
    this.bpm = bpm;
};

/**
 * Convert time to beatTime
 * BeatTime represents time measured in beats
 */
Beat.prototype.toBeatTime = function(t) {
    return t * this.bpm / 60.0;
};

/**
 * Convert time to beat value
 * Beat value is 0 to 1, hits 1 on the beat
 */
Beat.prototype.toBeat = function(t) {
    return 1.0 - Math.abs(Math.sin(this.toBeatTime(t) * 3.14159));
};

var Game = function() {
    // A Game object is the highest level object representing entire game
    this.clock = new THREE.Clock();
    this.renderer = new THREE.WebGLRenderer({antialias: true});
  	this.renderer.setSize(800, 600);
  	this.renderer.setClearColor(0xeeeeee, 1.0);
 	document.body.appendChild(this.renderer.domElement);
    this.panes = [];
    
    timeStop = false;
};

/**
 * Add pane to Game object
 * Any existing panes are pushed down on stack
 */
Game.prototype.pushPane = function(pane) {
  this.panes.push(pane);
};

/**
 * Pop off top pane
 * Reveals lower panes on stack
 */
Game.prototype.popPane = function() {
  this.panes.pop();
};

// Render function
Game.prototype.render = function(t, canvas, ctx) {
     // If there is no active pane do nothing
  	if(this.panes.length > 0) {
    var pane = this.panes[this.panes.length - 1];
    // Handle player input
    pane.handleInput(this);
    // Update pane
    // Pass renderer so it can do cubemaps for reflections
    pane.update(t , this.renderer);
    // Render the pane
    this.renderer.render(pane.scene, pane.camera);
  	}
};


Game.prototype.start = function() {
	var that = this;
	var time0 = new Date().getTime();
	//this.board.init();
	// milliseconds since 1970
	var loop = function() {
		var time = new Date().getTime();
		// Render visual frame
		that.render((time - time0) * 0.001);
		// Loop
		requestAnimationFrame(loop, that.renderer.domElement);
	};
	loop();
}; 
