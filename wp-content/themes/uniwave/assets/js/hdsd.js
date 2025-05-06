(function($) {
    // HDSD JS
    jQuery(document).ready(function($) {
       
    //$('#faq-menu').toggleClass('ccodon2');    
        var menuList = $(".ccodon2").find("li");
        menuList.find("ul").hide();
        menuList.on("click", function(e){
                        var childUl = $(this).find("ul");
                        if (childUl.length < 1 || childUl.is(':visible')) {
                            return;
                        }
                        e.preventDefault();
        menuList.removeClass("open");
        menuList.find("ul").slideUp(400);
        childUl.slideDown(400);
        $(this).addClass("open");
        });
        
    });
})(jQuery);