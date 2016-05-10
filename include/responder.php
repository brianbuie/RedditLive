<?php

if (isset($_GET)){
	sleep(2);
	echo "you said " . $_GET["data"];
} else {
	echo "failed at responder";
}

?>
