function createRequestObject() {
	if (window.XMLHttpRequest) // FIREFOX
		return new XMLHttpRequest();
	else if (window.ActiveXObject) // IE
		return new ActiveXObject("Microsoft.XMLHTTP");
	else
		return false;
}

function createPostRequestObject(fichier, param) {
	var xhr_object = createRequestObject();

	xhr_object.open("POST", fichier, false);
	xhr_object.setRequestHeader("Content-Type",
			"application/x-www-form-urlencoded");
	xhr_object.send(param);

	return xhr_object;
}

function handleAJAXReturnText(xhr_object) {
	if (xhr_object.readyState == 4 && xhr_object.status == 200) {
		// alert(xhr_object.responseText);
		return xhr_object.responseText;
	} else
		return false;
}

function handleAJAXReturnXML(xhr_object) {
	if (xhr_object.readyState == 4) {
		// alert(xhr_object.responseText);
		return xhr_object.responseXML;
	} else
		return false;
}

function handleLoadPage(xhr_object, containerid) {
	if (xhr_object.readyState == 4)
		document.getElementById(containerid).innerHTML = xhr_object.responseText;
}

// fonction requet Post Text
//
function file(fichier, param) {
	var xhr_object = createPostRequestObject(fichier, param);

	return handleAJAXReturnText(xhr_object);
}

// fonction chargement de page dynamique
//
function fileXML(fichier, param) {
	var xhr_object = createPostRequestObject(fichier, param);

	return handleAJAXReturnXML(xhr_object);
}

function loadpage(fichier, containerid) {
	var xhr_object = createRequestObject();

	// xhr_object.onreadystatechange = function(){handleLoadPage(xhr_object,
	// containerid)};
	xhr_object.open("Get", fichier, false);
	xhr_object.send(null);

	handleLoadPage(xhr_object, containerid);
}

function loadobjs() {
	if (!document.getElementById)
		return;
	for ( var i = 0; i < arguments.length; i++) {
		var file = arguments[i];
		var fileref = "";
		if (file.indexOf(".js") != -1) { // If object is a js file
			fileref = document.createElement('script');
			fileref.setAttribute("type", "text/javascript");
			fileref.setAttribute("src", file);
		} else if (file.indexOf(".css") != -1) { // If object is a css file
			fileref = document.createElement("link");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href", file);
		}
		if (fileref != "")
			document.getElementsByTagName("head").item(0).appendChild(fileref);
	}
}

function getValues(value, table, constrain) {
	var xhr_object = fileXML("phpscripts/DBRequestValues.php", "value_name="
			+ value + "&table=" + table + "&constrain=" + constrain);

	var elements = xhr_object.documentElement.childNodes;

	var elementsArray = new Array();

	for ( var i = 0; i < elements.length; i++) {

		if (elements.item(i).firstChild != null) {

			var fields = elements.item(i).childNodes;

			elementsArray[i] = new Array();

			for ( var j = 0; j < fields.length; j++) {

				if (fields.item(j).firstChild != null) {
					elementsArray[i][fields.item(j).nodeName] = fields.item(j).firstChild.nodeValue;
				}
			}
		}
	}

	return elementsArray;
}

function constrainGenerator(arr) {
	var constrain = "";
	var first = true;
	for ( var i = 0; i < arr.length; i++) {
		if (first) {
			constrain = " WHERE " + arr[i];
			first = false;
		} else
			constrain = constrain + " AND " + arr[i];
	}

	return constrain;
}

function addslashes(ch) {
	ch = ch.replace(/\\/g, "\\\\");
	ch = ch.replace(/\'/g, "\\'");
	ch = ch.replace(/\"/g, "\\\"");
	return ch;
}

function nullableValueInsert(value) {
	if (value == "")
		return "NULL ";
	else
		return " '" + addslashes(value) + "' ";
}

function nullableValueUpdate(fieldname, value) {
	var string = fieldname + "=";
	if (value == "")
		return string + "NULL ";
	else
		return string + "'" + addslashes(value) + "' ";
}