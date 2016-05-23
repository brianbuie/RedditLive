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

	<h3 id="title" class="center">Thread</h3>

	<?php if(!isset($_GET['url']) && !isset($_GET['subreddit'])){ ?>

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

	<h3 id="title" class="center">Subreddit</h3>
	<div class="row">
		<div class="col-lg-8 col-lg-offset-2">
			<div class="input-group">
				<form class="form-inline input-group">
					<input type="text" class="form-control" name="subreddit" placeholder="Subreddit" />
					<span class="input-group-btn">
						<button class="btn btn-default" type="submit">Go!</button>
					</span>
				</form>
			</div>
		</div>
	</div>

	<?php } elseif(isset($_GET['url'])) { ?>

	<div id="thread" data-url="<?php echo $_GET['url']; ?>">

	</div>
	<div id="stats">
		<h5>Total: <span id="queue">0</span></h5>
		<h5>Waiting: <span id="hiddenAmount">0</span></h5>
		<h5>Request time: <span id="processTime">0</span></h5>
		<h5>List check: <span id="listCheck">0</span></h5>
		<h5>Delay: 
			<span id="delay">
				<?php if(isset($_GET['delay'])){ echo $_GET['delay']; } else { echo '0'; } ?>
			</span> seconds
		<button id="lessDelay"> - </button>
		<button id="moreDelay"> + </button> </h5>


	</div>

	<?php } elseif(isset($_GET['subreddit'])) { ?>

	<div id="thread" data-url="<?php echo 'http://www.reddit.com/r/' . $_GET['subreddit'] . '/new'; ?>" data-name="<?php echo $_GET['subreddit']; ?>">

	</div>
	<div id="stats">
		<h5>Total: <span id="queue">0</span></h5>
		<h5>Request time: <span id="processTime">0</span></h5>
		<h5>List check: <span id="listCheck">0</span></h5>

	</div>

	<?php } ?>

	</section>

</div>



<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script src="<?echo BASE_URL;?>js/bootstrap.js"></script>
<?php if(isset($_GET['url'])){ ?>
	<script src="<?echo BASE_URL;?>js/gamethread.js" type="text/javascript" charset="utf-8"></script>
<?php } elseif(isset($_GET['subreddit'])) { ?>
	<script src="<?echo BASE_URL;?>js/subreddit.js" type="text/javascript" charset="utf-8"></script>
<?php } ?>
</body>
</html>
