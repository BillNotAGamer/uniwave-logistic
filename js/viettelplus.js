$(function(){
    $('#tab_guide .tab-control li a').click(function(){
        var content_show = $(this).data('target');
        let w = $(this).data('prog');
        $('#tab_guide .tab-control li').removeClass('active');
        $('#tab_guide .tab-content > div').hide(100);
        $(this).parent().addClass('active');
        $('#' + content_show).show(50);
        $('#bar_border .prog').css('width',w +'%')
   });
   $('.link-scroll').click(function(){
       const _target = $(this).data('target');
       var to = $('#'+_target).offset().top - 20;
       $('html,body').animate({scrollTop:to},500);
   });
   $('#sidebar_ping .list-group a.list-group-item-action').click(function(){
       const cont_active = $(this).data('target');
       $('#sidebar_ping .list-group a').removeClass('active');
       $('.content-detail').hide(100);
       $(this).addClass('active');
       $('#' + cont_active).show(50);
    });
   $('.carousel').owlCarousel({
        lazyLoad:true,
        nav: true,
        loop: true,
        margin: 50,
        items: 5,
        center: true,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:3
            },
            1014:{
                items: 5
            }
        },
        autoplay:false,
        navText:['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
        dots: false
   });
})
