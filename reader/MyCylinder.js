/*
 * MyCylinder
 * @constructor
 * @param scene
 * @param attributes [height, bottomRadius, topRadius, slices, stacks]
 */
 function MyCylinder(scene, attributes) {
 	CGFobject.call(this,scene);

	this.height = attributes[0];
	this.bottomRadius = attributes[1];
	this.topRadius = attributes[2];
	this.stacks = attributes[3];
	this.slices = attributes[4];

	this.angle=2*Math.PI/this.slices;

 	this.initBuffers();
 };

 MyCylinder.prototype = Object.create(CGFobject.prototype);

 MyCylinder.prototype.constructor = MyCylinder;

 MyCylinder.prototype.initBuffers = function() {
 
 	this.vertices = [];
 	var z = 0;

 	var radInterval = (this.topRadius - this.bottomRadius) / this.stacks;
 	var currentRad = this.bottomRadius;

 	this.texCoords = [];

 	this.texelXInterval = 1/(this.slices);
 	this.texelYInterval = 1/(this.stacks);

 	this.texelY = 1;
 	
 	for (var n = 0; n <= this.stacks; z+=(1/this.stacks)*this.height) {
 	    var tempAngle = 0;
 	    this.texelX = 0;
 	    for (var i = 0; i <= this.slices; i++) {
 	    	if(i < this.slices){
				this.vertices.push(Math.cos(tempAngle)*currentRad, Math.sin(tempAngle)*currentRad, z);
				this.texCoords.push(this.texelX, this.texelY);
 	    	} else{
 	    		this.vertices.push(currentRad, 0, z);
				this.texCoords.push(1, this.texelY);
 	    	}

			this.texelX += this.texelXInterval;
 	        tempAngle += this.angle;
 	    };
 	    this.texelY -= this.texelYInterval;
 	    currentRad += radInterval;
 	    n++;
 	};

 	this.indices = [];

	for(i = 0; i < ((this.slices*this.stacks)+(this.stacks-1)); i+=1){
 		if((i%(this.slices+1)) != (this.slices)){
 			this.indices.push(i+1, i + this.slices + 2, i + this.slices + 1);
 			this.indices.push(i,i+1, i + this.slices + 1);
 		}else{
 			this.indices.push(i+this.slices + 2, i+this.slices+1, i);
 			this.indices.push(i+this.slices + 2, i, i+1);
 		}
 	};

	this.normals = [];

 	for (var z = 0; z <= this.stacks; z++){
 	    var tempAngle = 0;
 	    for (var i = 0; i <= this.slices; i++) {
 	        this.normals.push(Math.cos(tempAngle), Math.sin(tempAngle), 0);
 	        tempAngle += this.angle;
  	    };
 	};

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };

/*
 * updateTextelCoordinates
 * No need to update the textel's coordinates according to amplifS and amplifT.
 *
 * @param amplifS amplification factor s
 * @param amplifT amplification factor t
 */
MyCylinder.prototype.updateTexelCoordinates = function (amplifS, amplifT) {};