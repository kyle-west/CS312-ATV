function Position(x=0,y=0,z=0) {
   this.x = x;
   this.y = y;
   this.z = z;
}
Position.prototype = {
   constructor: Position
};

function Size(l=20,w=20,h=20) {
   this.length = l;
   this.width  = w;
   this.height = h;
}
Size.prototype = {
   constructor: Size
};



function Rand(min,max) {
   return Math.floor((Math.random() * max) + min);
}
