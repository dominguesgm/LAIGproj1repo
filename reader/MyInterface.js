/*
 * MyInterface
 * @constructor
 */ 
function MyInterface() {
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);

MyInterface.prototype.constructor = MyInterface;

/*
 * init
 * @param CGFapplication application
 * @return true upon success
 */
MyInterface.prototype.init = function(application) {
	CGFinterface.prototype.init.call(this, application);
	this.gui = new dat.GUI();
	return true;
};

/*
 * listLigths
 * Create entries on application menu to act as switchers for the scene's ligths.
 * @param amplifS amplification factor s
 * @param amplifT amplification factor t
 */
MyInterface.prototype.listLights = function() {
	var lights = this.gui.addFolder("Lights");
	var i;
	for (i = 0; i < this.scene.lights.length; i++)
		if(this.scene.lights[i].id!=undefined)
			lights.add(this.scene, this.scene.lights[i].id);	
};