<?php
	abstract class DBRequest { 
		public static function getValuesXML($request) {				
			$dom = new DOMDocument("1.0", "UTF-8");
		
			if ($request == null || $request == "")
				return $dom->saveXML();
			$request = stripslashes($request);
			
			$result = mysql_query($request);
			
			$root = $dom->createElement("root");
				
			$tablename = mysql_field_table($result, 0);
							
			while($data = mysql_fetch_array($result)) {
				$element = $dom->createElement($tablename);
				
				for ($i = 0 ; $i < mysql_num_fields($result) ; $i++) {
					$value_name = mysql_field_name($result, $i);
					$field = $dom->createElement($value_name, $data[$value_name]);
					$element->appendChild($field);
				}
				
				$root->appendChild($element);
			}
			
			$dom->appendChild($root);
			
			return $dom->saveXML();
		}

		public static function getValuesExcel($request) {						
			if ($request == null || $request == "")
				return "";
					
			$result = mysql_query(stripslashes($request));
							
			$tablename = mysql_field_table($result, 0);
				
			for ($i = 0 ; $i < mysql_num_fields($result) ; $i++) {
					$csv .= mysql_field_name($result, $i).';';
			}							
			$csv .= "\n";
										
			while($data = mysql_fetch_array($result)) {
				for ($i = 0 ; $i < mysql_num_fields($result) ; $i++) {
					$value_name = mysql_field_name($result, $i);
					$csv .= $data[$value_name].';';
				}
				$csv .= "\n";
			}
						
			return $csv;
		}
		
		public static function executeQuery($request) {						
			if ($request == null || $request == "")
				return;
				
			$request = stripslashes($request);
			
			return mysql_query($request);
		}
		
		public static function getCountResultQuery($request) {						
			if ($request == null || $request == "")
				return;
				
			$request = stripslashes($request);
			
			echo mysql_num_rows(mysql_query($request));
		}
		
		public static function getConstainValuesXML($value_name, $table) {						
			$result = mysql_query("SHOW COLUMNS FROM $table LIKE '$value_name'");

			$ligne = mysql_fetch_row($result);
 
			$chaine = $ligne[1];

			$chaine = substr($chaine, 5, -1);
			 			 
			$chaine = explode(",", $chaine);
	
			$dom = new DOMDocument("1.0", "UTF-8");
			$scales = $dom->createElement($table);
			
			for($i=0; $i<count($chaine); $i++) {
				$ma_chaine = substr($chaine[$i], 1, -1);
				$element = $dom->createElement($value_name, $ma_chaine);
				$scales->appendChild($element);
			}
			
			$dom->appendChild($scales);
			
			return $dom->saveXML();
		}
    }
?>