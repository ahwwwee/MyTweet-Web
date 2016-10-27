const Timeline = (function () {

  const tweets = [];

  function initialize() {
    $(function () {
      $.get('getTweets', function (data) {
      }).done(function (data) {
        $.each(data, function (index, tweetObj)
        {
          console.log(tweetObj[0] + '+' + tweetObj[1]);
        });
      });
    });
  }

  function updateTweets(data)
  {
    removeTweets();
    const tweet = '';

    tweets.push(tweet);
  }

  function removeTweets()
  {
    for (i = 0; i < tweets.length; i += 1)  {
      console.log('take out of list ' + tweets[i]);
    }
  }

  return {
    updateTweets: updateTweets,
  };

});
