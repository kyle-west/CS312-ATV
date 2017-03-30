/**********************************************************
* This object sets up our ground meshes. These are static
* and loaded from height maps
**********************************************************/
Ground.prototype = {
   constructor: Ground,

   /************************************************************
   *
   ************************************************************/
   generateSquare : function (name,heightMap, material , position) {
      var ground = BABYLON.Mesh.CreateGroundFromHeightMap(
         name, heightMap, 1000, 1000, 50, 0, 30, this.scene, false,
         function () {
            ground.setPhysicsState(BABYLON.PhysicsEngine.HeightmapImpostor, { mass: 0, friction: 100});
            ground.position.x = position.x;
            ground.position.y = position.y - 10;
            ground.position.z = position.z;
            $register();
         });
      ground.material = material;
      ground.checkCollisions = true;
      if (this.log) console.log(ground.name);
      return ground;
   },

   /************************************************************
   *
   ************************************************************/
   setup : function () {
      this.mounds = new BABYLON.StandardMaterial("ground", this.scene);
      this.mounds.diffuseTexture = new BABYLON.Texture("assets/textures/snow_mud2.jpg", this.scene);
      this.mounds.diffuseTexture.uScale = 30;
      this.mounds.diffuseTexture.vScale = 30;
      this.mounds.specularColor = new BABYLON.Color3(196/255, 134/255, 58/255);//.Color3(0,0,0);

      this.flat = new BABYLON.StandardMaterial("ground", this.scene);
      this.flat.diffuseTexture = new BABYLON.Texture("assets/textures/snow_mud.jpg", this.scene);
      this.flat.diffuseTexture.uScale = 100;
      this.flat.diffuseTexture.vScale = 100;
      this.flat.specularColor = new BABYLON.Color3(0, 0, 0);

      this.ground0 = BABYLON.Mesh.CreateGround("ground_flat", 10000, 10000, 2, this.scene);
      this.ground0.material = this.flat;
      this.ground0.physicsImpostor = new BABYLON.PhysicsImpostor(this.ground0, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, this.scene);
      this.ground0.checkCollisions = true;
      if (this.log) console.log(ground0.name);

      // TODO: change to : "...terrain"+(i+j)+".png",
      for (var i = -(this.rows/2 - 1); i < (this.rows/2 + 1); i++) {
         for (var j = -(this.rows/2 - 1); j < (this.rows/2 + 1); j++) {
            this.generateSquare(
               "ground <"+i+","+j+">",
               this.getRandHeightMap(),
               this.mounds,
               {
                  x : i*950,
                  y : 0,
                  z : j*950
               }
            );
         }
      }
      console.log("Ground loaded.");
   },

   /************************************************************
   *
   ************************************************************/
   getRandHeightMap : function () {
      return this.heightMaps[random(0,this.heightMaps.length)];
   }
};

/************************************************************
* Ground constructor
************************************************************/
function Ground(scene, rows = 8, cols = 8 ) {
   this.scene = scene;
   this.rows  = rows;
   this.cols  = cols;
   this.heightMaps = [];
   this.log = false;
}
