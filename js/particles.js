/*******************************************************************
* Particles.js creates the two particle systems in our project. If
* scene is false then the system simulates snow, else it simulates
* fireflies.
*******************************************************************/

function createParticleSystem (scene, system = false) {
  // where particles originate from.
  pBoxSpawn = BABYLON.Mesh.CreateBox("pBoxSpawn", 1.0, scene);
  pBoxSpawn.isVisible = false;

  // 2 param num of particles
  if (!system) {
    if(particleSystem) particleSystem.stop();
    particleSystem = new BABYLON.ParticleSystem("particles", 100000, scene);

    // image for every particle
    particleSystem.particleTexture = new BABYLON.Texture("assets/textures/snowflake.png", scene);

    // change color of particles & alpha challenge
    particleSystem.textureMask = new BABYLON.Color4(0, 0, 0, 0);

    // Where the particles comes from
    particleSystem.emitter = pBoxSpawn; // the starting object, the emitter

    var size = 400; // orginally 200
    setBox();

    // Size of each particle (random between...)
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.2;

    // Life time of each particle (random between...)
    particleSystem.minLifeTime = 5;
    particleSystem.maxLifeTime = 10;

    particleSystem.emitRate = 6000;// originally 2000;

    //Set the gravity/wind of all particles
    particleSystem.gravity = new BABYLON.Vector3(params.WEwind, -9.81, params.NSwind);

    // give particles random direction at spawn
    particleSystem.direction1 = new BABYLON.Vector3(-7, -8, 3);
    particleSystem.direction2 = new BABYLON.Vector3(7, -8, -3);

    particleSystem.start();
    console.info("Particle System started");
    return pBoxSpawn;
  }
  else {
    if(particleSystem) particleSystem.stop();
    particleSystem = new BABYLON.ParticleSystem("particles", 100000, scene);

    // image for every particle
    particleSystem.particleTexture = new BABYLON.Texture("assets/textures/firefly.png", scene);

    // change color of particles & alpha challenge
    particleSystem.textureMask = new BABYLON.Color4(0.1, 0.8, 0.8, 1.0);
    // particleSystem.textureMask = new BABYLON.Color4(0, 0, 0, 0);

    // Where the particles comes from
    particleSystem.emitter = pBoxSpawn; // the starting object, the emitter

    var size = 400; // orginally 200
    setBox();

    // Colors of all particles (splited in 2 + specific color before dispose)
    particleSystem.color1 = new BABYLON.Color4(0, 0.5,0, 1.0); // combine for final color
    particleSystem.color2 = new BABYLON.Color4(1.0, 1.0, 0, 1.0); // combine for final color
    particleSystem.colorDead = new BABYLON.Color4(.1, 0, 0, 0.0); // color particle has before death

    // Size of each particle (random between...)
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = .5;

    // Life time of each particle (random between...)
    particleSystem.minLifeTime = .1;
    particleSystem.maxLifeTime = 2;
    
    particleSystem.emitRate = 6000;// originally 2000;

    particleSystem.gravity = new BABYLON.Vector3(0, 20, 0);

    // give particles random direction at spawn
    particleSystem.direction1 = new BABYLON.Vector3(-2, 2,  2);
    particleSystem.direction2 = new BABYLON.Vector3( 2,  2, -2);

    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;

    particleSystem.start();
    console.info("Particle System started");
    // particleSystem.stop();
    return pBoxSpawn;
  }
}

/******************************************************
* setBox is a helper function that makes the player become
* the emitter box. Effectively enveloping the player with
* particles.
******************************************************/
function setBox (px, pz) {


  var size = 400; // orginally 200
  particleSystem.minEmitBox = new BABYLON.Vector3(px - size,   0,
    pz - size); // Starting all From
  particleSystem.maxEmitBox = new BABYLON.Vector3(px + size, 100,
    pz + size); // To...
}
