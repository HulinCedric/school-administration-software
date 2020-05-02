// Promotion
//
autoCompleteSelectSimple("Promotion", "Promotion", "Classe", "ORDER BY Promotion DESC");
anneeScolaireChangeClasse();

function anneeScolaireChangeClasse() {
	emptySelect("Classe");
	autoCompleteSelectSimple("Classe", "Nom", "Classe", "WHERE Promotion = '" + document.getElementById("Promotion").value + "' ORDER BY Nom DESC");
	autoCompleteSelectClasseVerte("ClasseVerte", document.getElementById("Promotion").value);
 	enfantListerJQuery();  		
}

function enfantListerJQuery() {
	var arr = new Array();
		
	// Traiter la promotion
 	//
	arr.push(" S1.Promotion =  '" + document.getElementById("Promotion").value + "' ");
	arr.push(" S1.Classe =  '" + document.getElementById("Classe").value + "' ");

	// Caracteristique d'un eleve non radier
	//
	arr.push(" S1.DateEntreeEcole IS NOT NULL ");
	arr.push(" E1.DateRadiation IS NULL ");
	arr.push(" E1.idEnfant = S1.Enfant ");
	arr.push(" E1.idEnfant NOT IN ( Select E.idEnfant From Enfant as E, Scolariteinterne as S, Participant AS P Where S.Promotion =  '"+document.getElementById("Promotion").value+"' And S.Classe =  '" + document.getElementById("Classe").value + "' And S.DateEntreeEcole IS NOT NULL And E.DateRadiation IS NULL And E.idEnfant = S.Enfant And P.DateDebut = '"+dateReverse(document.getElementById("ClasseVerte")[document.getElementById("ClasseVerte").selectedIndex].text.substr(-10))+"' And P.Lieu = '"+document.getElementById("ClasseVerte").value+"' And E.idEnfant = P.Enfant )");
  	
  	var data = getValues("DISTINCT E1.*", "Enfant as E1, Scolariteinterne as S1", constrainGenerator(arr) + " ORDER BY E1.Nom "); 	
  	  	
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
		addCheckField(select, "Enfants", libelle, data[i]["idEnfant"], "checked");
	}
}

function enfantAffecter() {
	var information = "";
	var parent = document.getElementsByName('Enfants');
	
	document.getElementById("Promotion").className = "valid";
	document.getElementById("Classe").className = "valid";
	document.getElementById("ClasseVerte").className = "valid";

	for (var i = 0 ; i < parent.length ; i++) {
		if (parent[i].checked) {
			// Elaboration du message de confirmation
			//		
			information = information + 
						"<p>" + parent[i].parentNode.firstChild.data +
						" est affecter a la classe verte " + 
						document.getElementById("ClasseVerte").value + "</p>";
		
			// Mise a jour de la scolarité de l'enfant
			//
			file(	"phpscripts/DBExecuteQuery.php",
				"Request=Insert Into "+
					"Participant (Enfant, Lieu, DateDebut, PrixVerse)"+
				"Values ("+
					nullableValueInsert(parent[i].value)+","+
					nullableValueInsert(document.getElementById("ClasseVerte").value)+","+
					nullableValueInsert(dateReverse(document.getElementById("ClasseVerte")[document.getElementById("ClasseVerte").selectedIndex].text.substr(-10)))+","+
					nullableValueInsert('0')+")");
		}
	}
	
	document.getElementById("finish").style.display = "block";
	document.getElementById("finish").className = "finishValid";
	if (information == "")
		document.getElementById("finish").innerHTML = "<p>Aucun élève n'a été sélectionné</p>";
	else 
		document.getElementById("finish").innerHTML = information;
}