$('.ui.dropdown').dropdown();

$('.ui.form.users')
    .form({
      fields: {
        userId: {
          identifier: 'userId',
          rules: [
            {
              type: 'empty',
              prompt: 'Please select a User',
            },
          ],
        },
      },

      onSuccess: function (event, fields) {
        deleteUser();
        event.preventDefault();
      },
    });

function deleteUser() {
  var formData = $('.ui.form.users input').serialize();
  $.ajax({
    type: 'POST',
    url: '/deleteuser',
    data: formData,

    success: function (response) {
      let email = $('#userDD').dropdown('get value');
      removeItemUserDropdown(email);
      TIME_LINE.updateTweets(response);
    },
  });
};

function removeItemUserDropdown(email) {
  let $obj = $('.item.user');
  for (let i = 0; i < $obj.length; i += 1) {
    if ($obj[i].getAttribute('data-value').localeCompare(email) == 0) {
      $obj[i].remove();
      $('#userDD').dropdown('clear');
      break;
    }
  }
}

const TIME_LINE = (function () {
  let tweet;
  const tweets = [];

  function initialize() {
    $(function () {
      $.get('/getTweets', function (data) {
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
