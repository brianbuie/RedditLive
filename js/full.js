var sub = '';
var blankPost = $('#commentsContainer').html();
var posts = [];
var comments = [];
var commentsSort = "top";
var activePost = "";
var activePostURL = "";
var OP = "";
var audioElement = document.createElement('audio');
var sound = false;

$(document).ready(function () {

    $('html #subSelect').on('submit', function(e){
    	e.preventDefault();
    	sub = $('#subSelect input[name="sub"]').val();
		$('#subSelect input[name="sub"]').val('');
		$('#titleBar h2').text('r/'+sub);
		$('#welcome').addClass('hidden');
		$('#content').removeClass('hidden');
		orchestrator();
    });

    $(document).on('submit', '#threadSelect', function(e){
    	e.preventDefault();
    	$('#threadSelect').hide();
    	activePostURL = $('#threadSelect input[name="thread"]').val();
		$('#threadSelect input[name="thread"]').val('');
		getComments();
    });

    $(document).on('click', '.postLink', function(e){
    	e.preventDefault();
    	cleanUpShop();
    	$(this).children('.post').addClass('active');
    	activePost = $(this).children('.post').data('id');
    	getComments();
    });

    $(document).on('click', '#removeActive', function(e){
    	e.preventDefault();
    	cleanUpShop();
    });

    $(document).on('click', '#mute', function(e){
    	e.preventDefault();
    	if (sound) {
    		$('#mute i').removeClass('fa-bell').addClass('fa-bell-slash');
    		sound = false;
    	} else {
    		$('#mute i').removeClass('fa-bell-slash').addClass('fa-bell');
    		sound = true;
    	}
    });

});

function cleanUpShop(){
	$('.post.active').removeClass('active');
	activePost = "";
	activePostURL = "";
	comments = [];
	$('#commentsContainer').html(blankPost);
}

function orchestrator(){
	if(sub != ''){
		getPosts();	
	}
	if(activePost != "" || activePostURL != ""){
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
			var thisScore = this.data.score;
			var thisComments = this.data.num_comments;
			$.each(posts, function(){
				if (this.data.id == id){
					newPost = false;
					this.active = true;
					this.data.score = thisScore;
					this.data.num_comments = thisComments;
				}
			});
			var title = this.data.title;
			if (newPost == true){
				if ($(posts).size() < 25 || counter > 10){
					this.display = false;
					this.active = true;
					posts.push(this);
				}
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
			var html = '<a href="#" class="postLink">';
			html += '<div class="post" id="post-' + this.data.id + '" data-id="' + this.data.id + '"><div class="postStats"><h1 class="score-big">' + scoreHelper(this.data.score) + '</h1><p class="comments-big">' + this.data.num_comments + '</p></div>';
			html += '<h4 class="postTitle">' + this.data.title + '</h4>';
			html += '</div></a>';
			$('#posts').prepend(html);
			$('#'+this.data.id).hide().fadeIn('slow');
			playSound();
		} else {
			if(this.data.id != activePost && this.active){
				$('html #post-' + this.data.id + ' .score-big').text(scoreHelper(this.data.score));
				$('html #post-' + this.data.id + ' .comments-big').text(this.data.num_comments);
			}
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
	if(activePostURL == ""){
		activePostURL = 'http://www.reddit.com/comments/' + activePost;
	}
	$.ajax({
		type	: "GET",
		url		: activePostURL + '.json?sort=' + commentsSort + '&depth=5',
	}).success(function(data){
		var postInfo = data[0].data.children[0].data;
		if(activePost == "" && activePostURL != ""){
			activePost = postInfo.id;
		}
		if(postInfo.id == activePost){
			$('#removeActive').removeClass('hidden');
			$('.meta').removeClass('hidden');
			$('html #threadSelect').addClass('hidden');
			$('html #post-' + postInfo.id + ' .score-big').text(scoreHelper(postInfo.score));
			$('html #post-' + postInfo.id + ' .comments-big').text(scoreHelper(postInfo.num_comments));
			$('#postLink').attr('href', "http://www.reddit.com" + postInfo.permalink);
			$('.activePost-title .title').text(postInfo.title);
			$('#OP').text(postInfo.author);
			OP = postInfo.author;
			$('#OP-flair').text(flairHelper(postInfo.author_flair_text));
			if (postInfo.is_self){
				$('.activePost-content').html(unescapeHTML(postInfo.selftext_html));
			} else {
				$('.activePost-content').html('<a href="'+postInfo.url+'" target="blank"><i class="fa fa-external-link"></i> '+postInfo.url+'</a>')
			}
			var rawComments = data[1].data.children;
			rawComments.reverse();
			$.each(rawComments, function(){
				var newComment = true;
				var thisComment = this;
				if (this.kind == 't1'){
					$.each(comments, function(index){
						if (this.data.id == thisComment.data.id){
							newComment = false;
							comments[index] = thisComment;
						}
					});				
					if (newComment == true){
						this.display = false;
						comments.push(this);
						var commentsAmount = $(comments).size();
					}
				}
			});
			displayComments();
		}
	}).done( function(){
		var totalTime = new Date().getTime()-ajaxTime;
	}).fail( function(){
		// $('#commentsContainer').addClass('error');
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
		} else {
			$('html #score-' + this.data.id).text(scoreHelper(this.data.score));
			$('html #body-' + this.data.id).html(unescapeHTML(this.data.body_html));
		}
		displayReplies(this.data);
	});
	var totalTime = new Date().getTime()-listTime;
}

function formatComment(comment){
	var authorClass = "";
	if(comment.author == OP){ authorClass = "OP"; }
	var html = '<div class="comment" id="comment-' + comment.id + '">';
	html += '<span id="score-' + comment.id + '" class="score-big">' + scoreHelper(comment.score) + '</span>';
	html += '<div class="content"><div class="meta">';
	html += '<b class="' + authorClass + '">' + comment.author + '</b><span class="flair">' + flairHelper(comment.author_flair_text) + '</span></div>';
	html += '<div class="body" id="body-' + comment.id + '">' + unescapeHTML(comment.body_html) + '</div><div id="comment-' + comment.id + '-replies"></div></div></div></div>';
	return html;
}

function unescapeHTML(body){
	$("#formatZone").html(body);
	var newBody = $("#formatZone").text();
	return newBody;
}

function displayReplies(comment){
	if(comment.replies !== "" && comment.replies != undefined){
		var replySpot = $('#comment-'+comment.id+'-replies');
		// $('#comment-'+comment.id+'-replies').html("");
		$.each(comment.replies.data.children, function(){
			if(this.data.author){
				if($('#comment-'+this.data.id).length < 1){
					$(replySpot).append(formatComment(this.data));
				} else {
					$('html #score-' + this.data.id).text(scoreHelper(this.data.score));
					$('html #body-' + this.data.id).html(unescapeHTML(this.data.body_html));
				}
				displayReplies(this.data);
			}
		});
	}
}

function flairHelper(flair){
	if(flair == null){ flair = ''; }
	return flair;
}

function scoreHelper(score){
	scoreNum = parseInt(score);
	newScore = scoreNum;
	if(scoreNum > 1000){
		tempScore = scoreNum/1000;
		newScore = tempScore.toFixed(1) + 'k';
	}
	return newScore;
}

function playSound(){
	// todo: check settings to see if sound is enabled
	if (sound){
		if (!audioElement.src){
			audioElement.setAttribute('src', 'media/notification.mp3');
	    	audioElement.setAttribute('autoplay', 'false');
		} else {
			audioElement.play();
		}
	}
}