function createSceneCar(engine) {

///////////////////////////////////////////////////////// Cannon physics //////////////////////////////////////////////////
    var world = new CANNON.World();
	world.gravity.set(0, 0, -9.82);
	world.broadphase = new CANNON.NaiveBroadphase();
        world.defaultContactMaterial.contactEquationStiffness = 1e6;
        //world.defaultContactMaterial.contactEquationRegularizationTime = 1;
        world.solver.iterations = 10;
        world.contactgen.contactReduction=true;

    var worldstep = 7;
    var timeStep = 1.0 / 60.0; // seconds
    var mass = 1;
    var groundMaterial = new CANNON.Material("groundMaterial");
    var wheelMaterial =  new CANNON.Material("wheelMaterial");
    var wheelGroundContactMaterial = new CANNON.ContactMaterial(groundMaterial, wheelMaterial, 0.5, 0.3);

    world.addContactMaterial(wheelGroundContactMaterial);

    // ground
    var groundShape = new CANNON.Plane();
    var groundBody = new CANNON.RigidBody(0, groundShape, groundMaterial);
    world.add(groundBody);

    // wheels
    var wheelShape =      new CANNON.Sphere(1);
    var leftFrontWheel =  new CANNON.RigidBody(mass, wheelShape, wheelMaterial);
    var rightFrontWheel = new CANNON.RigidBody(mass, wheelShape, wheelMaterial);
    var leftRearWheel =   new CANNON.RigidBody(mass, wheelShape, wheelMaterial);
    var rightRearWheel =  new CANNON.RigidBody(mass, wheelShape, wheelMaterial);

    // chassis
    var chassisShape = new CANNON.Box(new CANNON.Vec3(3.25, 0.6, 0.4));
    var tx = new CANNON.RigidBody(mass*9, chassisShape);

    // Position constrain wheels
    var zero = new CANNON.Vec3();
    leftFrontWheel .position.set(  2.75,  1.75, 0);
    rightFrontWheel.position.set(  2.75, -1.75, 0);
    leftRearWheel  .position.set( -2.75,  1.75, 0);
    rightRearWheel .position.set( -2.75, -1.75, 0);

    // Constrain wheels
    var constraints = [];

    // Hinge the wheels
    var leftAxis =       new CANNON.Vec3(0, 1, 0);
    var rightAxis =      new CANNON.Vec3(0,-1, 0);
    var leftFrontAxis =  new CANNON.Vec3(0, 1, 0);
    var rightFrontAxis = new CANNON.Vec3(0,-1, 0);

    constraints.push(new CANNON.HingeConstraint(tx, new CANNON.Vec3( 2.75,  1.75, 0), leftFrontAxis,  leftFrontWheel,  zero, leftAxis ));
    constraints.push(new CANNON.HingeConstraint(tx, new CANNON.Vec3( 2.75, -1.75, 0), rightFrontAxis, rightFrontWheel, zero, rightAxis));
    constraints.push(new CANNON.HingeConstraint(tx, new CANNON.Vec3(-2.75,  1.75, 0), leftAxis,       leftRearWheel,   zero, leftAxis ));
    constraints.push(new CANNON.HingeConstraint(tx, new CANNON.Vec3(-2.75, -1.75, 0), rightAxis,      rightRearWheel,  zero, rightAxis));

    for(var i = 0; i < constraints.length; i++)
        world.addConstraint(constraints[i]);

    var c_bodies = [tx, leftFrontWheel, rightFrontWheel, leftRearWheel, rightRearWheel];

    for(var i = 0; i < c_bodies.length; i++)
        world.add(c_bodies[i]);

    // Enable motors
    var frontLeftHinge  = constraints[2];
    var frontRightHinge = constraints[3];
	frontLeftHinge.enableMotor();
	frontRightHinge.enableMotor();

    // boxes
    var wb = new Array(9);
    var boxShape = new CANNON.Box(new CANNON.Vec3(5, 5, 5));
        wb[0] = new CANNON.RigidBody(1, boxShape);
        wb[0].position.set(140, -27.5, 250);
        wb[0].linearDamping = 0;
    world.add(wb[0]);
    var boxShape2 = new CANNON.Box(new CANNON.Vec3(3, 3, 3));
    for (var i = 1; i < wb.length; i++) {
        wb[i] = new CANNON.RigidBody(1, boxShape2);
        wb[i].position.set(150, i  * 9,  6);
        wb[i].linearDamping = 0;
        world.add(wb[i]);
    }
    wb[1].position.set(-95, 130, 30.1);
    wb[2].position.set(-170, 70, 6);

    // bridge
    var boxShape11 = new CANNON.Box(new CANNON.Vec3(85, 5, 1));
    var br = new CANNON.RigidBody(0, boxShape11);
        br.position.x = -95;
        br.position.y = 130;
        br.position.z = 24.1;
        br.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), -0.8)
    world.add(br);

    // ramp
    var rampShape = new CANNON.Box(new CANNON.Vec3(20, 10, 20));
    var r1 = new CANNON.RigidBody(0, rampShape);
        r1.position.set(150, 125, -7.5);
        r1.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 180 * 70);
        r1.linearDamping = 0;
    world.add(r1);

    // virtualground-box car
    var boxShape1 = new CANNON.Box(new CANNON.Vec3(4, 4, 4));
    var bu = new CANNON.RigidBody(0, boxShape1);
        bu.position.z = -10;
    world.add(bu);
    // virtualground-box boxes
    var wbu = new Array(wb.length);
    var boxShape30 = new CANNON.Box(new CANNON.Vec3(3, 3, 0.25));
        wbu[0] = new CANNON.RigidBody(0, boxShape30);
        wbu[0].position.z = -10;
        world.add(wbu[0]);
    var boxShape31 = new CANNON.Box(new CANNON.Vec3(2, 2, 0.25));
    for (i = 1; i < wb.length; i++) {
        wbu[i] = new CANNON.RigidBody(0, boxShape31);
        wbu[i].position.z = -10;
        world.add(wbu[i]);
    }

    // Collision-Box trees
    var xxtree = 75;
    var b2 = new Array(xxtree);
    var boxShape3 = new CANNON.Box(new CANNON.Vec3(0.35, 0.35, 5));
    for (var i = 0; i < b2.length; i++) {
        b2[i] = new CANNON.RigidBody(0, boxShape3);
        world.add(b2[i]);
    }
    // Collision-Box pylon
    var b22 = new Array(8);
    var boxShape4 = new CANNON.Box(new CANNON.Vec3(1.5, 1.5, 25));
    for (var i = 0; i < b22.length-1; i++) {
        b22[i] = new CANNON.RigidBody(0, boxShape4);
        world.add(b22[i]);
    }
    var boxShape41 = new CANNON.Box(new CANNON.Vec3(3, 3, 6));
        b22[7] = new CANNON.RigidBody(0, boxShape41);
        b22[7].quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI/4);
        world.add(b22[7]);

    // world-border
    var bor = new Array(4);
    var boxShape411 = new CANNON.Box(new CANNON.Vec3(298, 1, 300));
    for (var i = 0; i < bor.length; i++) {
        bor[i] = new CANNON.RigidBody(0, boxShape411);
        if (i == 0) bor[i].position.y = 300; else if (i == 1) bor[i].position.y = -300; else bor[i].position.y = 0;
        if (i == 2) bor[i].position.x = 300; else if (i == 3) bor[i].position.x = -300; else bor[i].position.x = 0;
        bor[i].position.z = 50;
        if (i > 1) bor[i].quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI/2);
        world.add(bor[i]);
    }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Creation of the scene
var scene = new BABYLON.Scene(engine);

// Camera
var camera1 = new BABYLON.ArcRotateCamera("Camera", 1.5, 1.5, 20, new BABYLON.Vector3(0, 1, 0), scene);
    camera1.keysUp = [];
    camera1.keysDown = [];
    camera1.keysLeft = [];
    camera1.keysRight = [];

// Lights
var light01 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, 1), scene);
    light01.position = new BABYLON.Vector3(340, 340, -340);
    light01.intensity = 0.75;
var light02 = new BABYLON.DirectionalLight("dir02", new BABYLON.Vector3(1, -2, 1), scene);
    light02.position = new BABYLON.Vector3(340, 70, -340);
    light02.intensity = 0.1;
var light03 = new BABYLON.PointLight("poi01", new BABYLON.Vector3(340, 150, -340), scene);
    light03.intensity = 0.4;
var light04 = new BABYLON.PointLight("poi02", new BABYLON.Vector3(-340, 150, 340), scene);
    light04.intensity = 0.6;

// lensflare
var lensFlareSystem = new BABYLON.LensFlareSystem("lensFlareSystem", light02, scene);
    var flare01 = new BABYLON.LensFlare(0.4, 0.5, new BABYLON.Color3(0.5, 0.5, 1), "carx/flare.png", lensFlareSystem);
    var flare02 = new BABYLON.LensFlare(0.2, 1.0, new BABYLON.Color3(1,   1,   1), "carx/flare.png", lensFlareSystem);
    var flare03 = new BABYLON.LensFlare(0.3, 0.6, new BABYLON.Color3(1,   0.5, 1), "carx/flare.png", lensFlareSystem);
    var flare04 = new BABYLON.LensFlare(0.1, 1.0, new BABYLON.Color3(1,   1,   1), "carx/flare.png", lensFlareSystem);
    var flare05 = new BABYLON.LensFlare(0.3, 0.8, new BABYLON.Color3(1,   1,   1), "carx/flare.png", lensFlareSystem);

// event keys
var keys = { left:0, right:0, forward:0, back:0 };

window.addEventListener('keydown', function(event) {
    if (event.keyCode == 37) keys.left    = 1;
    if (event.keyCode == 38) keys.forward = 1;
    if (event.keyCode == 39) keys.right   = 1;
    if (event.keyCode == 40) keys.back    = 1;
});
window.addEventListener('keyup', function(event) {
    if (event.keyCode == 37) keys.left    = 0;
    if (event.keyCode == 38) keys.forward = 0;
    if (event.keyCode == 39) keys.right   = 0;
    if (event.keyCode == 40) keys.back    = 0;
});

// click event
window.addEventListener("click", function (evt) {
    var pickResult = scene.pick(evt.clientX, evt.clientY);
        if (pickResult.hit) {
            tx.position.z-=0.5;
        }
});

// skybox
var skybox = BABYLON.Mesh.CreateBox("skyBox", 860.0, scene);
var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("carx/skybox/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skybox.material = skyboxMaterial;

// ground - heightmap
var ground = new BABYLON.Mesh.CreateGroundFromHeightMap("ground", "carx/heightmap.png", 700, 700, 50, 0, 25, scene, false);
var matGround = new BABYLON.StandardMaterial("matGround", scene);
    matGround.diffuseTexture = new BABYLON.Texture("carx/sand3_a.jpg", scene);
    matGround.diffuseTexture.uScale = 25;
    matGround.diffuseTexture.vScale = 25;
    matGround.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    ground.material = matGround;
    //ground.material.backFaceCulling = false;
    ground.receiveShadows = true;
var ground2 = BABYLON.Mesh.CreatePlane("ground", 700, scene);
    ground2.rotation.x=Math.PI/2;
    ground2.material = matGround;
    ground2.position.y = -0.1;

// material
var materialbox = new BABYLON.StandardMaterial("texture2", scene);
    materialbox.diffuseTexture = new BABYLON.Texture("carx/webgl.png", scene);
    materialbox.alpha = 1;
var materialbox4 = new BABYLON.StandardMaterial("texture2", scene);
    materialbox4.diffuseTexture = new BABYLON.Texture("carx/webgl_blue.png", scene);
    materialbox4.alpha = 1;
var materialbox3 = new BABYLON.StandardMaterial("texture2", scene);
    materialbox3.diffuseColor = new BABYLON.Color3(1, 0, 0);
var materialbox2 = new BABYLON.StandardMaterial("texture2", scene);
    materialbox2.diffuseTexture = new BABYLON.Texture("carx/palm_s.png", scene);
    materialbox2.specularColor = new BABYLON.Color3(0, 0, 0);

// water
var waterMaterial = new BABYLON.StandardMaterial("texture4", scene);
    waterMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    waterMaterial.reflectionTexture = new BABYLON.MirrorTexture("mirror", 512, scene, true);
    waterMaterial.reflectionTexture.mirrorPlane = new BABYLON.Plane(0, -1, 0, 3);
var water = new BABYLON.Mesh.CreatePlane("water", 95, scene);
    water.rotation.x = Math.PI/2;
    water.position.y = 3;
    water.material = waterMaterial;
    water.position.x = -190;
    water.position.z = 105;

// pylon
var boxx = new Array(8);
    boxx[0] = new BABYLON.Mesh.CreateBox("boxx", 3, scene);
    boxx[0].scaling.y =    10;
    boxx[0].position.y =   15;
    boxx[0].position.z =   32;
    boxx[0].material = materialbox3;
    boxx[1] = boxx[0].clone();
    boxx[1].position.z =  -32;
    boxx[2] = boxx[0].clone();
    boxx[2].position.x = -220;
    boxx[3] = boxx[1].clone();
    boxx[3].position.x = -220;
    boxx[4] = boxx[0].clone();
    boxx[4].position.x = -100;
    boxx[5] = boxx[1].clone();
    boxx[5].position.x = -100;
    // bridge point 1
    boxx[6] = boxx[1].clone();
    boxx[6].position.x = -150;
    boxx[6].position.z =  210;
    boxx[6].position.y =   37;
    // bridge point 2
    boxx[7] = new BABYLON.Mesh.CreateBox("boxx", 6, scene);
    boxx[7].material = materialbox3;
    boxx[7].scaling.y =     2;
    boxx[7].position.x =  -40;
    boxx[7].position.z =   73;
    boxx[7].position.y =   17;
    boxx[7].rotation.y = Math.PI/4;
// canon box
for (var i = 0; i < boxx.length; i++) {
    b22[i].position.set(boxx[i].position.x, boxx[i].position.z, boxx[i].position.y);
}

// boxes
var wbox = new Array(wb.length);
    wbox[0] = new BABYLON.Mesh.CreateBox("box1", 10, scene);
    wbox[0].material = materialbox;
for (var i = 1; i < wb.length; i++) {
    wbox[i] = new BABYLON.Mesh.CreateBox("wbox1", 6, scene);
    wbox[i].material = materialbox4;
}

// bridge
var bridge1 = new BABYLON.Mesh.CreateBox("bridge1", 1, scene);
    bridge1.scaling = new BABYLON.Vector3(170, 2, 10);
    bridge1.material = materialbox3;
    bridge1.visibility = 1;
    // position + rotation from cannon
    bridge1.position = new BABYLON.Vector3(br.position.x, br.position.z, br.position.y);
    bridge1.rotationQuaternion = new BABYLON.Quaternion(br.quaternion.x, br.quaternion.z, br.quaternion.y, -br.quaternion.w);

// border
var bord = new Array(bor.length);
    bord[0] = new BABYLON.Mesh.CreateBox("bord1", 1, scene);
    bord[0].scaling = new BABYLON.Vector3(602, 10, 2);
    bord[0].visibility = 0.3;
    bord[0].material = materialbox2;
    bord[1] = bord[0].clone();
    bord[2] = bord[0].clone();
    bord[3] = bord[0].clone();
for (i = 0; i < bor.length; i++) {
    bord[i].position = new BABYLON.Vector3(bor[i].position.x, bor[i].position.z - 50, bor[i].position.y);
    bord[i].rotationQuaternion = new BABYLON.Quaternion(bor[i].quaternion.x, bor[i].quaternion.z, bor[i].quaternion.y, -bor[i].quaternion.w);
}

// ramp
var ramp1 = new BABYLON.Mesh.CreateBox("ramp1", 1, scene);
    ramp1.scaling = new BABYLON.Vector3(40, 40, 20);
    ramp1.material = materialbox3;
    ramp1.visibility = 0.5;
    // position + rotation from cannon
    ramp1.position = new BABYLON.Vector3(r1.position.x, r1.position.z, r1.position.y);
    ramp1.rotationQuaternion = new BABYLON.Quaternion(r1.quaternion.x, r1.quaternion.z, r1.quaternion.y, -r1.quaternion.w);

// car chassis
var chassis = new BABYLON.Mesh.CreateBox("chassis", 1, scene, false);
    chassis.visibility = 0;
var chassis_a = new BABYLON.Mesh.CreateCylinder("chassis_a", 1, 1, 1, 30, scene, false);
    chassis_a.scaling = new BABYLON.Vector3(6.75, 1, 3);
    chassis_a.visibility = 0.75;
    chassis_a.parent = chassis;
    chassis_a.position.y = 0.2;
    chassis_a.material = materialbox4;
var chassis_b = new BABYLON.Mesh.CreateBox("chassis_b", 1, scene, false);
    chassis_b.visibility = 1;
    chassis_b.parent=chassis_a;
    chassis_b.position.y=-0.2;
    chassis_b.scaling = new BABYLON.Vector3(0.85, 0.1, 0.75);
    chassis_b.material = materialbox3;
var chassis_bb = new BABYLON.Mesh.CreateBox("chassis", 1, scene, false);
    chassis_bb.visibility = 0;
    chassis_bb.scaling = new BABYLON.Vector3(7.5, 2, 5);
    chassis_bb.parent=chassis;

// car axis
var axis1 = new BABYLON.Mesh.CreateCylinder("axis", 4.5, 0.3, 0.3, 20, scene);
    axis1.parent = chassis;
    axis1.rotation.x = Math.PI / 2;
    axis1.position.x = 2.75;
    axis1.material = materialbox3;
var axis2 = axis1.clone();
    axis2.parent = chassis;
    axis2.position.x = -2.75;

// car wheels
var wheelfl = new BABYLON.Mesh.CreateSphere("wheel", 20, 1, scene, false);
    wheelfl.parent = chassis;
    wheelfl.position.x = 2.75;
    wheelfl.position.z = 2.25;
    wheelfl.visibility = 0.7;
    wheelfl.material = materialbox4;
var wheelfl_x = new BABYLON.Mesh.CreateTorus("wheel_x", 1.35, 0.9, 30, scene, false);
    wheelfl_x.rotation.z = Math.PI / 2;
    wheelfl_x.rotation.y = Math.PI / 2;
    wheelfl_x.parent = wheelfl;
    wheelfl_x.material = materialbox;

var wheelfr = wheelfl.clone();
    wheelfr.parent = chassis;
    wheelfr.position.z = -2.25;
var wheelfr_x = wheelfl_x.clone();
    wheelfr_x.parent = wheelfr;
    wheelfr_x.rotation.y = Math.PI * 1.5;

var wheelrl = wheelfl.clone();
    wheelrl.parent = chassis;
    wheelrl.position.x = -2.75;
var wheelrl_x = wheelfl_x.clone();
    wheelrl_x.parent = wheelrl;

var wheelrr = wheelrl.clone();
    wheelrr.parent = chassis;
    wheelrr.position.z = -2.25;
var wheelrr_x = wheelfr_x.clone();
    wheelrr_x.parent = wheelrr;

// water renderlist
waterMaterial.reflectionTexture.renderList =
    [skybox, bridge1, ground, chassis_a, chassis_b, wheelfl_x, wheelfr_x, wheelrl_x, wheelrr_x, axis1,
     axis2, boxx[2], boxx[3], boxx[4], boxx[5], boxx[6], boxx[7]];
    for (var i = 0; i < wbox.length; i++) {
        waterMaterial.reflectionTexture.renderList.push(wbox[i]);
    }

// Palms
var treebox=new Array(xxtree);
var spriteManagerTrees = new BABYLON.SpriteManager("treesManagr", "carx/palm1.png", xxtree, 400, scene);
for (var i = 0; i < xxtree-5; i++) {
    var tree = new BABYLON.Sprite("tree", spriteManagerTrees);
        tree.position.x = Math.random() * 500 - 280;
        tree.position.z = Math.random() * 250 - 280;
        tree.position.y = 6;
        tree.size = 20;
    // for collision
    treebox[i] = BABYLON.Mesh.CreateCylinder("treebox", 18, 0.7, 0.7, 20, scene);
    treebox[i].material = materialbox2;
    treebox[i].position.x = tree.position.x;
    treebox[i].position.z = tree.position.z;
    treebox[i].visibility = 1;
    b2[i].position.set(treebox[i].position.x, treebox[i].position.z, 5); // cannon-box
}
// palms water
var seetreex = [-230, -185, -150, -220, -200];
var seetreez = [  60,  105,   50,  150,   45];
for (var i = xxtree-5; i < xxtree; i++) {
    var tree = new BABYLON.Sprite("tree", spriteManagerTrees);
        tree.position.x = seetreex[i-(xxtree-5)];
        tree.position.z = seetreez[i-(xxtree-5)];
        tree.position.y = 6;
        tree.size = 20;
    // for collision
    treebox[i] = BABYLON.Mesh.CreateCylinder("treebox", 18, 0.7, 0.7, 20, scene);
    treebox[i].material = materialbox2;
    treebox[i].position.x = tree.position.x;
    treebox[i].position.z = tree.position.z;
    treebox[i].visibility = 1;
    b2[i].position.set(treebox[i].position.x, treebox[i].position.z, 5); // cannon-box
}

// Shadows
var shadowGenerator = new BABYLON.ShadowGenerator(2048, light01);
    shadowGenerator.getShadowMap().renderList.push(
        chassis_a, wheelfl_x, wheelfr_x, wheelrl_x, wheelrr_x, axis1, axis2, chassis_b, bridge1,
        boxx[0], boxx[1], boxx[2], boxx[3], boxx[4], boxx[5], boxx[6], boxx[7]);
    for (var i = 0; i < wbox.length; i++) {
        shadowGenerator.getShadowMap().renderList.push(wbox[i]);
    }
    shadowGenerator.useVarianceShadowMap = true;

// variables
var wheels = [wheelfl_x, wheelfr_x, wheelrl_x, wheelrr_x],
    hhh =        new Array(4),
    carflight = new Array(4),
    dyn = 0.0, bottom = 0.0, aroll = 0.0, roll = 0.0, apitch = 0.0, pitch = 0.0,
    xx = 0.0, yy = 0.0, zz = 0.0, ww = 0.0, hh = 0.0;
    norm = 1, up = 0, bridge_c = 0, ramp_c = false,
    chassis.rotationQuaternion = new BABYLON.Quaternion(0,0,0,0);

// start position + parameter
var v =    -20.0,
    lenk =  -0.3;
tx.position.z = 0;
tx.position.x = 220;
tx.position.y = 0;

// Multiplying Quat f with q - cannon-quats x,z,y,w
multiquat = function(f, rev, q) {
    return new BABYLON.Quaternion( -f.w*rev *  q.x + f.x * -q.w + f.z * q.y - f.y * q.z,
	                 	   -f.w*rev *  q.z + f.z * -q.w + f.y * q.x - f.x * q.y,
	                  	   -f.w*rev *  q.y + f.y * -q.w + f.x * q.z - f.z * q.x,
	                  	   -f.w*rev * -q.w - f.x *  q.x - f.z * q.z - f.y * q.y );
};

// Camera constraints
var camerasBorderFunction = function () {
    // Target
    camera1.target = chassis.position;
    // Angle
    if (camera1.beta < 0.1)
        camera1.beta = 0.1;
        else if (camera1.beta > (Math.PI / 2) * 0.9)
            camera1.beta = (Math.PI / 2) * 0.9;
    // Zoom
    camera1.radius = 12 + 2 * Math.abs(-v / 5);
    // Alpha
    // camera1.alpha = -chassis.rotationQuaternion.toEulerAngles().y - Math.PI;
};
//////////////////////////////////////////////////   register before render   /////////////////////////////////////////////////////

scene.registerBeforeRender(camerasBorderFunction);

scene.registerBeforeRender(function() {

//////////////////////////////////////////////////////// isReady ////////////////////////////////////////////////////////////////
if (scene.isReady()) {

// Sky-Animation
    skybox.rotation.y += 0.0001 * scene.getAnimationRatio();

// ray-casting reverse driving
var ray1 = scene.pickWithRay(new BABYLON.Ray(chassis_a.getAbsolutePosition(), new BABYLON.Vector3(0, -1, 0)));
if (ray1.pickedMesh != null)
    if (ray1.pickedMesh.name == "chassis_b") norm = 1; else if (ray1.pickedMesh.name == "chassis") norm = -1;

// accelerate
if (keys.forward == 1 && v > -40) {
    dyn += 0.01;
    v -= (0.2 + dyn);
    // acceleration pitch
    if (v < 0 || norm == 1) apitch = Math.min(0.012, Math.abs(v/300)) * norm;
}
if (keys.back == 1 && v < 40) {
    dyn += 0.01;
    v += (0.2 + dyn);
    // acceleration pitch
    if (v < 0 || norm == -1) apitch = Math.max(-0.012, -Math.abs(v/300)) * norm;
}

// rolling
if (keys.forward == 0 && keys.back == 0) {
    dyn = 0; apitch = 0;
    if (v < -0.25) v += 0.25; else if (v > 0.25) v -= 0.25; else v = 0;
}

// steering
if (keys.left == 1 && lenk >= -0.3) {
    lenk -= 0.015;
}
if (keys.right == 1 && lenk <= 0.3) {
    lenk += 0.015;
}
if (keys.left == 0 && keys.right == 0) {
    if (lenk <- 0.01) lenk += 0.005; else if (lenk > 0.01) lenk -= 0.005; else lenk = 0;
}

// acceleration + steering roll
aroll = (-lenk/ 200) * Math.abs(v);

// perspective
if (keys.left == 1 && keys.right == 1) {
camera1.alpha = -chassis.rotationQuaternion.toEulerAngles().y - Math.PI;
}

// ray-casting wheels
bridge_c = 0; ramp_c = false;
for(var i = 0; i < wheels.length; i++) {
    hhh[i] = 0;
    carflight[i] = 0;
    up = 0;
    var ray = ground.intersects(new BABYLON.Ray(wheels[i].getAbsolutePosition(), new BABYLON.Vector3(0, -1, 0)));
    if ( !ray.hit ) {var ray = ground.intersects(new BABYLON.Ray(wheels[i].getAbsolutePosition(), new BABYLON.Vector3(0, 1, 0)));up = 1;}
    if (  ray.hit ) {
        hhh[i] = ray.pickedPoint.y;
        if (up == 0) carflight[i] = ray.distance;
    }
    if (bridge1.intersectsMesh(wheels[i], true)) bridge_c += 1;
    if (ramp1.intersectsMesh(wheels[i], true)) ramp_c = true;
}

// ray-casting wboxes
for(var i = 0; i < wbox.length; i++) {
    var ray = ground.intersects(new BABYLON.Ray(wbox[i].position, new BABYLON.Vector3(0, -1, 0)));
        if ( !ray.hit ) var ray = ground.intersects(new BABYLON.Ray(wbox[i].position, new BABYLON.Vector3(0, 1, 0)));
        if (  ray.hit ) {
            if (ray.pickedPoint.y > 0.01)
                wbu[i].position.set(wb[i].position.x, wb[i].position.y, ray.pickedPoint.y - 0.5);
        }
}

// little heightmap physics
if ( bridge_c < 2 && (Math.min.apply(Math, carflight) < 4 || ramp_c) ) {
    // wheel diffs right/left front/rear
    if (Math.abs(hhh[0] - hhh[1]) < Math.abs(hhh[2] - hhh[3]))
        roll = (hhh[0] - hhh[1]);
        else
        roll = (hhh[2] - hhh[3]);
    pitch = Math.max(hhh[0], hhh[1]) - Math.max(hhh[2], hhh[3]);

    // roll + pitch heightmap
    xx = -Math.atan(aroll + roll/ 4 / 2) * norm; // roll
    yy = 0;
    zz = Math.atan(apitch + pitch/ 5 / 2) * norm; // pitch
    ww = 1;

    // rollback heightmap
    if (Math.abs(axis1.getAbsolutePosition().y-axis2.getAbsolutePosition().y) > 0.5 && Math.abs(v) < 40)
        v += (axis1.getAbsolutePosition().y-axis2.getAbsolutePosition().y) / 4 * norm;

    // chassis-height heightmap
    hh = (Math.abs(pitch) - Math.abs(roll)) / 2;

    } else {
    xx = 0;
    zz = 0;
    yy = 0;
    ww = 1;
    hh = 0;
}

// virtual-ground-level heightmap
bottom = Math.min( Math.max( hhh[0], hhh[1]), Math.max(hhh[2], hhh[3]) );

// collisions change v
for (var i = 0; i < treebox.length; i++) {
    if (treebox[i].intersectsMesh(chassis_bb, true)) {
        if (v < -5) v = -v - 1; else if (v > 5) v = -v + 1;
        break;
    }
}
for (var i = 0; i < boxx.length; i++) {
    if (boxx[i].intersectsMesh(chassis_bb, true)) {
        if (v < -5) v = -v - 1; else if (v > 5) v = -v + 1;
        break;
    }
}

//////////////////////////////////////////////////////////////// cannon physics ////////////////////////////////////////////////////////
    // update canon physics : velocity & steering
    frontLeftHinge.motorTargetVelocity =   v;
    frontRightHinge.motorTargetVelocity = -v;
    leftFrontAxis =  new CANNON.Vec3( lenk,  1 - Math.abs(lenk), 0);
    rightFrontAxis = new CANNON.Vec3(-lenk, -1 + Math.abs(lenk), 0);
    world.constraints[0] = new CANNON.HingeConstraint(tx, new CANNON.Vec3( 2.75, 1.75, 0), leftFrontAxis,  leftFrontWheel,  zero, leftAxis );
    world.constraints[1] = new CANNON.HingeConstraint(tx, new CANNON.Vec3( 2.75,-1.75, 0), rightFrontAxis, rightFrontWheel, zero, rightAxis);

    // cannon-phys virtualground car - heightmap
    if (bottom > 0.01) bu.position.set(tx.position.x, tx.position.y, bottom-4);

    // cannon-worldstep
    for (var i = 0; i < worldstep; ++i) {
        world.step(timeStep);
    }

    // update babylon / cannon positions + rotations
    // chassis position
    chassis.position = new BABYLON.Vector3( tx.position.x, tx.position.z + hh, tx.position.y);
    // chassis rotation - add heightmap roll + pitch
    chassis.rotationQuaternion = multiquat( tx.quaternion, 1, new BABYLON.Quaternion(xx, zz, yy, -ww));
    // wheel-rotation (position + roll + pitch inherit from chassis)
    wheelfl.rotationQuaternion = multiquat( tx.quaternion, -1, leftFrontWheel.quaternion );
    wheelfr.rotationQuaternion = multiquat( tx.quaternion, -1, rightFrontWheel.quaternion);
    wheelrl.rotationQuaternion = multiquat( tx.quaternion, -1, leftRearWheel.quaternion  );
    wheelrr.rotationQuaternion = multiquat( tx.quaternion, -1, rightRearWheel.quaternion );
    // boxes
    for (var i = 0; i < wb.length; i++) {
        wbox[i].position = new BABYLON.Vector3(wb[i].position.x, wb[i].position.z, wb[i].position.y);
        wbox[i].rotationQuaternion = new BABYLON.Quaternion(wb[i].quaternion.x, wb[i].quaternion.z, wb[i].quaternion.y, -wb[i].quaternion.w);
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

} // isReady

}); // registerBeforeRender

return scene;

}; // createScene

/////////////////////////////////// window.onload ////////////////////////////////
window.onload = function() {
    var canvas = document.getElementById("canvas");

    // Check support
    if (!BABYLON.Engine.isSupported()) {
        // window.alert('Browser not supported');
    } else {
        // Babylon
        var engine = new BABYLON.Engine(canvas, true);

        //Creating scene
        scene = createSceneCar(engine);

        //Validating
        scene.activeCamera.attachControl(canvas);

        // Render loop
        engine.runRenderLoop(function () {
            scene.render();
        });

        // Resize
        window.addEventListener("resize", function () {
            engine.resize();
        });
    }
};
