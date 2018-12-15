$(window).on 'load', ->
  if window.localStorage and $('body').hasClass('admin')
    menubarOpen  = 'site-menubar-unfold'
    menubarClose = 'site-menubar-fold'

    $('a[data-toggle="menubar"]').on 'click', () ->
      setTimeout( ->
        if $('body').hasClass(menubarOpen)
          localStorage.setItem('menubarClass', menubarOpen)
        else if $('body').hasClass(menubarClose)
          localStorage.setItem('menubarClass', menubarClose)
      , 0)

    menubarClass = localStorage.getItem('menubarClass')
    if menubarClass
      $('body')
        .removeClass("#{menubarOpen} #{menubarClose}")
        .addClass(menubarClass)
