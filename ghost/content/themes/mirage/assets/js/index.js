$(function(){
    var docBody = $('html, body');

    if($('.menu-top').length > 0) {
      //toggle mobile menu
      $('.toggle-mobile-menu').click(function( event ) {
        event.preventDefault();
        $('#menu ul').slideToggle("slow");
        $(this).toggleClass("open");
      });

      //add active style for current page
      $('#menu a[href="'+ location.pathname +'"]').addClass("active");
    }

    // blog article catalog
    var dir = $('.directory');
    if (dir.length > 0) {
      var postDir = $('.post-content h2');
      var catalog = $('.catalog');
      var headers = [];
      postDir.each(function(index) {
        $(this).attr('id', 'h2-' + index);
        headers.push('<li><a href="#h2-' + index + '">' + $(this).text() + '</a></li>');
      });
      catalog.append(headers.join(''));
    }

    //scroll page on top
    $('.post-template .to_top a').click(function( event ) {
      event.preventDefault();
      docBody.animate({ scrollTop: 0 });
    });
});