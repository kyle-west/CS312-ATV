var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
var params, particleSystem;
var createScene = function () {
   // This creates a basic Babylon Scene object (non-mesh)
   var scene = new BABYLON.Scene(engine);
   // scene.debugLayer.show();
   var atv;
   scene.clearColor = new BABYLON.Color3(0.8, 0.8, 1);

   // DAT.GUI //
   gui = new dat.GUI({
     height : 5 * 32 - 1
   });

   // parameters to be used in GUI
   params = {
     numParticles: 500,
     NSwind: 0,
     WEwind: 0,
     // functions render as buttons
     snow: function () {}
    //  sunny: function () {restartEngine(worldWeather,0)},
      // rain: function () {restartEngine("rain");},
   //  condition: "weather"
   };
   createParticleSystem(scene);
  //  scene.debugLayer.show()
  //  worldWeather = "snow";
   // add the params to the gui
  //  gui.add(params, "sunny").name("Sunny");
   gui.add(params, "snow").name("Snow");
  //  gui.add(params, "rain").name("Rain");
  //  gui.add(params, "numParticles",0,50000,100).name('# of Particles').onFinishChange(
    //  function() {
       // console.log(worldWeather);
        // restartEngine(worldWeather);
    //  });
   gui.add(params, "NSwind",-20,20,1).name('NSwind');
   gui.add(params, "WEwind",-20,20,1).name('WEwind');
   // DAT.GUI //

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
   createATV(scene,atv);

   // var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);
   // sphere.position.y = 15;
   // sphere.physicsImpostor = new BABYLON.PhysicsImpostor(
   //    sphere, BABYLON.PhysicsImpostor.SphereImpostor,
   //    { mass: 1, restitution: 0.01 }, scene
   // );

   placeTrees(scene);

   placeRocks(scene);

   // Skybox
   // loads skyBox images named accordingly:
   //    [image name]_nx.jpg --> the LEFT side
   //    [image name]_ny.jpg --> the BOTTOM side
   //    [image name]_nz.jpg --> the BACK side
   //    [image name]_px.jpg --> the RIGHT side
   //    [image name]_py.jpg --> the TOP side
   //    [image name]_pz.jpg --> the FRONT side
   var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
   var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
   skyboxMaterial.backFaceCulling = false;
   skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/dark/dark", scene);
   skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
   skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
   skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
   skyboxMaterial.disableLighting = true;
   skybox.material = skyboxMaterial;
   skybox.position.y = -100;

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
   particleSystem.gravity = new BABYLON.Vector3(params.WEwind, -9.81, params.NSwind);

});

// Resize
window.addEventListener("resize", function () {
   engine.resize();
});
