var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
var params, particleSystem, detail, music;
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
   gui.closed = true; // closed by default

   // parameters to be used in GUI
   params = {
      numParticles: 500,
      NSwind: 0,
      WEwind: 0,

      sound: true,

      // functions render as buttons
      snow: function () {}
      //  sunny: function () {restartEngine(worldWeather,0)},
      // rain: function () {restartEngine("rain");},
      //  condition: "weather"
   };
   var particleBox = createParticleSystem(scene);
   //  scene.debugLayer.show()
   //  worldWeather = "snow";
   // add the params to the gui
   //  gui.add(params, "sunny").name("Sunny");

   // this is our mute button
   gui.add(params, "sound").name("Sound").onChange(function() {
      if (SETTINGS.sound) {
         SETTINGS.sound = OPTIONS.sound.OFF;
         music.stop();
      } else {
         SETTINGS.sound = OPTIONS.sound.ON;
         music.play();
      }
   });

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
   var physicsPlugin = new BABYLON.OimoJSPlugin();
   scene.enablePhysics(gravityVector, physicsPlugin);

   // This creates and positions a free camera (non-mesh)
   var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 6, -10), scene);
   //  camera.setTarget(BABYLON.Vector3.Zero()); // This targets the camera to scene origin
   camera.attachControl(canvas, true); // This attaches the camera to the canvas

   // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
   var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
   light.intensity = 0.7; // Default intensity is 1. Let's dim the light a small amount

   // createATV(scene,atv);
   setUpGround(scene, detail);
   var skybox = setUpSky(scene);

   var props = new Props(scene);
   props.placeTrees();
   props.placeRocks();

   // our Background theme
   music = new BABYLON.Sound(
      "Background", "assets/sounds/bg_v1.mp3", scene, null,
      { loop: true, autoplay: true }
   );

   // attributes that take place when in game PLAY mode.
   if (SETTINGS.game) {
      camera.ellipsoid = new BABYLON.Vector3(.5, 5, .5);
      scene.collisionsEnabled = true;
      camera.applyGravity = true;
      camera.checkCollisions = true;
      skybox.infiniteDistance = true;
      particleBox.position.y = 100;
      particleBox.parent = skybox;

      if (SETTINGS.sound) {
         music.play();
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
