$(document).ready ->
  $form = $('.property-form > form')
  return unless $form.length


  # submitting = false

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
  }

  numericalSettings = {
    alias: 'integer',
    regex: '\\d*',
    rightAlign: false,
    allowPlus: false,
    allowMinus: false,
    autoGroup: true,
    groupSeparator: ' ',
    removeMaskOnSubmit: true
  }


  # beforeSubmit = ->
  #   $form.find('.template .asset').remove()
  #   $form.find('.template .debt').remove()

  #   any_assets = document.getElementById('property_data[assets_debts][any_assets]_true').checked
  #   if any_assets
  #     $form.find('.asset .tab-pane:not(.active)').remove()
  #   else
  #     $form.find('.asset').remove()

  #   any_debts = document.getElementById('property_data[assets_debts][any_debts]_true').checked
  #   if any_debts
  #     $form.find('.debt .tab-pane:not(.active)').remove()
  #   else
  #     $form.find('.debt').remove()


  # forceSubmit = ->
  #   $form.off('submit.Parsley')
  #   $form.off('form:validate')
  #   beforeSubmit()
  #   $form.submit()


  # disableSubmitButtons = ->
  #   $('.soft-submit, .hard-submit').prop('disabled', true)

  # enableSubmitButtons = ->
  #   $('.soft-submit, .hard-submit').prop('disabled', false)


  # window.Parsley.on 'form:validated', ->
  #   enableSubmitButtons()

  #   if $form.parsley().isValid()
  #     if submitting
  #       forceSubmit()

  #   else
  #     $invalid = $('.is-invalid:first').closest('.form-group')
  #     if $invalid.length
  #       window.scrollTo 0, $invalid.offset().top - window.innerHeight * 0.4


  # $form.find('.soft-submit').on 'click', (e) ->
  #   e.preventDefault()
  #   disableSubmitButtons()
  #   $form.find('#submit_type').val('soft')
  #   forceSubmit()


  # $form.find('.hard-submit').on 'click', (e) ->
  #   e.preventDefault()
  #   disableSubmitButtons()
  #   submitting = true
  #   $form.find('#submit_type').val('hard')
  #   $form.parsley().validate()


  # $form.find('.signup-submit').on 'click', (e) ->
  #   e.preventDefault()
  #   email = $('#customer_email')
  #   password = $('#customer_password')
  #   email.parsley().validate()
  #   password.parsley().validate()

  #   valid = email.parsley().isValid() && password.parsley().isValid()
  #   return unless valid

  #   $form.find('.signup-submit').get(0).disabled = true
  #   $form.find('#submit_type').val('soft')
  #   forceSubmit()


  validateCurrentFieldset = () ->
    $fieldset = $('fieldset.active')
    group = $fieldset.data('group')
    return $form.parsley().validate({ group: group })

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
    updateFormSubmitButtons()

  showNextFieldsetAndSave = () ->
    $fieldsets = $('fieldset')
    $fieldset  = $('fieldset.active')
    index      = $fieldsets.index($fieldset)
    next       = $fieldsets[index + 1]

    if next and next.dataset.skip is 'true'
      next = $fieldsets[index + 2]

    $form.find('#property_data_form_last_fieldset').val($fieldsets.index(next))

    if $(next).is('fieldset')
      showFieldset(next)
      $form.find('#submit_type').val('soft')
      $form.trigger('submit.rails')
    else
      $form.removeAttr('data-remote')
      $form.off('submit.Parsley')
      $form.off('form:validate')
      $form.find('#submit_type').val('hard')
      $form.get(0).submit()

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
    $progress      = $('#form-progress')
    $subprogress   = $('#form-subprogress')
    $fieldset      = $('fieldset.active')
    $group         = $fieldset.closest('.fieldset-group')
    currentStep    = $group.data('title')
    currentSubstep = $fieldset.data('title')

    steps = $('.fieldset-group')
      .map (_, v) -> v.dataset.title
      .filter (_, v) -> v
    substeps = $group.find('fieldset')
      .map (_, v) -> v.dataset.title
      .filter (_, v) -> v

    $progress.empty()
    $subprogress.empty()

    stepBackgroundClass = (active, complete) ->
      if active
        'current active'
      else
        if complete
          'bg-white'
        else
          'bg-white'

    if currentStep
      complete = true
      steps.each (_, step) ->
        active = step is currentStep
        complete = false if active

        $progress.append("
          <div class='step #{ stepBackgroundClass(active, complete) }'>
            <span class='step-title'>
              #{ step }
            </span>
          </div>
        ")

    if currentStep and currentSubstep and substeps.length > 1 and $fieldset.get(0).dataset.hideSubprogress isnt 'true'
      complete = true
      substeps.each (_, substep) ->
        active = substep is currentSubstep
        complete = false if active

        $subprogress.append("
          <div class='step #{ stepBackgroundClass(active, complete) }'>
            <span>
              #{ substep }
            </span>
          </div>
        ")

  updateFormSubmitButtons = () ->
    $fieldset = $('fieldset.active')
    index = $('fieldset').index($fieldset)

    if index is 0
      $('.form-prev').hide()
    else
      $('.form-prev').show()

  showInitialFieldset()


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
    numericInput: true,
    jitMasking: true
  })


  $form.find('.case-number-field').inputmask('T-*{*}', {
    clearMaskOnLostFocus: false
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

    setTimeout( ->
      $form.find('.asset a.nav-link.active').click()
      $form.find('.debt a.nav-link.active').click()
    , 0)


  addProperty = (group, type) ->
    id = String(Date.now())

    $container = $form.find(".#{group}s")
    $template  = $form.find(".template-#{type} .#{group}")

    $prop = $template
      .clone()
      .removeClass('d-none')
      .appendTo($container)

    $prop
      .find('a.nav-link')
      .each (_, node) ->
        new_id = "#asset_#{node.dataset.tab}_#{id}"
        node.href = new_id
        node.setAttribute('aria-controls', new_id)

    $prop
      .find('.tab-pane')
      .each (_, node) ->
        new_id = "asset_#{node.dataset.tab}_#{id}"
        node.id = new_id

    $prop.find('.plugin-tabs').tabs()

    $prop
      .find('input[type="range"]')
      .asRange(rangeSettings)

    $prop.find('input[data-plugin="datepicker"]').datepicker({
      container: '.page'
    })

    $prop.find('.numerical').inputmask(numericalSettings)

    $prop.find('input').each (i, input) ->
      old_name = $(input).attr('name')
      new_name = old_name.replace('[template]', "[#{id}]")
      input.id   = new_name
      input.name = new_name


  resetProperties = (type) ->
    setTimeout( ->
      $form.find(".#{type}s").empty()
      addProperty(type)
    , 400)


  $form.on 'click', '.asset a[data-toggle="tab"], .debt a[data-toggle="tab"]', ->
    $parent = $(this).closest('.asset, .debt')
    $parent.find('.tab-content.d-none').removeClass('d-none')


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
    $(this).closest('.asset').remove()

  $form.on 'click', '.remove-debt', (e) ->
    e.preventDefault()
    $(this).closest('.debt').remove()


  $form.on 'click', '.minimize-asset', (e) ->
    e.preventDefault()
    $asset = $(this).closest('.asset')
    $asset.find('.asset-fields').slideUp(300)
    setTimeout ->
      $asset.addClass('minimized')
    , 300

  $form.on 'click', '.minimize-debt', (e) ->
    e.preventDefault()
    $debt = $(this).closest('.debt')
    $debt.find('.debt-fields').slideUp(300)
    setTimeout ->
      $debt.addClass('minimized')
    , 300


  $form.on 'click', '.maximize-asset', (e) ->
    e.preventDefault()
    $asset = $(this).closest('.asset')
    $asset.removeClass('minimized')
    $asset.find('.asset-fields').slideDown(300)

  $form.on 'click', '.maximize-debt', (e) ->
    e.preventDefault()
    $debt = $(this).closest('.debt')
    $debt.removeClass('minimized')
    $debt.find('.debt-fields').slideDown(300)


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
