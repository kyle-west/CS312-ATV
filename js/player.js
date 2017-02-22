// player object
function Player(scene, camera) {
   var player = new THREE.JSONLoader();
   player.load( "models/mustang.json", function( car, car_materials ) {
      player.load( "models/mustang_wheel.json", function( wheel, wheel_materials ) {
         var mesh = new Physijs.BoxMesh(
            car,
            new THREE.MeshFaceMaterial( car_materials )
         );
         mesh.position.y = 20;
         mesh.castShadow = mesh.receiveShadow = true;
         var s = 10; // scale
         mesh.scale.set(s,s,s);

         if (_MODE_ == GAME) {
            camera.position.x = 0;
            camera.position.y = 5;
            camera.position.z = -20;
            camera.lookAt(scene.position);
            mesh.add(camera);
         }

         vehicle = new Physijs.Vehicle(mesh, new Physijs.VehicleTuning(
            10.88,
            1.83,
            0.28,
            500,
            10.5,
            6000
         ));
         scene.add( vehicle );
         window.vehicle = vehicle;
         window.scene = scene;

         var wheel_material = new THREE.MeshFaceMaterial( wheel_materials );
         for ( var i = 0; i < 4; i++ ) {
            vehicle.addWheel(
               wheel,
               wheel_material,
               new THREE.Vector3(
                  i % 2 === 0 ? -1.6*s : 1.6*s,
                  -1*s,
                  i < 2 ? 3.3*s : -3.2*s
               ),
               new THREE.Vector3( 0, -1, 0 ),
               new THREE.Vector3( -1, 0, 0 ),
               0.5*s,
               0.7*s,
               i < 2 ? false : true
            );
            vehicle.wheels[i].scale.set(s,s,s);
         }

         input = {
            power: null,
            direction: null,
            steering: 0
         };
         document.addEventListener('keydown', function( ev ) {
            switch ( ev.keyCode ) {
               case 37: // left
               input.direction = 1*s;
               break;

               case 38: // forward
               input.power = true;
               break;

               case 39: // right
               input.direction = -1*s;
               break;

               case 40: // back
               input.power = false;
               break;
            }
         });
         document.addEventListener('keyup', function( ev ) {
            switch ( ev.keyCode ) {
               case 37: // left
               input.direction = null;
               break;

               case 38: // forward
               input.power = null;
               break;

               case 39: // right
               input.direction = null;
               break;

               case 40: // back
               input.power = null;
               break;
            }
         });
      });
   });
}

Player.prototype = {
   constructor: Player,
};
