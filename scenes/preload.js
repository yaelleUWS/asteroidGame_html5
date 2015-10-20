var preload = function(game){	
	console.log("%c Preloading game", "color:black; background:yellow");
}
 
preload.prototype = {
	preload: function(){ 
        var loadingBar = this.add.sprite(160,240,"loading");
        loadingBar.anchor.setTo(0.5,0.5);
        this.load.setPreloadSprite(loadingBar);

		// GUI
        this.game.load.image("menu_bg","sprites/bgMenu.png"); 
        this.game.load.image("gametitle","sprites/titleGreen.png"); 

        this.game.load.image("btn_play", "sprites/btn_play.png");
		this.game.load.image("btn_start", "sprites/btn_start.png");
		this.game.load.image("btn_login", "sprites/btn_login.png");
		this.game.load.image("btn_guest", "sprites/btn_guestLogin.png");
		this.game.load.image("btn_menu", "sprites/btn_goToMenu.png");

		this.game.load.image("btn_settings", "sprites/btn_settings.png");
		this.game.load.image("btn_info", "sprites/btn_info.png");
		this.game.load.image("btn_leaderboard", "sprites/btn_leaderboard.png");
		this.game.load.image("btn_badges", "sprites/btn_badges.png");

		this.game.load.image("panel", "sprites/panel.png");

		// badges
		this.game.load.image("badgeLocked", "sprites/badges/lock_BW.png");

		// scores		
		this.game.load.image("eu", "sprites/game/coin.png");

		// Game assets
		this.game.load.image('bgAll', 'sprites/game/bgGame.png');
		this.game.load.image('bgAll', 'sprites/game/grey.png');
		this.game.load.image('bgAll', 'sprites/game/red.gif');
		this.game.load.image('bgAll', 'sprites/game/green.gif');
		this.game.load.image('bgAll', 'sprites/game/blue.gif');
		this.game.load.image('bgAll', 'sprites/game/yellow.gif');
		this.game.load.image('bgAll', 'sprites/game/orange.gif');
		this.game.load.image('bgAll', 'sprites/game/purple.gif');
		this.game.load.image('bgAll', 'sprites/game/brown.gif');


	    this.game.load.spritesheet('mouse', 'sprites/game/planetSprites.png', 610, 658);

	    this.loadBadges();

	},
  	create: function(){
		this.game.state.start("Login");
	},
	loadBadges: function(){
		for (var i = 0 ; i < listBadges.length ; i++)
		{
			this.game.load.image(listBadges[i], 'sprites/badges/' + listBadges[i] + '.png');
		}
	}
}