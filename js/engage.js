/*! engage - v0.9.0 - 2015-10-08
* Copyright (c) 2015 ; Licensed MIT */
window.engage = (function ($) {

	var baseURL = 'http://146.191.107.189:8080';
	
	var Session = function (idSG, data){
        this.idSG = idSG;
        this.student = [];
        this.idPlayer = -1;
        $.extend(this, data);
	};

	var GamePlay = function (idGameplay, scores){
        this.idGameplay = idGameplay;
        this.scores = scores;
	};

	var Engage = function () {		
	};

	Engage.loginStudent = function (idSG, username, password) {
		var dfr = jQuery.Deferred();
        var url = baseURL + '/SGaccess/';
        var data = {idSG: idSG, username: username, password: password};
     
        $.ajax({url: url, type:'POST', data: JSON.stringify(data), contentType:"application/json;", dataType: 'json'})
            .done(function (data) {
                if (!data.loginSuccess) {
                    dfr.reject('Login failed');
                }
                if (!data.hasOwnProperty('version')) {
                    dfr.reject('Sorry this game is not public');
                }
                dfr.resolve(new Session(idSG, data));
            })
            .fail(function () {dfr.reject('Connection error. Try again!');});
        return dfr.promise();
	};

	Engage.guestLogin = function (idSG) {
		var dfr = jQuery.Deferred();
		var url = baseURL + '/SGaccess/';
    	var data = {idSG: idSG, username: '', password: ''};
     
        $.ajax({url: url, type:'POST', data: JSON.stringify(data), contentType:"application/json;", dataType: 'json'})
            .done(function (data) {
                if (!data.hasOwnProperty('version')) {
                    dfr.reject('Sorry this game is not public');
                }
                dfr.resolve(new Session(idSG, data));
            })
            .fail(function () {dfr.reject('Could not login as guest');});
    	return dfr.promise();
	};

    Session.prototype.getLeaderboard = function () {
        var url = baseURL + '/learninganalytics/leaderboard/seriousgame/' + this.idSG + '/version/' + this.version;
        return $.getJSON(url);
    };  

    Session.prototype.getLeaderboard = function (limit) {
        var url = baseURL + '/learninganalytics/leaderboard/'+limit+'/seriousgame/' + this.idSG + '/version/' + this.version;
        return $.getJSON(url);
    };  

    Session.prototype.getGameDesc = function () {
    	var url = baseURL + '/seriousgame/info/' + this.idSG + "/version/" + this.version;
    	return $.getJSON(url);
    };

    Session.prototype.getGame = function () {
    	var url = baseURL + '/seriousgame/' + this.idSG + "/version/" + this.version;
    	return $.getJSON(url);
    };

    Session.prototype.getBadgesWon = function () {
        var url = baseURL + '/badges/seriousgame/' + this.idSG + '/version/' + this.version + '/player/' + this.idPlayer;
        return $.getJSON(url);
    };

    Session.prototype.getBadges = function () {
        var url = baseURL + '/badges/all/seriousgame/' + this.idSG + '/version/' + this.version + '/player/' + this.idPlayer;
        return $.getJSON(url);
    };

    Session.prototype.startGameplay = function () {
    	var url = baseURL + '/gameplay/start';
        var dfr = jQuery.Deferred();
        var data;

        // existing users
        if (this.idPlayer === -1){
            data = {
                idSG: this.idSG,
                version: this.version,
                idStudent: this.student.id || 0,
                params: this.params,
            };
        } else { // new users
            data = {
                idSG: this.idSG,
                version: this.version,
                idPlayer: this.idPlayer
            };
        }
        $.ajax({url: url, method: "PUT", contentType:"application/json;", data: JSON.stringify(data) })
            .done(function (idGameplay) {
                var scoresUrl = baseURL + '/gameplay/' + idGameplay + '/scores';
                $.getJSON(scoresUrl)
                    .done(function(scores){
                        dfr.resolve(new GamePlay(idGameplay, scores));
                    })
                    .fail(function(){
                        dfr.reject('Could not get the scores');
                    });

            })
            .fail(function(){
                dfr.reject('Could not start gameplay');
            });
        return dfr.promise();
    };

    GamePlay.prototype.assess = function (action, value) {
        var url = baseURL + '/gameplay/' + this.idGameplay + '/assessAndScore';
        var data = {action: action, values: value};
        return $.ajax({url: url, method: "PUT", contentType:"application/json;", data: JSON.stringify(data) });
    };

    GamePlay.prototype.endGameplay = function (win) {
        var end = win ? 'win' : 'lose';
        var url = baseURL + '/gameplay/' + this.idGameplay + '/end/' + end;        
        return $.ajax({url: url, method: "POST", contentType:"application/json;"});
    };

    GamePlay.prototype.getFeedback = function () {
        var url = baseURL + '/gameplay/' + this.idGameplay + '/feedback/';

        // todo update badges
        return $.getJSON(url);
    };

    GamePlay.prototype.getScores = function () {
        var url = baseURL + '/gameplay/' + this.idGameplay + '/scores/';
        return $.getJSON(url);
    };    
     
    return Engage;
}(jQuery));
