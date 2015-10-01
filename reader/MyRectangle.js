/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
//function MyQuad(scene) {
//	CGFobject.call(this,scene);
//
//	this.minS = 0;
//	this.minT = 0;
//	this.maxS = 1;
//	this.maxT = 1;
//
//	this.initBuffers();
//};

function MyQuad(scene, minS, maxS, minT, maxT) {
	CGFobject.call(this,scene);

	minS = typeof minS !== 'undefined' ? minS : 0;
	minT = typeof minT !== 'undefined' ? minT : 0;
	maxS = typeof maxS !== 'undefined' ? maxS : 1;
	maxT = typeof maxT !== 'undefined' ? maxT : 1;

	this.minS = minS;
	this.minT = minT;
	this.maxS = maxS;
	this.maxT = maxT;

	this.initBuffers();
};

MyQuad.prototype = Object.create(CGFobject.prototype);
MyQuad.prototype.constructor=MyQuad;

MyQuad.prototype.initBuffers = function () {
	this.vertices = [
            -0.5, -0.5, 0,
            0.5, -0.5, 0,
            -0.5, 0.5, 0,
            0.5, 0.5, 0
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
