$(document).ready(function() {
				
	// On cache les sous-menus
	//
    $("#navigation ul.subMenu").hide(); 
  
    // On sélectionne tous les items de liste portant la classe "toggleSubMenu" 
	// et on remplace l'element span qu'ils contiennent par un lien
	//
  	$("li.toggleSubMenu span").each(function() {
  	    // On stocke le contenu du span :
  	    var TexteSpan = $(this).text();
  	    $(this).replaceWith('<a href="" title="Afficher le sous-menu">' + TexteSpan + '</a>') ;
  	});   

	// On modifie l'évènement "mouseover" sur les liens 
    // qui portent la classe "toggleSubMenu"
    //
	$("#navigation li.toggleSubMenu > a").mouseover(function() {
		
		// Si le sous-menu est caché, on ferme les autres et on l'affiche
		//
		if ($(this).next("ul.subMenu:visible").length == 0) { 
		 	$("#navigation ul.subMenu").slideUp("fast"); 
			$(this).next("ul.subMenu").slideDown("normal"); 
		}
	});
	
	// On modifie l'évènement "click" sur les liens 
    // qui portent la classe "toggleSubMenu"
    //
	$("#navigation li.toggleSubMenu > a").click(function() {
		
		// On empêche le navigateur de suivre le lien
		//
		return false;
	});
	
	// On modifie l'évènement "click" sur les liens 
    // qui portent la classe "subMenu"
    //
	$("#navigation ul.subMenu").click(function() {
		
		// On enleve l'id des entete de menu
		//
		$("#navigation li.toggleSubMenu").attr("id", "");
		
		// On modifier l'entete de menu parent
		//
		$(this).parent().attr("id","current");
	});

 	// On modifie l'évènement "hover" sur la barre de menu 
    // qui portent l'id "navigation"
    //
    $("#navigation").hover( function () { 
		 
    	// On referme tout les sous menu
     	//
     	$("#navigation ul.subMenu").slideUp("fast"); 
    });
});