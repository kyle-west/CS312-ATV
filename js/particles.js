/******************************************************************
* makeStruct(): this is a struct factory! We use it to create our
* weatherstruct which holds conditions existent in each weather
* condition.
******************************************************************/
function makeStruct(names) {
  var names = names.split(' ');
  var count = names.length;
  function constructor() {
    for (var i = 0; i < count; i++) {
      this[names[i]] = arguments[i];
    }
  }
  return constructor;
}

// create our weather struct (each word represents a variable name)
var Weather = makeStruct("texture fallSpeed size numParticles");
var nParts;
// create each weather condition consisting of
// new Weather('location of texture', how fast particles should fall,
// size of the particle, number of particles in a system)


// list of potential weather conditions
var weathertypes;
var condArr;
// what is the weather currently?
var currentWeather;
var parRange = 1000;

//////////////////////////////////////////////////
//////////////////////////////////////////////////

/******************************************************************
* createParticleSystem(): this will generate our particleSystem of
* vertices so they might be manipulated as one entity
******************************************************************/
function createParticleSystem(winWidth,winHeight,condition,numParticles = 500) {
    nParts = numParticles;
    weathertypes = [
      "snow",
      "rain",
      "fireflies"
    ];

    condArr = [
      snow = new Weather('images/snowflake.png', 50, .5, nParts),
      rain = new Weather('images/raindrop.png', 300, .5, nParts),
      fireflies = new Weather('images/raindrop.png', 0, 3, nParts)
    ];
    currentWeather = condArr[weathertypes.indexOf(condition)];

    // The number of particles in a particle system is not easily changed.
    var particleCount = currentWeather.numParticles;

    // Particles are just individual vertices in a geometry
    // Create the geometry that will hold all of the vertices
    var particles = new THREE.Geometry();

    // Create the vertices and add them to the particles geometry
    for (var p = 0; p < particleCount; p++) {

        // This will create all the vertices in a range of -200 to 200 in all directions
        var x = Math.random() * parRange - parRange;//- 200;
        var y = Math.random() * parRange - parRange;//- 200;
        var z = Math.random() * parRange - parRange;//- 200;

        // Create the vertex
        var particle = new THREE.Vector3(x, y, z);
        // Add the vertex to the geometry
        particles.vertices.push(particle);
    }

    // point cloud geometry
//   var geometry = new THREE.SphereBufferGeometry( 100, 16, 8 );

   // add an attribute
   numVertices = currentWeather.numParticles;
/*   var alphas = new Float32Array( numVertices * 1 ); // 1 values per vertex

   for( var i = 0; i < numVertices; i ++ ) {

       // set alpha randomly
       particles.vertices[i].transparent = false;
       particles.vertices[i].opacity = 1;
   }

//   particles.addAttribute( 'alpha', new THREE.BufferAttribute( alphas, 1 ) );

   // uniforms
   uniforms = {

       color: { type: "c", value: new THREE.Color( 0x00ff00 ) },

   };

   // point cloud material
   var shaderMaterial = new THREE.ShaderMaterial( {

       uniforms:       uniforms,
       vertexShader:   document.getElementById( 'vertexshader' ).textContent,
       fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
       transparent:    true,
        blending: THREE.AdditiveBlending
   });

   // point cloud
*/

    // Create the material that will be used to render each vertex of the geometry
    THREE.ImageUtils.crossOrigin = '';
    var particleMaterial = new THREE.PointsMaterial(
            {color: 0xffffff,
             size: currentWeather.size,
             map: THREE.ImageUtils.loadTexture(currentWeather.texture),
             blending: THREE.AdditiveBlending,
             transparent: true
            });

    // Create the particle system

    if (weathertypes.indexOf(condition) == 2) particleSystem = new THREE.Points(particles, shaderMaterial);
    else particleSystem = new THREE.Points(particles, particleMaterial);
    particleSystem.frustumCulled = false;
    return particleSystem;
}

/******************************************************************
* animateParticles(): make the particleSystem move (afflict particles
* with gravity and possible wind)
******************************************************************/
function animateParticles(particleSystem, deltaTime, wind, player) {
    var verts = particleSystem.geometry.vertices;
    for(var i = 0; i < verts.length; i++) {
        var vert = verts[i];
        wrapParticles(vert,player);
        vert.y = vert.y - (currentWeather.fallSpeed * deltaTime);

        // used to create variance in falling particles
        var randomize = Math.random() * .25;
        vert.x += (wind.x + ((i % 2 ==0) ? randomize : -randomize));
        vert.z += (wind.z + ((i % 2 ==1) ? randomize : -randomize));
        vert.y += wind.y;
    }
    particleSystem.geometry.verticesNeedUpdate = true;

}

/*****************************************
* wrapParticles(): Keep particles on map
******************************************/
function wrapParticles(vert,player) {

  if (vert.y < -100) {
      vert.y = 400 - Math.random() * 200;
  }
  if (vert.y > 400) {
      vert.y = -300;
  }
  if (vert.x > parRange) {
      vert.x = -parRange;
  }
  if (vert.x < -parRange) {
      vert.x = parRange;
  }
  if (vert.z > parRange) {
      vert.z = -parRange;
  }
  if (vert.z < -parRange) {
      vert.z = parRange;
  }
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
// Additional useful code found/created
/*
  var plusOrMinus = Math.random() < 0.5 ? -1 : 1;

*/
