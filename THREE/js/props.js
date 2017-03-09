/*************************************************************
* Just a simple wall
*************************************************************/
function Wall(size,pos,rot,col = 0xffffff,img = textures+'brick_simple.jpg') {
   var geometry = new THREE.BoxGeometry(size.length, size.height, size.width);
   var texture = THREE.ImageUtils.loadTexture(img);
   texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
   texture.repeat.set( size.length/50,size.height/25);
   var material = new THREE.MeshPhongMaterial({
      map: texture,
      color: col
   });
   var wall = new Physijs.BoxMesh(geometry, material, 0);
   wall.position.set(pos.x,pos.y+size.height/2,pos.z);
   wall.rotation.y = rot;
   wall.castShadow = true;
   return wall;
}

Wall.prototype = {
   constructor: Wall
};



/*************************************************************
* A simple crate
*************************************************************/
function Crate(pos = new Position(0,0,0),size = new Size(30,30,30),rot = 0,t, mass = 100) {
   if (!size) size = new Size(30,30,30);
   if (!t) t = textures+'crate1.jpg';

   var geometry = new THREE.BoxGeometry(size.length, size.height, size.width);
   var texture = THREE.ImageUtils.loadTexture(t);
   var material = new THREE.MeshPhongMaterial({
      map: texture
   });
   var crate = new Physijs.BoxMesh(geometry, material , mass);
   crate.position.set(pos.x,pos.y+size.height/2,pos.z);
   crate.rotation.y = rot;
   crate.castShadow = true;
   return crate;
}
Crate.prototype = {
   constructor: Crate
};
