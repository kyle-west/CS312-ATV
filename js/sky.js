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
   // Set up mesh and material
   var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
   var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);

   // configure material to match our needs
   skyboxMaterial.backFaceCulling = false;
   skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
      "assets/textures/dark/dark", scene
   );
   skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
   skyboxMaterial.disableLighting = true;

   // assign material and repostion box
   skybox.material = skyboxMaterial;
   skybox.position.y = -100;

   return skybox;
}
