/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function() {
	//escape script tags
	function escape(str) {
		var div = document.createElement('div');
		div.appendChild(document.createTextNode(str));
		return div.innerHTML;
	}
	//Compose tweet hide and show animation
	$('.new-tweet').hide();

	$('.header-button').click(function(event) {
		$('.new-tweet').toggle(300);
		$('#composetweet').focus();
	});

	//form submit -> form validation, ajax post method for tweet and get last tweet.
	$('.new-tweet-form').submit(function(event) {
		event.preventDefault();
		var formInput = $(this).serialize();

		if (!$('#composetweet').val()) {
			$('.counter').append(' <span><b>Please enter in an input</b></span>');
		} else if ($('#composetweet').val().length < 140) {
			$.ajax({
				url: '/tweets',
				method: 'POST',
				data: formInput,

				success: function(formInput) {
					renderNewTweet(formInput);
					$('#composetweet').val('');
				},
			});
		} else if ($('#composetweet').val().length >= 140) {
			$('.counter').append(' <span><b>Letters are more than 140 </b></span>');
		}
	});

	//like a tweet and unlike tweet
	$('body').on('click', 'i.fa-heart', function(event) {
		const $icon = $(this);
		const $article = $(this).closest('article');

		let id = $article.data('id');

		if (!$(this).hasClass('liked')) {
			$.ajax({
				url: '/tweets/incrementlikes',
				method: 'POST',
				data: 'text=' + id,
				success: function() {
					$icon.toggleClass('liked');
				},
			});
		} else {
			$.ajax({
				url: '/tweets/decrementlikes',
				method: 'POST',
				data: 'text=' + id,
				success: function() {
					$icon.toggleClass('liked');
					
				},
			});
		}
	});

	const reloadTweet = (tweetID, $article) => {
		$.getJSON(`/tweets/${tweetID}`, data => {
		  const tweetData = data[0];
		  if (!tweetData) return;
		  const $tweet = createTweetElement(tweetData);
		  $article.html($tweet.html());
		});
	  };

	//render tweet after composing tweet
	function renderNewTweet(data) {
		$.ajax({
			url: '/tweets',
			method: 'GET',
			success: function(jsonData) {
				let lastTweet = createTweetElement(jsonData.slice(-1).pop());

				$('.tweets-container').prepend(lastTweet);
			},
		});
	}

	//loadTweet using json data from /tweets
	function loadTweets() {
		$.ajax({
			url: '/tweets',
			method: 'GET',
			success: function(jsonData) {
				renderTweets(jsonData);
			},
		});
	}

	loadTweets();

	//create one tweet element
	function createTweetElement(tweet) {
		function changeTime(date) {
			var currentDate = Date.now();
			var seconds = (currentDate - date) / 1000;
			var minutes = (currentDate - date) / 1000 / 60;
			var hours = (currentDate - date) / 1000 / 60 / 60;
			if (seconds < 60) {
				return `${Math.floor(seconds)} seconds ago`;
			} else {
				if (minutes > 1 && minutes < 60) {
					return `${Math.floor(minutes)} minutes ago`;
				} else {
					if (minutes > 60 && hours < 24) {
						return `${Math.floor(hours)} hours ago`;
					} else {
						if (hours > 24) {
							return `${Math.floor(hours / 24)} days ago`;
						}
					}
				}
			}
		}

		//		const $tweet = $('<article>').addClass('tweet');
		let $tweet = ` <article data-id="${
			tweet._id
		}"class="tweet"><header class="tweet-header">
        <img src="${tweet.user.avatars.small}"> </img>
        <h2 class="tweet-name">${tweet.user.name}</h2>
        <p class="tweet-handler">${tweet.user.handle}</p>
        
      </header>
      <div class="tweet-msg-container">
      <p class="tweet-message">${escape(tweet.content.text)}</p>
    </div>
    <hr>
    <footer>
      <p>${changeTime(tweet.created_at)}</p>
      <div class="footer-icons">
        <i class="fab fa-font-awesome-flag"></i>
        <i class="fas fa-retweet"></i>
        <i id="likeTweet" class="fas fa-heart"> <span> ${
					tweet.likes
				} </span class="tweetLikesNum"></i>
      </div>
    </footer>
		</article>`;

		return $tweet;
	}

	//pass data to createTweetelement to make tweets
	function renderTweets(data) {
		return data.map(elem => {
			let $tweet = createTweetElement(elem);
			$('.tweets-container').prepend($tweet);
		});
	}
});
