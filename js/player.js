var player;

function createPlayer(scene,camera) {
   player = BABYLON.Mesh.CreateSphere('player', 16, 2, scene);
   player.position.y = 5;
   player.position.z = 15;
   player.physicsImpostor = new BABYLON.PhysicsImpostor(
      player, BABYLON.PhysicsImpostor.SphereImpostor,
      { mass: 1, friction: 100, restitution: 0.1 }, scene
   );

   var mounds = new BABYLON.StandardMaterial("ground", scene);
   mounds.diffuseTexture = new BABYLON.Texture("assets/textures/snow_mud2.jpg",scene);
   player.material = mounds;

   if (SETTINGS.game) {
      camera.radius = 30; // how far from the object to follow
      camera.heightOffset = 8;
      camera.lockedTarget = player;
      document.addEventListener("keydown", key_down, false);
   }
}

function lock_camera() {
   camera.position.z = player.position.z - 20;
   camera.position.x = player.position.x;
   camera.position.y = player.position.y + 5;
   player.lockedTarget = camera;

   // atv.position.z = player.position.z;
   // atv.position.x = player.position.x;
   // atv.position.y = player.position.y;
}

const MAX_SPEED = 50;
const MIN_SPEED = 0;
const ROT_MAX_SPEED = 5;
const ROT_MIN_SPEED = 0;
var speed = MIN_SPEED;
var rot_speed = 0;

function key_down(evt) {
   switch (evt.keyCode) {
      case 38: // up key
         // player.position.x += Math.sin(player.rotation.y)*100;
         // player.position.z += Math.cos(player.rotation.y)*100;
         var vel = player.physicsImpostor.getLinearVelocity();

         player.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0,vel.y,speed++));
         if (speed > MAX_SPEED) speed = MAX_SPEED;
         break;
      case 40: // down key
         // player.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0,0,-speed));
         // player.position.z -= speed;
         player.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0,0,speed--));
         if (speed < MIN_SPEED) speed = MIN_SPEED;
         break;
      case 37: // left key
         break;
      case 39: // right key
         break;
      // ----------------------------
      case 13: // enter key
         break;
      case 32: // space key
         break;
   }
}

function key_up(evt) {

}
