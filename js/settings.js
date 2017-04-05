/*******************************************************************
* Settings.js is the file where we store global flags for the game.
*******************************************************************/

/**************************************************
* our options set for settings to select from
**************************************************/
const OPTIONS = {
   // Mute or no?
   sound : {
      OFF : false,
      ON  : true
   },

   // this is our free camera / FP player mode switch
   game : {
      DEV : false,
      PLAY: true
   }
};


/**************************************************
* Set the Gobal settings
**************************************************/
var SETTINGS = {
   sound : OPTIONS.sound.ON,
   game  : OPTIONS.game.DEV
};
