PNotify.prototype.options.delay = 4000
PNotify.prototype.options.buttons.sticker = false

$ ->
  flash_title = (type) ->
    switch type
      when 'notice'  then 'Notice'
      when 'error'   then 'Error'
      when 'success' then 'Success'
      else 'Notice'

  flashes = $('.pnotify-flash')

  flashes.each((_, flash) ->
    new PNotify({
      title: flash_title(flash.dataset.type),
      type: flash.dataset.type,
      text: flash.dataset.message
    })
  )
