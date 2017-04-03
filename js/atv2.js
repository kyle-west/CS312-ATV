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
         document.addEventListener("keydown", key_down_atv_lr, false);
         document.addEventListener("keydown", key_down_atv_fb, false);
         document.addEventListener("keyup", key_up_atv_lr, false);
         document.addEventListener("keyup", key_up_atv_fb, false);
      }

   });

   scene.registerBeforeRender(function () {
      if (scene.isReady() && atv) {
         if (player) {
            atv_visual_imposter.position.z = player.position.z;
            atv_visual_imposter.position.x = player.position.x;
            atv_visual_imposter.position.y = player.position.y;
         }
      }
   });

   console.log("ATV created");
}


/////////////////////////////////////////////////////////////
//      ATV ANIMATION HANDLING
/////////////////////////////////////////////////////////////

var VI_ROT_X = 0;
var VI_ROT_Y = 0;
const VI_ROT_INC = 0.01;
const VI_ROT_MAX_Y = .15;
const VI_ROT_MAX_X = .06;
function animate_atv() {
   atv_visual_imposter.rotation.y = rotation + VI_ROT_Y;
   atv_visual_imposter.rotation.x = VI_ROT_X;
}

function key_down_atv_lr(evt) {
   switch (evt.keyCode) {
      case 65: // A key
      case 37: // left key
         VI_ROT_Y -= VI_ROT_INC;
         if (VI_ROT_Y < -VI_ROT_MAX_Y) VI_ROT_Y = -VI_ROT_MAX_Y;
         break;
      case 68: // D key
      case 39: // right key
         // VI_ROT = VI_ROT_MAX;
         VI_ROT_Y += VI_ROT_INC;
         if (VI_ROT_Y > VI_ROT_MAX_Y) VI_ROT_Y = VI_ROT_MAX_Y;
         break;
   }
}

function key_up_atv_lr(evt) {
   switch (evt.keyCode) {
      case 65: // A key
      case 37: // left key
      case 68: // D key
      case 39: // right key
         VI_ROT_Y = 0;
         break;
   }
}

function key_down_atv_fb(evt) {
   switch (evt.keyCode) {
      case 87: // W key
      case 38: // up key
         VI_ROT_X -= VI_ROT_INC;
         if (VI_ROT_X < -VI_ROT_MAX_X) VI_ROT_X = -VI_ROT_MAX_X;
         break;
      case 83: // S key
      case 40: // down key
         // VI_ROT = VI_ROT_MAX;
         VI_ROT_X += VI_ROT_INC;
         if (VI_ROT_X > VI_ROT_MAX_X) VI_ROT_X = VI_ROT_MAX_X;
         break;
   }
}

function key_up_atv_fb(evt) {
   switch (evt.keyCode) {
      case 87: // W key
      case 38: // up key
         VI_ROT_X += VI_ROT_INC;
         if (VI_ROT_X >= 0) VI_ROT_X = 0;
         break;
      case 83: // S key
      case 40: // down key
         VI_ROT_X -= VI_ROT_INC;
         if (VI_ROT_X <= 0) VI_ROT_X = 0;
         break;
   }
}

function apply_rotational_inertia() {

}
