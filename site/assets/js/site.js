// @TODO: can we do it without jQuery? :D
(function () {
  const currentPath = window.location.pathname
    .replace(/\/$/, '');

  // active top nav links
  const $topNavLinks = $('nav .nav-left a');
  $topNavLinks.each(function () {
    const url = $(this).attr('href');

    if (currentPath.indexOf(url) > -1) {
      $topNavLinks.removeClass('is-active');
      $(this).addClass('is-active');
    }
  });

  // active sidebar links
  const $asideLinks = $('aside.menu > ul > li > a');
  $asideLinks.each(function () {
    const url = $(this).attr('href');

    if (currentPath.indexOf(url) > -1) {
      $asideLinks.removeClass('is-active');
      $(this).addClass('is-active');
    }
  });

  // hyperlink headers
  $('.content h1, .content h2, .content h3, .content h4').each(function () {
    const id = $(this).attr('id');
    const title = $(this).text();
    const html = $(this).html();

    if (html.indexOf('<a') > -1) {
      return;
    }

    const newHtml = $('<a>' + title + '</a>')
      .attr('href', '#' + id)
      .addClass('permalink');

    $(this).html(newHtml);
  });
})();
