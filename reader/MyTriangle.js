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

function MyTriangle(coordinates) {
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
	];

	this.primitiveType=this.scene.gl.TRIANGLES;	
	this.initGLBuffers();
};
