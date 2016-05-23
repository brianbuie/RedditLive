var url = $('#thread').data('url');
var queue = [];

var filters = ['refs', 'ref', 'foul', 'call'];

$(document).ready(function () {

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

		$.each(rawPosts, function(){
			var newPost = true;
			var id = this.data.id;
			$.each(queue, function(){
				if (this.data.id == id){
					newPost = false;
				}
			});
			var title = this.data.title;
			
			if (newPost == true){
				this.display = false;
				console.log(this);
				queue.push(this);
				var queueAmount = $(queue).size();
			} else {
				$('html #post-' + id + ' .score').text(this.data.score);
				$('html #post-' + id + ' .comments').text(this.data.num_comments);
			}

			$('#queue').text(queueAmount);
		});

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
		}
	});

	var totalTime = new Date().getTime()-listTime;
	var timeDif = totalTime.toString();
	$('#listCheck').html(timeDif + ' ms');

	setTimeout( getPosts, 5000);
}