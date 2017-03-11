/**********************************************************
* These functions place trees and other props accross the
* environment.
**********************************************************/

function placeTrees(scene) {
   BABYLON.SceneLoader.ImportMesh("","assets/mesh/", "tree-05.babylon", scene,
   function(newMeshes, particleSystems, skeletons) {
      var tree0 = newMeshes[1];

      //   tree.position.y += 5;
      tree0.scaling = new BABYLON.Vector3(.5,.5,.5);

      for (var i = 1; i < 100; i++) {
         var treeClone = tree0.clone("tree: " + i);
         treeClone.position.x += random(0,3000,true);
         treeClone.position.z += random(0,4000,true);
         treeClone.rotation.y = random(1,360);
      }

      console.info("tree-05 meshes ----------------")
      for (var i = 0; i < newMeshes.length; i++) {
         console.info(newMeshes[i]);
      }
      console.info("============== ----------------")
   });
}
