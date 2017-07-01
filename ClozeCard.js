"use strict";

(function(){
	var Promise = require("promise");
	var fs = require("fs");

	function ClozeCard(text,cloze){
		if(!text.includes(cloze)){
				throw new Error("Full Text doesn't include cloze deletion.");
		} 

		if(!(this instanceof ClozeCard)){
			return new ClozeCard(text,cloze);
		}

		this.text = text;
		this.cloze = cloze;
		this.partial = this.text.replace(cloze,"....");

		
		this.toJson = function (){
        return ("{" +
            "\"text\":\"" + this.text + "\"," +
            "\"cloze\":\"" + this.cloze + "\"" +
        "}\n");
    };
	}

	ClozeCard.fromJson = function (json){
	    var obj = JSON.parse (json);
	    return new ClozeCard (obj.text, obj.cloze);
};
	
	
	ClozeCard.validateCard = function(text,cloze){
		if(!text.contains(cloze)){
			return false;
		}
		return true;
	}
	

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
					var bc = ClozeCard.fromJson(lines[i]);
					test.push(bc);
				}
				}
				resolve(test);
			}
			}
			
	  });
	 });
	}	
		



	
	module.exports = ClozeCard;
	// module.exports.output = readFlashCardsData;
	module.exports.readJson = readJson;

})();

