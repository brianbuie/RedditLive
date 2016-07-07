<?php include('include/include.php'); ?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title> </title>
	<link href="<?echo BASE_URL;?>css/vendor/bootstrap/bootstrap.min.css" rel="stylesheet">
	<link rel="stylesheet" href="<?echo BASE_URL;?>css/full.css" type="text/css">

</head>

<body>
<div class="container">
	<section id="content">

		<?php if(!isset($_GET['sub'])){ ?>

			<h3 id="title" class="center">Subreddit</h3>
			<div class="row">
				<div class="col-lg-8 col-lg-offset-2">
					<div class="input-group">
						<form class="form-inline input-group">
							<input type="text" class="form-control" name="sub" placeholder="Subreddit" />
							<span class="input-group-btn">
								<button class="btn btn-default" type="submit">Go!</button>
							</span>
						</form>
					</div>
				</div>
			</div>

		<?php } else { ?>

			<div class="row">
				<div class="col-sm-5">
					<div id="posts" data-sub="<?php echo $_GET['sub']; ?>"></div>
				</div>
				<div class="col-sm-7" id="commentsContainer">
					<a href="#" id="removeActive">X</a>
					<h3 class="activePost-title">No post selected</h3>
					<p class="activePost-content">Select a post to begin</p>
					<div id="comments">
					</div>
				</div>
			</div>

			<div id="stats">
				<h5>Total: <span id="postsAmount">0</span></h5>
				<h5>Request time: <span id="processTime">0</span></h5>
				<h5>List check: <span id="listCheck">0</span></h5>

			</div>

		<?php } ?>

	</section>

</div>



<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script src="<?echo BASE_URL;?>js/vendor/bootstrap/bootstrap.min.js"></script>
<?php if(isset($_GET['sub'])) { ?>
	<script src="<?echo BASE_URL;?>js/full.js" type="text/javascript" charset="utf-8"></script>
<?php } ?>
</body>
</html>
