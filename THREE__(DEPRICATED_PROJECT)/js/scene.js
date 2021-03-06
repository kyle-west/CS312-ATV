/*************************************************************
* Initialize the game and the scene
*************************************************************/
function init() {
   // set up Physijs and scene
   clock = new THREE.Clock(true);
   Physijs.scripts.worker = 'js/physi/physijs_worker.js';
   Physijs.scripts.ammo =   '../physi/ammo.js';
   scene = new Physijs.Scene;

   scene.background = new THREE.Color( 0xaaaaff );
   scene.setGravity(new THREE.Vector3(0, -180 ,0));

   lights(scene);
   camera = cameraSetup();
   // Action!

   // Allows us to see the axis - you can remove it if you want
   axis = new THREE.AxisHelper( 50 );
   axis.position.set( 0,0,0 );
   scene.add( axis );

   // scene ground
   var ground = new THREE.TextureLoader().load(textures+'dirt1.jpg');
   ground.wrapS = ground.wrapT = THREE.RepeatWrapping;
   ground.repeat.set( 500, 500 );
   ground.anisotropy = 1;
   var floor_material = new THREE.MeshPhongMaterial({
      map: ground,
      side: THREE.DoubleSide
      // wireframe:true
   });
   floor = new Terrain(floor_material).getBumpy(); // random terrain
   floor.position.y = -1;
   scene.add(floor);

   // falling block
   // object = new Crate(new Position(25,150,10),null,10,textures+'crate_metal.jpg');
   // object.rotation.x = Math.PI/2;
   // scene.add(object);

   // player
   new Player(scene,camera);

   // the renderer renders the scene using the objects, lights and camera
   renderer = new THREE.WebGLRenderer();
   renderer.setSize( window.innerWidth, window.innerHeight );
   // Attach the threeJS renderer to the HTML page
   document.body.appendChild( renderer.domElement );

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
     snow: function () {restartEngine("snow");},
     rain: function () {restartEngine("rain");},
     sunny: function () {restartEngine(worldWeather,0)},
   //  condition: "weather"
   };

   worldWeather = "snow";
   // add the params to the gui
   gui.add(params, "sunny").name("Sunny");
   gui.add(params, "snow").name("Snow");
   gui.add(params, "rain").name("Rain");
   gui.add(params, "numParticles",0,50000,100).name('# of Particles').onFinishChange(
     function() {
       // console.log(worldWeather);
        restartEngine(worldWeather);
     });
   gui.add(params, "NSwind",-4,4,.1).name('NSwind');
   gui.add(params, "WEwind",-4,4,.1).name('WEwind');
   // DAT.GUI //
   particleSystem = createParticleSystem(window.innerWidth,window.innerHeight,worldWeather, 0);
}

/*************************************************************
* Handle lights for the scene
*************************************************************/
var light = [];
function lights(scene) {
   // lights[0]
   var amb_light = new THREE.AmbientLight( 0xffffff);
   light.push(amb_light);
   scene.add(amb_light);

   // lights[1]
   var front_light = new THREE.DirectionalLight( 0x888888 );
   front_light.position.set( 0, 100, 100 ).normalize();
   light.push(front_light);
   scene.add(front_light);
}

/********************************************************************
* resetCamera(): Extra precaution to make sure rendering of the new
* scene is smooth
********************************************************************/
function resetCamera()
{
	// CAMERA
  // camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000);
  // camera.position.z = 100;
  // camera.position.y = 50;
  // camera.position.x = 100;
	// camera.lookAt(scene.position);

}

/*************************************************************
* Handle camera for the scene
*************************************************************/
function cameraSetup() {
   this.camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 1, 10000
   );
   this.camera.position.z = 100;
   this.camera.position.y = 50;
   this.camera.position.x = 100;
   if (_MODE_ == DEV) {
      controls = new THREE.OrbitControls( this.camera );
      controls.target.set(0,0,0);
   }
   return this.camera;
}
