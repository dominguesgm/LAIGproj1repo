/**
 * MySphere
 * @constructor
 */
 function MySphere(scene, arguments) {
 	CGFobject.call(this,scene);
	
	this.slices=arguments[2];
	this.stacks=arguments[1];
	this.radius=arguments[0];

	this.angle=2*Math.PI/this.slices;

 	this.initBuffers();
 };

 MySphere.prototype = Object.create(CGFobject.prototype);
 MySphere.prototype.constructor = MySphere;

 MySphere.prototype.initBuffers = function() {

 	this.texCoords = [];

 	this.texelXInterval = 1/(this.slices);
 	this.texelYInterval = 1/(this.stacks);

	this.texelY = 0;

 	this.vertices = [];
 	var alpha = 0;
 	for (var n = 0; n <= this.stacks;n++, alpha+=(Math.PI/(this.stacks))) {
 	    var tempAngle = 0;
 	    this.texelX = 0;
  	 	for (var i = 0; i <= this.slices; i++) {
  			this.vertices.push(Math.sin(alpha)*Math.cos(tempAngle), Math.sin(alpha)*Math.sin(tempAngle), Math.cos(alpha));
 	       	this.texCoords.push(this.texelX, this.texelY);
  	 		this.texelX += this.texelXInterval;
  	 		tempAngle += this.angle;
 	    };
   	    this.texelY += this.texelYInterval;
 	};


 	this.indices = [];


	for(i = 0; i < ((this.slices*this.stacks)+(this.stacks-1)); i+=1)
 	{
 		if((i%(this.slices+1)) != (this.slices)){
 			this.indices.push(i + this.slices + 2, i+1, i + this.slices + 1);
 			this.indices.push(i+1, i, i + this.slices + 1);
 		}else{
 			this.indices.push(i+this.slices + 2, i, i+this.slices+1);
 			this.indices.push(i+this.slices + 2, i+1, i);
 		}
 	};

	this.normals = [];
	alpha=0;
 	for (var z = 0; z <= this.stacks; z++, alpha+=(Math.PI/(this.stacks*2))) {
 	    var tempAngle = 0;
 	    for (var i = 0; i <= this.slices; i++) {
 	  		this.normals.push(Math.sin(alpha)*Math.cos(tempAngle), Math.sin(alpha)*Math.sin(tempAngle), Math.abs(Math.cos(alpha)));
 	        tempAngle += this.angle;
  	    };
 	};

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
