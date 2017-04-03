function Avatar(scene, camera) {
   this.scene = scene;
   this.camera = camera;

   // rotational control values
   this.ROT_INC       = .05;
   this.SPEED_INC     = .75;
   this.MAX_SPEED     =  50;
   this.MIN_SPEED     =   0;
   this.ROT_MAX_SPEED =   5;
   this.ROT_MIN_SPEED =   0;

   // animation control values
   this.VI_ROT_X      =   0;
   this.VI_ROT_Y      =   0;
   this.VI_ROT_INC    = .01;
   this.VI_ROT_MAX_Y  = .15;
   this.VI_ROT_MAX_X  = .06;
   this.VI_THRESHOLD  = .02;

   this.speed = this.MIN_SPEED;
   this.rotation = 0.0;
   this.visual_imposter = BABYLON.Mesh.CreateBox(
      "visual_imposter", 2.0, this.scene
   );
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

   this.registerControls();
}

Avatar.prototype = {
   constructor: Avatar,

   initializeControler: function () {
      this.physics_imposter = BABYLON.Mesh.CreateSphere('physics_imposter', 16, 2, this.scene);
      this.physics_imposter.position.y = 5;
      this.physics_imposter.position.z = 15;
      this.physics_imposter.physicsImpostor = new BABYLON.PhysicsImpostor(
         this.physics_imposter, BABYLON.PhysicsImpostor.SphereImpostor,
         { mass: 1, friction: 100, restitution: 0.0 },
         this.scene
      );

      var mounds = new BABYLON.StandardMaterial("ground", this.scene);
      mounds.diffuseTexture = new BABYLON.Texture("assets/textures/snow_mud2.jpg", this.scene);
      this.physics_imposter.material = mounds;

      if (SETTINGS.game) {
         this.camera.radius = 30; // how far from the object to follow
         this.camera.heightOffset = 8;
         this.camera.lockedTarget = this.physics_imposter;
         this.physics_imposter.isVisible = false;
      }
   },

   initializeATVMeshes: function () {
      var that = this; // resolve scope issues
      BABYLON.SceneLoader.ImportMesh(
         "","assets/mesh/", "atv-complete-test.babylon", that.scene,
         function(newMeshes, particleSystems, skeletons) {
            var it = that; // FURTHER scope issues;

            var wheel_mat = new BABYLON.StandardMaterial("", it.scene);
            wheel_mat.diffuseTexture = new BABYLON.Texture("assets/textures/mud.png", it.scene);

            newMeshes[3].position.y = 1.5;
            it.atv = newMeshes[3]; //fl 0 fr 1 br 2 bl 4 body 3
            fl = newMeshes[0];
            fr = newMeshes[1];
            br = newMeshes[2];
            bl = newMeshes[4];
            fl.parent = it.atv;
            fr.parent = it.atv;
            br.parent = it.atv;
            bl.parent = it.atv;

            fl.material = wheel_mat;
            fr.material = wheel_mat;
            br.material = wheel_mat;
            bl.material = wheel_mat;

            it.atv.parent = it.visual_imposter;
            it.atv.position.y -= 2;

            it.atv.material = new BABYLON.StandardMaterial("", it.scene);
            it.atv.material.diffuseTexture = new BABYLON.Texture("assets/textures/red.png", it.scene);

            if (SETTINGS.game) {
               it.visual_imposter.isVisible = false;
            }
            console.log("ATV Mesh Loaded");
         }
      );
   },

   update_velocity: function () {
      var vel = this.physics_imposter.physicsImpostor.getLinearVelocity();
      vel.x = Math.sin(this.rotation) * this.speed;
      vel.z = Math.cos(this.rotation) * this.speed;
      this.physics_imposter.physicsImpostor.setLinearVelocity(vel);
   },

   registerControls: function () {
      var that = this; // resolve scope issue

      // UP DOWN keys pressed
      document.addEventListener("keydown", function (evt) {
         switch (evt.keyCode) {
            case 87: // W key
            case 38: // up key
               this.slowengine = false;
               if (that.speed < that.MAX_SPEED)
                  that.speed += that.SPEED_INC;

               that.VI_ROT_X -= that.VI_ROT_INC;
               if (that.VI_ROT_X < -that.VI_ROT_MAX_X)
                  that.VI_ROT_X = -that.VI_ROT_MAX_X;

               break;
            case 83: // S key
            case 40: // down key
               this.slowengine = false;
               if (that.speed > that.MIN_SPEED)
                  that.speed -= that.SPEED_INC*3;
               else that.speed = that.MIN_SPEED;

               that.VI_ROT_X += that.VI_ROT_INC;
               if (that.VI_ROT_X > that.VI_ROT_MAX_X)
                  that.VI_ROT_X = that.VI_ROT_MAX_X;
               break;
         }
         that.update_velocity();
      }, false);

      // LEFT RIGHT keys pressed
      document.addEventListener("keydown", function (evt) {
         switch (evt.keyCode) {
            case 65: // A key
            case 37: // left key
               that.rotation -= that.ROT_INC;
               that.VI_ROT_Y -= that.VI_ROT_INC;
               if (that.VI_ROT_Y < -that.VI_ROT_MAX_Y)
                  that.VI_ROT_Y = -that.VI_ROT_MAX_Y;
               break;
            case 68: // D key
            case 39: // right key
               that.rotation += that.ROT_INC;
               that.VI_ROT_Y += that.VI_ROT_INC;
               if (that.VI_ROT_Y > that.VI_ROT_MAX_Y)
                  that.VI_ROT_Y = that.VI_ROT_MAX_Y;
               break;
         }
         that.update_velocity();
      }, false);

      document.addEventListener("keydown", function (evt) {
         switch (evt.keyCode) {
            case 13: // enter key
            break;
            case 32: // space key
            break;
         }
      }, false);

      document.addEventListener("keyup", function (evt) {
         switch (evt.keyCode) {
            case 87: // W key
            case 38: // up key
               that.slowengine = true;
            case 83: // S key
            case 40: // down key
               that.VI_ROT_X = 0;
               break;
         }
      }, false);

      document.addEventListener("keyup", function (evt) {
         switch (evt.keyCode) {
            case 65: // A key
            case 37: // left key
            case 68: // D key
            case 39: // right key
               that.VI_ROT_Y = 0;
               break;
         }
      }, false);
   },

   animate: function () {
      this.apply_inertia();

      this.camera.position.z = this.physics_imposter.position.z + (Math.cos(this.rotation) * -20);
      this.camera.position.x = this.physics_imposter.position.x + (Math.sin(this.rotation) * -20);
      this.camera.position.y = this.physics_imposter.position.y + 5;

      this.visual_imposter.position.z = this.physics_imposter.position.z;
      this.visual_imposter.position.x = this.physics_imposter.position.x;
      this.visual_imposter.position.y = this.physics_imposter.position.y;

      this.visual_imposter.rotation.y = this.rotation + this.VI_ROT_Y;
      this.visual_imposter.rotation.x = this.VI_ROT_X;

      if (this.slowengine) {
         this.speed -= this.SPEED_INC/2;
         if (this.speed <= this.MIN_SPEED) {
            this.speed = this.MIN_SPEED;
            this.slowengine = false;
         }
      }

      this.enginesound.setPlaybackRate(
         0.2 + 0.5 * (this.speed / this.MAX_SPEED)
      );
   },

   apply_inertia: function () {}
};
