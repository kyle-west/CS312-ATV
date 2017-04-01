var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
var params, particleSystem, detail, music, particleBox;
var camera;
var atv;
var createScene = function () {
   engine.loadingUIText = "<div class = 'msg'>"+
      "Welcome to the All-West ATV Experience.<br/><br/>"+
      "Use <img src = 'assets/images/WASD.png'/> "+
      "or the arrow keys to navigate.</div>";
   engine.displayLoadingUI();
   // This creates a basic Babylon Scene object (non-mesh)
   var scene = new BABYLON.Scene(engine);
   // scene.debugLayer.show();
   scene.clearColor = new BABYLON.Color3(0.8, 0.8, 1);
   // DAT.GUI //
   gui = new dat.GUI({
      height : 5 * 32 - 1
   });
   gui.closed = true; // closed by default
   var debF = false;
   // parameters to be used in GUI
   var wflag = true;
   params = {
      instructions: function(){
         alert("Use WASD or the arrow keys to navigate.");
      },
      numParticles: 500,
      NSwind: 0,
      WEwind: 0,
      weather: function(){particleBox = createParticleSystem(scene, wflag); wflag = !wflag},
      sound: true,

      // functions render as buttons
      snow: function () {},
      debug: function () {if(!debF) {scene.debugLayer.show(); debF = !debF;}
                          else {scene.debugLayer.hide(); deb = !debF;}},
      //  sunny: function () {restartEngine(worldWeather,0)},
      // rain: function () {restartEngine("rain");},
      //  condition: "weather"
   };
   particleBox = createParticleSystem(scene);
   scene.debugLayer.hide()
   //  worldWeather = "snow";
   // add the params to the gui
   //  gui.add(params, "sunny").name("Sunny");

   // this is our mute button

   gui.add(params, "instructions").name("Instructions");
   gui.add(params, "weather").name("Weather");
   gui.add(params, "debug").name("Debug");
   gui.add(params, "sound").name("Sound").onChange(function() {
     if (SETTINGS.sound) {
       SETTINGS.sound = OPTIONS.sound.OFF;
       music.stop();
     } else {
       SETTINGS.sound = OPTIONS.sound.ON;
       music.play();
     }
   });
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

   camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 6, -10), scene);
   //  camera.setTarget(BABYLON.Vector3.Zero()); // This targets the camera to scene origin
   if (!SETTINGS.game)
      camera.attachControl(canvas, true); // This attaches the camera to the canvas

   // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
   var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
   light.intensity = 0.7; // Default intensity is 1. Let's dim the light a small amount

   createPlayer(scene,camera);
   createATV(scene,atv,camera);
  // createCar(scene);

   var ground = new Ground(scene);
   ground.heightMaps = [
      "assets/heightmaps/terrain0.png",
      "assets/heightmaps/terrain1.png"
   ];
   ground.setup();
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
      // camera.ellipsoid = new BABYLON.Vector3(.5, 3, .5);
      // scene.collisionsEnabled = true;
      // camera.applyGravity = true;
      // camera.checkCollisions = true;
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
   adjustObj();

});

// Resize
window.addEventListener("resize", function () {
   engine.resize();
});

function adjustObj() {
   particleSystem.gravity = new BABYLON.Vector3 (
      params.WEwind,
      -9.81, params.NSwind
   );

   if (SETTINGS.game) {
      lock_camera();
      atv_visual_imposter.rotation.y = rotation;
   }

   if (player) {
      var px = player.position.x;
      var pz = player.position.z;
   }
   else {px = pz = 0;}
   setBox(px, pz);
}
