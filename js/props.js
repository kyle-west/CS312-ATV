/**********************************************************
* These functions place trees and other props accross the
* environment.
**********************************************************/

Props.prototype = {
   constructor: Props,
   placeTrees: function () {
      var trees = [];
      BABYLON.SceneLoader.ImportMesh("","assets/mesh/", "tree-05.babylon",
      this.scene,
      function(newMeshes, particleSystems, skeletons) {
         var tree = newMeshes[1];
         tree.scaling = new BABYLON.Vector3(.5,.5,.5);

         for (var i = 0; i < 100; i++) {
            var treeClone = tree.clone("tree: " + i);
            treeClone.position.x += random(0,3000,true);
            treeClone.position.z += random(0,3000,true);
            treeClone.rotation.y = random(1,360);
            // fixHeight(treeClone);
            trees.push(treeClone);
            $register();
         }
         this.trees = trees;
         console.log("Trees loaded: " + this.trees.length);
      });
   },

   placeRocks: function () {
      var rocks = [];
      BABYLON.SceneLoader.ImportMesh("","assets/mesh/", "mountain-rock.babylon",
      this.scene,
      function(newMeshes, particleSystems, skeletons) {
         var rock = newMeshes[0];
         rock.scaling = new BABYLON.Vector3(.5,.5,.5);

         for (var i = 0; i < 500; i++) {
            var rockClone = rock.clone("rock: " + i);
            rockClone.position.x += random(0,3000,true);
            rockClone.position.z += random(0,3000,true);
            rockClone.position.y -= random(0,3);
            rockClone.rotation.y = random(1,360);
            var scale = random(0.1,3);
            rockClone.scaling = new BABYLON.Vector3(scale,scale,scale);
            rocks.push(rockClone);
            $register();
         }
         this.rocks = rocks;
         console.log("Rocks loaded: " + this.rocks.length);
      });
   }
};

function Props(scene) {
   this.scene = scene;
   this.trees = [];
   this.rocks = [];
}
