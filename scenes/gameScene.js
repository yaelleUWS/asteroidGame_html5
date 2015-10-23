var astGame = function(game){	
	console.log("%c Starting game scene", "color:white; background:green");

    var score;   
    var health;  
    var initialHealth;  
    var initialScore;   

    var scores;
    var scoreText;    
    var healthbar;
    var heathText;

    posibleColours = [];
    colourScoreValues = [];

    var planet;
    var asteroids;
    var bullets;

    allAsteroids = [];
    allAsteroidTexts = [];
    allAnswers = [];
    allAssessments = [];

    posibleQuestions = [];
    posibleMathEquations = [];

    var lastQuestion;
    var lastAction;

    var enterKey;

    var gameOverPanel;

    var isGameOver;

    session = {};
    var gameplay;

    speedSlow = 1;
    wait = 0;
    waitGoal = 800;

    asteroidsKilled = 0;
};
 
astGame.prototype = {
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
        this.game.add.sprite(0, 0,'bg');


        // *** The planet ***
        planet = this.game.add.sprite(400, 225, 'planet');
        planet.anchor.setTo(0.5,0.5);
        planet.scale.setTo(0.25);
        this.game.physics.arcade.enable(planet);

            //  Player's animations
        planet.animations.add('unhappy', [1], 10, true);
        planet.animations.add('happy', [2], 10, true);
        planet.animations.add('surprised', [3], 10, true);
        planet.animations.add('idle', [0], 10, true);

            // create groups for bullets and asteroids
        bullets = this.game.add.group();
        asteroids = this.game.add.group();
        

        // *** The input text ***
        $("#form_inputs").empty();
        $("#form_inputs").append('<input type="text" class="form-control" id="answer" placeholder="write your answer here">');
        $("#answer").css({"position": "absolute", "top": "440px", "left": "230px", "width": "400px"});

            // listen for "Enter" key
        enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);


        // *** The asteroids ***
        var astgame = this;
        session.getGame()
            .done(function(sg){
                if (sg["evidenceModel"]["answerMathEquation"])
                {
                    astgame.initialiseMathEquations(sg["evidenceModel"]["answerMathEquation"]["reactions"]);
                }
                if (sg["evidenceModel"]["answerQuestion"])
                {
                    astgame.initialiseQuestions(sg["evidenceModel"]["answerQuestion"]["reactions"]);
                }
                astgame.initialiseAsteroidColours();
            });

        // *** The scores ***
            // initialise scores 
        
        gameplay.getScores()
            .done(function(scores){
                astgame.initialiseScores(scores);
            });

            // create group so it's easier to move
        scores = this.game.add.group();
            // the eu_score
        var scoreImg = scores.create(0, 0, 'score');
        scoreImg.scale.setTo(0.6);
        scoreImg.anchor.setTo(0,0);
        scoreText = this.game.add.text(80, 42, '-', { font: 'bold 20pt Arial', fill: 'white' });
        scoreText.anchor.setTo(0,0.5);
        scores.add(scoreText);
            // the health score
        var healthbarFull = this.game.add.sprite(525, 20,'full_healthbar');
        healthbarFull.anchor.setTo(0,0);
        healthbar = this.game.add.sprite(525,20,'empty_healthbar');
        healthbar.anchor.setTo(0,0);
        healthbar.cropEnabled = true;        

        heathText = this.game.add.text(0, 0, '/', { font: 'bold 10pt Arial', fill: 'black' });
        heathText.anchor.setTo(0.5, 0.35);
        // center healthText on sprite
        heathText.x = Math.floor(healthbarFull.x + healthbarFull.width / 2);
        heathText.y = Math.floor(healthbarFull.y + healthbarFull.height / 2);
	},
    update: function() {        
        if (!isGameOver)
        {      
            wait++ ;

            //  *** Colliders ***
                // bullets collides with asteroids (if this.checkOverlap, then this.protectPlanet is called)
            this.game.physics.arcade.overlap(bullets, asteroids, this.protectPlanet, this.checkOverlap, this);
                // planet collides with asteroids (if this.checkOverlap, then this.hitPlanet is called)
            this.game.physics.arcade.overlap(planet, asteroids, this.hitPlanet, this.checkOverlap, this);


            // *** Create asteroids if need be ***
            if (wait > waitGoal || (asteroids.children.length-asteroidsKilled <= 0)) {
                wait = 0;
                this.createAsteroid ();
            }


            // *** Move asteroids towards planet ***
            for (var i = 0, len = asteroids.children.length; i < len; i++) {
                radians = this.game.physics.arcade.angleBetween(asteroids.children[i], planet);
        
                degrees = radians * (180/Math.PI);
                        
                // 23/30 is good spped
                this.game.physics.arcade.velocityFromAngle(degrees, 40 * speedSlow, asteroids.children[i].body.velocity);
            }

            // *** Move bullet towards asteroid ***
            for (var i = 0, len = bullets.children.length; i < len; i++) {
                radians = this.game.physics.arcade.angleBetween(bullets.children[i], asteroids.children[asteroids.children.length-2]);
        
                degrees = radians * (180/Math.PI);
                        
                // 23/30 is good spped
                this.game.physics.arcade.velocityFromAngle(degrees, 100, bullets.children[i].body.velocity);
            }


            // *** if enter is hit, submit  ***
            enterKey.onDown.add(this.submitAnswer,this);
        }
    },
    speedGame: function() {
        speedSlow = 1.5;
    },
    slowGame: function() {
        speedSlow = 0.5;
    },
    initialiseMathEquations: function(mathReactions) {
        for (var i=0 ; i<mathReactions.length ; i++)
        {
            if (mathReactions[i] && mathReactions[i]["values"])
            {
                posibleMathEquations = posibleMathEquations.concat(mathReactions[i]["values"]);
            }
        }
    },
    initialiseQuestions: function(questionReactions) {
        for (var i=0 ; i<questionReactions.length ; i++)
        {
            if (questionReactions[i] && questionReactions[i]["values"])
            {
                posibleQuestions = posibleQuestions.concat(questionReactions[i]["values"]);
            }
        }
    },
    initialiseAsteroidColours: function() {
        availableChoices = posibleMathEquations.concat(posibleQuestions);
        for (var i=0 ; i<availableChoices.length ; i++)
        {
            if (posibleColours.indexOf(availableChoices[i]["asteroidColor"]) < 0)
            {
                posibleColours.push(availableChoices[i]["asteroidColor"]);
                colourScoreValues.push("0");
            }
        }
    },
    initialiseScores: function(scores) {

        for (var s = 0 ; s < scores.length ; s++)
        {
            var scoreName = scores[s]["name"];
            var scoreValue = scores[s]["value"];

            if (scoreName == "health")
            {
                initialHealth = scoreValue;
                    health = scoreValue;
            }
            else if (scoreName == "overallScore") 
            {
                initialScore = scoreValue;
                score = scoreValue;
            }
            else
            {
                for (var i = 0 ; i<posibleColours.length ; i++)
                {
                    if (scoreName == posibleColours[i])
                    {
                        colourScoreValues[i] = scoreValue + "";
                    }
                }
            }
        }

        var detailedScore = "";
        for (var c = 0 ; c<posibleColours.length ; c++)
        {
            detailedScore += (c ==posibleColours.length -1)? colourScoreValues[c] : colourScoreValues[c] + ", ";
        }
        var detailedScoreText = (posibleColours.length>0)? " (" + detailedScore + ")" : "";
        scoreText.text = score + detailedScoreText;

        for (var c = 0 ; c<posibleColours.length ; c++)
        {
            var indexColour = 3+3*c;
            scoreText.addColor(posibleColours[c], indexColour);
        }
        scoreText.addColor("white", scoreText.text.length-1);

        heathText.text = health + ' / ' + initialHealth;
    },
    updateScores: function(scores) {

        for (var s = 0 ; s < scores.length ; s++)
        {
            var scoreName = scores[s]["name"];
            var scoreValue = scores[s]["value"];

            if (scoreName == "health")
            {
                health = scoreValue;
            }
            else if (scoreName == "overallScore") 
            {
                score = scoreValue;
            }
            else
            {
                for (var i = 0 ; i<posibleColours.length ; i++)
                {
                    if (scoreName == posibleColours[i])
                    {
                        colourScoreValues[i] = scoreValue;
                    }
                }
            }
        }
        var detailedScore = "";
        for (var c = 0 ; c<posibleColours.length ; c++)
        {
            detailedScore += (c ==posibleColours.length -1)? colourScoreValues[c] : colourScoreValues[c] + ", ";
        }
        var detailedScoreText = (posibleColours.length>0)? " (" + detailedScore + ")" : "";
        scoreText.text = score + detailedScoreText; 
        heathText.text = health + ' / ' + initialHealth;

        var newWidthRatioHealthBar = (health / initialHealth);
        healthbar.scale.setTo(newWidthRatioHealthBar, 1);
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
                else if (feedback[i]["name"] == "fireBulletAtAsteroid")
                {
                    this.fireBullet(feedback[i]["message"]);
                }
                else if (feedback[i]["name"] == "loseBullet")
                {
                    this.loseBullet();
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
        for (var i = 0, len = asteroids.children.length; i < len; i++) {            
            asteroids.children[i].body.velocity = 0;
        }

        if (!win){
            planet.animations.play('unhappy');
        }
        else {
            planet.animations.play('happy');            
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
    hitPlanet: function (planet, asteroid) {

        if (!asteroid.text)
        {   
             //  *** update animations ***
             planet.animations.play('unhappy');

            // send assessment to EngAGe
            var index = allAsteroids.indexOf(asteroid);
            var assessment = allAssessments[index];
            var correctAnswer = allAnswers[index];

            var values = {"question": assessment["question"], "answer": correctAnswer, "asteroidColor": assessment["asteroidColor"]};
            var action = "planetHit";

            var astgame = this;

            gameplay.assess(action, values)
            .done(function(response){
                astgame.updateFeedback(response["feedback"]);
                astgame.updateScores(response["scores"]);
            });

             // kill text
             asteroidsKilled++;
             allAsteroidTexts[index].kill();

             // kill asteroid
             asteroidsKilled++;
             asteroid.kill();
         }
    },
    protectPlanet: function (bullet, asteroid) {  
        if (!asteroid.text)
        {        
            //  *** update animations ***
            planet.animations.play('happy');

            // Removes the asteroid from the screen    
            var index = allAsteroids.indexOf(asteroid);    
            // kill text
            asteroidsKilled++;
            allAsteroidTexts[index].kill();

            // kill asteroid
            asteroidsKilled++;
            asteroid.kill();

            // kill bullet
            bullet.kill();  
        }
    }, 
    fireBullet: function (question) {
        bullet = bullets.create(planet.x, planet.y, "bullet");
        bullet.anchor.setTo(0.5,0.5);
        bullet.scale.setTo(0.25); 

        this.game.physics.arcade.enable(bullet);
    },
    loseBullet: function () {
        console.log("Losing bullet!");
    },
    submitAnswer: function () { 
        var assessment = allAssessments[allAssessments.length-1];
        var question = assessment["question"];
        var answer = $("#answer").val();
        var colour = assessment["asteroidColor"];
        var correctAnswer = allAnswers[allAssessments.length-1];

        var action = "answerQuestion";
        var values = {"question": question, "answer": answer, "asteroidColor": colour};

        // assess action with EngAGe
        if (assessment["sign"])
        {
            action = "answerMathEquation";
            var isAnswerCorrect = (answer == correctAnswer);
           // values = {"sign": assessment["sign"], "question": question, "answer": answer, 
            //                            "answerCorrect": isAnswerCorrect, "asteroidColor": colour};
            values = {"sign": assessment["sign"], "answerCorrect": isAnswerCorrect, "asteroidColor": colour};
        }


        console.log(action);
        console.log(values);

        var astgame = this;
        gameplay.assess(action, values)
        .done(function(response){
            console.log(response);
            astgame.updateScores(response["scores"]);             
            astgame.updateFeedback(response["feedback"]);
        });   

        $("#answer").val('');     
    },
    checkOverlap: function (obj1, obj2) {
        return (this.game.physics.arcade.distanceBetween(obj1, obj2) < (obj1.width/2 + obj2.width/2 - 10));
    },
    render: function() {
       //this.game.debug.cameraInfo(this.game.camera, 32, 32);
    }, 
    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    createAsteroid: function(){
        availableChoices = posibleMathEquations.concat(posibleQuestions);

        if (availableChoices.length == 0 )
        {
            return;
        }
        else 
        {
            var choice = availableChoices[this.getRandomInt(0, availableChoices.length-1)];

            var question = choice["question"];
            var sign = choice["sign"];
            var answer = choice["answer"];
            var asteroidColor = choice["asteroidColor"];
            var correctAnswer = answer;

            switch(sign) {
                case "multiplication":
                    var1 = this.getRandomInt(0, 10);
                    var2 = this.getRandomInt(0, 10);
                    question = var1 + " x " + var2 + " = ?";
                    correctAnswer = var1 * var2;
                    break;
                case "division":
                    var2 = this.getRandomInt(1, 10);
                    var1 = var2 * this.getRandomInt(0, 10);
                    question = var1 + " / " + var2 + " = ?";
                    correctAnswer = var1 / var2;
                    break;
                case "addition":
                    var1 = this.getRandomInt(0, 10);
                    var2 = this.getRandomInt(0, 10);
                    question = var1 + " + " + var2 + " = ?";
                    correctAnswer = var1 + var2;
                    break;
                case "substraction":
                    var1 = this.getRandomInt(0, 10);
                    var2 = this.getRandomInt(0, 10);
                    question = var1 + " - " + var2 + " = ?";
                    correctAnswer = var1 - var2;
                    break;
            }
        }

        var randomStartPosition = this.getRandomInt(0,3);
        var xAsteroid = 0;
        var yAsteroid = 0;

        switch(randomStartPosition) {
            // appear on the left
            case 0:
                xAsteroid = 0;
                yAsteroid = Math.random() * 450;
                break;
            // appear on top
            case 1:
                xAsteroid = Math.random() * 800;
                yAsteroid = 0;
                break;
            // on the right
            case 2:
                xAsteroid = 800;
                yAsteroid = Math.random() * 450;
                break;
            // from bottom
            case 3:
                xAsteroid = Math.random() * 800;
                yAsteroid = 450
                break;
        }

        ast = asteroids.create(xAsteroid, yAsteroid, asteroidColor);
        ast.anchor.setTo(0.5,0.5);
        ast.scale.setTo(0.25); 
        allAsteroids.push(ast);

        astText = this.game.add.text(0, 0, question, { font: 'bold 12pt Arial', fill: 'black', backgroundColor: asteroidColor });
        astText.anchor.setTo(0.5, 0.5);
        asteroids.add(astText);
        allAsteroidTexts.push(astText);
        // center text on sprite
        astText.x = Math.floor(ast.x - ast.width / 2);
        astText.y = Math.floor(ast.y + ast.height / 2);

        // store assessment data
        choice["question"] = question;
        allAssessments.push(choice);
        allAnswers.push(correctAnswer);

        this.game.physics.arcade.enable(ast);
        this.game.physics.arcade.enable(astText);
    },
    goToMenu: function(){
        this.game.state.start("Menu", true, false, session);
    }
}
