/*****************************************************************
* This function / data keeps track of the number of meshes loaded.
* If we reach our expected count, close the loading screen.
*****************************************************************/

var SCENE_OBJECT_COUNT = 0;      // global counter of meshes
var SCENE_OBJECT_PROGRESS = 0.0; // global progress counter (%)
const SCENE_OBJECT_MAX = 672;    // total number of meshes in the scene

/*******************************************************
* Updates the global count, and checks if it is time to
* close the loading screen and play the game.
*******************************************************/
function $register(add_count = 1) {
   // update the count
   SCENE_OBJECT_COUNT += add_count;
   SCENE_OBJECT_PROGRESS = Math.floor(
      SCENE_OBJECT_COUNT*1000/SCENE_OBJECT_MAX
   )/10; // one tenth accuracy

   // notify the console what number we are on
   console.info(
      "loaded object #" + SCENE_OBJECT_COUNT +
      " (" + SCENE_OBJECT_PROGRESS + "% complete)"
   );

   // notify the loading screen of change
   document.getElementById('prog').innerHTML =
      "(Loading: " + SCENE_OBJECT_PROGRESS + "% complete)";

   // check our updated count
   if (SCENE_OBJECT_COUNT >= SCENE_OBJECT_MAX) {
      engine.hideLoadingUI();
   }
}
