function createCar(scene) {


    //The car's body:
    scale = .5;
    //wheel radius
    var rad = 5*scale;
    //height
    var h = 4*scale;
    //width
    var w = 5*scale;
    //depth
    var d = 10*scale;

    var body = BABYLON.MeshBuilder.CreateBox("body", {
        width: (w + 2) * 1.5,
        height: h,
        depth: (d + 4) * 1.5
    }, scene);
    // body.position.y = 100;
    //the wheels:

    var wheel1 = BABYLON.MeshBuilder.CreateSphere("wheel1", {
        diameterY: rad,
        //make the wheel look like... a wheel.
        diameterX: rad / 2,
        diameterZ: rad,
        segments: 5
    }, scene);
    // wheel1.position.copyFromFloats(-(w + 30), -20, -d);

    var wheel2 = BABYLON.MeshBuilder.CreateSphere("wheel2", {
        diameterY: rad,
        diameterX: rad / 2,
        diameterZ: rad,
        segments: 5
    }, scene);
    // wheel2.position.copyFromFloats((w + 30), -20, -d);

    var wheel3 = BABYLON.MeshBuilder.CreateSphere("wheel3", {
        diameterY: rad,
        diameterX: rad / 2,
        diameterZ: rad,
        segments: 5
    }, scene);
    // wheel3.position.copyFromFloats(-(w + 30), -20, d);

    var wheel4 = BABYLON.MeshBuilder.CreateSphere("wheel4", {
        diameterY: rad,
        diameterX: rad / 2,
        diameterZ: rad,
        segments: 5
    }, scene);
    // wheel4.position.copyFromFloats((w + 30), -20, d);

	// scene.enablePhysics(undefined, new BABYLON.OimoJSPlugin(500))

	// //set up the ground impostor:
	// ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
	//     //ground should stay in place
	// 	mass: 0,
	// 	friction: 1
	// });

	//the car body's impostor
	body.physicsImpostor = new BABYLON.PhysicsImpostor(body, BABYLON.PhysicsImpostor.BoxImpostor, {
	    mass: 30,
	    friction: 0.5,
	    restitution: 0,
	    nativeOptions: {
	        noSleep: true,
	        move: true
	    }
	});

	//The wheels impostors:
	[wheel1, wheel2, wheel3, wheel4].forEach(function(w) {
	    w.physicsImpostor = new BABYLON.PhysicsImpostor(w, BABYLON.PhysicsImpostor.SphereImpostor, {
	        mass: 4,
	        friction: 1,
	        restitution: 0,
	        nativeOptions: {
	            move: false
	        }
	    });
	});

  body.position = new BABYLON.Vector3(0,7,0);
  wheel1.position = new BABYLON.Vector3(1,5,1);
  wheel2.position = new BABYLON.Vector3(-1,5,1);
  wheel3.position = new BABYLON.Vector3(1,5,-1);
  wheel4.position = new BABYLON.Vector3(-1,5,-1);
  // wheel2.position = wheel3.position =
  // wheel4.position = new BABYLON.Vector3(0,5,0);
  //
	// //suspensions:
	// var holderSize = 20;
  //
	// var holder1 = BABYLON.MeshBuilder.CreateBox("holder1", {
	// 	height: holderSize, width: holderSize/2, depth: holderSize/2
	// }, scene);
	// holder1.position.copyFromFloats(-w, -20, -d);
  //
	// var holder2 = BABYLON.MeshBuilder.CreateBox("holder2", {
	// 	height: holderSize, width: holderSize/2, depth: holderSize/2
	// }, scene);
	// holder2.position.copyFromFloats(w, -20, -d);
  //
	// var holder3 = BABYLON.MeshBuilder.CreateBox("holder3", {
	// 	height: holderSize, width: holderSize/2, depth: holderSize/2
	// }, scene);
	// holder3.position.copyFromFloats(-w, -20, d);
  //
	// var holder4 = BABYLON.MeshBuilder.CreateBox("holder4", {
	// 	height: holderSize, width: holderSize/2, depth: holderSize/2
	// }, scene);
	// holder4.position.copyFromFloats(w, -20, d);
  //
	// [holder1, holder2, holder3, holder4].forEach(function (h) {
	// 	h.isVisible = false;
	// 	h.physicsImpostor = new BABYLON.PhysicsImpostor(h, BABYLON.PhysicsImpostor.SphereImpostor, {
  //           mass: 8,
  //           friction: 4,
  //           restitution: 0.5
  //       });
	// 	h.physicsImpostor.physicsBody.collidesWith = ~1;
	// });
  //
	// //slider joints
  //
	//  var sJoint1 = new BABYLON.MotorEnabledJoint(BABYLON.PhysicsJoint.SliderJoint, {
  //       mainPivot: new BABYLON.Vector3(-w, -20, -d),
  //       mainAxis: new BABYLON.Vector3(0, -1, 0),
  //       connectedAxis: new BABYLON.Vector3(0, -1, 0),
  //       nativeParams: {
  //           limit: [0, 0],
	// 		spring: [100, 2],
	// 		min: 5,
	// 		max: 30
  //       }
  //   });
  //   body.physicsImpostor.addJoint(holder1.physicsImpostor, sJoint1);
  //
  //   var sJoint2 = new BABYLON.MotorEnabledJoint(BABYLON.PhysicsJoint.SliderJoint, {
  //       mainPivot: new BABYLON.Vector3(w, -20, -d),
  //       mainAxis: new BABYLON.Vector3(0, -1, 0),
  //       connectedAxis: new BABYLON.Vector3(0, -1, 0),
  //       nativeParams: {
  //           limit: [0, 0],
	// 		spring: [100, 2],
	// 		min: 5,
	// 		max: 30
  //       }
  //   });
  //   body.physicsImpostor.addJoint(holder2.physicsImpostor, sJoint2);
  //
  //   var sJoint3 = new BABYLON.MotorEnabledJoint(BABYLON.PhysicsJoint.SliderJoint, {
  //       mainPivot: new BABYLON.Vector3(-w, -20, d),
  //       mainAxis: new BABYLON.Vector3(0, -1, 0),
  //       connectedAxis: new BABYLON.Vector3(0, -1, 0),
  //       nativeParams: {
  //           limit: [0, 0],
	// 		spring: [100, 2],
	// 		min: 5,
	// 		max: 30
  //       }
  //   });
  //   body.physicsImpostor.addJoint(holder3.physicsImpostor, sJoint3);
  //
  //   var sJoint4 = new BABYLON.MotorEnabledJoint(BABYLON.PhysicsJoint.SliderJoint, {
  //       mainPivot: new BABYLON.Vector3(w, -20, d),
  //       mainAxis: new BABYLON.Vector3(0, -1, 0),
  //       connectedAxis: new BABYLON.Vector3(0, -1, 0),
  //       nativeParams: {
  //           limit: [0, 0],
	// 		spring: [100, 2],
	// 		min: 5,
	// 		max: 30
  //       }
  //   });
  //   body.physicsImpostor.addJoint(holder4.physicsImpostor, sJoint4);
  //
	// //wheel joints
  //   var joint1 = new BABYLON.HingeJoint({
  //       mainPivot: new BABYLON.Vector3(0, -20, 0),
	// 	connectedPivot: new BABYLON.Vector3(30, 0, 0),
  //       mainAxis: new BABYLON.Vector3(-1, 0, 0),
  //       connectedAxis: new BABYLON.Vector3(-1, 0, 0),
  //       nativeParams: {
  //           limit: [0, 0]
  //       }
  //   });
  //   holder1.physicsImpostor.addJoint(wheel1.physicsImpostor, joint1);
  //
  //   var joint2 = new BABYLON.HingeJoint({
  //       mainPivot: new BABYLON.Vector3(0, -20, 0),
	// 	connectedPivot: new BABYLON.Vector3(-30, 0, 0),
  //       mainAxis: new BABYLON.Vector3(-1, 0, 0),
  //       connectedAxis: new BABYLON.Vector3(-1, 0, 0),
  //       nativeParams: {
  //           limit: [0, 0]
  //       }
  //   });
  //   holder2.physicsImpostor.addJoint(wheel2.physicsImpostor, joint2);
  //
  //   var joint3 = new BABYLON.HingeJoint({
  //       mainPivot: new BABYLON.Vector3(0, -20, 0),
	// 	connectedPivot: new BABYLON.Vector3(30, 0, 0),
  //       mainAxis: new BABYLON.Vector3(-1, 0, 0),
  //       connectedAxis: new BABYLON.Vector3(-1, 0, 0),
  //       nativeParams: {
  //           limit: [0, 0]
  //       }
  //   });
  //   holder3.physicsImpostor.addJoint(wheel3.physicsImpostor, joint3);
  //
  //   var joint4 = new BABYLON.HingeJoint({
  //       mainPivot: new BABYLON.Vector3(0, -20, 0),
	// 	connectedPivot: new BABYLON.Vector3(-30, 0, 0),
  //       mainAxis: new BABYLON.Vector3(-1, 0, 0),
  //       connectedAxis: new BABYLON.Vector3(-1, 0, 0),
  //       nativeParams: {
  //           limit: [0, 0]
  //       }
  //   });
  //   holder4.physicsImpostor.addJoint(wheel4.physicsImpostor, joint4);
  //   body.position.y =
  //   wheel1.position.y = wheel2.position.y = wheel3.position.y = wheel4.position.y = 100;
  //   wheel1.rotation.x = wheel2.rotation.x = wheel3.rotation.x = wheel4.rotation.x = 0;
  //
	//     //The control object - what is happening at the moment.
  //   var actions = {
  //       steering: 0,
  //       velocity: 0
  //   };
  //
  //   var deg45 = Math.PI / 4;
  //
  //   //current rotation angle
  //   var angle = 0
  //
  //   //My keyUp / reset implementation
  //   function keyUp(event) {
  //
  //       var key = event.keyCode;
  //
  //       switch (key) {
  //           //left and right arrows
  //           case 37:
  //           case 39:
  //               actions.steering = 0;
  //               break;
  //               //up and down arrows
  //           case 38:
  //           case 40:
  //               actions.velocity = 0;
  //               break;
  //       }
  //
  //       updating = false;
  //   }
  //
  //   //when a key is pressend
  //   function keyDown(event) {
  //
  //       var key = event.keyCode;
  //
  //       switch (key) {
  //           case 37:
  //               actions.steering = 1;
  //               break;
  //           case 38:
  //               actions.velocity = -1;
  //               break;
  //           case 39:
  //               actions.steering = -1;
  //               break;
  //           case 40:
  //               actions.velocity = 1;
  //               break;
  //       }
  //       updating = true;
  //   }
  //
  //   //add the event listeners
  //   document.addEventListener('keydown', keyDown);
  //   document.addEventListener('keyup', keyUp);
  //
  //   //remove listeners when the scene is disposed
  //   scene.onDispose = function() {
  //       document.removeEventListener('keydown', keyDown);
  //       document.removeEventListener('keyup', keyUp);
  //   }
  //
  //   var steeringLimit = Math.PI / 6;
  //   var updating = false;
  //
  //   /**
  //   The update function will be in change of updating both motors - steering and movement on each frame.
  //   */
    function update() {
  //
  //       //get the current steering direction
  //       var steering = actions.steering;
  //
  //       //change the angle of steering
  //       angle += steering * 0.1;
  //       //set the max/min angle. so that the wheels won't turn 360 degrees
  //       angle = angle = angle > steeringLimit ? steeringLimit : angle < -steeringLimit ? -steeringLimit : angle;
  //
  //       //Make both front wheels turn!
  //
  //       //First set the motor's limit - from/till what angle should it move.
  //       sJoint3.setLimit(angle, angle);
  //       sJoint4.setLimit(angle, angle);
  //       // The back wheels should ALWAYS be straight
  //       sJoint1.setLimit(0, 0);
  //       sJoint2.setLimit(0, 0);
  //       // Now add force to force steering movement.
  //       sJoint3.setMotor(steering, 1);
  //       sJoint4.setMotor(steering, 1);
  //
  //       //Is that car moving forward / backwards?
  //       var velocity = actions.velocity || 0;
  //       //Calculate the velocity of a single wheel
  //       var wheelVelocity = 10 * Math.PI * velocity;
  //
  //       //set this force to all wheels (simulating a 4x4 car).
  //       // joint1.setMotor(wheelVelocity, 12);
  //       // joint2.setMotor(wheelVelocity, 12);
  //       // joint3.setMotor(wheelVelocity, 12);
  //       // joint4.setMotor(wheelVelocity, 12);
    }

    //Run the update function on every frame, so acceleration and wheel movement will work smoothly.
    scene.registerBeforeRender(update);

	    //general randomize function

    return scene;

  }
