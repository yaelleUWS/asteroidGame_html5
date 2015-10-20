var eumouse = function(game){	
	console.log("%c Starting game scene", "color:white; background:green");
   
    var euScore;   
    var score;   
    var lives;   

    var numBg;

    var countryIndex;

    var countries;
    var ground;

    var scores;
    var euScoreText;
    var scoreText;
    
    var livesScore1;
    var livesScore2;
    var livesScore3;
    var livesScore4;
    var livesScore5;

    var gameOverPanel;

    var isGameOver;

    session = {};
    var gameplay;

    speedSlow = 1;

    countriesFound = [];
};
 
eumouse.prototype = {
    init: function(sessionReceived, gameplayReceived) {
        gameplay = gameplayReceived;
        session = sessionReceived;
    },
  	create: function() {
        isGameOver = false;

        // *** feedback panel ***
        $("#feedback").empty();


        // *** physics system ***
        this.game.physics.startSystem(Phaser.Physics.ARCADE);


        // *** A background for our game ***
        this.stage.backgroundColor = '#6bf';
        numBg = 1;

        tilesprite = this.game.add.tileSprite(0, 0, 800, 450, 'bgAll');
        tilesprite.fixedToCamera = true;


        // ***  The ground ***
        platforms = this.game.add.group();
        platforms.enableBody = true;
        ground = platforms.create(0, 425, 'ground');
        ground.scale.setTo(2, 2);
        ground.body.immovable = true;


        // *** The player ***
        player = this.game.add.sprite(120, 300, 'mouse');
        player.anchor.setTo(0.5,0.5);
        player.scale.setTo(0.6);
        this.game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        player.body.gravity.y = 300;

            //  Player's animations
        player.animations.add('stand', [4], 10, true);
        player.animations.add('run', [4, 5, 6, 7], 10, true);
        player.animations.add('die', [0, 1], 10, false);
        player.animations.add('jump', [3], 10, true);
        player.animations.add('fall', [2], 10, true);
        

        // *** the countries to collect ***
        countryIndex = 0;
        countries = this.game.add.group();
            // create two countries first
        this.createCountryItem(400, listCountries[countryIndex++]["name"]);
        this.createCountryItem(650, listCountries[countryIndex++]["name"]);


        // *** The scores ***
        // initialise scores 
        var eugame = this;
        gameplay.getScores()
            .done(function(scores){
                console.log(scores);
                eugame.updateScores(scores);
            });

            // create group so it's easier to move
        scores = this.game.add.group();
            // the eu_countries score
        var euScoreImg = scores.create(5, 5, 'eu');
        euScoreImg.anchor.setTo(0,0);
        euScoreText = this.game.add.text(67, 33, '-', { font: 'bold 20pt Arial', fill: 'white' });
        euScoreText.anchor.setTo(0,0.5);
        scores.add(euScoreText);
            // the eu_score
        var scoreImg = scores.create(5, 67, 'score');
        scoreImg.anchor.setTo(0,0);
        scoreText = this.game.add.text(67, 95, '-', { font: 'bold 20pt Arial', fill: 'white' });
        scoreText.anchor.setTo(0,0.5);
        scores.add(scoreText);
            // the lives score
        livesScore1 = scores.create(790, 10, 'life');
        livesScore1.anchor.setTo(1,0);
        livesScore1.scale.setTo(0.7);
        livesScore2 = scores.create(749, 10, 'life');
        livesScore2.anchor.setTo(1,0);
        livesScore2.scale.setTo(0.7);
        livesScore3 = scores.create(708, 10, 'life');
        livesScore3.anchor.setTo(1,0);
        livesScore3.scale.setTo(0.7);
        livesScore4 = scores.create(667, 10, 'life');
        livesScore4.anchor.setTo(1,0);
        livesScore4.scale.setTo(0.7);
        livesScore5 = scores.create(626, 10, 'life');
        livesScore5.anchor.setTo(1,0);
        livesScore5.scale.setTo(0.7);
	},
    update: function() {
        
        if (!isGameOver)
        {
            // *** move camera automatically ***
            this.game.camera.x += 2 * speedSlow;
            this.game.world.setBounds(0, 0, this.game.world.width + 2, this.game.world.height);
            player.body.velocity.x = 120 * speedSlow;
            scores.position.x += 2 * speedSlow;
            tilesprite.tilePosition.set(-this.game.camera.x,-this.game.camera.y) ;

            // every 800px, resize the ground + create new countries
            if (this.game.camera.x > (800*(numBg-1)))
            {
                // resize ground
                ground.scale.setTo(2+numBg, 2);

                // add countries            
                this.createCountryItem(150 +800*numBg, listCountries[countryIndex++]["name"]);  
                this.createCountryItem(400 +800*numBg, listCountries[countryIndex++]["name"]);  
                this.createCountryItem(700 +800*numBg, listCountries[countryIndex++]["name"]);  

                // update the number of 800px background the player ran through
                numBg ++; 
            }
            

            //  *** Colliders ***
                // player collides with ground
            this.game.physics.arcade.collide(player, platforms);
                // player collides with countries (if this.checkOverlap, then this.collectCountry is called)
            this.game.physics.arcade.overlap(player, countries, this.collectCountry, this.checkOverlap, this);


            //  *** update animations ***
            if (this.game.input.activePointer.isDown && player.body.touching.down)
            {
                player.body.velocity.y = -700;
                player.animations.play('jump');
            }
            else if (this.game.input.activePointer.isDown && !player.body.touching.down)
            {
                player.body.velocity.y = -300;
                player.animations.play('jump');
            }
            else if (!this.game.input.activePointer.isDown && player.body.velocity.y >0)
            {
                player.animations.play('fall');
            }
            else if (player.body.position.y > 320) {
                player.animations.play('run');
            }
        }
    },
    speedGame: function() {
        speedSlow = 1.5;
    },
    slowGame: function() {
        speedSlow = 0.5;
    },
    updateScores: function(scores) {

        for (var s = 0 ; s < scores.length ; s++)
        {
            var scoreName = scores[s]["name"];
            var scoreValue = scores[s]["value"];

            switch(scoreName) {
                case "eu_score":
                    euScore = scoreValue;
                    break;
                case "eu_countries":
                    score = scoreValue;
                    break;
                case "lives":
                    lives = scoreValue;
                    break;
            }
        }
        euScoreText.text = euScore + "";
        scoreText.text = score + "";

        switch(lives) {
            case 5:
                livesScore1.visible = true;
                livesScore2.visible = true;
                livesScore3.visible = true;
                livesScore4.visible = true;
                livesScore5.visible = true;
                break;
            case 4:
                livesScore1.visible = true;
                livesScore2.visible = true;
                livesScore3.visible = true;
                livesScore4.visible = true;
                livesScore5.visible = false;
                break;
            case 3:
                livesScore1.visible = true;
                livesScore2.visible = true;
                livesScore3.visible = true;
                livesScore4.visible = false;
                livesScore5.visible = false;
                break;
            case 2:
                livesScore1.visible = true;
                livesScore2.visible = true;
                livesScore3.visible = false;
                livesScore4.visible = false;
                livesScore5.visible = false;
                break;
            case 1:
                livesScore1.visible = true;
                livesScore2.visible = false;
                livesScore3.visible = false;
                livesScore4.visible = false;
                livesScore5.visible = false;
                break;
            case 0:
                livesScore1.visible = false;
                livesScore2.visible = false;
                livesScore3.visible = false;
                livesScore4.visible = false;
                livesScore5.visible = false;
                break;
        }
    },
    updateFeedback: function(feedback) {
        for (var i = 0 ; i < feedback.length ; i++)
        {
            if (feedback[i]["type"] == "ADAPTATION")
            {
                if (feedback[i]["name"] == "speedGame")
                {
                    this.speedGame();
                }
                else if (feedback[i]["name"] == "slowGame")
                {
                    this.slowGame();
                }
                this.displayFeedback(feedback[i]["message"],  
                                               feedback[i]["type"]);
            }
            else if (feedback[i]["final"])
            {
                this.gameOver(feedback[i]["final"], feedback[i]["message"])
            }
            else {
                this.displayFeedback(feedback[i]["message"], 
                                             feedback[i]["type"]);
            }
        }
    },
    displayFeedback: function(feedback, type) {
        if (type.toUpperCase() == "POSITIVE")
        {
            $("#feedback").append('<li style="color: green;">' + feedback + '</li>');
        }
        else if (type.toUpperCase() == "NEGATIVE")
        {
            $("#feedback").append('<li style="color: red;">' + feedback + '</li>');
        }
        else if (type.toUpperCase() == "ADAPTATION")
        {
            $("#feedback").append('<li style="color: blue;">' + feedback + '</li>');
        }
        else
        {
            $("#feedback").append('<li style="color: black;">' + feedback + '</li>');
        }
    },
    gameOver: function(win, textFeedback) {

        // tell EngAGe the game ended
        gameplay.endGameplay(win);

        // set boolean to stop updates
        isGameOver = true;
        player.body.velocity.x = 0;

        console.log(win);

        if (!win){
            player.animations.play('die');
        }
        else {
            player.animations.play('stand');            
        }

        // *** game over panel *** //
        gameOverPanel = this.game.add.group();

        var panel = gameOverPanel.create(400 + this.game.camera.x,225,"panel");
        panel.anchor.setTo(0.5,0.5);
        panel.scale.setTo(0.6, 0.6);

        title_info = new Phaser.Text(this.game, 400 + this.game.camera.x, 150, "Game Over!", {fill: '#FFFFFF'});
        title_info.anchor.setTo(0.5,0.5);
        gameOverPanel.add(title_info);

        txt_info = new Phaser.Text(this.game, 400 + this.game.camera.x, 180, textFeedback, {font: '15pt Arial', wordWrap: true, wordWrapWidth: '500'});
        txt_info.anchor.setTo(0.5,0);
        gameOverPanel.add(txt_info);

        var menuButton = this.game.add.button(400 + this.game.camera.x,275,"btn_menu",this.goToMenu,this);
        menuButton.anchor.setTo(0.5,0.5);
        gameOverPanel.add(menuButton);
    },
    collectCountry: function (player, flag) {        
        countriesFound.push(flag.key);

        // assess action with EngAGe
        var values = {"country": flag.key};
        var action = ($.inArray(flag.key, countriesFound))? "countryReSelected" : "newCountrySelected";
        var eugame = this;

        gameplay.assess(action, values)
        .done(function(response){
            eugame.updateScores(response["scores"]);             
            eugame.updateFeedback(response["feedback"]);

        });

        // Removes the country from the screen
        flag.kill();        
    },
    checkOverlap: function (player, flag) {
        return (this.game.physics.arcade.distanceBetween(player, flag) < 110);
    },
    render: function() {
       //this.game.debug.cameraInfo(this.game.camera, 32, 32);
    }, 
    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    createCountryItem: function(x, nameSprite){
        var country = countries.create(x, Math.random() * (250) + 100, nameSprite);
        country.anchor.setTo(0.5,0.5);
        country.scale.setTo(0.25); 

        this.game.physics.arcade.enable(country);
    },
    goToMenu: function(){
        this.game.state.start("Menu", true, false, session);
    }
}
