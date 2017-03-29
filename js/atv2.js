var wheels_imp = [];

function createATV(scene,atv,camera) {
   BABYLON.SceneLoader.ImportMesh("","assets/mesh/", "atv-complete-test.babylon", scene,
   function(newMeshes, particleSystems, skeletons) {
      for (var i = 0; i < newMeshes.length; i ++) {
         newMeshes[i].position.y = 1.5;
      }
      atv = newMeshes[3]; //fl 0 fr 1 br 2 bl 4 body 3
      fl = newMeshes[0];
      fr = newMeshes[1];
      br = newMeshes[2];
      bl = newMeshes[4];
      fl.parent = atv;
      fr.parent = atv;
      br.parent = atv;
      bl.parent = atv;

      var pos = -1.5;
      bl.position.y += pos;
      br.position.y += pos;
      fr.position.y += pos;
      fl.position.y += pos;

      // if (SETTINGS.game) {
      //    atv.parent = camera;
      //    atv.position = new BABYLON.Vector3(0,0,0);
      //    atv.position.y += -1.7;
      //    atv.position.z += .2;
      // }
   });

   scene.registerBeforeRender(function () {
      if (scene.isReady() && atv) {
         if (SETTINGS.game) {
            atv.position.y = camera.position.y - 1.7;
            atv.position.x = camera.position.x;
            atv.position.z = camera.position.z + .2;
         }
      }
   });

   console.log("ATV created");
}
