
var login = function(game){
	console.log("%cStarting login scene", "color:black; background:green");

    username_tag = "Username"; 
    password_tag = "Password"; 
    username_inputText = "";
    password_inputText = "";
    
    // Set the unique ID for your serious game  
    idSG = 161;

	session = {};
};
  
login.prototype = {
	create: function(){
  		this.stage.backgroundColor = '#6bf';
    	this.game.add.sprite(0, 0, 'menu_bg');
    	
    	var gameTitle = this.game.add.sprite(400,70,"gametitle");
		gameTitle.anchor.setTo(0.5,0.5);

		username_tag = this.game.add.text(200, 180, 'Username', { fontSize: '20px', fill: '#000' });
		password_tag = this.game.add.text(200, 230, 'Password', { fontSize: '20px', fill: '#000' });

		$("#form_inputs").append('<input type="text" class="form-control" id="username" value="">');
		$("#username").css({"position": "absolute", "top": "200px", "left": "375px", "width": "300px"});

		$("#form_inputs").append('<input type="password" class="form-control" id="password" value="">');
		$("#password").css({"position": "absolute", "top": "250px", "left": "375px", "width": "300px"});

    	var loginButton = this.game.add.button(400,330,"btn_login",this.loginToGame,this);
		loginButton.anchor.setTo(0.5,0.5);
    	var loginGuestButton = this.game.add.button(400,400,"btn_guest",this.loginGuestToGame,this);
		loginGuestButton.anchor.setTo(0.5,0.5);
	},
	loginToGame: function(){
		username_inputText = $("#username").val();
		password_inputText = $("#password").val();

		var login = this;

		engage.loginStudent(idSG, username_inputText, password_inputText)
		.done(function(s){ 
			session=s;
			if (session["params"].length == 0) {
				login.goToMenuScene();
			}
			else {
				login.goToQuestionsScene(username_inputText);	
			}
		})
		.fail(function(msg){
			login.errorMessage(msg);
		});

	},
	loginGuestToGame: function(){
		var login = this;
		engage.guestLogin(idSG)
		.done(function(s){
			session=s;
			login.goToQuestionsScene("Guest");				
		})
		.fail(function(msg){
	 		login.errorMessage(msg);
		});
	},
	errorMessage: function(msg){
		var error_msg = this.game.add.text(400, 150, msg, { fontSize: '20px', fill: 'DarkRed' });
		error_msg.anchor.setTo(0.5,0.5);
	},
	goToQuestionsScene: function(username){
		$("#form_inputs").empty();
		this.game.state.start("Questions", true, false, username, session );
	},
	goToMenuScene: function(){
		$("#form_inputs").empty();
		this.game.state.start("Menu", true, false, session);
	}
}