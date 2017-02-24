function Terrain(material) {
   this.mat = Physijs.createMaterial(
      material,
      friction,
      restitution
   );
}

Terrain.prototype = {
   constructor : Terrain,
   getBumpy : function () {
      var NoiseGen = new SimplexNoise;
      this.geo = new THREE.PlaneGeometry( 50000, 50000, 50, 50 );
		for ( var i = 0; i < this.geo.vertices.length; i++ ) {
			var vertex = this.geo.vertices[i];
			vertex.z = NoiseGen.noise( vertex.x / 10, vertex.y / 10 ) * 250;
		}
      this.geo.computeFaceNormals();
      this.geo.computeVertexNormals();
      this.terrain = new Physijs.HeightfieldMesh(
			this.geo,
			this.mat,
			0, // mass
			50,
			50
		);
      this.terrain.rotation.x = (Math.PI / 2) * 3;
      this.terrain.receiveShadow = true;
      this.terrain.castShadow = true;
      return this.terrain;
   },
   getFlat : function () {
      this.geo = new THREE.PlaneGeometry(1000,1000);
      this.terrain = new Physijs.PlaneMesh(this.geo,this.mat);
      this.terrain.rotation.x = (Math.PI / 2) * 3;
      this.terrain.receiveShadow = true;
      return this.terrain;
   }
};
