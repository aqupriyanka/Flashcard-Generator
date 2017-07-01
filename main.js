
var BasicCard = require("./BasicCard");
var ClozeCard = require("./ClozeCard");

var Promise = require("Promise");
var fs = require("fs");

var firstPresident = new BasicCard(
    "Who was the first president of the United States?", "George Washington");
// console.log(firstPresident.front);
// console.log(firstPresident.back);

var inquirer = require("./main_inquirer").ask(getUserSelection);;

function getUserSelection(userAnswer){

	switch(userAnswer){
		case "Add Basic Cards" : writeBasicCardJson(); break;
		case "Add Cloze Cards" : writeClozeCardJson(); break;
		case "User Created Basic Cards" : getBasicCardsFromFile("user.json"); break;
		case "Default Basic Cards" : getBasicCardsFromFile("vocab.json"); break;
		case "Default Cloze Cards" : getClozedCardsFromFile("vocab-cloze.json");break;
		case "User Created Cloze Cards" : getClozedCardsFromFile("user-cloze.json");break;
	}
}


var outputJson = [];
var j=0;
var userInputVal = "s";

function writeBasicCardJson(){
		var front = "";
		var back = "";
		console.log("\nPlease Enter the front and back of the card :\n ");
		console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
		console.log("\t\tFRONT\n");
		console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");

		getUserResponse().then(function(success){
				front = success;
				console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
				console.log("\t\tBACK  \n");
				console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
				getUserResponse().then(function(success){
					back = success;
					var bc = new BasicCard(front,back);
					writeFlashCardInFile("user.json",bc.toJson());
					// fs.appendFile("user.json",bc.toJson(), function(err,resp){
					// 	console.log("resp",resp);
					// 	process.exit(0);
					// });
				});
				return;
		}, function(error){
			console.log("Please enter the valid input.");
		});

}

function writeClozeCardJson(){
		var text = "";
		var cloze = "";
		console.log("\nPlease Enter the full text and cloze clause for the card :\n ");
		console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
		console.log("\t\tFULL TEXT\n");
		console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
		
		getUserResponse().then(function(success){
				text = success;
				console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
				console.log("\t\tCLOZE CARD\n ");
				console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
				getUserResponse().then(function(success){
					cloze = success;
				try{	
					var cc = new ClozeCard(text,cloze);
					writeFlashCardInFile("user-cloze.json",cc.toJson());
					// fs.appendFile("user-cloze.json",cc.toJson(),function(err,resp){
					// 	process.exit(0);
					// });
				}catch(e){
					console.log(e.message);
					process.exit(0);
				}
				});
				return;
		}, function(error){
			console.log("Please enter the valid input.");
		});

}

function writeFlashCardInFile(filename,text){
	fs.stat(filename, function(err, stat) {
    if(err == null) {
        fs.appendFile(filename, text,function(err,resp){
						process.exit(0);
					});
    } else if(err.code == 'ENOENT') {
        // file does not exist
        fs.writeFile(filename, text,function(err,resp){
						process.exit(0);
					});
    } else {
        console.log('Some other error: ', err.code);
    }
});
}


function getClozedCardsFromFile(filename){
	ClozeCard.readJson(filename).then(
		function(successResp){
			outputJson = successResp;
			console.log("\nPlease enter ANSWER to the given card or below options \n1. next/n -- to get next card \n2. text/t -- to get full text of the card \n3. Answer/a -- to get the Answer for the displayed card. \n4. Exit/e -- to exit anytime.");
			displayClozeAccTOUserInput(j);
			// displayAccTOUserInput(j);
			// displayCard("Cloze", outputJson[i].partial);

		},
		function(errResp){
			console.log("\n\nThere are no cards added. Please Add Cards.");
		});
}


function getBasicCardsFromFile(filename){
	BasicCard.readJson(filename).then(
		function(successResp){
			outputJson = successResp;
			console.log("\nPlease enter ANSWER to the given card or below options \n1. next/n -- to get next card \n2. Answer/a -- to get the Answer for the displayed card. \n3. Exit/e -- to exit anytime.\n");
			displayAccTOUserInput(j);

		},
		function(errResp){
			console.log("\n\nThere are no cards added. Please Add Cards.");
		});
}



function displayAccTOUserInput(i){
	if(i< outputJson.length){

		if(userInputVal != "a" && userInputVal != "err"){

			displayCard("Front", outputJson[i].front);
		}	
		getUserResponse().then(function(success){
			if(success.indexOf("n") == 0 || success.indexOf("N") == 0){
				userInputVal = "n";
		  		displayAccTOUserInput(++j);
		  	   }
		  	else if(success.indexOf("a") == 0 || success.indexOf("A") == 0){
		  		userInputVal = "a";
		  		displayCard("Back", outputJson[i].back);
		  		displayAccTOUserInput(i);
		  	} else if(success.toLowerCase() === outputJson[i].back.toLowerCase()){
		  		userInputVal = "a";
		  		console.log("CORRECT ANSWER, please press n for Next Card.");
		  		displayAccTOUserInput(i);
		  	} else if(success.indexOf("e") == 0 || success.indexOf("E") == 0){
		  		console.log("EXITING ... ");
		  		process.exit(0);
		  	}else{
				userInputVal = "err";
		  		console.log("Please enter the correct answer OR correct options (a/e/n)");
		  		displayAccTOUserInput(i);
		  	} 

		},function(err){
			console.log("error");
			displayAccTOUserInput(i);

		});
	} else{
		console.log("Cards Finished !!");
		process.exit(0);
	}

}

function displayClozeAccTOUserInput(i){
	if(i< outputJson.length){

		if(userInputVal != "t" && userInputVal != "a" && userInputVal != "err"){

			displayCard("Clozed", outputJson[i].partial);
		}	
		getUserResponse().then(function(success){
			if(success.indexOf("n") == 0 || success.indexOf("N") == 0){
				userInputVal = "n";
		  		displayClozeAccTOUserInput(++j);
		  	   }
		  	else if(success.indexOf("t") == 0 || success.indexOf("T") == 0){
		  		userInputVal = "t";
		  		displayCard("Full Text", outputJson[i].text);
		  		displayClozeAccTOUserInput(i);
		  	} else if(success.indexOf("a") == 0 || success.indexOf("A") == 0){
		  		userInputVal = "a";
		  		displayCard("Answer", outputJson[i].cloze);
		  		displayClozeAccTOUserInput(i);
		  	} else if(success.toLowerCase() == outputJson[i].cloze.toLowerCase()){
		  		userInputVal = "a";
		  		console.log("CORRECT ANSWER, please press n for Next Card.");
		  		displayClozeAccTOUserInput(i);
		  	}else if(success.indexOf("e") == 0 || success.indexOf("E") == 0){
		  		console.log("EXITING ... ");
		  		process.exit(0);
		  	}else{
				userInputVal = "err";
		  		console.log("Please enter the correct answer OR correct options (a/t/n/e)");
		  		displayClozeAccTOUserInput(i);
		  	} 

		},function(err){
			console.log("error");
			displayClozeAccTOUserInput(i);

		});
	} else{
		console.log("Cards Finished !!");
		process.exit(0);
	}

}


function displayCard(side,text){
	var AsciiTable = require('ascii-table');
	var table = new AsciiTable(side + ' CARD');
	  table.setJustify();

	table
	  .addRow("")
	  .addRow("")
	  .addRow(text)
	  .addRow("")
	  .addRow("");
	console.log(table.toString());
	console.log("\n");
}

function getUserResponse(){
	var stdin = process.openStdin();
	return new Promise(function(resolve,reject){
		stdin.addListener("data", function(input){
		 	var userInput = input ? input.toString().trim() : "";
		 	if(userInput)
		 		resolve(userInput);
		 	else
		 		reject("Failure");
		 });
	});
}









