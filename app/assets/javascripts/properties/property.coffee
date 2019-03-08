$(document).ready ->
  $form = $('.property-form > form')
  return unless $form.length

  updateFormSubmitButtonsCooldown = 2

  rangeSettings = {
    namespace: 'rangeUi',
    min: 0,
    max: 100,
    step: 1,
    scale: false,
    onChange: () ->
      element = this.element
      $this   = $(element)
      $other  = $this
        .closest('.row')
        .find('input[type="range"]')
        .filter (i, node) -> node isnt element

      this_value  = $this.asRange('get')
      other_value = $other.asRange('get')

      entangled = element.dataset.entangled == 'true'
      max       = parseInt element.dataset.maxvalue

      if entangled or this_value + other_value > max
        $other.asRange('set', max - this_value)

      $asset = $this.closest('.asset')
      if $asset.length
        this_value  = $this.asRange('get')
        other_value = $other.asRange('get')

        $after_full = $asset.find('.after-full')
        $after_part = $asset.find('.after-part')

        if this_value + other_value >= max
          $after_full.removeClass('d-none')
          $after_part.addClass('d-none')
        else
          $after_full.addClass('d-none')
          $after_part.removeClass('d-none')
          $after_part.find('.after-part-percent').text(this_value + other_value)

      $this
        .closest('.form-group')
        .find('.parsley-error')
        .empty()

      resetFormSubmitButtonsCooldown()
  }

  numericalSettings = {
    alias: 'integer',
    regex: '\\d*',
    rightAlign: false,
    allowPlus: false,
    allowMinus: false,
    autoGroup: true,
    groupSeparator: ' ',
    removeMaskOnSubmit: true,
    autoUnmask: true,
    onUnMask: (v) -> v.replace(/\D/g, '')
  }


  validateCurrentFieldset = () ->
    $fieldset = $('fieldset.active')
    group = $fieldset.data('group')

    isValid = $form.parsley().validate({ group: group })

    if group is 'assets'
      return validatePropertyFieldset('asset', isValid)

    if group is 'debts'
      return validatePropertyFieldset('debt', isValid)

    return isValid

  validateProperties = () ->
    noAssets    = not $("[id='property_data[assets_debts][any_assets]_true']").get(0).checked
    noDebts     = not $("[id='property_data[assets_debts][any_debts]_true']").get(0).checked
    assetsCount = $form.find(".assets .asset").length
    debtsCount  = $form.find(".debts .debt").length

    return (noAssets or assetsCount > 0) and (noDebts or debtsCount > 0)

  validatePropertyFieldset = (group, isValid) ->
    $fieldset = $('fieldset.active')

    if $form.find(".#{group}s .#{group}").length is 0
      error = $("#any-#{group}s-error")
      error.html("
        <ul class='parsley-errors-list filled'>
          <li class='parsley-custom-error-message'>
            #{ error.data('message') }
          </li>
        </ul>
      ")
      return false

    unless isValid
      $fieldset
        .find('.is-invalid')
        .closest(".#{group}")
        .find(".maximize-#{group}")
        .click()

      setTimeout ->
        scrollOffset = window.innerHeight * 0.3
        $('html, body').animate({
          scrollTop: $fieldset
            .find('.is-invalid')
            .first()
            .parent()
            .offset()
            .top - scrollOffset
        }, 300)
      , 300

    return isValid

  saveAndQuit = () ->
    $form.removeAttr('data-remote')
    $form.off('submit.Parsley')
    $form.off('form:validate')
    $form.find('input').inputmask('remove')
    $form.get(0).submit()

  showInitialFieldset = () ->
    index = $form.find('#property_data_form_last_fieldset').val()
    fieldset = $('fieldset')[index]
    showFieldset(fieldset)

  showFieldset = (fieldset) ->
    $('fieldset').removeClass('active')
    $(fieldset).addClass('active')
    window.scrollTo(0, 0)
    $form.parsley().reset()
    updateFormProgress()
    updateFormButtons()
    resetFormSubmitButtonsCooldown()
    setTimeout updateFormSubmitButtons, 0

  showNextFieldsetAndSave = () ->
    $fieldsets = $('fieldset')
    $fieldset  = $('fieldset.active')
    index      = $fieldsets.index($fieldset)
    next       = $fieldsets[index + 1]

    if next and next.dataset.skip is 'true'
      next = $fieldsets[index + 2]

    $form.find('#property_data_form_last_fieldset').val($fieldsets.index(next))

    isFormValid = $form.parsley().validate()
    if isFormValid
      $form.find('#submit_type').val('hard')
    else
      $form.find('#submit_type').val('soft')

    if $(next).is('fieldset')
      showFieldset(next)
      $form.trigger('submit.rails')
    else
      saveAndQuit()

  showPrevFieldset = () ->
    $fieldsets = $('fieldset')
    $fieldset  = $('fieldset.active')
    index      = $fieldsets.index($fieldset)
    prev       = $fieldsets[index - 1]

    if prev.dataset.skip is 'true'
      prev = $fieldsets[index - 2]

    if $(prev).is('fieldset')
      showFieldset(prev)

  updateFormProgress = () ->
    $progress        = $('.form-progress')
    $container       = $progress.find('.steps')
    $currentFieldset = $('fieldset.active')
    $currentGroup    = $currentFieldset.closest('.fieldset-group')
    currentStep      = $currentGroup.data('title')
    currentSubstep   = $currentFieldset.data('title')


    getStep = (group) ->
      {
        title: group.dataset.title,
        icon: group.dataset.icon,
        substeps: getSubsteps(group)
      }

    getSubstep = (fieldset) ->
      {
        title: fieldset.dataset.title
      }

    getSubsteps = (group) ->
      $(group).find('fieldset')
        .map (_, fieldset) -> getSubstep(fieldset)
        .filter (_, substep) -> substep.title

    steps = $('.fieldset-group')
      .map (_, group) -> getStep(group)
      .filter (_, step) -> step.title


    getCompletionClass = (step, currentStep, complete) ->
      if step.title is currentStep
        'current'
      else if complete
        'done'
      else
        ''

    if $currentGroup.data('hide-progress')
      return $progress.addClass('d-none')
    else
      $progress.removeClass('d-none')

    $container.empty()

    complete = true
    complete = false if $currentGroup.data('initial-progress') is false

    steps.each (_, step) ->
      completionClass = getCompletionClass(step, currentStep, complete)

      $container.append("
        <div class='step #{completionClass}'>
          <div class='icon'>
            <img src='#{step.icon}'/>
          </div>
          <span>#{step.title}</span>
        </div>")

      step.substeps.each (_, substep) ->
        completionClass = getCompletionClass(substep, currentSubstep, complete)
        complete = false if substep.title is currentSubstep

        $container.append("
          <div class='substep #{completionClass}'>
            <span>#{substep.title}</span>
          </div>")

  showFormButtons = () ->
    buttonContainer = $form.find('.form-actions')
    buttonContainer.removeClass('d-none')

  updateFormButtons = () ->
    $fieldset = $('fieldset.active')
    index     = $('fieldset').index($fieldset)
    $prev     = $('.form-prev')
    $next     = $('.form-next')
    $arrow    = $('.arrow-next')

    if index is 0 or $fieldset.data('prev-btn-hide')
      $prev.hide()
    else
      $prev.show()

    if index is 0
      $arrow.show()
    else
      $arrow.hide()

    if $fieldset.data('next-btn-label')
      $next.text($fieldset.data('next-btn-label'))
    else
      $next.text($next.data('default-label'))

  resetFormSubmitButtonsCooldown = () ->
    updateFormSubmitButtonsCooldown = 2

  updateFormSubmitButtons = () ->
    updateFormSubmitButtonsCooldown -= 1
    return if updateFormSubmitButtonsCooldown <= 0

    $save = $('.form-save')

    return if $save.length is 0

    isFormValid = $form.parsley().isValid() && validateProperties()
    if isFormValid
      $save.prop('disabled', false)
    else
      $save.prop('disabled', true)

  showInitialFieldset()
  showFormButtons()
  setInterval(updateFormSubmitButtons, 750)


  $form.find('.form-next').on 'click', (e) ->
    e.preventDefault()
    return if this.disabled

    $(this).prop('disabled', true)
    if validateCurrentFieldset()
      showNextFieldsetAndSave()
    $(this).prop('disabled', false)

  $form.find('.form-prev').on 'click', (e) ->
    e.preventDefault()

    showPrevFieldset()

  $form.find('.form-save').on 'click', (e) ->
    e.preventDefault()
    return if this.disabled

    $(this).prop('disabled', true)
    if validateCurrentFieldset()
      saveAndQuit()
    $(this).prop('disabled', false)


  $form.on 'input change', 'input, select', resetFormSubmitButtonsCooldown


  $form.find('input[data-slide-target]').on 'change', ->
    slideTargets = this.dataset.slideTarget.split(' ')
    slideTargets.forEach (slideTarget) ->
      target  = slideTarget.split(':')[0]
      show    = slideTarget.split(':')[1] is 'show'
      $target = $(target)

      if show
        $target.slideDown()
      else
        $target.slideUp()

      $target.find('input[data-parsley-required]').each ->
        this.dataset.parsleyRequired = show && $(this).parent().is(':visible')
        true

      if not show
        $target.find('.is-invalid').removeClass('is-invalid')
        $target.find('ul.parsley-errors-list').remove()


  $payment_to_whom_husband = $('.payment-to-whom input').first()
  $payment_to_whom_wife    = $('.payment-to-whom input').last()
  $payment_to_whom_husband.labelauty({
    checked_label:   $payment_to_whom_husband.data('name'),
    unchecked_label: $payment_to_whom_husband.data('name')
  })
  $payment_to_whom_wife.labelauty({
    checked_label:   $payment_to_whom_wife.data('name'),
    unchecked_label: $payment_to_whom_wife.data('name')
  })


  $form.find('.interest-rate').on 'keypress', (event) ->
    '0123456789,.'.indexOf(event.key) isnt -1

  $form.find('.interest-rate').on 'input', (event) ->
    min = parseInt this.dataset.min
    max = parseInt this.dataset.max
    val = parseFloat this.value.replace(',', '.')

    if val < min
      this.value = this.dataset.min
    else if val > max
      this.value = this.dataset.max


  $form.find('.ssn2').inputmask('9{4}', {
    jitMasking: true
  })


  $form.find('.case-number-field').inputmask('T-*{*}', {
    clearMaskOnLostFocus: false,
    definitions: {
      '*': {
        validator: "[0-9A-Za-z\-]"
      }
    }
  })


  $form.find('.payment-how-much').inputmask(numericalSettings)


  $form.on 'focus', '[type=tel]', ->
    isInputmask = $(this).inputmask('hasMaskedValue')
    isAndroid = /(android)/i.test navigator.userAgent
    this.type = 'number' if isInputmask and isAndroid


  # ASSETS AND DEBTS


  initProperties = ->
    $form
      .find('input[type="range"]')
      .filter (i, node) -> node.id.indexOf('template') is -1
      .asRange(rangeSettings)

    $form
      .find('.numerical')
      .filter (i, node) -> node.id.indexOf('template') is -1
      .inputmask(numericalSettings)


  addProperty = (group, type) ->
    id = String(Date.now())

    $container = $form.find(".#{group}s")
    $template  = $form.find(".template-#{type} .#{group}")

    $prop = $template
      .clone()
      .removeClass('d-none')
      .appendTo($container)

    $prop
      .find('input[type="range"]')
      .asRange(rangeSettings)

    $prop.find('input[data-plugin="datepicker"]').datepicker()

    $prop.find('.numerical').inputmask(numericalSettings)

    $prop.find('input').each (i, input) ->
      old_name = $(input).attr('name')
      new_name = old_name.replace('[template]', "[#{id}]")
      input.id   = new_name
      input.name = new_name

    $("#any-#{group}s-error").html('')
    resetFormSubmitButtonsCooldown()


  resetProperties = (type) ->
    setTimeout( ->
      $form.find(".#{type}s").empty()
      addProperty(type)
    , 400)


  $form.on 'click', '.add-asset a', (e) ->
    e.preventDefault()
    type = $('.add-asset select').val()
    addProperty('asset', type)

  $form.on 'click', '.add-debt a', (e) ->
    e.preventDefault()
    type = $('.add-debt select').val()
    addProperty('debt', type)


  $form.on 'click', '.remove-asset', (e) ->
    e.preventDefault()
    if confirm(this.dataset.confirmText)
      $(this).closest('.asset').remove()
      resetFormSubmitButtonsCooldown()

  $form.on 'click', '.remove-debt', (e) ->
    e.preventDefault()
    if confirm(this.dataset.confirmText)
      $(this).closest('.debt').remove()
      resetFormSubmitButtonsCooldown()


  slideUpTime = 600
  slideDownTime = 600

  $form.on 'click', '.minimize-asset', (e) ->
    e.preventDefault()
    $asset = $(this).closest('.asset')
    $asset.find('.asset-fields').slideUp(slideUpTime)
    setTimeout ->
      $asset.addClass('minimized')
    , slideUpTime

  $form.on 'click', '.minimize-debt', (e) ->
    e.preventDefault()
    $debt = $(this).closest('.debt')
    $debt.find('.debt-fields').slideUp(slideUpTime)
    setTimeout ->
      $debt.addClass('minimized')
    , slideUpTime


  $form.on 'click', '.maximize-asset', (e) ->
    e.preventDefault()
    $asset = $(this).closest('.asset')
    $asset.removeClass('minimized')
    $asset.find('.asset-fields').slideDown(slideDownTime)

  $form.on 'click', '.maximize-debt', (e) ->
    e.preventDefault()
    $debt = $(this).closest('.debt')
    $debt.removeClass('minimized')
    $debt.find('.debt-fields').slideDown(slideDownTime)


  $form.on 'change', 'input[name="property[data[assets_debts][any_assets]]"]', () ->
    skip = this.value is 'false'
    $('[data-group=assets]').get(0).dataset.skip = skip
    resetProperties('asset')


  $form.on 'change', 'input[name="property[data[assets_debts][any_debts]]"]', () ->
    skip = this.value is 'false'
    $('[data-group=debts]').get(0).dataset.skip = skip
    resetProperties('debt')


  initProperties()


  # OTHER


  $form.on 'click', '.faq > .btn', ->
    $answer = $(this).closest('.faq').find('.faq-body')
    show = $answer.css('display') is 'none'

    if show
      $answer.slideDown()
    else
      $answer.slideUp()
