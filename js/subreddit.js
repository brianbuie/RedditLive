var url = $('#thread').data('url');
var queue = [];
var audioElement = document.createElement('audio');

$(document).ready(function () {

    audioElement.setAttribute('src', 'notification.mp3');
    audioElement.setAttribute('autoplay', 'false');
    //audioElement.load()

    $.get();

    audioElement.addEventListener("load", function() {
        audioElement.play();
    }, true);

	if(url != undefined){
		var title = $('#thread').data('name');
		$('#title').text('r/' + title + '/new');

		getPosts();
	}

});


function getPosts(){
	var ajaxTime= new Date().getTime();
	$.ajax({
		type	: "GET",
		url		: url + '.json',
	}).success(function(data){
		// console.log(data);

		var rawPosts = data.data.children;
		rawPosts.reverse();

		// console.log(rawPosts);

		$.each(queue, function(){
			this.active = false;
		});

		var counter = 0;

		$.each(rawPosts, function(){
			var newPost = true;
			var id = this.data.id;
			$.each(queue, function(){
				if (this.data.id == id){
					newPost = false;
					this.active = true;
				}
			});
			var title = this.data.title;
			
			if (newPost == true){
				if ($(queue).size() < 25 || counter > 10){
					this.display = false;
					this.active = true;
					queue.push(this);
				} else {
					console.log('triggered by "' + this.data.title + '"');
					console.log('queue size = ' + $(queue).size());
					console.log('counter at ' + counter);
				}
			} else {
				$('html #post-' + id + ' .score').text(this.data.score);
				$('html #post-' + id + ' .comments').text(this.data.num_comments);
			}
			counter++;
		});

	}).error( function(){

		$('#title').css('color: red;');

	}).done( function(){
		var totalTime = new Date().getTime()-ajaxTime;
  		var timeDif = totalTime.toString();
  		$('#processTime').html(timeDif + ' ms');
		displayPosts();
	});
}

function displayPosts(){
	var curTime = Math.round(new Date().getTime()/1000);
	var listTime= new Date().getTime();
	var pageTitle = 'F5 Helper';
	$.each(queue, function(){
		if (this.display == false){
			this.display = true;
			var flair = this.data.author_flair_text;
			if (flair == null){ flair = ''; }
			var html = '<a href="http://reddit.com' + this.data.permalink + '" target="_blank">';
			html += '<div class="comment" id="post-' + this.data.id + '">';
			html += '<h4>' + this.data.title + '</h4>';
			html += '<div class="meta">' + this.data.author + '<span class="score">' + this.data.score + '</span> points <span class="comments">' + this.data.num_comments + '</span> comments</div></div></a>';
			$('#thread').prepend(html);
			$('#'+this.data.id).hide().fadeIn('slow');
			audioElement.play();
		}
		if (this.active == false){
			$('#post-'+this.data.id).addClass('removed');
		}
		pageTitle = this.data.title;
	});

	// queue = $.grep(queue, function(value) {
	// 	return value.active != false;
	// });

	var queueAmount = $(queue).size();
	$('#queue').text(queueAmount);

	var totalTime = new Date().getTime()-listTime;
	var timeDif = totalTime.toString();
	$('#listCheck').html(timeDif + ' ms');

	document.title = pageTitle;

	setTimeout( getPosts, 10000);
}