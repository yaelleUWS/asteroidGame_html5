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
		this.game.load.image("score", "sprites/game/coin.png");
		this.game.load.image("empty_healthbar", "sprites/game/empty_healthbar.gif");
		this.game.load.image("full_healthbar", "sprites/game/full_healthbar.png");

		// Game assets
		this.game.load.image('bg', 'sprites/game/bgGame.png');
		this.game.load.image('grey', 'sprites/game/grey.png');
		this.game.load.image('red', 'sprites/game/red.gif');
		this.game.load.image('green', 'sprites/game/green.gif');
		this.game.load.image('blue', 'sprites/game/blue.gif');
		this.game.load.image('yellow', 'sprites/game/yellow.gif');
		this.game.load.image('orange', 'sprites/game/orange.gif');
		this.game.load.image('purple', 'sprites/game/purple.gif');
		this.game.load.image('brown', 'sprites/game/brown.gif');

		this.game.load.image('bullet', 'sprites/game/fireball.png');


	    this.game.load.spritesheet('planet', 'sprites/game/planetSprites.png', 610, 658);

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