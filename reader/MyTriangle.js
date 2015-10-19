/**
 * MyTriangle
 * @constructor
 * @param scene
 * @param coordinates
 */
function MyTriangle(scene, coordinates) {
	CGFobject.call(this,scene);

	this.x2 = coordinates[0];
	this.y2 = coordinates[1];
	this.z2 = coordinates[2];
	this.x3 = coordinates[3];
	this.y3 = coordinates[4];
	this.z3 = coordinates[5];
	this.x1 = coordinates[6];
	this.y1 = coordinates[7];
	this.z1 = coordinates[8];

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

        /* Calculo do vetor normal ao triangulo */

	var vector1X = this.x2 - this.x1;
	var vector1Y = this.y2 - this.y1;
	var vector1Z = this.z2 - this.z1;
	var vector2X = this.x3 - this.x1;
	var vector2Y = this.y3 - this.y1;
	var vector2Z = this.z3 - this.z1;

	this.normal1 = Math.abs(vector1Y * vector2Z - vector1Z * vector2Y);
	this.normal2 = Math.abs(vector1Z * vector2X - vector1X * vector2Z);
	this.normal3 = Math.abs(vector1X * vector2X - vector1Y * vector2X);
		
	this.normals = [
    this.normal1, this.normal2, this.normal3,
    this.normal1, this.normal2, this.normal3,
    this.normal1, this.normal2, this.normal3
    ];
	
	
	this.texCoords = [
		(this.c - this.a * Math.cos(this.beta)) / this.amplifS, this.amplifT - ((this.a * Math.sin(this.beta)) /this.amplifT),
	  0.0, 1.0,
	  this.c / this.amplifS, 1.0
    ];

	this.primitiveType=this.scene.gl.TRIANGLES;	
	this.initGLBuffers();
};


/*
 * updateTextelCoordinates
 * Update the textel's coordinates according to amplifS and amplifT.
 *
 * @param amplifS amplification factor s
 * @param amplifT amplification factor t
 */
MyTriangle.prototype.updateTexelCoordinates = function (amplifS, amplifT) {

	this.texCoords = [	
		(this.c - this.a * Math.cos(this.beta)) / amplifS, 1 - ((this.a * Math.sin(this.beta)) /amplifT),
	  0.0, 1.0,
	  this.c / amplifS, 1.0
    ];

	this.updateTexCoordsGLBuffers();
};