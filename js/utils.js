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
