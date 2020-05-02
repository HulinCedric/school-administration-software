function dateReverse(date) {
	if (date == undefined) return undefined;
	if (date == null) return "";
	if (date == "") return "";
	
	var day, month, year;
	if (date.length == 10) {
 		day = date.substring(0, 2);
 		month = date.substring(3, 5);
 		year = date.substring(6, 10);
 	
 		return year + "-" + month + "-" + day;
 	}
 	else {
 		day = date.substring(8, 10);
 		month = date.substring(5, 7);
 		year = date.substring(0, 4);

 		return day + "/" + month + "/" + year;
 	}
}