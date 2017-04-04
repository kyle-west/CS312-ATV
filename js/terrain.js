/**********************************************************
* This object sets up our ground meshes. These are static
* and loaded from randomly selected height maps
**********************************************************/
ground_meshes = [];

/************************************************************
* Class definition
************************************************************/
Ground.prototype = {
   /************************************************************
   * Constructor
   ************************************************************/
   constructor: Ground,

   /************************************************************
   * Generate a single tile of ground from a given heightMap
   ************************************************************/
   generateSquare : function (name,heightMap, material , position) {
      // create ground shape
      var ground = BABYLON.Mesh.CreateGroundFromHeightMap(
         name, heightMap, 1000, 1000, 50, 0, 30, this.scene, false,
         function () {
            ground.setPhysicsState(
               BABYLON.PhysicsEngine.HeightmapImpostor,
               { mass: 0, friction: 100}
            );
            ground.position.x = position.x;
            ground.position.y = position.y - 10; // sink meshes to fit slightly
            ground.position.z = position.z;      //    underground to blend well
            $register();
         }
      );

      // attach material and configure physics
      ground.material = material;
      ground.checkCollisions = true;

      // notify waiting parties of our existance
      if (this.log) console.log(ground.name);
      ground_meshes.push(ground);
      return ground;
   },

   /************************************************************
   * Create and configure the ground plane and hills
   ************************************************************/
   setup : function () {
      // the material for the hills and mounds
      this.mounds = new BABYLON.StandardMaterial("ground", this.scene);
      this.mounds.diffuseTexture = new BABYLON.Texture(
         "assets/textures/snow_mud2.jpg", this.scene
      );
      this.mounds.diffuseTexture.uScale = 30;
      this.mounds.diffuseTexture.vScale = 30;
      this.mounds.specularColor = new BABYLON.Color3(196/255, 134/255, 58/255);

      // the material for the flat plane ground
      this.flat = new BABYLON.StandardMaterial("ground", this.scene);
      this.flat.diffuseTexture = new BABYLON.Texture(
         "assets/textures/snow_mud.jpg", this.scene
      );
      this.flat.diffuseTexture.uScale = 100;
      this.flat.diffuseTexture.vScale = 100;
      this.flat.specularColor = new BABYLON.Color3(0, 0, 0);

      // create the flat plane ground
      this.ground0 = BABYLON.Mesh.CreateGround(
         "ground_flat", 10000, 10000, 2, this.scene
      );
      this.ground0.material = this.flat;
      this.ground0.physicsImpostor = new BABYLON.PhysicsImpostor(
         this.ground0, BABYLON.PhysicsImpostor.BoxImpostor,
         { mass: 0, restitution: 0.9 }, this.scene
       );
      this.ground0.checkCollisions = true;
      ground_meshes.push(this.ground0);

      // notify waiting parties that we have a flat plane for a ground
      $register();
      if (this.log) console.log(ground0.name);

      // create the hills for our ground surface.
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
   * Select a random heightMap from our array storing their paths
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
   this.heightMaps = []; // array of local paths to heightmaps
   this.log = false;     // log used for debuging
}
