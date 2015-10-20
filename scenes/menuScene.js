var menu = function(game){
	console.log("%cStarting menu scene", "color:black; background:green");

	settingsOpened = false;
	infoOpened = false;
	badgesOpened = false;
	leaderBoardOpen = false;

	var infoButton;
	var badgesButton;
	var leaderBoardButton;
	var infoPanel;
	var badgesPanel;
	var leaderBoardPanel;

	var gold_medal;
	var silver_medal;
	var bronze_medal;
	var expert_time;
	var master_time;
	var novice_time;
	var effort; 
	var performance;

	session = {};
};
  
menu.prototype = {
	init: function(sessionReceived) {
		session = sessionReceived;
	},
	create: function(){
  		this.game.add.sprite(0, 0, 'menu_bg');
    	var gameTitle = this.game.add.sprite(400,70,"gametitle");
		gameTitle.anchor.setTo(0.5,0.5);

		// settings options
		var settingsButton = this.game.add.button(50,400,"btn_settings",this.toggleSettings,this);
		settingsButton.anchor.setTo(0.5,0.5);

		var gameButton = this.game.add.button(400,250,"btn_play",this.startGame,this);
		gameButton.anchor.setTo(0.5,0.5);

		infoPanel= this.game.add.group();
		badgesPanel= this.game.add.group();
		leaderBoardPanel= this.game.add.group();

		// create panel about based on EngAGe data
		var menu = this;
		session.getGameDesc()
		.done(
		    function(gameDesc){
		        menu.createPanelAbout(gameDesc["name"], gameDesc["description"]);
		    }
		);

		// badges panel
		session.getBadges()
		.done(
		    function(badges){
		        menu.createPanelBadges(badges);
		    }
		);

		// leaderboard panel
		session.getLeaderboard(10)
		.done(
			function(leaderboard){
		        menu.createPanelLeaderboard(leaderboard["eu_score"]);
		    }
		);	
	},
	updateBadges: function(badges) {
		for (var i = 0 ; i < badges.length ; i++)
		{
			if (badges[i]["earned"])
			{
				switch(badges[i]["name"]) {
					case "gold_medal":
						gold_medal.loadTexture(badges[i]["name"], 0);
						break;
					case "silver_medal":
						silver_medal.loadTexture(badges[i]["name"], 0);
						break;
					case "bronze_medal":
						bronze_medal.loadTexture(badges[i]["name"], 0);
						break;
					case "expert_time":
						expert_time.loadTexture(badges[i]["name"], 0);
						break;
					case "master_time":
						master_time.loadTexture(badges[i]["name"], 0);
						break;
					case "novice_time":
						novice_time.loadTexture(badges[i]["name"], 0);
						break;
					case "effort":
						effort.loadTexture(badges[i]["name"], 0);
						break;
					case "performance":
						performance.loadTexture(badges[i]["name"], 0);
						break;						
				}
			}
		}
	},
	createPanelAbout: function(name, gameDesc) {
		panel = infoPanel.create(400,225,"panel");
		panel.anchor.setTo(0.5,0.5);

		title_info = new Phaser.Text(this.game, 400, 90, "About - " + name, {fill: '#FFFFFF'});
		title_info.anchor.setTo(0.5,0.5);
		infoPanel.add(title_info);

		txt_info = new Phaser.Text(this.game, 400, 120, gameDesc, {font: '15pt Arial', wordWrap: true, wordWrapWidth: '500'});
		txt_info.anchor.setTo(0.5,0);
		infoPanel.add(txt_info);

		infoPanel.visible = false;
	},
	createPanelBadges: function(badges) {
		panel = badgesPanel.create(400,240,"panel");
		panel.anchor.setTo(0.5,0.5);
		panel.scale.setTo(1, 1.1);

		title_badges = new Phaser.Text(this.game, 400, 90, "Badges", {fill: '#FFFFFF'});
		title_badges.anchor.setTo(0.5,0.5);
		badgesPanel.add(title_badges);

		// set all badges locked
		gold_medal = badgesPanel.create(230,170,"badgeLocked");
		gold_medal.anchor.setTo(0.5,0.5);
		silver_medal = badgesPanel.create(400,170,"badgeLocked");
		silver_medal.anchor.setTo(0.5,0.5);
		bronze_medal = badgesPanel.create(570,170,"badgeLocked");
		bronze_medal.anchor.setTo(0.5,0.5);

		var title_badge = new Phaser.Text(this.game, 230, 220, "Gold medal", {font: '13pt Arial', fill: '#FFFFFF'});
		title_badge.anchor.setTo(0.5,0.5);
		badgesPanel.add(title_badge);
		title_badge = new Phaser.Text(this.game, 400, 220, "Silver medal", {font: '13pt Arial', fill: '#FFFFFF'});
		title_badge.anchor.setTo(0.5,0.5);
		badgesPanel.add(title_badge);
		title_badge = new Phaser.Text(this.game, 570, 220, "Bronze medal", {font: '13pt Arial', fill: '#FFFFFF'});
		title_badge.anchor.setTo(0.5,0.5);
		badgesPanel.add(title_badge);
		
		effort = badgesPanel.create(315,260,"badgeLocked");
		effort.anchor.setTo(0.5,0.5);
		performance = badgesPanel.create(495,260,"badgeLocked");
		performance.anchor.setTo(0.5,0.5);
		
		title_badge = new Phaser.Text(this.game, 315, 310, "Effort", {font: '13pt Arial', fill: '#FFFFFF'});
		title_badge.anchor.setTo(0.5,0.5);
		badgesPanel.add(title_badge);
		title_badge = new Phaser.Text(this.game, 495, 310, "Performance", {font: '13pt Arial', fill: '#FFFFFF'});
		title_badge.anchor.setTo(0.5,0.5);
		badgesPanel.add(title_badge);

		expert_time = badgesPanel.create(230,350,"badgeLocked");
		expert_time.anchor.setTo(0.5,0.5);
		master_time = badgesPanel.create(400,350,"badgeLocked");
		master_time.anchor.setTo(0.5,0.5);
		novice_time = badgesPanel.create(570,350,"badgeLocked");
		novice_time.anchor.setTo(0.5,0.5);
		
		title_badge = new Phaser.Text(this.game, 230, 400, "Expert", {font: '13pt Arial', fill: '#FFFFFF'});
		title_badge.anchor.setTo(0.5,0.5);
		badgesPanel.add(title_badge);
		title_badge = new Phaser.Text(this.game, 400, 400, "Master", {font: '13pt Arial', fill: '#FFFFFF'});
		title_badge.anchor.setTo(0.5,0.5);
		badgesPanel.add(title_badge);
		title_badge = new Phaser.Text(this.game, 570, 400, "Novice", {font: '13pt Arial', fill: '#FFFFFF'});
		title_badge.anchor.setTo(0.5,0.5);
		badgesPanel.add(title_badge);

		this.updateBadges(badges);
		badgesPanel.visible = false;
	},
	createPanelLeaderboard: function(leaderboard) {		
		panel = leaderBoardPanel.create(400,225,"panel");
		panel.anchor.setTo(0.5,0.5);

		title = new Phaser.Text(this.game, 400, 90, "Leaderboard", {fill: '#FFFFFF'});
		title.anchor.setTo(0.5,0.5);
		leaderBoardPanel.add(title);

		var txt_leaderboard = "";
		for (var i=0 ; i < leaderboard.length ; i++)
		{
			txt_leaderboard += leaderboard[i]["name"] + " - " + leaderboard[i]["score"] + "\n";
		}

		txt_info = new Phaser.Text(this.game, 400, 120, txt_leaderboard, {font: '15pt Arial', wordWrap: true, wordWrapWidth: '500'});
		txt_info.anchor.setTo(0.5,0);
		leaderBoardPanel.add(txt_info);

		leaderBoardPanel.visible = false;
	},
	toggleSettings: function(){
		if (!settingsOpened)
		{
			infoButton = this.game.add.button(50,250,"btn_info",this.toggleInfo,this);
			infoButton.anchor.setTo(0.5,0.5);
			badgesButton = this.game.add.button(50,300,"btn_badges",this.toggleBadges,this);
			badgesButton.anchor.setTo(0.5,0.5);
			leaderBoardButton = this.game.add.button(50,350,"btn_leaderboard",this.toggleLeaderBoard,this);
			leaderBoardButton.anchor.setTo(0.5,0.5);
			settingsOpened = true;
		}
		else
		{
			settingsOpened = false;
			infoButton.kill();
			badgesButton.kill();
			leaderBoardButton.kill();
		}
	},
	toggleInfo: function(){
		if (!infoOpened)
		{
			// close other panels
			badgesPanel.visible = false;
			badgesOpened = false;
			leaderBoardPanel.visible = false;
			leaderBoardOpen = false
			infoPanel.visible = true;

			infoOpened = true;
		}
		else
		{
			infoOpened = false;
			infoPanel.visible = false;
		}
	},
	toggleBadges: function(){
		if (!badgesOpened)
		{
			// close other panels
			infoPanel.visible = false;
			infoOpened = false;
			leaderBoardPanel.visible = false;
			leaderBoardOpen = false
			badgesPanel.visible = true;			

			badgesOpened = true;
		}
		else
		{
			badgesOpened = false;
			badgesPanel.visible = false;
		}
	},
	toggleLeaderBoard: function(){
		if (!leaderBoardOpen)
		{
			// close other panels
			infoPanel.visible = false;
			infoOpened = false;
			badgesPanel.visible = false;
			badgesOpened = false;
			leaderBoardPanel.visible = true;
			
			leaderBoardOpen = true;
		}
		else
		{
			leaderBoardOpen = false;
			leaderBoardPanel.visible = false;
		}
	},
	startGame: function(){

		var menu = this;
		session.startGameplay()
	    .done(function(gp){ 
	    	var gameplay = gp;
	    	menu.game.state.start("Game", true, false, session, gameplay);
	    })
	    .fail(function(msg){ console.log(msg);})

	}
}