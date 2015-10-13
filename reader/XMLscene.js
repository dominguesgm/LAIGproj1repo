
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

/*
 * Sets the scene's interface.
 */
XMLscene.prototype.setMyInterface = function(newInterface) {
	this.myInterface = newInterface;
}

/*
 * Initiate scene with default settings.
 */
XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();
    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.enableTextures(true);

    // create matrix
	this.matrix = mat4.create();
	// set to identity
    mat4.identity(this.matrix);

	this.axis=new CGFaxis(this);
};

/*
 * Initiate the scene's lights by default.
 */
XMLscene.prototype.initLights = function () {

    this.shader.bind();
	this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();
    this[this.lights[0].id]=true;
    this.shader.unbind();
};

/*
 * Initiate the scene's default camera.
 */
XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

/*
 * Initiate the scene's default appearance.
 */
XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

/*
 * Set the scene to the specified settings.
 */
 XMLscene.prototype.onGraphLoaded = function () {

	console.log('XMLscene');

  	// TODO INITIALS
  	this.setInitials();
  	this.setIllumination();
    this.createLights();
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

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

/*
 * Initiate the scene's geometry according to the information read.
 */
XMLscene.prototype.initGeometry = function () {
	this.leaves = [];
	for(id in this.graph.leaves){
		console.log("Leaf number" + id);
		if(this.graph.leaves[id]['type']=='rectangle')
			this.leaves[id] = new MyRectangle(this, this.graph.leaves[id]['args']);
		if(this.graph.leaves[id]['type']=='cylinder')
			this.leaves[id] = new MyCylinder(this, this.graph.leaves[id]['args']);
		if(this.graph.leaves[id]['type']=='sphere')
			this.leaves[id] = new MySphere(this, this.graph.leaves[id]['args']);
		if(this.graph.leaves[id]['type']=='triangle')
			this.leaves[id] = new MyTriangle(this, this.graph.leaves[id]['args']);
	}
};

/*
 * Set the scene's definitions to the specified values.
 */
XMLscene.prototype.setInitials = function () {

	console.log("ATENTION__________________ " + this.matrix);
			
	// add  translation
    mat4.translate(this.matrix, this.matrix, this.graph.initials['translation']);
	console.log("ATENTION__________________ " + this.matrix);

	// add rotations
	mat4.rotateX(this.matrix, this.matrix, degToRad(this.graph.initials['rotations'][0][1]));	
	mat4.rotateY(this.matrix, this.matrix, degToRad(this.graph.initials['rotations'][1][1]));	
	mat4.rotateZ(this.matrix, this.matrix, degToRad(this.graph.initials['rotations'][2][1]));	
    console.log("ATENTION__________________ " + this.matrix);

    // add scale
	mat4.scale(this.matrix, this.matrix, this.graph.initials['scale']);
	console.log("ATENTION__________________ " + this.matrix);

	// debug final matrix
	console.log("ATENTION__________________ " + this.matrix);

	// TODO
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////
	var perspective = mat4.create();
	mat4.perspective(45, 800* 600 , this.graph.initials.frustumNear, this.graph.initials.frustumFar, perspective);
};

/*
 * Create the scene's illumination accoording to the specified settings.
 */
XMLscene.prototype.setIllumination = function () {
	this.setGlobalAmbientLight( this.graph.illumination['ambient'][0], 
								this.graph.illumination['ambient'][1], 
								this.graph.illumination['ambient'][2], 
								this.graph.illumination['ambient'][3]);
	this.gl.clearColor( this.graph.illumination['background'][0], 
						this.graph.illumination['background'][1], 
						this.graph.illumination['background'][2], 
						this.graph.illumination['background'][3]);
};


/*
 * Create the scene's lights accoording to the specified settings.
 */
XMLscene.prototype.createLights = function(){
	var numberOfLights = this.graph.lights.length;

	for(var i = 0; i < numberOfLights; i++){
		this.lights[i].id = this.graph.lights[i]['id'];
		
		// debug		
		this.lights[i].setVisible(true);

		this[this.lights[i].id] = this.graph.lights[i]['enable'];
		
		if(this.graph.lights[i]['enable'])
			this.lights[i].enable();
		else this.lights[i].disable();	
 
		this.lights[i].setPosition( this.graph.lights[i]['position'][0], 
									this.graph.lights[i]['position'][1], 
									this.graph.lights[i]['position'][2], 
									this.graph.lights[i]['position'][3]);

		this.lights[i].setAmbient(  this.graph.lights[i]['ambient'][0], 
									this.graph.lights[i]['ambient'][1], 
									this.graph.lights[i]['ambient'][2], 
									this.graph.lights[i]['ambient'][3]);

		this.lights[i].setDiffuse(  this.graph.lights[i]['diffuse'][0], 
									this.graph.lights[i]['diffuse'][1], 
									this.graph.lights[i]['diffuse'][2], 
									this.graph.lights[i]['diffuse'][3]);

		this.lights[i].setSpecular( this.graph.lights[i]['specular'][0],
									this.graph.lights[i]['specular'][1], 
									this.graph.lights[i]['specular'][2], 
									this.graph.lights[i]['specular'][3]);
	}

	this.myInterface.listLights();	// create the light switchers
};

/*
 * Update the lights according to their current state (enabled/disabled).
 */
XMLscene.prototype.updateLights = function() {
	var i;
	for (i = 0; i < this.lights.length; i++){
		if(this[this.lights[i].id])
				this.lights[i].enable();
		else this.lights[i].disable();
		this.lights[i].update();
	}
}

/*
 * Load the scene's textures.
 */
XMLscene.prototype.loadTextures = function () {

	this.textures = [];
	this.amplificationFactor = [];

	for(id in this.graph.textures){
		this.textures[id] = new CGFtexture(this, this.graph.textures[id]['file']);
		this.amplificationFactor[id] = this.graph.textures[id]['amplif_factor'];
		console.log("texture read ID=" + id);
	}
};

/*
 * Create the scene's materials.
 */
XMLscene.prototype.loadMaterials = function () {

	this.materials = [];

	// default material
	this.materials['default'] = new  CGFappearance(this);
	this.materials['default'].setAmbient(.5,.5,.5,.5);
	this.materials['default'].setDiffuse(.5,.5,.5,.5);
	this.materials['default'].setSpecular(.5,.5,.5,.5);
	this.materials['default'].setEmission(.5,.5,.5,.5);
	this.materials['default'].setShininess(1);
	this.materials['default'].setTextureWrap("REPEAT","REPEAT");

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
		this.materials[id].setTextureWrap("REPEAT","REPEAT");

		// debug
		console.log("material read id=" + id);
	}
};

/*
 * Display the scene.
 */
XMLscene.prototype.display = function () {
    this.shader.bind();
	
	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View
	this.updateProjectionMatrix();
    this.loadIdentity();
    this.multMatrix(this.matrix);

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	this.axis.display();
	this.setDefaultAppearance();


	if (this.graph.loadedOk){
		this.updateLights();
		this.processGraph();
	}	

    this.shader.unbind();
};


/*
 * Processes the scene's elements.
 */
XMLscene.prototype.processGraph = function() {
  
 	this.materialsUsed = ['default'];
 	this.texturesUsed = ['clear'];

	console.log("CURRRENT ROOT" + this.graph.root);

 	this.processElement(this.graph.root);
 };

/*
 * Draws the element with elementId with current appearance and tranformation.
 */
XMLscene.prototype.drawElement = function(elementId) {
	console.log("draw element " + elementId);

	var material = this.materialsUsed.pop();
	var texture = this.texturesUsed.pop();
	var previousTexture;
	
	console.log("APPLYING TEXTURE - " + texture);
	if(texture!='clear'){
		this.leaves[elementId].updateTexelCoordinates(this.amplificationFactor[texture][0], this.amplificationFactor[texture][1]);
		this.materials[material].setTexture(this.textures[texture]);
	}else this.materials[material].setTexture(null);

	this.materials[material].apply();

	// draw the element specified
	this.leaves[elementId].display();

	this.materialsUsed.push(material);
	this.texturesUsed.push(texture);
};


/*
 * Processes element elementId and its descendants.
 */
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
	if(this.textures[element['texture']] == null && element['texture']!="null")
		this.texturesUsed.push('clear');
	else if(element['texture']=="null"){
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


