var SCENE_OBJECT_COUNT = 0;
const SCENE_OBJECT_MAX = 664;

function $register() {
   SCENE_OBJECT_COUNT++;
   console.info("loaded object #" + SCENE_OBJECT_COUNT);
   if (SCENE_OBJECT_COUNT >= SCENE_OBJECT_MAX)
      engine.hideLoadingUI();
}
