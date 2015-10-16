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

 	this.normals = [];

 	this.texelXInterval = 1/(this.slices);
 	this.texelYInterval = 1/(this.stacks);

	this.texelY = 0;

 	this.vertices = [];
 	var alpha = -Math.PI/2;
 	for (var n = 0; n <= this.stacks;n++, alpha+=(Math.PI/(this.stacks))) {
 	    var tempAngle = 0;
 	    this.texelX = 0;
  	 	for (var i = 0; i <= this.slices; i++) {
  			this.vertices.push(this.radius*Math.cos(alpha)*Math.cos(tempAngle), this.radius*Math.sin(alpha), this.radius*Math.cos(alpha)*Math.sin(tempAngle));
  			this.normals.push(Math.cos(alpha)*Math.cos(tempAngle),  Math.sin(alpha), Math.cos(alpha)*Math.sin(tempAngle));
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

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };

MySphere.prototype.updateTexelCoordinates = function (amplifS, amplifT) {
};