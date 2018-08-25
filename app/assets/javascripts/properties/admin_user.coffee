$(document).ready ->
  $('#new_user').on 'ajax:success', ->
    window.location.reload()
