// @TODO: can we do it without jQuery? :D
(function () {
  function endUrlWithSlash(url) {
    if (url.endsWith('/')) {
      return url;
    }

    return url + '/';
  }

  const currentPath = endUrlWithSlash(window.location.pathname);

  // active top nav links
  const $topNavLinks = $('nav .nav-left a');
  $topNavLinks.each(function () {
    const url = endUrlWithSlash($(this).attr('href'));

    if (currentPath.indexOf(url) > -1) {
      $topNavLinks.removeClass('is-active');
      $(this).addClass('is-active');
    }
  });

  // active sidebar links
  const $asideLinks = $('aside.menu.docs > ul > li > a');
  $asideLinks.each(function () {
    const url = endUrlWithSlash($(this).attr('href'));

    if (currentPath.indexOf(url) > -1) {
      $asideLinks.removeClass('is-active');
      $(this).addClass('is-active');

      // mount TOC in sidebar from content area
      const $lists = $('.content ul');

      if ($lists.length === 0) {
        // is not TOC
        return;
      }

      if (!$($lists[0]).find('li:first-child').html().startsWith('<a')) {
        // is not TOC
        return;
      }

      const $toc = $($lists[0]);
      $toc.hide();
      $(this).after('<ul>' + $toc.html() + '</ul>');
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
