/****************************************************************
* Skybox for the scene
* loads skyBox images named accordingly:
*    [image name]_nx.jpg --> the LEFT side
*    [image name]_ny.jpg --> the BOTTOM side
*    [image name]_nz.jpg --> the BACK side
*    [image name]_px.jpg --> the RIGHT side
*    [image name]_py.jpg --> the TOP side
*    [image name]_pz.jpg --> the FRONT side
****************************************************************/
function setUpSky(scene) {
   var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
   var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
   skyboxMaterial.backFaceCulling = false;
   skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/dark/dark", scene);
   skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
   skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
   skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
   skyboxMaterial.disableLighting = true;
   skybox.material = skyboxMaterial;
   skybox.position.y = -100;
   return skybox;
}
