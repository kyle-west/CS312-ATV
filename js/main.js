var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);

var createScene = function () {
   // This creates a basic Babylon Scene object (non-mesh)
   var scene = new BABYLON.Scene(engine);
   scene.clearColor = new BABYLON.Color3(0.8, 0.8, 1);

   var gravityVector = new BABYLON.Vector3(0,-9.81, 0);
   var physicsPlugin = new BABYLON.CannonJSPlugin();
   scene.enablePhysics(gravityVector, physicsPlugin);

   // This creates and positions a free camera (non-mesh)
   var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 6, -10), scene);
   //  camera.setTarget(BABYLON.Vector3.Zero()); // This targets the camera to scene origin
   camera.attachControl(canvas, true); // This attaches the camera to the canvas

   // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
   var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
   light.intensity = 0.7; // Default intensity is 1. Let's dim the light a small amount

   setUpGround(scene);

   placeTrees(scene);

   // Skybox
   var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
   var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
   skyboxMaterial.backFaceCulling = false;
   skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/skybox/skybox", scene);
   skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
   skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
   skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
   skyboxMaterial.disableLighting = true;
   skybox.material = skyboxMaterial;

   // attributes that take place when in game PLAY mode.
   if (SETTINGS.game) {
      camera.ellipsoid = new BABYLON.Vector3(.5, 5, .5);
      scene.collisionsEnabled = true;
      camera.applyGravity = true;
      camera.checkCollisions = true;
      skybox.infiniteDistance = true;

      if (SETTINGS.sound) {
         var music = new BABYLON.Sound(
            "Background", "assets/sounds/bg_v1.mp3", scene, null,
            { loop: true, autoplay: true }
         );
      }
   }


   return scene;
};

var scene = createScene();

engine.runRenderLoop(function () {
   scene.render();
});

// Resize
window.addEventListener("resize", function () {
   engine.resize();
});
