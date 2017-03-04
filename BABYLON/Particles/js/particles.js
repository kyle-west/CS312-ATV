function createParticleSystem (scene) {
  // where particles originate from.
  pBoxSpawn = BABYLON.Mesh.CreateBox("pBoxSpawn", 1.0, scene);

  // 2 param num of particles
  particleSystem = new BABYLON.ParticleSystem("particles", 100000, scene);

  // image for every particle
  particleSystem.particleTexture = new BABYLON.Texture("images/snowflake.png", scene);

  // change color of particles & alpha challenge
  // particleSystem.textureMask = new BABYLON.Color4(0.1, 0.8, 0.8, 1.0);
  particleSystem.textureMask = new BABYLON.Color4(0, 0, 0, 0);

  // Where the particles comes from
  particleSystem.emitter = pBoxSpawn; // the starting object, the emitter

  particleSystem.minEmitBox = new BABYLON.Vector3(-100, 20, -100); // Starting all From
  particleSystem.maxEmitBox = new BABYLON.Vector3(100, 30, 100); // To...

  // Colors of all particles (splited in 2 + specific color before dispose)
  // particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0); // combine for final color
  // particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0); // combine for final color
  // particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0); // color particle has before death

  // Size of each particle (random between...)
  particleSystem.minSize = 0.1;
  particleSystem.maxSize = 0.2;

  // Life time of each particle (random between...)
  particleSystem.minLifeTime = 1.3;
  particleSystem.maxLifeTime = 3.5;

  particleSystem.emitRate = 1000;

  // particleSystem.manualEmitCount = 300; // if you want to emit particles in bursts

  // “BLENDMODE_ONEONE” (default choice: source color is added to the destination color without
  //  alpha affecting the result), and “BLENDMODE_STANDARD” (to blend current color and particle
  // color using particle’s alpha).

  // particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;

  //Set the gravity/wind of all particles
  particleSystem.gravity = new BABYLON.Vector3(50, -9.81, 0);

  // give particles random direction at spawn
  particleSystem.direction1 = new BABYLON.Vector3(-7, -8, 3);
  particleSystem.direction2 = new BABYLON.Vector3(7, -8, -3);

  particleSystem.start();
  // particleSystem.stop();
}
