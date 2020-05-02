<?php
    function loadClass($classname) {
        require "../phpclass/" . $classname . ".class.php";
    }
    spl_autoload_register("loadClass");
?>