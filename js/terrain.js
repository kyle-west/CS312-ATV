/**********************************************************
* This function sets up our ground meshes. These are static
* and loaded from height maps
**********************************************************/
function setUpGround(scene) {
   var mounds = new BABYLON.StandardMaterial("ground", scene);
   mounds.diffuseTexture = new BABYLON.Texture("assets/textures/moss.jpg", scene);
   mounds.diffuseTexture.uScale = 30;
   mounds.diffuseTexture.vScale = 30;
   mounds.specularColor = new BABYLON.Color3(0, 0, 0);

   var flat = new BABYLON.StandardMaterial("ground", scene);
   flat.diffuseTexture = new BABYLON.Texture("assets/textures/mud.png", scene);
   flat.diffuseTexture.uScale = 500;
   flat.diffuseTexture.vScale = 500;
   flat.specularColor = new BABYLON.Color3(0, 0, 0);

   var ground0 = BABYLON.Mesh.CreateGround("ground1", 10000, 10000, 2, scene);
   ground0.material = flat;
   ground0.physicsImpostor = new BABYLON.PhysicsImpostor(ground0, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
   ground0.checkCollisions = true;

   // TODO: change to : "...terrain"+(i+j)+".png",
   for (var i = -3; i < 5; i++) {
      for (var j = -3; j < 5; j++) {
         createGroundSquare(
            "assets/heightmaps/terrain0.png",
            mounds,
            {
               x : i*950,
               y : 0,
               z : j*950
            },
            scene
         );
      }
   }
}

function createGroundSquare(heightMap, material , position, scene) {
   var ground = BABYLON.Mesh.CreateGroundFromHeightMap(
      "", heightMap, 1000, 1000, 50, 0, 30, scene, false,
      function () {
         ground.setPhysicsState(BABYLON.PhysicsEngine.HeightmapImpostor, { mass: 0 });
         ground.position.x = position.x;
         ground.position.y = position.y - 10;
         ground.position.z = position.z;
         scene.registerBeforeRender(function () {
            scene.meshes.forEach(function (m) {
               if (m.name=="s" && m.position.y < -100) {
                  m.dispose();
               }
            })
         });
      });
   ground.material = material;
   ground.checkCollisions = true;
   return ground;
}
