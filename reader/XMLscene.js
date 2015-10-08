
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

XMLscene.prototype.initGeometry = function (application) {
	
	for(id in this.graph.leaves){
		console.log("Leaf number" + id);
		if(this.graph.leaves[id]['type']=='rectangle')
			this.rectangle = new MyRectangle(this, this.graph.leaves[id]['args']);
		if(this.graph.leaves[id]['type']=='cylinder')
			this.cylinder = new MyCylinder(this, this.graph.leaves[id]['args']);
		if(this.graph.leaves[id]['type']=='sphere')
			this.sphere = new MySphere(this, this.graph.leaves[id]['args']);
	}
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
XMLscene.prototype.onGraphLoaded = function () {
	//this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
	/*this.lights[0].setVisible(true);
    this.lights[0].enable();*/

	this.setIllumination();

    this.createLights();

	//shading    = Gouraud
	//polygon mode = fill

	console.log('XMLscene');

  	// TODO INITIALS
  	this.setInitials();
    this.loadTextures();
    this.loadMaterials();
    this.initGeometry();

   	// display nodes read:
   	console.log("LOAD REVIEW=======================================");
  	console.log("CURRRENT ROOT" + this.graph.root);

  	for(id in this.graph.nodes)
  		console.log(id+ " descendants" + this.graph.nodes[id]['descendants'].length);
	
	for(id in this.graph.nodes)
  		console.log(id+ " descendants" + this.graph.nodes[id]['descendants'].length);

    console.log("STARTING Drawing NOW");
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

	// default material
	this.materials['default'] = new  CGFappearance(this);
	this.materials['default'].setAmbient(.5,.5,.5,.5);
	this.materials['default'].setDiffuse(.5,.5,.5,.5);
	this.materials['default'].setSpecular(.5,.5,.5,.5);
	this.materials['default'].setEmission(.5,.5,.5,.5);
	this.materials['default'].setShininess(.5);

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
		this.processGraph();
	}	

    this.shader.unbind();
};

// TODO major changes required
/*
 * Processes node elementId and its descendants, calculating each one's matrix and checking for errors.
 */
XMLscene.prototype.processGraph = function() {
  
 	this.materialsUsed = ['default'];
 	this.texturesUsed = ['clear'];

	//this.loadIdentity();
	// temp 
	this.graph.initials['matrix']=[1,0,0,0
									,0,1,0,0,
									0,0,1,0
									,0,0,0,1];

	this.multMatrix(this.graph.initials['matrix']);

	console.log("CURRRENT ROOT" + this.graph.root);
	//console.log("CURRRENT ROOT descendants" + this.graph.nodes[this.graph.root]['descendants'].length);

 	this.processElement(this.graph.root);
 };

// TODO major changes required
XMLscene.prototype.drawElement = function(elementId) {
	console.log("draw element " + elementId);

	var material = this.materialsUsed.pop();
	var texture = this.texturesUsed.pop();

	this.materials[material].apply();
	this.textures[texture].apply();
	// change according to elementId
	if(elementId == 1){
		this.rectangle.display();
		console.log("Drawing rectangle");
	}
	if(elementId == 2){
		this.cylinder.display();
		console.log("Drawing cylinder");
	}
	if(elementId == 3){
		this.sphere.display();
		console.log("Drawing sphere");
	}
	this.materialsUsed.push(material);
	this.texturesUsed.push(texture);
};

// TODO major changes required
XMLscene.prototype.processElement = function(elementId) {

	var element = null;

	// debug
	console.log("STARTING "+ elementId);
	
	// find node or leaf
	if(this.graph.nodes[elementId] != null)
		element = this.graph.nodes[elementId];
	else if(this.graph.leaves[elementId] != null){
		//debug
		console.log("FINISHED LEAF "+ elementId);
		this.drawElement(elementId);
		return null;
	}else return null;

	// check if the element's material is valid
	if(this.materials[element['material']] == null || element['material']=="null"){
		var material = this.materialsUsed.pop();
		this.materialsUsed.push(material);
		this.materialsUsed.push(material);
	}else this.materialsUsed.push(element['material']);

	// check if the element's texture is valid
	if(this.textures[element['texture']] == null || element['texture']=="null"){
		var texture = this.texturesUsed.pop();
		this.texturesUsed.push(texture);
		this.texturesUsed.push(texture);
	}else this.texturesUsed.push(element['texture']);

	this.pushMatrix();

    this.multMatrix(element['matrix']);

	// check descendants
	var n;
	for(n=0; n< element['descendants'].length; n++)
		this.processElement(element['descendants'][n]);

	//debug
	console.log("FINISHED PROCESSING NODE "+ elementId);

	this.popMatrix();
	this.materialsUsed.pop();
	this.texturesUsed.pop();
};


XMLscene.prototype.setIllumination = function () {
	this.setGlobalAmbientLight(this.graph.illumination['ambient'][0], this.graph.illumination['ambient'][1], this.graph.illumination['ambient'][2], this.graph.illumination['ambient'][3]);

	//TODO complete with doubleside

	this.gl.clearColor(this.graph.illumination['background'][0], this.graph.illumination['background'][1], this.graph.illumination['background'][2], this.graph.illumination['background'][3]);
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
};
