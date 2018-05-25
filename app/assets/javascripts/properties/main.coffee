$ ->
  Breakpoints()

  Site = window.Site

  $(document).ready ->
    Site.run()


$(document).ready ->
  blank_password = $('#blank-password.modal')
  if blank_password.length
    blank_password.modal(backdrop: 'static', keyboard: false)
