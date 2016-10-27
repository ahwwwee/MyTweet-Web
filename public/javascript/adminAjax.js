'use strict'

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
      Timeline.updateTweets(response);
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
