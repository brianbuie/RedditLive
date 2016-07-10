var sub = $('#posts').data('sub');
var blankPost = $('#commentsContainer').html();
var posts = [];
var comments = [];
var commentsSort = "top";
var activePost = "";
var audioElement = document.createElement('audio');

$(document).ready(function () {

    audioElement.setAttribute('src', 'notification.mp3');
    audioElement.setAttribute('autoplay', 'false');
    //audioElement.load()

    $.get();

    audioElement.addEventListener("load", function() {
        audioElement.play();
    }, true);

    $(document).on('click', '.postLink', function(){
    	cleanUpShop();
    	$(this).children('.post').addClass('active');
    	activePost = $(this).children('.post').data('id');
    	$.each(posts, function(){
    		if(this.data.id == activePost){
    			$('.activePost-title .link').attr('href', "http://www.reddit.com" + this.data.permalink);
				$('.activePost-title .title').text(this.data.title);
				$('.activePost-content').text(this.data.selftext);
    		}
    	});
    });

    $(document).on('click', '#removeActive', function(){
    	cleanUpShop();
    })

    orchestrator();

});

function cleanUpShop(){
	$('.post.active').removeClass('active');
	activePost = "";
	comments = [];
	$('#commentsContainer').html(blankPost);
}

function orchestrator(){
	if(sub != undefined){
		getPosts();	
	}
	if(activePost != ""){
		getComments();
	}
	setTimeout(orchestrator, 10000);
}


function getPosts(){
	var ajaxTime= new Date().getTime();
	$.ajax({
		type	: "GET",
		url		: "http://www.reddit.com/r/" + sub + '/new.json',
	}).success(function(data){
		var rawPosts = data.data.children;
		rawPosts.reverse();
		$.each(posts, function(){
			this.active = false;
		});
		var counter = 0;
		$.each(rawPosts, function(){
			var newPost = true;
			var id = this.data.id;
			$.each(posts, function(){
				if (this.data.id == id){
					newPost = false;
					this.active = true;
				}
			});
			var title = this.data.title;
			if (newPost == true){
				if ($(posts).size() < 25 || counter > 10){
					this.display = false;
					this.active = true;
					posts.push(this);
				}
			} else {
				$('html #post-' + id + ' .score').text(this.data.score);
				$('html #post-' + id + ' .score-big').text(this.data.score);
				$('html #post-' + id + ' .comments').text(this.data.num_comments);
				$('html #post-' + id + ' .comments-big').text(this.data.num_comments);
			}
			counter++;
		});
		$('#posts').removeClass('error');
	}).done( function(){
		var totalTime = new Date().getTime()-ajaxTime;
  		var timeDif = totalTime.toString();
  		$('#processTime').html(timeDif + ' ms');
  		displayPosts();
	}).fail( function(){
		$('#posts').addClass('error');
	});
}

function displayPosts(){
	var curTime = Math.round(new Date().getTime()/1000);
	var listTime= new Date().getTime();
	var pageTitle = 'F5 Helper';
	$.each(posts, function(){
		if (this.display == false){
			this.display = true;
			var flair = this.data.author_flair_text;
			if (flair == null){ flair = ''; }
			// var html = '<a href="http://reddit.com' + this.data.permalink + '" target="_blank">';
			var html = '<a href="#" class="postLink">';
			html += '<div class="post row" id="post-' + this.data.id + '" data-id="' + this.data.id + '"><div class="col-xs-1"><h1 class="score-big">' + this.data.score + '</h1><p class="comments-big">' + this.data.num_comments + '</p></div>';
			html += '<div class="col-xs-11"><h4>' + this.data.title + '</h4>';
			html += '</div></div></a>';
			$('#posts').prepend(html);
			$('#'+this.data.id).hide().fadeIn('slow');
			audioElement.play();
		}
		if (this.active == false){
			$('#post-'+this.data.id).addClass('removed');
		}
		pageTitle = this.data.title;
	});
	var postsAmount = $(posts).size();
	$('#postsAmount').text(postsAmount);
	var totalTime = new Date().getTime()-listTime;
	var timeDif = totalTime.toString();
	$('#listCheck').html(timeDif + ' ms');
	document.title = pageTitle;
}

function getComments(){
	var ajaxTime= new Date().getTime();
	$.ajax({
		type	: "GET",
		url		: "http://www.reddit.com/r/" + sub + '/comments/' + activePost + '.json?sort=' + commentsSort + '&depth=5',
	}).success(function(data){
		var postInfo = data[0].data.children[0].data;
		var title = postInfo.title;
		var permalink = "http://www.reddit.com" + postInfo.permalink;
		// var titleHTML = '<a href="' + permalink + '" target="_blank">' + title + '</a>';
		$('.activePost-title .link').attr('href', "http://www.reddit.com" + postInfo.permalink);
		$('.activePost-title .title').text(postInfo.title);
		$('.activePost-content').text(postInfo.selftext);

		var rawComments = data[1].data.children;
		rawComments.reverse();

		$.each(rawComments, function(){
			var newComment = true;
			var id = this.data.id;
			if (this.kind == 't1'){
				$.each(comments, function(){
					if (this.data.id == id){
						newComment = false;
					}
				});
				var comment = this.data.body;				
				if (newComment == true){
					this.display = false;
					comments.push(this);
					var commentsAmount = $(comments).size();
				} else {
					$('html #score-' + id).text(this.data.score);
					$('html #body-' + id).text(this.data.body);
				}
				// $('#queue').text(queueAmount);
				// var hiddenAmount = 0;
				// $.each(comments, function(){
				// 	if(this.display == false){
				// 		hiddenAmount += 1;
				// 	}
				// });
				// $('#hiddenAmount').text(hiddenAmount);
			}
		});

	}).done( function(){
		var totalTime = new Date().getTime()-ajaxTime;
  // 		var timeDif = totalTime.toString();
  // 		$('#processTime').html(timeDif + ' ms');
		displayComments();
	}).fail( function(){
		// console.log('fail!');
		// getComments();
	});
}

function displayComments(){
	var curTime = Math.round(new Date().getTime()/1000);
	var listTime= new Date().getTime();
	$.each(comments, function(){
		if (this.display == false){
			this.display = true;
			var ajaxObj = $('#comments');
			var curScrollTop = ajaxObj.scrollTop();
			var curScrollHeight = ajaxObj.prop('scrollHeight');
			$('#comments').prepend(formatComment(this.data));
			$('#comment-'+this.data.id).hide().fadeIn('slow');
			if(curScrollTop > 10){
				var newScrollHeight = ajaxObj.prop('scrollHeight');
				var heightDif = newScrollHeight - curScrollHeight;
				var newPosition = curScrollTop + heightDif;
				ajaxObj.scrollTop(newPosition);
			}
			if(this.data.replies != ""){
				var replySpot = $('#comment-'+this.data.id+'-replies');
				// console.log(this.data.replies);
				$.each(this.data.replies.data.children, function(){
					$(replySpot).append(formatComment(this.data));
				});
			}
		}
	});

	var totalTime = new Date().getTime()-listTime;
	// var timeDif = totalTime.toString();
	// $('#listCheck').html(timeDif + ' ms');
}

function formatComment(comment){
	var flair = comment.author_flair_text;
	if (flair == null){ flair = ''; }
	var html = '<div class="comment row" id="comment-' + comment.id + '">';
	html += '<div class="col-xs-1"><h1 id="score-' + comment.id + '" class="score-big">' + comment.score + '</h1></div>';
	html += '<div class="col-xs-11"><div class="meta"><b>' + comment.author + '</b><span class="flair">' + flair + '</span></div>';
	html += '<div class="body" id="body-' + comment.id + '">' + comment.body + '</div><div id="comment-' + comment.id + '-replies"></div></div></div></div>';
	return html;
}