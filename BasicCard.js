"use strict";

(function(){
	var Promise = require("promise");
	var fs = require("fs");

	function BasicCard(front,back){
		
		if(!(this instanceof BasicCard)){
			return new BasicCard(front,back);
		}

		this.front = front;
		this.back = back;

		this.toJson = function (){
			
        return ("{" +
            "\"front\":\"" + this.front + "\"," +
            "\"back\":\"" + this.back + "\"" +
        "}\n");
    };
	}

	BasicCard.fromJson = function (json){
	    var obj = JSON.parse (json);
	    return new BasicCard (obj.front, obj.back);
};

	

	function readJson(filename){
		var test = [];

	  return new Promise(function(resolve,reject){
		fs.readFile(filename,"utf-8",function(err,data){
			if(err){
				reject(err);
			} else{
				var lines = data.split("\n");
				if(lines == "" || lines === undefined){
					reject("No Cards Added");
				} else{
				for(var i=0; i<lines.length;i++){
					if(lines[i] != ""){
					var bc = BasicCard.fromJson(lines[i]);
					test.push(bc);
				}
				}
				resolve(test);
			}
			}
			
	  });
	 });
	}	
		



	module.exports = BasicCard;
	// module.exports.output = readFlashCardsData;
	module.exports.readJson = readJson;

})();

