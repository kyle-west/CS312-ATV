var wheels_imp = [];
var atv_visual_imposter;
function createATV(scene,atv,camera) {
   // imported meshes are dumb and can't follow a constant rotation
   // this visual imposter alows us to control rotation of the mesh
   atv_visual_imposter = BABYLON.Mesh.CreateBox("visual_imposter", 2.0, scene);

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

      atv.parent = atv_visual_imposter;
      atv.position.y -= 2;

      if (SETTINGS.game) {
         atv_visual_imposter.isVisible = false;
      }

   });

   scene.registerBeforeRender(function () {
      if (scene.isReady() && atv) {
         if (player) {
            atv_visual_imposter.position.z = player.position.z;
            atv_visual_imposter.position.x = player.position.x;
            atv_visual_imposter.position.y = player.position.y;
            // atv_visual_imposter.rotation.y = rotation;

         }
      }
   });

   console.log("ATV created");
}
