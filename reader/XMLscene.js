
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	this.axis=new CGFaxis(this);
};

XMLscene.prototype.initLights = function () {

    this.shader.bind();

	this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();
 
    this.shader.unbind();
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{
	//this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
	/*this.lights[0].setVisible(true);
    this.lights[0].enable();*/

    this.createLights();

	//shading    = Gouraud
	//polygon mode = fill

	console.log('XMLscene');

  	// TODO INITIALS
  	this.setInitials();
    this.loadTextures();
    this.loadMaterials();
};

XMLscene.prototype.setInitials = function () {
	// TODO correct upon new lib release
	//this.axis=new CGFaxis(this, this.graph.initials.referenceLength);

	//CGFcamera( fov, near, far, position, target );
	//this.camera = new CGFcamera(0.4, this.graph.initials.frustumNear, this.graph.initials.frustumFar, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
	this.camera.far = this.graph.initials.frustumFar;
	this.camera.near = this.graph.initials.frustumNear;
	// translate
//	this.camera.translate(vec3.fromValues(this.graph.initials.translation[0], this.graph.initials.translation[1], this.graph.initials.translation[2]));

	// rotate x,y,z
	//TOOD improve
//	var toRadians = Math.PI / 180.0;
//	this.camera.rotate(vec3.fromValues(1, 0, 0), this.graph.initials.rotations[0][1]*toRadians);
//	this.camera.rotate(vec3.fromValues(0, 1, 0), this.graph.initials.rotations[1][1]*toRadians);
//	this.camera.rotate(vec3.fromValues(0, 0, 1), this.graph.initials.rotations[2][1]*toRadians);
// scale ???	
};

XMLscene.prototype.loadTextures = function () {

	this.textures = [];

	for(id in this.graph.textures){
		this.textures[id] = new CGFappearance(this);
		/*
		this.textures[id].setAmbient(.86,0.81,.79,1);
		this.windowTexture.setDiffuse(.76,0.71,.59,1);
		this.windowTexture.setSpecular(.76,0.71,0.59,1);
		this.windowTexture.setShininess(60);	
		this.windowTexture.setTextureWrap("CLAMP_TO_EDGE","CLAMP_TO_EDGE");*/
		
		this.textures[id].loadTexture(this.graph.textures[id]['file']);

		// TODO deal with ampli_factors s,t
		// debug
		console.log("texture read ID=" + id);
		}
};

XMLscene.prototype.loadMaterials = function () {

	this.materials = [];

	for(id in this.graph.materials){
		this.materials[id] = new CGFappearance(this);

		this.materials[id].setAmbient(  this.graph.materials[id]['ambient'][0],
										this.graph.materials[id]['ambient'][1],
										this.graph.materials[id]['ambient'][2],
										this.graph.materials[id]['ambient'][3]);

		this.materials[id].setDiffuse(  this.graph.materials[id]['diffuse'][0],
										this.graph.materials[id]['diffuse'][1],
										this.graph.materials[id]['diffuse'][2],
										this.graph.materials[id]['diffuse'][3]);

		this.materials[id].setSpecular( this.graph.materials[id]['specular'][0],
										this.graph.materials[id]['specular'][1],
										this.graph.materials[id]['specular'][2],
										this.graph.materials[id]['specular'][3]);

		this.materials[id].setEmission( this.graph.materials[id]['emission'][0],
										this.graph.materials[id]['emission'][1],
										this.graph.materials[id]['emission'][2],
										this.graph.materials[id]['emission'][3]);

		this.materials[id].setShininess(this.graph.materials[id]['shininess']);

		// debug
		console.log("material read id=" + id);
	}
};

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup
    this.shader.bind();
	
	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Draw axis
	this.axis.display();

	this.setDefaultAppearance();
	
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk)
	{
		this.lights[0].update();






	};	

    this.shader.unbind();
};

XMLscene.prototype.createLights = function(){
	var numberOfLights = this.graph.lights.length;

	for(var i = 0; i < numberOfLights; i++){
		this.lights[i].id = this.graph.lights[i]['id'];

		if(this.graph.lights[i]['enable'] == true)
			this.lights[i].enable();
		else
			this.lights[i].disable();

		this.lights[i].setPosition(this.graph.lights[i]['position'][0], this.graph.lights[i]['position'][1], this.graph.lights[i]['position'][2], this.graph.lights[i]['position'][3]);

		this.lights[i].setAmbient(this.graph.lights[i]['ambient'][0], this.graph.lights[i]['ambient'][1], this.graph.lights[i]['ambient'][2], this.graph.lights[i]['ambient'][3]);

		this.lights[i].setDiffuse(this.graph.lights[i]['diffuse'][0], this.graph.lights[i]['diffuse'][1], this.graph.lights[i]['diffuse'][2], this.graph.lights[i]['diffuse'][3]);

		this.lights[i].setSpecular(this.graph.lights[i]['specular'][0], this.graph.lights[i]['specular'][1], this.graph.lights[i]['specular'][2], this.graph.lights[i]['specular'][3]);

	}
}