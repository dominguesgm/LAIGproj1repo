/**
 * MyInterface
 * @constructor
 */
 
 
function MyInterface() {
	//call CGFinterface constructor 
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);
	this.gui = new dat.GUI();
	return true;
};

MyInterface.prototype.listLights = function() {
	// add light switches	
	var lights = this.gui.addFolder("Lights");

	var i;
	for (i = 0; i < this.scene.lights.length; i++)
		if(this.scene.lights[i].id!=undefined)
			lights.add(this.scene, this.scene.lights[i].id);	
};

/**
 * processKeyboard
 * @param event {Event}
 */
MyInterface.prototype.processKeyboard = function(event) {
	// call CGFinterface default code (omit if you want to override)
	CGFinterface.prototype.processKeyboard.call(this,event);	
};

MyInterface.prototype.processKeyDown = function(event){

	CGFinterface.prototype.processKeyDown.call(this,event);

	switch (event.keyCode)
	{
	};
}


MyInterface.prototype.processKeyUp = function(event){

	CGFinterface.prototype.processKeyDown.call(this,event);

	switch (event.keyCode)
	{
	};
}