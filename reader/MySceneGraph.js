
function MySceneGraph(filename, scene){
	this.loadedOk = null;
	this.nElements = 0;
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
		
	// File reading 
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	 
	this.reader.open('scenes/'+filename, this);
};

/*
 * Handles errors and warnings.
 * Returns true if a critical error occurred.
 */
MySceneGraph.prototype.criticalErrors=function(errors){

	if (errors != null){
		var n;
		
		for(n = 0; n<errors.length; n++)
		// check type of error
		if(errors[n][0]=="Warning")
			this.onXMLWarning(errors[n][1]);
		else{
			this.onXMLError(errors[n][1]);
			return true;
		}	
	}
	return false;
};


/*
 * Callback to be executed after successful reading.
 */
MySceneGraph.prototype.onXMLReady=function(){
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	
	var errors = this.parseInitials(rootElement);
	if(this.criticalErrors(errors))
		return;

	//debug
	console.log("#INITIALS read");

	var errors = this.parseIllumination(rootElement);
	if(this.criticalErrors(errors))
		return;

	//debug
	console.log("#ILLUMINATION read");

	var errors = this.parseLights(rootElement);
	if(this.criticalErrors(errors))
		return;

	//debug
	console.log("#LIGHTS read");

	errors = this.parseTextures(rootElement);
	if(this.criticalErrors(errors))
		return;

	//debug
	console.log("#TEXTURES read");

	errors = this.parseMaterials(rootElement);
	if(this.criticalErrors(errors))
		return;

	//debug
	console.log("#MATERIALS read");

	errors = this.parseLeaves(rootElement);
	if(this.criticalErrors(errors))
		return;

	//debug
	console.log("#LEAVES read");

	errors = this.parseNodes(rootElement);
	if(this.criticalErrors(errors))
		return;

	//debug
	console.log("#NODES read");

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	console.log("#GRAPH LOADED");
	this.scene.onGraphLoaded();
};

/**********************************************************************************************
 * Auxiliar functions.
 **********************************************************************************************/

MySceneGraph.prototype.getTranslation= function(element, required) {
	var coordenates = this.getXYZ(element, ['x', 'y','z'], required);
	
	if(!this.validElement(coordenates))
		return null;
	else return coordenates;
};

MySceneGraph.prototype.getScale= function(element, required) {
	var scale = this.getXYZ(element, ["sx", "sy", "sz"], required);
	
	if(!this.validElement(scale))
		return null;
	else return scale;
};

MySceneGraph.prototype.getRotation= function(element, required) {
	var rotation = [];
	rotation[0] =  this.reader.getItem(element,'axis' , ['x', 'y', 'z'], required);
	rotation[1] = this.reader.getFloat(element,'angle' , required);

	if(!this.validElement(rotation))
		return null;
	else return rotation;
};

MySceneGraph.prototype.getXYZ= function(element, tags, required) {
	var coordenates = [];
	coordenates[0] = this.reader.getFloat(element, tags[0], required);
	coordenates[1] = this.reader.getFloat(element, tags[1], required);
	coordenates[2] = this.reader.getFloat(element, tags[2], required);

	return coordenates;
};

MySceneGraph.prototype.getRGBA= function(element, required) {
 var rgba = [];
 	rgba[0] = this.reader.getFloat(element, 'r', required);
	rgba[1] = this.reader.getFloat(element, 'g', required);
	rgba[2] = this.reader.getFloat(element, 'b', required);
	rgba[3] = this.reader.getFloat(element, 'a', required);

	if(!this.validElement(rgba))
		return null;
	else return rgba;
};

/*
 * Check the RGBA element for completion and errors on values' range.
 */
MySceneGraph.prototype.checkRGBA= function(element) {
	var n;
	var error = false;
	for(n=0; n<element.length; n++)
		if(element[n]==null || element[n]>1 || element[n]<0){
			element[n]=.5; // default
			error = true;
		}
		// debug
		console.log(!error);
	return !error;
};

/*
 * Checks if an element is valid.
 */
MySceneGraph.prototype.validElement= function(element) {
	if(element==null)
		return false;

	var n;
	for(n=0; n<element.length; n++)
		if(element[n]==null)
			return false;
	return true;
};

/*
 * Returns the matrix resulting of mA.mB.
 */
MySceneGraph.prototype.multiplyTansformationMatrixes= function(mA, mB) {
	var result = [];
	var n, iA=0, iB=0;
	for(n=0; n<mA.length; n++, iB++){
		if(n%4 ==0 && n!=0){
			iA+=4;
			iB=0;
		}
		result[n] = mA[iA]*mB[iB]+mA[iA+1]*mB[iB+4]+mA[iA+2]*mB[iB+8]+mA[iA+3]*mB[iB+12];
	}

	return result;
}

/*
 * Sets the parameters in Initials to the specified values.
 */ 
MySceneGraph.prototype.setInitials= function(settings) {
	for(property in settings)
		this.initials[property]=settings[property];
}

/*
 * Callback to be executed on any read error or warning.
 */
 MySceneGraph.prototype.onXMLWarning= function(message){
	console.error("LSX Loading Warning: " + message);
};

MySceneGraph.prototype.onXMLError=function (message){ 
	console.error("LSX Loading Error: "+message);
	this.loadedOk=false;
};

/**********************************************************************************************
 * Parsing functions.
 **********************************************************************************************/

/*
 * Method that parses elements of 'INITIALS' block and stores information in a specific data structure.
 * Returns a list of errors and warnings.
 */
MySceneGraph.prototype.parseInitials= function(rootElement) {
	this.initials = [];

	var defaultSettings = { frustumNear: 0, frustumFar: 0, translation: [0,0,0], rotations: [['x',0], ['y',0], ['z',0]], scale: [1,1,1], referenceLength: 1};

	// check occurrences of 'INITIALS'
	var elemsInitial =  rootElement.getElementsByTagName('INITIALS');

	if (elemsInitial == null || elemsInitial.length == 0) {
		this.setInitials(defaultSettings);	
		warningMessages.push(["Warning", "<INITIALS> element not found. Default used."]);
		return warningMessages;
	}

	if (elemsInitial.length > 1)
		warningMessages.push(["Warning", "Several definitions for <INITIALS> element found."]);
	
	var initialsTemp = elemsInitial[0].children;

	var warningMessages = [];

	// read information on frustum	
	this.initials['frustumNear'] = this.reader.getFloat(initialsTemp[0], 'near', false);
	this.initials['frustumFar'] = this.reader.getFloat(initialsTemp[0], 'far', false);
	if(this.initials['frustumNear'] == null || this.initials['frustumFar'] == null){
		warningMessages.push(["Warning", "One or more errors on <INITIALS>/<frustum>. Default used."]);
		this.initials['frustumNear'] = defaultSettings["frustumNear"];
		this.initials['frustumFar'] = defaultSettings["frustumFar"];
	}
	
	// debug	
	console.log(this.initials['frustumFar']);
	console.log(this.initials['frustumNear']);

	// read information on translation	
	this.initials['translation'] = this.getTranslation(initialsTemp[1], false);

	if(this.initials['translation']==null){
		warningMessages.push(["Warning", "One or more errors on <INITIALS>/<translation>. Default used."]);
		this.initials['translation'] = defaultSettings["translation"];
	}

	// debug	
	console.log(this.initials['translation']);

	// read information on rotations	
	this.initials['rotations'] = [];
	var n;
	for(n=0; n<3; n++){
		this.initials['rotations'][n]=this.getRotation(initialsTemp[n+2], false);
		if(this.initials['rotations'][n]==null){
			this.initials['rotations'][n] = defaultSettings["rotations"][n];
			warningMessages.push(["Warning", "One or more errors on <INITIALS>/<rotation> no. " + n+1 + ". Default used."]);
		}
	}

	// debug	
	console.log(this.initials['rotations'][0]);

	// read information on scale
	this.initials['scale'] = this.getScale(initialsTemp[n+2], false);
	if(this.initials['scale'] == null){
		warningMessages.push(["Warning", "One or more errors on <INITIALS>/<scale>. Default used."]);
		this.initials['scale'] = defaultSettings["scale"];	
	}

	// debug	
	console.log(this.initials['scale']);

	// reference length
	this.initials['referenceLength'] = this.reader.getFloat(initialsTemp[n+3], 'length', false);
	if(this.initials['referenceLength'] == null){
		warningMessages.push(["Warning", "One or more errors on <INITIALS>/<reference>. Default used."]);
		this.initials['referenceLength'] = defaultSettings["referenceLength"];	
	}

	console.log(this.initials['referenceLength']);
	return warningMessages;
};

/*
 *	Method that parses elements of the 'ILLUMINATION' block and stores information in a specific data structure
 */
MySceneGraph.prototype.parseIllumination = function(rootElement){
	var illuminationXML=rootElement.getElementsByTagName('ILLUMINATION');

	var warnings =[];

	if (illuminationXML == null  || illuminationXML.length==0) {
		warnings.push(["Error", "No 'Illumination' element found."]);
		return warnings;
	}

	var illumnodes=illuminationXML[0].children.length;
	if(illumnodes != 2){
		warnings.push(["Error", "The 'Illumination' element must have 3 attributes in the following order: 'ambient' and 'background'."]);
		return warnings;
	}

	this.illumination = [['ambient', []],
							['background', []]];

	var e=illuminationXML[0].children[0];
	if(e.nodeName == "ambient"){
		this.illumination['ambient'] = this.getRGBA(e, false);
		if(this.illumination['ambient'][0] == null || this.illumination['ambient'][1] == null || this.illumination['ambient'][2] == null || this.illumination['ambient'][3] == null){
		 	warnings.push(["Error", "'Ambient' is composed of r='float', g='float', b='float' and a='float'."]);
			return warnings;
		}
	} else{
		warnings.push(["Error", "No 'ambient' attribute found, or found in the wrong order."]);
		return warnings;
	}

	var e=illuminationXML[0].children[1];
	if(e.nodeName == "background"){
	 	this.illumination['background'] = this.getRGBA(e, false);
		if(this.illumination['background'][0] == null || this.illumination['background'][1] == null || this.illumination['background'][2] == null || this.illumination['background'][3] == null){
		 	warnings.push(["Error", "'Background' is composed of r='float', g='float', b='float' and a='float'."]);
			return warnings;
		}
	} else{
		warnings.push(["Error", "No 'background' attribute found, or found in the wrong order."]);
		return warnings;
	}
	// Finished reading illumination data
	/* Confirm that illumination is being read
	console.log("AmbientRGBA " + this.ambientR + " " + this.ambientG + " " + this.ambientB + " " + this.ambientA);
	console.log("DoubleSide " + this.doubleside);
	console.log("BackgroundRGBA " + this.backgroundR + " " + this.backgroundG + " " + this.backgroundB + " " + this.backgroundA);
	*/
};


/*
 * Methods used for parsing the 'LIGHTS' block information
 */

 MySceneGraph.prototype.parseLights = function(rootElement) {
 	var warningMessages = [];

 	var lightsBlock = rootElement.getElementsByTagName("LIGHTS");

 	if(lightsBlock == null || lightsBlock.length == 0 || lightsBlock.length > 1){
 		warningMessages.push(['Error', "<LIGHTS> block not found."]);
 		return warningMessages;
 	}

 	this.lights = [];

 	var lightIterator = 0;
 	for(; lightIterator < lightsBlock[0].children.length; lightIterator++){
 		var tempLight = lightsBlock[0].children[lightIterator];
 		if(tempLight.nodeName == 'LIGHT'){
 			var parseWarning = this.parseSingleLight(tempLight);
 			if(parseWarning != null)
 				warningMessages.push('Warning', 'Issue parsing light number ' + lightIterator + '.');
 		} else 
 			warningMessage.push('Warning', 'Current element number ' + lightIterator + ' is not a light, ignoring it.');
 	}
 	if(this.lights.length == 0){
 		warningMessages.push('Error', 'There should at least be one light.');
 		return warningMessages;
 	}
 };

 MySceneGraph.prototype.parseSingleLight= function(element){
 	var light = [];
 	var warningMessages = [];

 	var id = this.reader.getString(element, 'id', false);
 	if(id == null){
 		warningMessages.push('Warning', 'Issue parsing light: no id.');
 		return warningMessages;
 	}
 	light['id'] = id;
 	var attributes = element.children;

 	//enable
 	if(attributes[0].nodeName == 'enable'){
 		light['enable'] = this.reader.getBoolean(attributes[0], 'value', false);
 		if(light['enable'] == null){
 			warningMessages.push('Warning', 'Issue parsing light: incorrect value in attribute "enable".');
 			return warningMessages;
 		}
 	} else {
 		warningMessages.push('Warning', 'Issue parsing light: "enable attribute not found or in wrong order.');
 			return warningMessages;
 	}
	
 	//position
 	if(attributes[1].nodeName == 'position'){
 		var position = this.getTranslation(attributes[1], false);
 		position.push(this.reader.getFloat(attributes[1], 'w', false));
 		light['position'] = position;
 		if(light['position'][0] == null || light['position'][1] == null || light['position'][2] == null || light['position'][3] == null){
 			warningMessages.push('Warning', 'Issue parsing light : incorrect value in attribute "position".');
 			return warningMessages;
 		}
 	} else {
 		warningMessages.push('Warning', 'Issue parsing light: "position attribute not found or in wrong order.');
 			return warningMessages;
 	}

 	//ambient
 	if(attributes[2].nodeName == 'ambient'){
 		light['ambient'] = this.getRGBA(attributes[2], false);
 		if(light['ambient'][0] == null || light['ambient'][1] == null || light['ambient'][2] == null || light['ambient'][3] == null){
 			warningMessages.push('Warning', 'Issue parsing light: incorrect value in attribute "ambient".');
 			return warningMessages;
 		}
 	} else {
 		warningMessages.push('Warning', 'Issue parsing light : "ambient attribute not found or in wrong order.');
 			return warningMessages;
 	}

 	//diffuse
 	if(attributes[3].nodeName == 'diffuse'){
 		light['diffuse'] = this.getRGBA(attributes[3], false);
 		if(light['diffuse'][0] == null || light['diffuse'][1] == null || light['diffuse'][2] == null || light['diffuse'][3] == null){
 			warningMessages.push('Warning', 'Issue parsing light: incorrect value in attribute "diffuse".');
 			return warningMessages;
 		}
 	} else {
 		warningMessages.push('Warning', 'Issue parsing light: "diffuse attribute not found or in wrong order.');
 			return warningMessages;
 	}

 	//specular
 	if(attributes[4].nodeName == 'specular'){
 		light['specular'] = this.getRGBA(attributes[4], false);
 		if(light['specular'][0] == null || light['specular'][1] == null || light['specular'][2] == null || light['specular'][3] == null){
 			warningMessages.push('Warning', 'Issue parsing light number: incorrect value in attribute "specular".');
 			return warningMessages;
 		}
 	} else {
 		warningMessages.push('Warning', 'Issue parsing light: "specular attribute not found or in wrong order.');
 			return warningMessages;
 	}

 	this.lights.push(light);
 	return null;

 };

/*
 * Method that parses elements of 'TEXTURES' block and stores information in a specific data structure
 */
MySceneGraph.prototype.parseTextures= function(rootElement) {
	return this.parseElement('TEXTURE', rootElement);
}

/*
 * Method that parses elements of 'MATERIALS' block and stores information in a specific data structure.
 * Returns a list of errors and warnings.
 */
MySceneGraph.prototype.parseMaterials= function(rootElement) {
	return this.parseElement('MATERIAL', rootElement);
}

/*
 * Method that parses elements of type elementType and stores information in a specific data structure.
 * Returns a list of errors and warnings.
 */
MySceneGraph.prototype.parseElement= function(elementType, rootElement) {

	var warningMessages = [];

	// check occurrences of elementType
	var elems =  rootElement.getElementsByTagName(elementType+'S');

	if (elems == null || elems.length == 0) {
		warningMessages.push(["Warning", "<" + elementType + "S> element not found."]);
		return warningMessages;
	}

	if (elems.length > 1)
		warningMessages.push(["Warning", "Several definitions for <" + elementType + "S> element found."]);
	
	this[elementType.toLowerCase() +'s'] = [];

	var n, m;
	for(n=0; n<elems.length; n++){

		var elmsTemp = elems[n].getElementsByTagName(elementType);
		for(m=0; m<elmsTemp.length; m++){

			var elm = elmsTemp[m];		
			
			if(this[elementType.toLowerCase() +'s'][elm.id]!= null)
				warningMessages.push(["Warning", "Two or more <" + elementType + "S>/<" + elementType + "> elements with id=" + elm.id + " found."]);
			else if(elementType=='MATERIAL') 
				this[elementType.toLowerCase() +'s'][elm.id]=this.readMaterial(elm);
			else if(elementType=='TEXTURE')
				this[elementType.toLowerCase() +'s'][elm.id]=this.readTexture(elm);
			else continue;

			if(this[elementType.toLowerCase() +'s'][elm.id]==null)	// delete material if an error occurred
				delete this[elementType.toLowerCase() +'s'][elm.id];
		}
	}

	return warningMessages;
};

/*
 * Returns a structure of type texture { file, ampli_factor[] } or null if an error occurs.
 */
MySceneGraph.prototype.readTexture= function(element) {
	var texture = [];

	var filePath =  element.getElementsByTagName('file');
	if(filePath.length!=1){
		this.onXMLWarning("Error on <TEXTURE id=" + element.id +"><file>. Element ignored.");
		return null;
	}

	texture['file'] = filePath[0].attributes.getNamedItem("path").value;
	if(texture['file']==null){
		this.onXMLWarning("Error on <TEXTURE id=" + element.id +"><file>. Element ignored.");
		return null;
	}		
	
	texture['amplif_factor'] = [null, null];
	var ampliFactor =  element.getElementsByTagName('amplif_factor');
	if(ampliFactor.length!=0)
		texture['amplif_factor'] = [parseFloat(ampliFactor[0].attributes.getNamedItem("s").value), 
				  parseFloat(ampliFactor[0].attributes.getNamedItem("t").value)];

	if(!this.validElement(texture['amplif_factor'])){
		this.onXMLWarning("Error on <TEXTURE id=" + element.id +"><file>. Default used.");
		texture['amplif_factor'] = [1,1];
	}
		
	// debug
	console.log( texture['file'] + ", s=" + texture['amplif_factor'][0]+" t=" + texture['amplif_factor'][1]);

	return texture;
}

/*
 * Returns a structure of type material { shininess, specular[], diffuse[], ambient[], emission[] } or null if an error occurs.
 */
MySceneGraph.prototype.readMaterial= function(element) {
	var material = [];
	//
	var properties = ['shininess', 'specular', 'diffuse', 'ambient', 'emission'];
	var n;

	for(n=0; n<properties.length; n++){
		var property = element.getElementsByTagName(properties[n]);
		if(property.length!=1){
			this.onXMLWarning("Error on <MATERIAL id=" + element.id +"><" + properties[n] + ">. Element ignored.");
			return null;
		}

		switch(properties[n]){
			case 'shininess':
				material['shininess'] = parseFloat(property[0].attributes.getNamedItem("value").value);
				if(material['shininess']== null || material['shininess']<0){
					material['shininess'] = 1;	// default
					this.onXMLWarning("Error on <MATERIAL id=" + element.id +"><" + properties[n] + ">. Default used.");
				}
				break;
			case 'specular':
			case 'diffuse':
			case 'ambient':
			case 'emission':
				material[properties[n]] = this.getRGBA(property[0], false);
				if(material[properties[n]] == null){
					this.onXMLWarning("Error on <MATERIAL id=" + element.id +"><" + properties[n] + ">. Element ignored.");
					return null;
				}else if(!this.checkRGBA(material[properties[n]]))
					this.onXMLWarning("Error on <MATERIAL id=" + element.id +"><" + properties[n] + ">. Default used.");
				break;
			default:
				this.onXMLWarning("Error on <MATERIAL id=" + element.id +">. Element ignored.");
				return null;
		}
	}

	// debug
	console.log( material['shininess']);
	console.log( material['specular']);
	console.log( material['diffuse']);
	console.log( material['ambient']);
	console.log( material['emission']);

	return material;
};

/*
 * Method that parses elements of 'LEAVES' block and stores information in a specific data structure.
 * Returns a list of errors and warnings.
 */
MySceneGraph.prototype.parseLeaves= function(rootElement) {
	
	var warningMessages = [];

	// check occurrences of 'LEAVES'
	var elemsLeaves =  rootElement.getElementsByTagName('LEAVES');

	if (elemsLeaves == null || elemsLeaves.length == 0) {
		warningMessages.push(["Warning", "<LEAVES> element not found."]);
		return warningMessages;
	}

	if (elemsLeaves.length > 1)
		warningMessages.push(["Warning", "Several definitions for <LEAVES> element found."]);
	
	this.leaves = [];

	var n, m;
	for(n=0; n<elemsLeaves.length; n++){

		var leavesTemp = elemsLeaves[n].getElementsByTagName('LEAF');

		for(m=0; m<leavesTemp.length; m++){

			var leaf = leavesTemp[m];		
			
			if(this.leaves[leaf.id]!= null)
				warningMessages.push(["Warning", "Two or more <LEAVES>/<LEAVE> elements with id=" + leaf.id + " found."]);
			else this.leaves[leaf.id]=this.readLeaf(leaf);

			if(this.leaves[leaf.id]==null){
				warningMessages.push(["Warning", "One or more errors on <LEAVES>/<LEAVE> element with id=" + leaf.id + ". Ignored."]);
				delete this.leaves[leaf.id];
			}else this.leaves[leaf.id]['idSeq'] = this.nElements++;
		}

	}

	return warningMessages;
};

/*
 * Returns a structure of type leaf { type, args[] } or null if an error occurs.
 */
MySceneGraph.prototype.readLeaf= function(element) {
	var leaf = [];

	leaf['type'] = this.reader.getString(element, 'type', false);
	if(leaf['type']==null)
		return null;

	leaf['args'] = [];
	var args = this.reader.getString(element, 'args', false);
	if(args==null)
		return null;
	
	var values = args.split(" ");
	var n;
	for(n=0; n<values.length; n++)
		values[n]=parseFloat(values[n]);
	
	leaf['args'] = values;

	// debug
	console.log(leaf['type']);
	console.log(leaf['args']);

	return leaf;
}


/*
 * Method that parses elements of 'NODES' block and stores information in a specific data structure.
 * Returns a list of errors and warnings.
 */
MySceneGraph.prototype.parseNodes= function(rootElement) {
	
	var warningMessages = [];

	// check occurrences of 'MATERIALS'
	var elemsNodes =  rootElement.getElementsByTagName('NODES');

	if (elemsNodes == null || elemsNodes.length == 0) {
		warningMessages.push(["Warning", "<NODES> element not found."]);
		return warningMessages;
	}

	if (elemsNodes.length > 1)
		warningMessages.push(["Warning", "Several definitions for <NODES> element found."]);
	
	this.nodes = [];

	var n, m;
	for(n=0; n<elemsNodes.length; n++){

		var rootTemp = elemsNodes[n].getElementsByTagName('ROOT');
		if(rootTemp.length==1)
			this.root = rootTemp[0].id;

		var nodesTemp = elemsNodes[n].getElementsByTagName('NODE');

		for(m=0; m<nodesTemp.length; m++){

			var node = nodesTemp[m];		
			
			if(this.nodes[node.id]!= null || this.leaves[node.id]!=null)
				warningMessages.push(["Warning", "Two or more <NODES>/<NODE> or <LEAVES>/<LEAVE> elements with id=" + node.id + " found."]);
			else this.nodes[node.id]=this.readNode(node);

			if(this.nodes[node.id]==null){
				warningMessages.push(["Warning", "Error on <NODES>/<NODE> element with id=" + node.id + " - no <DESCENDANTS> found. Ignored."]);
				delete this.nodes[node.id];
			}
			else this.nodes[node.id]['idSeq'] = this.nElements++;
		}

	}

	// debug
	console.log("ROOT "+ this.root);


	// TODO assign default (?)
	// check root
	if(this.root==null || this.nodes[this.root]==null)
		warningMessages.push(["Error", "No <NODES>/<ROOT> element found." ]);
	else if(!this.processGraph(this.root))
		warningMessages.push(["Warning", "No <DESCENDANTS> of <ROOT> found." ]);

	return warningMessages;
};

/*
 * Returns a structure of type node { material, texture, transformations[], descendants[] }.
 */
MySceneGraph.prototype.readNode= function(element) {
	var node = [];
	
	var material =  element.getElementsByTagName('MATERIAL');
	if(material.length!=0)
		node['material'] = material[0].id;
	else node['material'] = null;
	
	//debug
	console.log(node['material']);

	var texture =  element.getElementsByTagName('TEXTURE');
	if(texture.length!=0)
		node['texture'] = texture[0].id;
	else node['texture'] = null;

	//debug
	console.log(node['texture']);

	// read transformations
	node['transformations'] = [];

	var n;
	for(n=0; n<element.children.length; n++){
		var transformation = { type: element.children[n].nodeName.toLowerCase(), args: []};
		
		switch(element.children[n].nodeName){
		 case 'TRANSLATION':
		 	transformation['args'] = this.getTranslation(element.children[n], false);
		 	break;
		 case 'ROTATION':
			transformation['args'] = this.getRotation(element.children[n], false);
		 	break;
		 case 'SCALE':
			transformation['args'] = this.getScale(element.children[n], false);
			break;
		default:
			transformation['args'] = null;
			continue;
		}

		if(transformation['args']!=null)
			node['transformations'].push(transformation);
		else this.onXMLWarning("Error on <NODE id=" + element.id +"><"+ element.children[n].nodeName + "> (L. "+n+"). Element ignored.");

		//debug 
		console.log(transformation['type']);
		console.log(transformation['args']);
	}

	// read descendants
	node['descendants'] = [];
	var descendants =  element.getElementsByTagName('DESCENDANTS');
	if(descendants.lenght == 0)
		return null;	// error if no descendants are found

	var n, m;
	for(n=0; n<descendants.length; n++){

		var descendantsTemp = descendants[n].getElementsByTagName('DESCENDANT');
		for(m=0; m<descendantsTemp.length; m++){
			node['descendants'].push(descendantsTemp[m].id);
			console.log(element.id +" -> DESCENDANT FOUND " + descendantsTemp[m].id);
		}
	}

	return node;
}

// TODO testing
/*
 * Processes node elementId and its descendants, calculating each one's matrix and checking for errors.
 */
MySceneGraph.prototype.processGraph = function(elementId) {

	var element = null;

	// debug
	console.log("STARTING "+ elementId);
	
	// find node or leaf
	if(this.nodes[elementId] != null)
		element = this.nodes[elementId];
	else if(this.leaves[elementId] != null){
		//debug
		console.log("FINISHED LEAF "+ elementId);
		return true;
	}
	else{
		console.log("UNKNOWN ERROR");
		return false;	
	} 

	// check if the element's material is valid
	if(this.materials[element['material']] == null && element['material']!="null"){
		this.onXMLWarning("Error on <NODE> with id = " + elementId + " - No material with id=" + element['material'] + ".");
		element['material'] = "null"; // use parent's material
	}

	// check if the element's texture is valid
	if(this.textures[element['texture']] == null && element['texture']!="null" && element['texture'] != "clear"){
		this.onXMLWarning("Error on <NODE> with id = " + elementId + " - No material with id=" + element['material'] + ".");
		element['texture'] = "null"; // use parent's texture
	}

	// TODO
	// check order of matrixes product
	var resultingTransformation =  [1.0, 0.0, 0.0, 0.0,
                  				   0.0, 1.0, 0.0, 0.0,
                  				   0.0, 0.0, 1.0, 0.0,
                  				   0.0, 0.0, 0.0, 1.0];
	var n;
	for(n = element['transformations'].length -1; n >= 0; n--){
		var transformation = this.tranformationToMatrix(element['transformations'][n]);
		console.log(transformation)
		resultingTransformation = this.multiplyTansformationMatrixes(resultingTransformation, transformation);
		console.log(resultingTransformation);
	}

	console.log("next");

	element['matrix'] = resultingTransformation;

	// check descendants
	var n;
	for(n=0; n< element['descendants'].length; n++){

		// debug
		console.log("DESCENDANT"+element['descendants'][n]);
		if(!this.processGraph( element['descendants'][n])){
			this.onXMLWarning("Error on <NODE> with id = " + elementId + " - No <DESCENDANT> with id=" + element['descendants'][n] + ".");
			element['descendants'].splice(n, 1);
			n--;
		}
	}

	//debug
	console.log("FINISHED PROCESSING NODE "+ elementId);

	// return false if no descendants are found
	if(element['descendants'].length==0){
		console.log(elementId + " has no descendants");
		delete this.nodes[elementId];
		return false;
	}else return true;

};

// TODO testing
/*
 * Receives a structure transformation{ type, args[] } and returns the corresponding matrix.
 */
MySceneGraph.prototype.tranformationToMatrix= function(transformation) {
	var matrix = null;
	// NOTE
	// OpenGL matrixes are transposed
	switch(transformation['type']) {
    	case "rotation":
    		var angle = transformation['args'][1] * Math.PI / 180.0;
        	switch(transformation['args'][0]) {
				case 'x': 
					matrix = [1.0,0.0,0.0,0.0, 
	        				  0.0, Math.cos(angle), Math.sin(angle),0.0, 
	        				  0.0,-Math.sin(angle), Math.cos(angle),0.0, 
	        				  0.0,0.0,0.0,1.0];
					break;
				case 'y':
 					matrix = [ Math.cos(angle),0.0,-Math.sin(angle),0.0, 
	        				   0.0,1.0,0.0,0.0, 
	        				   Math.sin(angle),0.0, Math.cos(angle),0.0, 
	        				   0.0,0.0,0.0,1.0];
					break;
				case 'z':
 					matrix = [ Math.cos(angle), Math.sin(angle),0.0,0.0, 
	        				  -Math.sin(angle), Math.cos(angle),0.0,0.0, 
	        				   0.0,0.0,1.0,0.0,
	        				   0.0,0.0,0.0,1.0];
					break;
				default: return null;
			}
        	break;
    	case "scale":
	        matrix = [transformation['args'][0],0.0,0.0,0.0, 
	        		  0.0,transformation['args'][1],0.0,0.0, 
	        		  0.0,0.0,transformation['args'][2],0.0, 
	        		  0.0,0.0,0.0,1.0];
    	    break;
    	case "translation":
	        matrix = [1.0,0.0,0.0,0.0, 
	        		  0.0,1.0,0.0,0.0, 
	        		  0.0,0.0,1.0,0.0, 
	        		 transformation['args'][0],transformation['args'][1],transformation['args'][2],1.0];
    	    break;
    	default: return null;
	}

	return matrix;
};