/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function() {
	$('.new-tweet-form').submit(function(event) {
		event.preventDefault();
		$(this).serialize();
	});

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

	function createTweetElement(tweet) {
		//		const $tweet = $('<article>').addClass('tweet');

		let $tweet = ` <article class="tweet"><header class="tweet-header">
        <img src="${tweet.user.avatars.small}"> </img>
        <h2 class="tweet-name">${tweet.user.name}</h2>
        <p class="tweet-handler">${tweet.user.handle}</p>
        
      </header>
      <div class="tweet-msg-container">
      <p class="tweet-message">${tweet.content.text}</p>
    </div>
    <hr>
    <footer>
      <p>${tweet.created_at}</p>
      <div class="footer-icons">
        <i class="fab fa-font-awesome-flag"></i>
        <i class="fas fa-retweet"></i>
        <i class="fas fa-heart"></i>
      </div>
    </footer>
    </article>`;

		//return $('.tweets-container').append($tweet);
		return $tweet;
	}

	//console.log(createTweetElement(data.users));

	function renderTweets(data) {
		return data.map(elem => {
			let $tweet = createTweetElement(elem);
			$('.tweets-container').append($tweet);
		});
	}

	
});
