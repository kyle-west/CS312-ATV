var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
var params, particleSystem, detail, music, particleBox;
var camera;
var atv;
var avatar;
var createScene = function () {
   engine.loadingUIText = "<div class = 'msg'>"+
      "Welcome to the All-West ATV Experience.<br/><br/>"+
      "Use <img src = 'assets/images/WASD.png'/> "+
      "or the arrow keys to navigate.</div>";
   engine.displayLoadingUI();

   var scene = new BABYLON.Scene(engine);
   scene.clearColor = new BABYLON.Color3(0.8, 0.8, 1);
   var gravityVector = new BABYLON.Vector3(0,-9.81, 0);
   var physicsPlugin = new BABYLON.CannonJSPlugin();
   scene.enablePhysics(gravityVector, physicsPlugin);


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
      music: true,

      // functions render as buttons
      snow: function () {},
      debug: function () {if(!debF) {scene.debugLayer.show(); debF = !debF;}
                          else {scene.debugLayer.hide(); deb = !debF;}}
   };
   scene.debugLayer.hide();
   gui.add(params, "instructions").name("Instructions");
   gui.add(params, "weather").name("Weather");
   gui.add(params, "debug").name("Debug");
   gui.add(params, "music").name("Music").onChange(function() {
     if (SETTINGS.sound) {
       SETTINGS.sound = OPTIONS.sound.OFF;
       music.stop();
     } else {
       SETTINGS.sound = OPTIONS.sound.ON;
       music.play();
     }
   });
   gui.add(params, "NSwind",-20,20,1).name('NSwind');
   gui.add(params, "WEwind",-20,20,1).name('WEwind');

   particleBox = createParticleSystem(scene);

   camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 6, -10), scene);
   if (!SETTINGS.game)
      camera.attachControl(canvas, true); // This attaches the camera to the canvas

   var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
   light.intensity = 0.7; // Default intensity is 1. Let's dim the light a small amount

   var ground = new Ground(scene);
   ground.heightMaps = [
      "assets/heightmaps/terrain0.png",
      "assets/heightmaps/terrain1.png"
   ];
   ground.setup();
   var skybox = setUpSky(scene);

   avatar = new Avatar(scene,camera);

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
      avatar.animate();
   }

   if (avatar) {
      var px = avatar.physics_imposter.position.x;
      var pz = avatar.physics_imposter.position.z;
   }
   else {px = pz = 0;}
   setBox(px, pz);
}
