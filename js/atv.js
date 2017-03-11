function createATV(scene,atv) {

  BABYLON.SceneLoader.ImportMesh("","assets/mesh/", "atv-complete-test.babylon", scene,
  function(newMeshes, particleSystems, skeletons) {
    for (var i = 0; i < newMeshes.length; i ++){
      newMeshes[i].position.y = 1.5;
    }
    atv = newMeshes[3]; //fl 0 fr 1 br 2 bl 4 body 3

    //bl 6-8 fl 9-11 br 12-14 fr 15-17
    // body is 0-1
    fl = newMeshes[0];
    fr = newMeshes[1];
    br = newMeshes[2];
    bl = newMeshes[4];
    // bl1 = newMeshes[7];
    //  bl = newMeshes[8];
    // bl.position = new BABYLON.Vector3(0,5,0);
    bl.physicsImpostor = new BABYLON.PhysicsImpostor(bl,
      BABYLON.PhysicsImpostor.SphereImpostor, {mass:1,restitution:.1},scene);
    br.physicsImpostor = new BABYLON.PhysicsImpostor(br,
      BABYLON.PhysicsImpostor.SphereImpostor, {mass:1,restitution:.1},scene);
    fl.physicsImpostor = new BABYLON.PhysicsImpostor(fl,
      BABYLON.PhysicsImpostor.SphereImpostor, {mass:1,restitution:.1},scene);
    fr.physicsImpostor = new BABYLON.PhysicsImpostor(fr,
      BABYLON.PhysicsImpostor.SphereImpostor, {mass:1,restitution:.1},scene);

   //  bl.physicsImpostor = new BABYLON.PhysicsImpostor(bl,
      // BABYLON.PhysicsImpostor.SphereImpostor, {mass:1,restitution:.9},scene);
      // atv.position = new Babylon.Vector3(5,10,0);
    atv.physicsImpostor = new BABYLON.PhysicsImpostor(atv,
      BABYLON.PhysicsImpostor.BoxImposter,
         {mass: 40,
          friction: 0.5,
          restitution: 0.5,
          nativeOptions: {
            noSleep: true,
            move: true
          }},scene);
        });
        // buildCar(scene);

        scene.registerBeforeRender(function () {
          if (scene.isReady() && atv) {
            // atv.position.y += .1;

            // if(bl.position.y < 0) bl.position.y =0;
          }
        });

}
