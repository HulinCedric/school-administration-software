// Nom Service
//
autoComplete("#NomService", "NomService", "ServiceCantine", "");

matchCantineField();

function matchCantineField() {
	if (document.getElementById("NomServiceModifier").value == "") return;
	
	var arr = new Array();
	
 	arr.push(" NomService = '" + document.getElementById("NomServiceModifier").value + "' ");
 	 		 	 		
	var Cantine = getValues("*", "ServiceCantine", constrainGenerator(arr));

	matchDataField("NomService", Cantine[0]["NomService"]);
	matchDataField("HeureRepas", Cantine[0]["HeureRepas"]);
}

function cantineEnregistrer() {
	var ok = true;
	var erreur = "";

	// NomService
	//
	document.getElementById("NomService").value = document.getElementById("NomService").value.capitalize();
  	if(document.getElementById("NomService").value == "") {
 		document.getElementById("NomService").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le nom est vide</p>";
  	}
  	else document.getElementById("NomService").className = "valid";
  	
  	// HeureRepas
	//
	document.getElementById("HeureRepas").value = document.getElementById("HeureRepas").value.capitalize();
  	if(document.getElementById("HeureRepas").value == "") {
 		document.getElementById("HeureRepas").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>L'heure de repas est vide</p>";
  	}
  	else
  	if(document.getElementById("HeureRepas").value.length != 5) {
 		document.getElementById("HeureRepas").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>L'heure de repas n'est pas valide</p>";
  	}
  	else document.getElementById("HeureRepas").className = "valid";
  	  
  	// Verification existance
  	//
  	if (document.getElementById("NomServiceModifier").value == "")
  		if (ok)
   			if(file("phpscripts/DBCountResultQuery.php",
  					"Request=SELECT * FROM ServiceCantine WHERE NomService='" + document.getElementById("NomService").value +
  					"'")!=0) {
				document.getElementById("NomService").className = "invalid";
				ok = false;
				erreur = erreur + "<p>Ce service existe déjà</p>";
			}

	// Traiter la reponse
    //
    if (ok) {
    	var NomServiceModifier = document.getElementById("NomServiceModifier").value;

		if (NomServiceModifier == "")
			file("phpscripts/DBExecuteQuery.php", 
				"Request=INSERT INTO "+
					"ServiceCantine (NomService, HeureRepas) "+ 			
				"VALUES ("+
					nullableValueInsert(document.getElementById("NomService").value)+","+
					nullableValueInsert(document.getElementById("HeureRepas").value)+
						")"
			);
		else					
			file("phpscripts/DBExecuteQuery.php",
				"Request=UPDATE "+
					"ServiceCantine "+
				"SET "+
					nullableValueUpdate("NomService", document.getElementById("NomService").value)+","+
					nullableValueUpdate("HeureRepas", document.getElementById("HeureRepas").value)+
				" WHERE "+
					nullableValueUpdate("NomService", NomServiceModifier) + ";"
			);

		document.getElementById("finish").style.display = "block";
		document.getElementById("finish").className = "finishValid";
		document.getElementById("finish").innerHTML = "<p>Enregistrement effectué</p>";
	}
    else {
		document.getElementById("finish").style.display = "block";
		document.getElementById("finish").className = "finishInvalid";
		document.getElementById("finish").innerHTML = erreur;
    }
}