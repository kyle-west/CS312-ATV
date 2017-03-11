/**********************************************************
* Random Integer function returns int between min and max
* @param pos_neg, returns a random positive or negative value
**********************************************************/
function random(min, max, pos_neg = false) {
   var d = 1;// direction
   var val = Math.floor(Math.random() * max);
   if (pos_neg) {
      d = Math.pow(-1, val);
   }
   return d*val;
}

/**********************************************************
* Fix height
**********************************************************/
function fixHeight(mesh) {
   var lowermesh;
   var grid = { x : 0, z : 0 };

   var dx = 1;
   var dz = 1;
   if (mesh.position.x > 0) dx = -1;
   if (mesh.position.z > 0) dz = -1;


   grid.x = Math.floor((mesh.position.x + 475*dx) / 950);
   grid.z = Math.floor((mesh.position.z + 475*dz) / 950);
   console.info("Mesh '"+mesh.name+"' found on ground <"+grid.x+","+grid.z+">");
   // lowermesh = scene.getMeshByID("ground <"+grid.x+","+grid.z+">");
   // var safety = 1;
   // if (lowermesh) {
   //    while (lowermesh.intersectsMesh(mesh,false) && (safety < 50)) {
   //       mesh.position.y += 1;
   //       safety++;
   //    }
   //    if (safety == 50) console.error("exited via safety on "+mesh.name);
   // }
}
