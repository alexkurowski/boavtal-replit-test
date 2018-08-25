$(document).ready ->
  updateEmptyClass = (el) ->
    if el.value
      $(el).removeClass('empty')
    else
      $(el).addClass('empty')

  $('[data-plugin="formMaterial"]').each (i, el) ->
    control = $(el).find('.form-control')
    control.on 'input', -> updateEmptyClass(this)
