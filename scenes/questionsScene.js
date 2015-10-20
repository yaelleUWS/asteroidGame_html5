var questions = function(game){
	console.log("%cStarting question scene", "color:black; background:green");

	questions = [
		{"question": "default1?", "name": "default1", "type": "String"}, 
		{"question": "default2?", "name": "default2", "type": "String"}
	];

	username = "you";

	answers = [];
	session = {};
};
  
questions.prototype = {
	init: function(usernameReceived, sessionReceived){
		username = usernameReceived;
		session = sessionReceived;
		questions = (session["params"])? session["params"] : [] ;

	},
  	create: function(){
		$("#form_inputs").empty();

    	this.game.add.sprite(0, 0, 'menu_bg');
    	var gameTitle = this.game.add.sprite(400,65,"gametitle");
		gameTitle.anchor.setTo(0.5,0.5);

		username_tag = this.game.add.text(100, 130, 'Hello '+username+'! Before you start, please answer a few questions:', { fontSize: '20px', fill: '#000' });

		// questions
		for (var i=0; i<questions.length; i++)
		{
			$("#form_inputs").append('<input type="text" class="form-control" id="question'+i+'" placeholder="'+questions[i].question+'">');
			var marginTop = 200 + i*50;
			$("#question"+i).css({"position": "absolute", "top": marginTop+"px", "left": "200px", "width": "400px"});
		}

    	var menuButton = this.game.add.button(400,400,"btn_start",this.goToMenu,this);
		menuButton.anchor.setTo(0.5,0.5);


	},
	goToMenu: function(){
		answers = questions;
		for (i=0; i<questions.length; i++)
		{
			answers[i]["value"] = $("#question"+i).val();
		}

		session.params = answers;

		$("#form_inputs").empty();
		this.game.state.start("Menu", true, false, session);

		}
}