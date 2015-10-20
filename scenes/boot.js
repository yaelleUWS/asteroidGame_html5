var boot = function(game){
	console.log("%c Booting game", "color:white; background:blue");
};
  
boot.prototype = {
	preload: function(){
        this.game.load.image("loading","sprites/loading.png"); 
	},
  	create: function(){
		this.game.state.start("Preload");
	}
}