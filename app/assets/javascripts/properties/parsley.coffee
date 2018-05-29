$(document).ready ->
  $form = $('form.new_property, form.edit_property')

  return unless $form.length

  any_assets = -> document.getElementById('property_data[assets_debts][any_assets]_true').checked
  any_debts  = -> document.getElementById('property_data[assets_debts][any_debts]_true').checked

  $form.parsley({
    trigger: 'input change changeDate',
    errorClass: 'is-invalid',
    errorsContainer: (field) ->
      field.$element.closest('.form-group').find('.parsley-error')
  })

  window.Parsley.addValidator('requiredRange', {
    validateNumber: (value, _, field) ->
      return true if field.element.name.indexOf('template') isnt -1
      return true if field.element.dataset.parsleyRequiredRange is 'false'
      return true unless $(field.element).closest('.tab-pane').hasClass('active')

      return true if $(field.element).closest('.assets').length and not any_assets()
      return true if $(field.element).closest('.debts').length and not any_debts()

      $this  = $(field.element)
      $other = $this
        .closest('.row')
        .find('input[type="range"]')
        .filter (i, node) -> node isnt field.element

      return $this.val() isnt '0' or $other.val() isnt '0'
  })

  window.Parsley.addValidator('requiredField', {
    validateString: (value, _, field) ->
      return true if field.element.name.indexOf('template') isnt -1
      return true unless $(field.element).closest('.tab-pane').hasClass('active')

      return true if $(field.element).closest('.assets').length and not any_assets()
      return true if $(field.element).closest('.debts').length and not any_debts()

      return value.length > 0
  })

  $form.on 'changeDate', (e) ->
    $(e.target).trigger('input')
