<?php 
	header("Content-type: application/pdf; charset=utf-8"); 

	require("../library/fpdf.php");

	setlocale(LC_TIME,"fr_FR");

	$PDF=new FPDF();
	$PDF->AddPage();
	$PDF->SetTitle($_GET["Filename"], true);
	$PDF->SetAuthor('École Publique Decroly',true);
	$PDF->SetFont('Times','',14);
	$PDF->SetMargins(15,0,15);
	$PDF->Write(50, utf8_decode("\n"));
	$PDF->Cell(0,30,utf8_decode("Saint Mandé, le ".strftime("%d %B %Y", strtotime(date("m.d.y")))), 0 , 1, 'R');
	$PDF->Write(10, utf8_decode("            Je soussignée Françoise Delahaye directrice de l'École Decroly à Saint Mandé atteste que l'élève ".$_GET["Nom"]." va participer à un séjour scolaire avec sa classe de ".$_GET["Classe"].".\nLe séjour va se dérouler à ".$_GET["Lieu"]." du ".$_GET["DateDebut"]." au ".$_GET["DateFin"].".\nLe coût du séjour va s'élever à ".$_GET["Prix"]." euros et aucune subvention n'est prévue. Ce montant est à régler à l'ordre de l'agent comptable du collège Decroly."));
	$PDF->Output($_GET["Filename"].".pdf","I");
?>