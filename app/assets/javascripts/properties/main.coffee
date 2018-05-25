$(document).on 'turbolinks:load', ->
  Breakpoints()

  Site = window.Site

  $(document).ready ->
    Site.run()


$(document).on 'turbolinks:load', ->
  blank_password = $('#blank-password.modal')
  if blank_password.length
    blank_password.modal(backdrop: 'static', keyboard: false)
