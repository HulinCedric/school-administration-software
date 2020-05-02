autoComplete("#Lieu", "Lieu", "ClasseVerte", "");

var dates = $("#DateDebut, #DateFin")
		.datepicker(
				{
					defaultDate : "+1w",
					changeMonth : true,
					dateFormat : "dd/mm/yy",
					showAnim : "fadeIn",
					onSelect : function(selectedDate) {
						var option = this.id == "DateDebut" ? "minDate"
								: "maxDate", instance = $(this).data(
								"datepicker"), date = $.datepicker.parseDate(
								instance.settings.dateFormat
										|| $.datepicker._defaults.dateFormat,
								selectedDate, instance.settings);
						dates.not(this).datepicker("option", option, date);
					}
				});

function calculPriceClasseVerte() {
	var PrixComptable = "0";
	var PrixAssociation = "0";
	var AideAssociation = "0";
	if (document.getElementById("PrixComptable").value != "")
		PrixComptable = document.getElementById("PrixComptable").value;
	if (document.getElementById("PrixAssociation").value != "")
		PrixAssociation = document.getElementById("PrixAssociation").value;
	if (document.getElementById("AideAssociation").value != "")
		AideAssociation = document.getElementById("AideAssociation").value;
	document.getElementById("Total").value = eval(PrixComptable + "+"
			+ PrixAssociation + "-" + AideAssociation)
			+ " €";
}

matchClasseVerteField();
calculPriceClasseVerte();

function matchClasseVerteField() {
	if (document.getElementById("LieuModifier").value == "")
		return;
	if (document.getElementById("DateDebutModifier").value == "")
		return;

	var arr = new Array();
	arr
			.push(" Lieu = '" + document.getElementById("LieuModifier").value
					+ "' ");
	arr.push(" DateDebut = '"
			+ document.getElementById("DateDebutModifier").value + "' ");

	var ClasseVerte = getValues("*", "ClasseVerte", constrainGenerator(arr));

	matchDataField("Lieu", ClasseVerte[0]["Lieu"]);
	matchDataField("DateDebut", dateReverse(ClasseVerte[0]["DateDebut"]));
	matchDataField("DateFin", dateReverse(ClasseVerte[0]["DateFin"]));
	matchDataField("PrixComptable", ClasseVerte[0]["PrixComptable"]);
	matchDataField("PrixAssociation", ClasseVerte[0]["PrixAssociation"]);
	matchDataField("AideAssociation", ClasseVerte[0]["AideAssociation"]);
	matchDataField("AccompagnateursAutres",
			ClasseVerte[0]["AccompagnateursAutres"]);
}

function classeVerteEnregistrer() {
	var ok = true;
	var erreur = "";

	// Lieu
	//
	document.getElementById("Lieu").value = document.getElementById("Lieu").value
			.capitalize();
	if (document.getElementById("Lieu").value == "") {
		document.getElementById("Lieu").className = "invalid";
		ok = false;
		erreur = erreur + "<p>Le lieu n'est pas renseigné</p>";
	} else
		document.getElementById("Lieu").className = "valid";

	// DateDebut
	//
	if (document.getElementById("DateDebut").value == "") {
		document.getElementById("DateDebut").className = "invalid";
		ok = false;
		erreur = erreur + "<p>La date de début est vide</p>";
	} else
		document.getElementById("DateDebut").className = "valid";

	// DateFin
	//
	if (document.getElementById("DateFin").value == "") {
		document.getElementById("DateFin").className = "invalid";
		ok = false;
		erreur = erreur + "<p>La date de fin est vide</p>";
	} else
		document.getElementById("DateFin").className = "valid";

	// PrixComptable
	//
	if (document.getElementById("PrixComptable").value == "") {
		document.getElementById("PrixComptable").className = "invalid";
		ok = false;
		erreur = erreur + "<p>Le prix agent comptable est vide</p>";
	} else if (!verifcationNumeric(document.getElementById("PrixComptable").value)) {
		document.getElementById("PrixComptable").className = "invalid";
		ok = false;
		erreur = erreur + "<p>Le prix agent comptable n'est pas numérique</p>";
	} else
		document.getElementById("PrixComptable").className = "valid";

	// PrixAssociation
	//
	if (document.getElementById("PrixAssociation").value == "") {
		document.getElementById("PrixAssociation").className = "invalid";
		ok = false;
		erreur = erreur + "<p>Le prix association est vide</p>";
	} else if (!verifcationNumeric(document.getElementById("PrixAssociation").value)) {
		document.getElementById("PrixAssociation").className = "invalid";
		ok = false;
		erreur = erreur + "<p>Le prix association n'est pas numérique</p>";
	} else
		document.getElementById("PrixAssociation").className = "valid";

	// AideAssociation
	//
	if (document.getElementById("AideAssociation").value == "") {
		document.getElementById("AideAssociation").className = "invalid";
		ok = false;
		erreur = erreur + "<p>Le prix d'aide association est vide</p>";
	} else if (!verifcationNumeric(document.getElementById("AideAssociation").value)) {
		document.getElementById("AideAssociation").className = "invalid";
		ok = false;
		erreur = erreur
				+ "<p>Le prix d'aide association n'est pas numérique</p>";
	} else
		document.getElementById("AideAssociation").className = "valid";

	// AccompagnateursAutres
	//
	document.getElementById("AccompagnateursAutres").className = "valid";

	// Verification existance
	//
	if (document.getElementById("LieuModifier").value == "")
		if (ok)
			if (file(
					"phpscripts/DBCountResultQuery.php",
					"Request=SELECT * FROM ClasseVerte WHERE Lieu='"
							+ document.getElementById("Lieu").value
							+ "' AND DateDebut ='"
							+ dateReverse(document.getElementById("DateDebut").value)
							+ "'") != 0) {
				document.getElementById("Lieu").className = "invalid";
				document.getElementById("DateDebut").className = "invalid";
				ok = false;
				erreur = erreur + "<p>Cette classe verte existe déjà</p>";
			}

	// Traiter la reponse
	//
	if (ok) {
		var LieuModifier = document.getElementById("LieuModifier").value;
		var DateDebutModifier = document.getElementById("DateDebutModifier").value;
		if (LieuModifier == "")
			file(
					"phpscripts/DBExecuteQuery.php",
					"Request=INSERT INTO "
							+ "ClasseVerte (Lieu, DateDebut, DateFin, PrixComptable, PrixAssociation, AideAssociation, AccompagnateursAutres) "
							+ "VALUES ("
							+ nullableValueInsert(document
									.getElementById("Lieu").value)
							+ ","
							+ nullableValueInsert(dateReverse(document
									.getElementById("DateDebut").value))
							+ ","
							+ nullableValueInsert(dateReverse(document
									.getElementById("DateFin").value))
							+ ","
							+ nullableValueInsert(document
									.getElementById("PrixComptable").value)
							+ ","
							+ nullableValueInsert(document
									.getElementById("PrixAssociation").value)
							+ ","
							+ nullableValueInsert(document
									.getElementById("AideAssociation").value)
							+ ","
							+ nullableValueInsert(document
									.getElementById("AccompagnateursAutres").value)
							+ ")");
		else {
			file("phpscripts/DBExecuteQuery.php", "Request=UPDATE "
					+ "ClasseVerte "
					+ "SET "
					+ nullableValueUpdate("Lieu", document
							.getElementById("Lieu").value)
					+ ","
					+ nullableValueUpdate("DateDebut", dateReverse(document
							.getElementById("DateDebut").value))
					+ ","
					+ nullableValueUpdate("DateFin", dateReverse(document
							.getElementById("DateFin").value))
					+ ","
					+ nullableValueUpdate("PrixComptable", document
							.getElementById("PrixComptable").value)
					+ ","
					+ nullableValueUpdate("PrixAssociation", document
							.getElementById("PrixAssociation").value)
					+ ","
					+ nullableValueUpdate("AideAssociation", document
							.getElementById("AideAssociation").value)
					+ ","
					+ nullableValueUpdate("AccompagnateursAutres", document
							.getElementById("AccompagnateursAutres").value)
					+ " WHERE " + nullableValueUpdate("Lieu", LieuModifier)
					+ " AND "
					+ nullableValueUpdate("DateDebut", DateDebutModifier) + ";");
			file("phpscripts/DBExecuteQuery.php", "Request=UPDATE "
					+ "Participant "
					+ "SET "
					+ nullableValueUpdate("Lieu", document
							.getElementById("Lieu").value)
					+ ","
					+ nullableValueUpdate("DateDebut", dateReverse(document
							.getElementById("DateDebut").value)) + " WHERE "
					+ nullableValueUpdate("Lieu", LieuModifier) + " AND "
					+ nullableValueUpdate("DateDebut", DateDebutModifier) + ";");
			file("phpscripts/DBExecuteQuery.php", "Request=UPDATE "
					+ "Accompagnateur "
					+ "SET "
					+ nullableValueUpdate("Lieu", document
							.getElementById("Lieu").value)
					+ ","
					+ nullableValueUpdate("DateDebut", dateReverse(document
							.getElementById("DateDebut").value)) + " WHERE "
					+ nullableValueUpdate("Lieu", LieuModifier) + " AND "
					+ nullableValueUpdate("DateDebut", DateDebutModifier) + ";");
		}

		document.getElementById("finish").style.display = "block";
		document.getElementById("finish").className = "finishValid";
		document.getElementById("finish").innerHTML = "<p>Enregistrement effectué</p>";
	} else {
		document.getElementById("finish").style.display = "block";
		document.getElementById("finish").className = "finishInvalid";
		document.getElementById("finish").innerHTML = erreur;
	}
}