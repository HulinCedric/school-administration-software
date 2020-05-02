// Promotion
//
autoCompleteSelectSimple("Promotion", "Promotion", "Classe", "ORDER BY Promotion DESC");
promotionChangeCantine();

function promotionChangeCantine() {
	var Min = document.getElementById("Promotion").value.substring(0,4);
	var Max = document.getElementById("Promotion").value.substring(5);

	$(".datepicker-spec").datepicker('destroy');
	$(".datepicker-spec").datepicker({ dateFormat: "dd/mm/yy", showAnim: "fadeIn", changeMonth: true, changeYear: true, minDate: new Date(Min, 8, 1), maxDate: new Date(Max, 5, 30) });
	
	emptySelect("Classe");
	autoCompleteSelectSimple("Classe", "Nom", "Classe", "WHERE Promotion = '" + document.getElementById("Promotion").value + "' ORDER BY Nom DESC");

	autoComplete("#Nom", "Nom", "Enfant AS E, Scolariteinterne AS SI", "WHERE SI.DateEntreeEcole IS NOT NULL AND E.idEnfant = SI.Enfant AND E.DateRadiation IS NULL AND E.Regime = 'Demi Pensionnaire' AND SI.Classe =  '" + document.getElementById("Classe").value + "'");

	classeChangeCantine();
}

function classeChangeCantine() {
	var arr = new Array();
	arr.push(" C.Promotion =  '" + document.getElementById("Promotion").value + "' ");
	arr.push(" C.Nom =  '" + document.getElementById("Classe").value + "' ");
	arr.push(" C.ServiceCantine =  SC.NomService ");

  	var data = getValues("SC.*", "Classe AS C, ServiceCantine AS SC", constrainGenerator(arr));
  	   	
   	document.getElementById("ServiceCantine").value = data[0]["NomService"];
   	document.getElementById("HeureRepas").value = data[0]["HeureRepas"];
  
   	enfantListerJQuery();  		
}

function enfantListerJQuery() {
	var arr = new Array();
	
	// Traiter la Sexe
	//
	var Sexe = "";
	for(i = 0; i < document.getElementsByName("Sexe").length; i++)
		if(document.getElementsByName("Sexe")[i].checked)
			Sexe = document.getElementsByName("Sexe")[i].value;
	if(Sexe != "")
 		arr.push(" E.Sexe = '" + Sexe + "' ");
 		
 	// Traiter le nom
 	//
 	if(document.getElementById("Nom").value != "" )
 	arr.push(" (E.Nom LIKE '" + document.getElementById("Nom").value + "%' OR E.NomUsage LIKE '" + document.getElementById("Nom").value + "%') ");

	// Traiter la Date
 	//
 	if(document.getElementById("Date").value != "" )
 		arr.push(" E.idEnfant NOT IN (Select A.Enfant FROM AbscenceCantine as A WHERE A.Date = '" + dateReverse(document.getElementById("Date").value) + "') ");

	// Traiter la classe
 	//
	arr.push(" SI.Promotion =  '" + document.getElementById("Promotion").value + "' ");
	arr.push(" SI.Classe =  '" + document.getElementById("Classe").value + "' ");

	// Caracteristique d'un eleve non radier
	//
	arr.push(" SI.DateEntreeEcole IS NOT NULL ");
	arr.push(" E.DateRadiation IS NULL ");
	arr.push(" E.Regime = 'Demi Pensionnaire' ");
	arr.push(" E.idEnfant = SI.Enfant ");

	var data = getValues("DISTINCT *", "Enfant as E, Scolariteinterne as SI", constrainGenerator(arr) + " ORDER BY E.Nom "); 	
  	  	
  	var select = document.getElementById("Enfant");
  	while (select.firstChild)
  		select.removeChild(select.firstChild);

  	if (data.length <= 0)
  		document.getElementById("submit").style.visibility = "hidden";
  	else
  		document.getElementById("submit").style.visibility = "";
 	
 	for (var i = 0 ; i < data.length ; i++) {
		// Enfant
		//
		var libelle = data[i]["Nom"];
		if (data[i]["NomUsage"] != undefined)
			libelle = libelle + " (" + data[i]["NomUsage"] + ")";
		libelle = libelle + " " + data[i]["Prenom"];
		addCheckField(select, "Enfants", libelle, data[i]["idEnfant"], "");
	}
}

enfantListerJQuery();

function cantineAbsenceEnregistrer() {
	var ok = true;
	var information = "";
	var erreur = "";
	var parent = document.getElementsByName('Enfants');
	
	if (document.getElementById("Date").value == "") {
		document.getElementById("Date").className = "invalid";
		ok = false;
		erreur = erreur + "<p>Le date d'absence n'est pas renseignée</p>";
	}
	else document.getElementById("Date").className = "valid";
	
	if (ok) {
		for (var i = 0 ; i < parent.length ; i++) {
			if (parent[i].checked) {
			
				// Elaboration du message de confirmation
				//		
				information = information + "<p>Une absence a été ajoutée pour " + parent[i].parentNode.firstChild.data + "</p>";
															
				// Mise a jour de la scolarité de l'enfant
				//
				file(	"phpscripts/DBExecuteQuery.php",
					"Request=INSERT INTO "+
						"AbscenceCantine (Enfant, Date) "+
					"VALUES ("+
						nullableValueInsert(parent[i].value)+","+
						nullableValueInsert(dateReverse(document.getElementById("Date").value))+")"
					);
			}
		}
	}
			
	if (ok) {
		document.getElementById("finish").style.display = "block";
		document.getElementById("finish").className = "finishValid";
		if (information == "")
			document.getElementById("finish").innerHTML = "<p>Aucun élève n'a été sélectionné</p>";
		else 
			document.getElementById("finish").innerHTML = information;
	}
	else {
		document.getElementById("finish").style.display = "block";
		document.getElementById("finish").className = "finishInvalid";
		document.getElementById("finish").innerHTML = erreur;
    }
}