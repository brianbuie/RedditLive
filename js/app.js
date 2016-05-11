var url = $('#thread').data('url');
var delay = parseInt($('#delay').text());
var queue = [];

var filters = ['refs', 'ref', 'foul', 'call'];

$(document).ready(function () {

	if(url != undefined){	
		getComments();
		displayComments();
	}

	$('#lessDelay').on('click', function(){
		if (delay > 0){
			newDelay = delay - 10;
			delay = newDelay;
			$('#delay').text(delay);
		}
	});

	$('#moreDelay').on('click', function(){
		newDelay = delay + 10;
		delay = newDelay;
		$('#delay').text(delay);
	});


});


function getComments(){
	var ajaxTime= new Date().getTime();
	$.ajax({
		type	: "GET",
		url		: url + '.json',
	}).success(function(data){
		var title = data[0].data.children[0].data.title;
		$('#title').text(title);

		var rawComments = data[1].data.children;
		rawComments.reverse();

		$.each(rawComments, function(){
			var newComment = true;
			var id = this.data.id;
			if (this.kind == 't1'){
				$.each(queue, function(){
					if (this.data.id == id){
						newComment = false;
					}
				});
				var comment = this.data.body;
				$.each(filters, function(){
					if (comment.toLowerCase().indexOf(this) > 0){
						// console.log('comment hidden (contains "' + this + '"): ' + comment);
						newComment = false;
					}
				});
				
				if (newComment == true){
					this.display = false;
					this.timeReceived = Math.round(new Date().getTime()/1000);
					this.displayTime = this.timeReceived + delay;
					// console.log(this);
					queue.push(this);
					var queueAmount = $(queue).size();
				} 
				// if (newComment != true){
				// 	var selector = 'body #' + id + ' .score';
				// 	var score = $(selector).text();
				// 	if (this.data.score != score){
				// 		$(selector).text(this.data.score).hide().fadeIn();
				// 	}
				// 	// console.log(this.data.score);
				// }
				$('#queue').text(queueAmount);
				var hiddenAmount = 0;
				$.each(queue, function(){
					if(this.display == false){
						hiddenAmount += 1;
					}
				});
				$('#hiddenAmount').text(hiddenAmount);
			}
		});

	}).done( function(){
		var totalTime = new Date().getTime()-ajaxTime;
  		var timeDif = totalTime.toString();
  		$('#processTime').html(timeDif + ' ms');
		setTimeout(function(){ 
			getComments();
			}, 3000);
	});
}

function displayComments(){
	var curTime = Math.round(new Date().getTime()/1000);
	$.each(queue, function(){
		if (this.display == false){
			if (this.displayTime < curTime){
				this.display = true;
				var flair = this.data.author_flair_text;
				if (flair == null){ flair = ''; }
				var html = '<a href="' + url + this.data.id + '" target="_blank">';
				html += '<div class="comment" id="' + this.data.id + '">';
				html += '<div class="meta">' + this.data.author + '<span class="flair">' + flair + '</span>  <span class="score">' + this.data.score + '</span> points</div>';
				html += this.data.body + '</div></a>';
				$('#thread').prepend(html);
				$('#'+this.data.id).hide().fadeIn('slow');
			}
		}
	});

	setTimeout(function(){
		displayComments();
	}, 1000);
}