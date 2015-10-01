/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
//function MyRectangle(scene) {
//	CGFobject.call(this,scene);
//
//	this.minS = 0;
//	this.minT = 0;
//	this.maxS = 1;
//	this.maxT = 1;
//
//	this.initBuffers();
//};

function MyRectangle(coordinates) {
	CGFobject.call(this,scene);

	this.minX = coordinates[0];
	this.maxY = coordinates[1];
	this.maxX = coordinates[2];
	this.minY = coordinates[3];

	minS = 0;
	minT = 0;
	maxS = 1;
	maxT = 1;

	this.minS = minS;
	this.minT = minT;
	this.maxS = maxS;
	this.maxT = maxT;

	this.initBuffers();
};

MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor=MyRectangle;

MyRectangle.prototype.initBuffers = function () {
	this.vertices = [
            this.minX, this.minY, 0,
            this.maxX, this.minY, 0,
            this.minX, this.maxY, 0,
            this.minX, this.maxY, 0
			];

	this.indices = [
            0, 1, 2, 
			3, 2, 1
        ];
		
	this.normals = [
    0,0,1,
    0,0,1,
    0,0,1,
    0,0,1
    ];
	
	
	this.texCoords = [
	this.minS,this.maxT,
	this.maxS,this.maxT,
	this.minS,this.minT,
	this.maxS,this.minT
	];

	this.primitiveType=this.scene.gl.TRIANGLES;	
	this.initGLBuffers();
};
