var wheels_imp = [];

function createATV(scene,atv) {
   BABYLON.SceneLoader.ImportMesh("","assets/mesh/", "atv-complete-test.babylon", scene,
   function(newMeshes, particleSystems, skeletons) {
      for (var i = 0; i < newMeshes.length; i ++) {
         newMeshes[i].position.y = 1.5;
      }
      atv = newMeshes[3]; //fl 0 fr 1 br 2 bl 4 body 3
      fl = newMeshes[0];
      fr = newMeshes[1];
      br = newMeshes[2];
      bl = newMeshes[4];

      var wheel_attribs = {
         mass:1,
         friction:1000,
         restitution:0
      };

      bl.physicsImpostor = new BABYLON.PhysicsImpostor(bl,
         BABYLON.PhysicsImpostor.CylinderImpostor, wheel_attribs, scene);
      br.physicsImpostor = new BABYLON.PhysicsImpostor(br,
         BABYLON.PhysicsImpostor.CylinderImpostor, wheel_attribs, scene);
      fl.physicsImpostor = new BABYLON.PhysicsImpostor(fl,
         BABYLON.PhysicsImpostor.CylinderImpostor, wheel_attribs, scene);
      fr.physicsImpostor = new BABYLON.PhysicsImpostor(fr,
         BABYLON.PhysicsImpostor.CylinderImpostor, wheel_attribs, scene);
      wheels_imp.push(bl);
      wheels_imp.push(br);
      wheels_imp.push(fl);
      wheels_imp.push(fr);

      bodyMesh = BABYLON.Mesh.CreateBox("bodyMesh",1,scene);


      bodyMesh.physicsImpostor = new BABYLON.PhysicsImpostor(bodyMesh,
         BABYLON.PhysicsImpostor.BoxImpostor, {mass:1,friction:0 ,restitution:0},scene);

      var height = 5;
      var width  = 2.5;
      var length = 2.5;
      var cross  = Math.hypot(width, length);

      var dist_height = new BABYLON.DistanceJoint({ maxDistance: height });
      var dist_width  = new BABYLON.DistanceJoint({ maxDistance: width });
      var dist_length = new BABYLON.DistanceJoint({ maxDistance: length });
      var dist_cross = new BABYLON.DistanceJoint({ maxDistance: cross });

      // bodyMesh.physicsImpostor.addJoint(bl.physicsImpostor, dist_height);
      // bodyMesh.physicsImpostor.addJoint(br.physicsImpostor, dist_height);
      // bodyMesh.physicsImpostor.addJoint(fl.physicsImpostor, dist_height);
      // bodyMesh.physicsImpostor.addJoint(fr.physicsImpostor, dist_height);

      br.physicsImpostor.addJoint(bl.physicsImpostor, dist_width);
      fr.physicsImpostor.addJoint(fl.physicsImpostor, dist_width);

      bl.physicsImpostor.addJoint(fl.physicsImpostor, dist_length);
      br.physicsImpostor.addJoint(fr.physicsImpostor, dist_length);

      br.physicsImpostor.addJoint(fl.physicsImpostor, dist_cross);
      bl.physicsImpostor.addJoint(fr.physicsImpostor, dist_cross);

      atv.parent = bodyMesh;
      atv.position = new BABYLON.Vector3(0,-.25,0);
      // bl.parent = childMesh;
      // bl.position = new BABYLON.Vector3(5,0,0);
   });

   scene.registerBeforeRender(function () {
      if (scene.isReady() && atv) {
         // bl.rotation.x = bl.rotation.y = bl.rotation.z = 0;
         // var speed = -5;
         // bl.rotation.y += speed;
         // br.rotation.y += speed;
         // fl.rotation.y += speed;
         // fr.rotation.y += speed;
         // atv.position.y += .1;
         // childMesh.position.y += .2;
         // childMesh.position.x += .2;

         // for (var i = 0; i < wheels_imp.length; i++) {
         //    wheels_imp[i].physicsImpostor.applyImpulse(
         //       new BABYLON.Vector3(0, 0, 1),
         //       wheels_imp[i].getAbsolutePosition()
         //    );
         // }

         bodyMesh.physicsImpostor.applyImpulse(
            new BABYLON.Vector3(0, 0, 1),
            bodyMesh.getAbsolutePosition()
         );
         bodyMesh.rotation = new BABYLON.Vector3(0,0,0);
         // if(bl.position.y < 0) bl.position.y =0;
      }
   });

   console.log("ATV created");
}
