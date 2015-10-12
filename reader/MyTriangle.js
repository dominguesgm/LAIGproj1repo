/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
//function MyTriangle(scene) {
//	CGFobject.call(this,scene);
//
//	this.minS = 0;
//	this.minT = 0;
//	this.maxS = 1;
//	this.maxT = 1;
//
//	this.initBuffers();
//};

function MyTriangle(scene, coordinates) {
	CGFobject.call(this,scene);

	this.x1 = coordinates[0];
	this.y1 = coordinates[1];
	this.z1 = coordinates[2];
	this.x2 = coordinates[3];
	this.y2 = coordinates[4];
	this.z2 = coordinates[5];
	this.x3 = coordinates[6];
	this.y3 = coordinates[7];
	this.z3 = coordinates[8];

	this.amplifS = 1;
	this.amplifT = 1;

	this.a = Math.sqrt((this.x1 - this.x3) * (this.x1 - this.x3) + 
			 		   (this.y1 - this.y3) * (this.y1 - this.y3) +
			 		   (this.z1 - this.z3) * (this.z1 - this.z3));

	this.b = Math.sqrt((this.x2 - this.x1) * (this.x2 - this.x1) + 
			 		   (this.y2 - this.y1) * (this.y2 - this.y1) +
			 		   (this.z2 - this.z1) * (this.z2 - this.z1));

	this.c = Math.sqrt((this.x3 - this.x2) * (this.x3 - this.x2) + 
			 		   (this.y3 - this.y2) * (this.y3 - this.y2) +
			 		   (this.z3 - this.z2) * (this.z3 - this.z2));

	this.cosAlpha = (-this.a*this.a + this.b*this.b + this.c * this.c) / (2 * this.b * this.c);
	this.cosBeta =  ( this.a*this.a - this.b*this.b + this.c * this.c) / (2 * this.a * this.c);
	this.cosGamma = ( this.a*this.a + this.b*this.b - this.c * this.c) / (2 * this.a * this.b);
				
	this.beta = Math.acos(this.cosBeta);
	this.alpha = Math.acos(this.cosAlpha);
	this.gamma = Math.acos(this.cosGamma);
	this.sum = this.beta + this.alpha + this.gamma;


	this.initBuffers();
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor=MyTriangle;

MyTriangle.prototype.initBuffers = function () {
	this.vertices = [
				this.x1, this.y1, this.z1,
				this.x2, this.y2, this.z2,
				this.x3, this.y3, this.z3
			];

	this.indices = [
            0, 1, 2
        ];
		
	this.normals = [
    0,0,1,
    0,0,1,
    0,0,1
    ];
	
	
	this.texCoords = [
		(this.c - this.a * Math.cos(this.beta)) / this.amplifS, 0.0,
	  0.0, 1 / this.amplifT,
	  this.c / this.amplifS, 1.0 / this.amplifT
    ];

	this.primitiveType=this.scene.gl.TRIANGLES;	
	this.initGLBuffers();
};


MyTriangle.prototype.updateTexelCoordinates = function (amplifS, amplifT) {

	this.texCoords = [
		(this.c - this.a * Math.cos(this.beta)) / amplifS, 0.0,
	  0.0, 1 / amplifT,
	  this.c / amplifS, 1.0 / amplifT
    ];

	this.updateTexCoordsGLBuffers();
};