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

    //scroll page on top
    $('.post-template .to_top a').click(function( event ) {
      event.preventDefault();
      docBody.animate({ scrollTop: 0 });
    });
});