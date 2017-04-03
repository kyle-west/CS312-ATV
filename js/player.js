var player;
var rotation = 0.0;
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
      document.addEventListener("keydown", key_down_fb, false);
      document.addEventListener("keydown", key_down_lr, false);
      document.addEventListener("keydown", key_down_special, false);
      player.isVisible = false;
   }
}

function lock_camera() {
   camera.position.z = player.position.z + (Math.cos(rotation) * -20);
   camera.position.x = player.position.x + (Math.sin(rotation) * -20);
   camera.position.y = player.position.y + 5;
   player.lockedTarget = camera;
}

const MAX_SPEED = 50;
const SPEED_INC = .75;
const ROT_INC = .05;
const MIN_SPEED = 0;
const ROT_MAX_SPEED = 5;
const ROT_MIN_SPEED = 0;
var speed = MIN_SPEED;

function key_down_fb(evt) {
   switch (evt.keyCode) {
      case 87: // W key
      case 38: // up key
         if (speed < MAX_SPEED)
            speed += SPEED_INC;
         break;
      case 83: // S key
      case 40: // down key
         if (speed > MIN_SPEED)
            speed -= SPEED_INC*3;
         else speed = MIN_SPEED;
         break;
   }
   update_velocity();
}

function key_down_lr(evt) {
   switch (evt.keyCode) {
      case 65: // A key
      case 37: // left key
         rotation -= ROT_INC;
         break;
      case 68: // D key
      case 39: // right key
         rotation += ROT_INC;
         break;
   }
   update_velocity();
}

function key_down_special(evt) {
   switch (evt.keyCode) {
      case 13: // enter key
         break;
      case 32: // space key
         break;
   }
}

function update_velocity() {
   var vel = player.physicsImpostor.getLinearVelocity();
   vel.x = Math.sin(rotation) * speed;
   vel.z = Math.cos(rotation) * speed;
   player.physicsImpostor.setLinearVelocity(vel);
}

function key_up(evt) {

}
