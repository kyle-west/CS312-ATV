/*************************************************************
* Initialize the game and the scene
*************************************************************/
function init() {
   // set up Physijs and scene
   Physijs.scripts.worker = 'js/physi/physijs_worker.js';
   Physijs.scripts.ammo =   '../physi/ammo.js';
   scene = new Physijs.Scene;
   scene.background = new THREE.Color( 0xaaaaff );
   scene.setGravity(new THREE.Vector3(0, -90 ,0));

   lights(scene);
   camera = cameraSetup();
   // Action!

   // Allows us to see the axis - you can remove it if you want
   axis = new THREE.AxisHelper( 50 );
   axis.position.set( 0,0,0 );
   scene.add( axis );

   // scene ground
   var grass = new THREE.TextureLoader().load(textures+'grass_simple.jpg');
   grass.wrapS = grass.wrapT = THREE.RepeatWrapping;
   grass.repeat.set( 500, 500 );
   var floor_material = new THREE.MeshPhongMaterial({map: grass });
   floor = new Terrain(floor_material).getBumpy(); // random terrain
   floor.position.y = -1;
   scene.add(floor);

   // falling block
   object = new Crate(new Position(25,150,10),null,10,textures+'crate_metal.jpg');
   object.rotation.x = Math.PI/2;
   scene.add(object);

   // the renderer renders the scene using the objects, lights and camera
   renderer = new THREE.WebGLRenderer();
   renderer.setSize( window.innerWidth, window.innerHeight );
   // Attach the threeJS renderer to the HTML page
   document.body.appendChild( renderer.domElement );

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
   controls = new THREE.OrbitControls( this.camera );
   controls.target.set(0,0,0);
   return this.camera;
}
