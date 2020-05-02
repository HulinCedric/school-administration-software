<?php     
	class DBConnection {
  		private $host,
        		$user, 
        		$pass, 
        		$dataBase;
        
        public $handle;
        		
       	private static $m_pInstance;
        		        
        private function __construct($host, $user, $pass, $dataBase) {
            $this->host = $host;
            $this->user = $user;
            $this->pass = $pass;
            $this->dataBase = $dataBase;
            
            $this->connectionDB();
        }
        
        public static function getInstance($host, $user, $pass, $dataBase) { 
        	if (!self::$m_pInstance) 
            	self::$m_pInstance=new DBConnection($host, $user, $pass, $dataBase); 

        	return self::$m_pInstance; 
   	 	} 
        
        private function connectionDB() {
         	$this->handle = mysql_connect($this->host, $this->user, $this->pass) or
				die("Erreur de connexion au serveur : voir le fichier de configuration " . mysql_error());
	
			mysql_select_db($this->dataBase, $this->handle) or
				die("Erreur de selection de base de donnees : voir le fichier de configuration " . mysql_error());
			mysql_query("SET NAMES 'UTF8'");
        }
        
		public function __sleep() {
            mysql_close();
            return array ('host', 'user', 'pass', 'dataBase');
        }
        
        public function __wakeup() {
            $this->connectionDB();
        }
    }
?>