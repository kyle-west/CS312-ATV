var SCENE_OBJECT_COUNT = 0;   // gobal counter of meshes
const SCENE_OBJECT_MAX = 671; // total number of meshes in the scene

function $register(add_count = 1) {
   SCENE_OBJECT_COUNT += add_count;
   console.info("loaded object #" + SCENE_OBJECT_COUNT);
   if (SCENE_OBJECT_COUNT >= SCENE_OBJECT_MAX) {
      engine.hideLoadingUI();
   }
}
