$(document).ready ->
  $form = $('.property-form > form')
  return unless $form.length


  beforeValidSubmit = ->
    $form.find('.template .asset').remove()
    $form.find('.template .debt').remove()

    any_assets = document.getElementById('property_data[assets_debts][any_assets]_true').checked
    if any_assets
      $form.find('.asset .tab-pane:not(.active)').remove()
    else
      $form.find('.asset').remove()

    any_debts = document.getElementById('property_data[assets_debts][any_debts]_true').checked
    if any_debts
      $form.find('.debt .tab-pane:not(.active)').remove()
    else
      $form.find('.debt').remove()


  window.Parsley.on 'form:submit', ->
    beforeValidSubmit()


  $form.find('.soft-submit').on 'click', ->
    $form.find('#submit_type').val('soft')
    $form.off('submit.Parsley')
    $form.off('form:validate')
    beforeValidSubmit()


  $form.find('.hard-submit').on 'click', ->
    $form.find('#submit_type').val('hard')


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
        this.dataset.parsleyRequired = show
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


  $form.find('.case-number-field').inputmask('T-*{*}', {
    clearMaskOnLostFocus: false
  })


  # ASSETS AND DEBTS


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


  initProperties = ->
    $form
      .find('input[type="range"]')
      .filter (i, node) -> node.id.indexOf('template') is -1
      .asRange(rangeSettings)

    setTimeout( ->
      $form.find('.asset a.nav-link.active').click()
      $form.find('.debt a.nav-link.active').click()
    , 0)


  addProperty = (type) ->
    id = String(Date.now())

    $container = $form.find(".#{type}s")
    $template  = $form.find(".template .#{type}")

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


  updatePropertyTitles = ($tab) ->
    tab    = $tab.data('tab')
    name   = $tab.data('name')
    $panel = $tab.find("#panel_#{tab}")
    $panel.children().each (index, entry) ->
      $(entry).find('a.panel-title').text("#{name} ##{index + 1}")


  $form.on 'click', '.asset a[data-toggle="tab"], .debt a[data-toggle="tab"]', ->
    $parent = $(this).closest('.asset, .debt')
    $parent.find('.tab-content.d-none').removeClass('d-none')


  $form.on 'click', '.add-asset a', (e) ->
    e.preventDefault()
    addProperty('asset')


  $form.on 'click', '.add-debt a', (e) ->
    e.preventDefault()
    addProperty('debt')


  $form.on 'click', '.remove-asset', (e) ->
    e.preventDefault()
    $(this).closest('.asset').remove()


  $form.on 'click', '.remove-debt', (e) ->
    e.preventDefault()
    $(this).closest('.debt').remove()


  $form.on 'change', 'input[name="property[data[assets_debts][any_assets]]"]', () ->
    resetProperties('asset')


  $form.on 'change', 'input[name="property[data[assets_debts][any_debts]]"]', () ->
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
