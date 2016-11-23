let tweets = [];

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

      onSuccess: function (event) {
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
      let id = $('#userDD').dropdown('get value');
      removeItemUserDropdown(id);
      removeTweets(id);
      toStart()
    },
  });
};

function removeItemUserDropdown(id) {
  let $obj = $('.item.user');
  for (let i = 0; i < $obj.length; i += 1) {
    if ($obj[i].getAttribute('data-value').localeCompare(id) == 0) {
      $obj[i].remove();
      $('#userDD').dropdown('clear');
      break;
    }
  }
}

function removeTweets(id)
{
  $('.ui.fluid.card').each(function () {
    if (this.getAttribute('value') === id) {
      this.remove();
    }
  });
}

$('.ui.form.deleteTweets')
    .form({
      fields: {
      },

      onSuccess: function (event) {
        deleteSelectedTweets();
        event.preventDefault();
      },
    });

function deleteSelectedTweets() {
  var formData = $('input[type="checkbox"]:checked').serialize();
  $.ajax({
    type: 'POST',
    url: '/deleteTweets',
    data: formData,

    success: function (response) {
      $('.ui.fluid.card').each(function () {
        $('input[type="checkbox"]:checked').closest('.ui.fluid.card').remove();
      });
    },
  });
}

$('.ui.form.deleteAllTweets')
    .form({
      fields: {

      },

      onSuccess: function (event) {
        deleteAll();
        event.preventDefault();
      },
    });

function deleteAll() {
  $.ajax({
    type: 'GET',
    url: '/deleteAllTweets',

    success: function (response) {
      $('.usertweets').each(function () {
        $('input[type="checkbox"]').parents('tr').remove();
      });
    },
  });
}
