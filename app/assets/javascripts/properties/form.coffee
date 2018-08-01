$(document).ready ->
  $('[data-toggle=cut]').on 'click', (e) ->
    e.preventDefault()
    $target = $(this.dataset.target)
    willOpen = $target.hasClass('cut')

    if willOpen
      $(this).text(this.dataset.textHide)
      height = $target.children().get(0).offsetHeight
      $target.css('max-height', height)
      $target.removeClass('cut')
    else
      $(this).text(this.dataset.textShow)
      $target.css('max-height', '')
      $target.addClass('cut')
