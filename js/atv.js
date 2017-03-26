function createATV(scene,atv) {
  testcar();

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
    // fl.isVisible = false
    // fr.isVisible = false
    // bl.isVisible = false
    // br.isVisible = false


    // bl.position = new BABYLON.Vector3(0,5,0);
    // bl.physicsImpostor = new BABYLON.PhysicsImpostor(bl,
    //   BABYLON.PhysicsImpostor.CylinderImpostor, {mass:1,restitution:.1},scene);
    // br.physicsImpostor = new BABYLON.PhysicsImpostor(br,
    //   BABYLON.PhysicsImpostor.CylinderImpostor, {mass:1,restitution:.1},scene);
    // fl.physicsImpostor = new BABYLON.PhysicsImpostor(fl,
    //   BABYLON.PhysicsImpostor.CylinderImpostor, {mass:1,restitution:.1},scene);
    // fr.physicsImpostor = new BABYLON.PhysicsImpostor(fr,
    //   BABYLON.PhysicsImpostor.CylinderImpostor, {mass:1,restitution:.1},scene);

   //  bl.physicsImpostor = new BABYLON.PhysicsImpostor(bl,
      // BABYLON.PhysicsImpostor.SphereImpostor, {mass:1,restitution:.9},scene);
      // atv.position = new Babylon.Vector3(5,10,0);
      childMesh = BABYLON.Mesh.CreateBox("childMesh",1,scene);
      childMesh.position = new BABYLON.Vector3(0,3,0);

      // childMesh.scaling = new BABYLON.Vector3(2,2,2);
      // childMesh.scaling = new BABYLON.Vector3(1,1,2);
      childMesh.wireframe = true;
      // childMesh.position = new BABYLON.Vector3(0,10.5,0);
      childMesh.physicsImpostor = new BABYLON.PhysicsImpostor(childMesh,
        BABYLON.PhysicsImpostor.BoxImpostor, {mass:1,friction:1 ,restitution:0},scene);

        // var distanceJoint = new BABYLON.DistanceJoint({ maxDistance: 1 });
        // childMesh.physicsImpostor.addJoint(bl.physicsImpostor, distanceJoint);

        atv.parent = childMesh;
        atv.position = new BABYLON.Vector3(0,-.25,0);


        });
        // buildCar(scene);
              // friction: 0.5,

              // nativeOptions: {
                // noSleep: true,
                // move: true


        scene.registerBeforeRender(function () {
          if (scene.isReady() && atv) {
            // bl.rotation.x = bl.rotation.y = bl.rotation.z = 0;
            // atv.position.y += .1;
            // childMesh.position.y += .2;
            // childMesh.position.x += .2;
            // childMesh.physicsImpostor.applyImpulse(new BABYLON.Vector3(.1, 0, 0), childMesh.getAbsolutePosition());
            // if(bl.position.y < 0) bl.position.y =0;
          }
        });



        

}

function testcar() {

}
