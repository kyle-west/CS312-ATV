/*******************************************************************
* Avatar is the main player of the game. Due to some issues with the
* imported mesh, the Avatar has several imposters used to emulate
* interacting with the environment.
*
*    physics_imposter : handles interacting with the ground surfaces.
*    visual_imposter  : handles rotation and animation of the mesh.
*******************************************************************/

/**************************************************
* Constructor
**************************************************/
function Avatar(scene, camera) {
   this.scene = scene;
   this.camera = camera;

   // rotational control values
   // for physics_imposter
   this.ROT_INC       = .05;
   this.SPEED_INC     = .75;
   this.MAX_SPEED     =  50;
   this.MIN_SPEED     =   0;
   this.ROT_MAX_SPEED =   5;
   this.ROT_MIN_SPEED =   0;

   // animation control values
   // for visual_imposter
   this.VI_ROT_X      =   0;
   this.VI_ROT_Y      =   0;
   this.VI_ROT_INC    = .01;
   this.VI_ROT_MAX_Y  = .15;
   this.VI_ROT_MAX_X  = .06;
   this.VI_THRESHOLD  = .02;

   // these values are used by both imposters
   this.speed = this.MIN_SPEED;
   this.rotation = 0.0;

   // initialize visual_imposter
   this.visual_imposter = BABYLON.Mesh.CreateBox(
      "visual_imposter", 2.0, this.scene
   );
   $register(); // notify housekeeper we exist

   // set up the physics and attach mesh imports
   this.initializeControler();
   this.initializeATVMeshes();

   // Engine sounds and related code adapted from:
   // http://cdn.babylonjs.com/wwwbabylonjs/Scenes/minority-race/
   this.enginesound = new BABYLON.Sound(
      "Engine", "assets/sounds/engine.wav",
      this.scene, null,
      {
         volume: 0.4,
         loop: true,
         autoplay: true,
         spatialSound: true,
         distanceModel: "exponential",
         refDistance: 20,
         rolloffFactor: 2
      }
   );
   this.enginesound.setPlaybackRate(0.2);
   this.enginesound.attachToMesh(this.physics_imposter);
   this.enginesound.play();
}

/**************************************************
* Class declaration
**************************************************/
Avatar.prototype = {
   /***********************************************
   * Constructor (declared outside model)
   ***********************************************/
   constructor: Avatar,

   /***********************************************
   * This function sets up the physics_imposter
   * which also enables controls from the user.
   ***********************************************/
   initializeControler: function () {
      // create and position physics body
      this.physics_imposter = BABYLON.Mesh.CreateSphere(
         'physics_imposter', 16, 2, this.scene
      );
      this.physics_imposter.position.y = 5;
      this.physics_imposter.position.z = 15;

      // yes, our physics_imposter has a PhysicsImpostor, which is used by the
      // Physics Engine for collision detection.
      this.physics_imposter.physicsImpostor = new BABYLON.PhysicsImpostor(
         this.physics_imposter, BABYLON.PhysicsImpostor.SphereImpostor,
         { mass: 1, friction: 100, restitution: 0.0 }, // our physics parameters
         this.scene
      );
      $register(); // notify housekeeper we have loaded a new mesh
   },

   /***********************************************
   * Load the ATV mesh from external file and attach
   * the mesh to our visual_imposter.
   ***********************************************/
   initializeATVMeshes: function () {
      var that = this; // resolve scope issues

      // load file into scene that Jake made in Blender
      BABYLON.SceneLoader.ImportMesh(
         "","assets/mesh/", "atv-complete-test.babylon", this.scene,
         function(newMeshes, particleSystems, skeletons) {
            newMeshes[3].position.y = 1.5; // adjust body mesh location

            // assign meshes to their proper orders
            that.atv = newMeshes[3];
            var fl = newMeshes[0];
            var fr = newMeshes[1];
            var br = newMeshes[2];
            var bl = newMeshes[4];

            // make the wheels children of the body mesh
            fl.parent = that.atv;
            fr.parent = that.atv;
            br.parent = that.atv;
            bl.parent = that.atv;

            // establish a parent-child relationship of
            // the mesh to our visual_imposter
            that.atv.parent = that.visual_imposter;
            that.atv.position.y -= 2;

            // give the ATV body mesh a material
            that.atv.material = new BABYLON.StandardMaterial("", that.scene);
            that.atv.material.diffuseTexture = new BABYLON.Texture(
               "assets/textures/red.png", that.scene
            );

            // give the wheels a material
            var wheel_mat = new BABYLON.StandardMaterial("", that.scene);
            wheel_mat.diffuseTexture = new BABYLON.Texture(
               "assets/textures/mud.png", that.scene
            );
            fl.material = wheel_mat;
            fr.material = wheel_mat;
            br.material = wheel_mat;
            bl.material = wheel_mat;

            // notify the housekeeper and logs that we have wheels and body!
            $register(5);
            console.log("ATV Mesh Loaded.");
         }
      );
   },

   /***********************************************
   * Allows us to adjust the relative velocity
   * of the physics_imposter according to our
   * object's speed and location.
   ***********************************************/
   update_velocity: function () {
      var vel = this.physics_imposter.physicsImpostor.getLinearVelocity();
      vel.x = Math.sin(this.rotation) * this.speed;
      vel.z = Math.cos(this.rotation) * this.speed;
      this.physics_imposter.physicsImpostor.setLinearVelocity(vel);
   },

   /***********************************************
   * This tells both the browser and the engine to
   * that the Avatar is in control by the user,
   * and what to do with the user's input.
   ***********************************************/
   registerControls: function () {
      // register the camera to follow the player.
      this.camera.radius = 30;
      this.camera.heightOffset = 8;
      this.camera.lockedTarget = this.physics_imposter;

      // make our imposters hide from the camera
      this.physics_imposter.isVisible = false;
      this.visual_imposter.isVisible  = false;

      var that = this; // resolve scope issues

      // UP & DOWN keys pressed -- speed up / slow down
      document.addEventListener("keydown", function (evt) {
         switch (evt.keyCode) {
            case 87: // W key
            case 38: // up arrow key
               // stop our interial flag
               this.slowengine = false;

               // speed up!
               if (that.speed < that.MAX_SPEED)
                  that.speed += that.SPEED_INC;

               // animate some uplift from the acceleration
               that.VI_ROT_X -= that.VI_ROT_INC;
               if (that.VI_ROT_X < -that.VI_ROT_MAX_X)
                  that.VI_ROT_X = -that.VI_ROT_MAX_X;
               break;

            case 83: // S key
            case 40: // down arrow key
               // slow down the ATV
               if (that.speed > that.MIN_SPEED)
                  that.speed -= that.SPEED_INC*3;
               else
                  that.speed = that.MIN_SPEED;

               // animate the inertia from a sudden halt.
               that.VI_ROT_X += that.VI_ROT_INC;
               if (that.VI_ROT_X > that.VI_ROT_MAX_X)
                  that.VI_ROT_X = that.VI_ROT_MAX_X;
               break;
         }
         that.update_velocity(); // update our speed changes
      }, false);

      // LEFT & RIGHT keys pressed -- turn left / turn right
      document.addEventListener("keydown", function (evt) {
         switch (evt.keyCode) {
            case 65: // A key
            case 37: // left arrow key
               // rotate the ATV left
               that.rotation -= that.ROT_INC;

               // animate inertia from a turn
               that.VI_ROT_Y -= that.VI_ROT_INC;
               if (that.VI_ROT_Y < -that.VI_ROT_MAX_Y)
                  that.VI_ROT_Y = -that.VI_ROT_MAX_Y;
               break;

            case 68: // D key
            case 39: // right arrow key
               // rotate the ATV right
               that.rotation += that.ROT_INC;

               // animate inertia from a turn
               that.VI_ROT_Y += that.VI_ROT_INC;
               if (that.VI_ROT_Y > that.VI_ROT_MAX_Y)
                  that.VI_ROT_Y = that.VI_ROT_MAX_Y;
               break;
         }
         that.update_velocity(); // update our speed changes
      }, false);

      // UP & DOWN keys released
      document.addEventListener("keyup", function (evt) {
         switch (evt.keyCode) {
            case 87: // W key
            case 38: // up arrow key
               that.slowengine = true; // flag to simulate inertia
            case 83: // S key
            case 40: // down arrow key
               that.VI_ROT_X = 0; // end animation
               break;
         }
      }, false);

      // LEFT & RIGHT keys released
      document.addEventListener("keyup", function (evt) {
         switch (evt.keyCode) {
            case 65: // A key
            case 37: // left arrow key
            case 68: // D key
            case 39: // right arrow key
               that.VI_ROT_Y = 0; // end animation
               break;
         }
      }, false);
   },

   /***********************************************
   * Advance all animations and tie all the meshes,
   * imposters, and camera to the same postion.
   ***********************************************/
   animate: function () {
      // make camera follow physics_imposter position, but not rotation
      // as that would literally be a blur since it spins A LOT.
      this.camera.position.z = this.physics_imposter.position.z +
         (Math.cos(this.rotation) * -20);
      this.camera.position.x = this.physics_imposter.position.x +
         (Math.sin(this.rotation) * -20);
      this.camera.position.y = this.physics_imposter.position.y + 3;

      // visual imposter follow the physics_imposter in the same way and
      // for the same reason as the camera
      this.visual_imposter.position.z = this.physics_imposter.position.z;
      this.visual_imposter.position.x = this.physics_imposter.position.x;
      this.visual_imposter.position.y = this.physics_imposter.position.y;

      // advance the visual_imposter animations
      this.visual_imposter.rotation.y = this.rotation + this.VI_ROT_Y;
      this.visual_imposter.rotation.x = this.VI_ROT_X;

      // simulate inertia
      if (this.slowengine) {
         this.speed -= this.SPEED_INC/2;
         if (this.speed <= this.MIN_SPEED) {
            this.speed = this.MIN_SPEED;
            this.slowengine = false;
         }
      }

      // the playback speed of the engine sounds gives the user
      // feedback on their acceleration and speed.
      this.enginesound.setPlaybackRate(
         0.2 + 0.5 * (this.speed / this.MAX_SPEED)
      );
   }
};
