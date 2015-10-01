/**
 * MyCylinder
 * @constructor
 */
 function MyCylinder(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;
	this.stacks=stacks;

	this.angle=2*Math.PI/slices;

 	this.initBuffers();
 };

 MyCylinder.prototype = Object.create(CGFobject.prototype);
 MyCylinder.prototype.constructor = MyCylinder;

 MyCylinder.prototype.initBuffers = function() {
 
 	this.vertices = [];
 	var z = 0;

 	this.texCoords = [];

 	this.texelXInterval = 1/(this.slices);
 	this.texelYInterval = 1/(this.stacks);

 	this.texelY = 1;
 	
 	for (var n = 0; n <= this.stacks; z+=1/this.stacks) {
 	    var tempAngle = 0;
 	    this.texelX = 0;
 	    for (var i = 0; i <= this.slices; i++) {
 	    	if(i < this.slices){
				this.vertices.push(Math.cos(tempAngle), Math.sin(tempAngle), z);
				this.texCoords.push(this.texelX, this.texelY);
 	    	} else{
 	    		this.vertices.push(1, 0, z);
				this.texCoords.push(1, this.texelY);
 	    	}

			this.texelX += this.texelXInterval;
 	        tempAngle += this.angle;
 	    };
 	    this.texelY -= this.texelYInterval;
 	    n++;
 	};


 	this.indices = [];


	for(i = 0; i < ((this.slices*this.stacks)+(this.stacks-1)); i+=1)
 	{
 		if((i%(this.slices+1)) != (this.slices)){
 			this.indices.push(i+1, i + this.slices + 2, i + this.slices + 1);
 			this.indices.push(i,i+1, i + this.slices + 1);
 		}else{
 			this.indices.push(i+this.slices + 2, i+this.slices+1, i);
 			this.indices.push(i+this.slices + 2, i, i+1);
 		}
 	};

	this.normals = [];

 	for (var z = 0; z <= this.stacks; z++) {
 	    var tempAngle = 0;
 	    for (var i = 0; i <= this.slices; i++) {
 	        this.normals.push(Math.cos(tempAngle), Math.sin(tempAngle), 0);
 	        tempAngle += this.angle;
  	    };
 	};

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
