var camera;
var scene;
var renderer;
var cubeMesh;

var clock;
var deltaTime;

var particleSystem;
var rotation = 0;
var wind = new THREE.Vector3(0,0,0);
var condition;
var gui, params, currentParts, worldWeather;

function init() {
    // used in rendering
    clock = new THREE.Clock(true);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 100;
    camera.position.y = 50;
    camera.position.x = 100;

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

    // initial particleSystem
    particleSystem = createParticleSystem(window.innerWidth,window.innerHeight,worldWeather, 0);
    console.log(worldWeather);
    scene.add(particleSystem);

    axis = new THREE.AxisHelper( 50 );
		axis.position.set( 0,0,0 );
    scene.add( axis );

    // our sunlight
    var light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 50, -50, 50 ).normalize();
    scene.add(light);

    // block used to give perspective
    var geometry = new THREE.CubeGeometry( 10, 10, 10);
    var material = new THREE.MeshToonMaterial( { color: 0x0033ff, specular: 0x555555, shininess: 30 } );
    cubeMesh = new THREE.Mesh(geometry, material );
    scene.add( cubeMesh );

    // the plane our cube sits on
    geometry = new THREE.CubeGeometry(1000,0,1000);
    material = new THREE.MeshToonMaterial( { color: 0xdddddd, specular: 0x555555, shininess: 30 } );
    cubeMesh = new THREE.Mesh(geometry, material );
    cubeMesh.position.y =-6;
    scene.add( cubeMesh );

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor (0x707574, 1);
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );

    render();
}

/********************************************************************
* restartEngine() this will update our particleSystem as the user
* changes variables in the GUI. Old particleSystem is removed and a
* new one is added to the scene.
********************************************************************/
function restartEngine(weather = "snow", par = params.numParticles)
{
  worldWeather = weather;
	resetCamera();
  scene.remove(particleSystem);
  particleSystem = createParticleSystem(window.innerWidth,window.innerHeight,weather,par);
	scene.add(particleSystem);
}

/********************************************************************
* resetCamera(): Extra precaution to make sure rendering of the new
* scene is smooth
********************************************************************/
function resetCamera()
{
	// CAMERA
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 100;
  camera.position.y = 50;
  camera.position.x = 100;
	camera.lookAt(cubeMesh.position);

}

function animate() {
    requestAnimationFrame( animate );
    deltaTime = clock.getDelta();

    // animate the particles.
    wind = new THREE.Vector3(params.WEwind,0,params.NSwind);
    animateParticles(particleSystem,deltaTime,/*wind vector*/wind);
    rotation -= .01;

    camera.position.x = Math.sin(rotation/2) * 100;
    camera.position.z = Math.cos(rotation/2) * 100;
    camera.position.y = 10;
    camera.lookAt(cubeMesh.position);

    render();
}


function render() {
  if (condition == "fireflies") {

    for( var i = 0; i < particleSystem.geometry.vertices.length; i ++ ) {

      // dynamically change alphas
      particleSystem.geometry.vertices[ i ].alpha *= 0.95;

      if ( particleSystem.geometry.vertices[ i ].alpha < 0.01 ) {
        particleSystem.geometry.vertices[ i ].alpha = 1.0;
      }

       particleSystem.geometry.vertices[ i ].alpha.needsUpdate = true; // important!
    }
  }
  // DAT.GUI //

  renderer.render( scene, camera );
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    render();
}

// Additional useful code
/*
  gui.add(params, "condition", {Snow: 'snow', Rain: 'rain'}).name("Condition");

*/
