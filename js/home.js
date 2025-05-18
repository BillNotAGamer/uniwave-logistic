function numberWithCommas() {
    var x = document.querySelectorAll('span.timer');

    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    console.log(x);
}

$(function() {
  $("#s1 .u1 li.att").click(function(){
           if($(this).hasClass("acti")){
            $(this).removeClass('acti');
          }
          else{
            $('#s1 .u1 li.att').removeClass('acti');
            $(this).addClass('acti');

            $('.ct-tracuu').slideUp(700);
            var content_show = $(this).attr('data-title');
            $('.' + content_show).slideDown(700);
          }      
  });
  $("#s1 .u2 li").click(function(){
           if($(this).hasClass("active")){
            $(this).removeClass('active');
          }
          else{
            $('#s1 .u2 li').removeClass('active');
            $(this).addClass('active');

            $('#s1 .ct-tracuu .ct-u2').slideUp(700);
            var content_show = $(this).attr('data-title');
            $('.' + content_show).slideDown(700);
          }      
  });
  $("#s2 .ul-tt li").click(function(){
           if($(this).hasClass("on")){
            $(this).removeClass('on');
          }
          else{
            $('#s2 .ul-tt li').removeClass('on');
            $(this).addClass('on');

            $('.ct-tt').slideUp(700);
            var content_show = $(this).attr('data-title');
            $('.' + content_show).slideDown(700);
          }      
  });


  $('.slide-kh').owlCarousel({
      lazyLoad:true,
      loop:true,
      nav: true,
      dots: false,
      margin:20,
      autoHeight:true,
      responsive:{
          0:{
              items:1
          },
          1014:{
              items:2
          }
      },
      autoplay:false,
      navText: [' ', ' ']
  });

  $('.slide-ct-kh').owlCarousel({
    autoplay:true,
    autoplayTimeout:5000,
    autoplayHoverPause:true,
    items:1,
    loop: true,
    onInitialized  : ml_change,
    onTranslated : ml_change
  });

  function ml_change(event) {
    var items     = event.item.count;
    var item      = event.item.index - 1;
    
    if(item > items) {
      item = item - items
    }
    $('.slide-kh').trigger('to.owl.carousel', [item, 500, true]);
    $('.slide-kh .item').removeClass('btc');
    $('.slide-kh').find('.item[data-number="'+item+'"]').addClass('btc');
  }


});