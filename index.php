<?php include('include/include.php'); ?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title> </title>
	<link href="<?echo BASE_URL;?>css/bootstrap.min.css" rel="stylesheet">
	<link rel="stylesheet" href="<?echo BASE_URL;?>css/style.css" type="text/css">

</head>

<body>
<div class="container">
	<section id="content">

	<h1 class="center">Gamethread</h1>

	<?php if(!isset($_GET['url'])){ ?>

	<div class="row">
		<div class="col-lg-8 col-lg-offset-2">
			<div class="input-group">
				<form class="form-inline input-group">
					<input type="text" class="form-control" name="url" placeholder="Reddit Comments URL (eg. https://www.reddit.com/r/nba/comments/4imy0w)" />
					<span class="input-group-btn">
						<button class="btn btn-default" type="submit">Go!</button>
					</span>
				</form>
			</div>
		</div>
	</div>

	<?php } else { ?>


	<pre>
	<div id="thread" data-url="<?php echo $_GET['url']; ?>">

	</div>
	</pre>

	<?php } ?>

	</section>

</div>



<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script src="<?echo BASE_URL;?>js/bootstrap.js"></script>
<script src="<?echo BASE_URL;?>js/app.js" type="text/javascript" charset="utf-8"></script>
</body>
</html>
