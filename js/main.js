
/*--------------------------------------------------------*/
/* TABLE OF CONTENTS: */
/*--------------------------------------------------------*/

/* 01 - VARIABLES */
/* 02 - page calculations */
/* 03 - function on document ready */
/* 04 - function on page load */
/* 05 - function on page resize */
/* 06 - function on page scroll */
/* 07 - swiper sliders */
/* 08 - buttons, clicks, hovers */

var _functions = {};

$(function() {

    "use strict";

  /*================*/
  /* 01 - VARIABLES */
  /*================*/
  var swipers = [], winW, winH, headerH, winScr, footerTop, _isresponsive, _ismobile = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i), _isFF = 'MozAppearance' in document.documentElement.style,headerHeight;

  /*========================*/
  /* 02 - page calculations */
  /*========================*/
  _functions.pageCalculations = function(){
    winW = $(window).width();
    winH = $(window).height();
    headerHeight = $('header').outerHeight();
    $('.pageHeight .cell-view').css('height', winH);
    revealInit();
  };

  /*==============================*/
  /* 03 - function on page scroll */
  /*==============================*/
  $(window).scroll(function(){
    _functions.scrollCall();
    $('body.loaded .reveal-animate').each(function(){
            if($(this).data('top')<(winScr+winH)) $(this).addClass('visible');
        });
  });

  _functions.scrollCall = function(){
    winScr = $(window).scrollTop();
    pageScroll();
  };

  /*=================================*/
  /* 04 - function on document ready */
  /*=================================*/
  if(_ismobile) $('body').addClass('mobile');
  _functions.pageCalculations();
  _functions.scrollCall();
  if ($('.sumoWrapper').length) {
    $('.SelectBox').SumoSelect();
  }
  videoPopup();
  revealInit();

  /*============================*/
  /* 05 - function on page load */
  /*============================*/
  $(window).load(function(){
    _functions.initSwiper();
    $('body').addClass('loaded');
    $('#loader-wrapper').fadeOut();

    // Masonry
    if ($('.grid').length) {
      var $grid = $('.grid').isotope({
        itemSelector: '.grid-item',
        layoutMode: 'masonry',
        percentPosition: true,
        masonry: {
          columnWidth: '.grid-sizer',
          },
        stamp: ".stamp"
      });
    }
    // filter functions
    var filterFns = {
      // show if number is greater than 50
      numberGreaterThan50: function() {
        var number = $(this).find('.number').text();
        return parseInt( number, 10 ) > 50;
      },
      // show if name ends with -ium
      ium: function() {
        var name = $(this).find('.name').text();
        return name.match( /ium$/ );
      }
    };
    // bind filter button click
    $('.filters-button-group').on( 'click', 'div', function() {
      var filterValue = $( this ).attr('data-filter');
      // use filterFn if matches value
      filterValue = filterFns[ filterValue ] || filterValue;
      $grid.isotope({ filter: filterValue });
    });
    // change is-checked class on buttons
    $('.button-group').each( function( i, buttonGroup ) {
      var $buttonGroup = $( buttonGroup );
      $buttonGroup.on( 'click', 'div', function() {
        $buttonGroup.find('.is-checked').removeClass('is-checked');
        $( this ).addClass('is-checked');
      });
    });
  });

  /*==============================*/
  /* 06 - function on page resize */
  /*==============================*/
  _functions.resizeCall = function(){
    _functions.pageCalculations();
  };
  if(!_ismobile){
    $(window).resize(function(){
      _functions.resizeCall();
    });
  } else{
    window.addEventListener("orientationchange", function() {
      _functions.resizeCall();
    }, false);
  }

  /*=====================*/
  /* 07 - swiper sliders */
  /*=====================*/
  var initIterator = 0;
  _functions.initSwiper = function(){
    $('.swiper-container').not('.initialized').each(function(){                 
      var $t = $(this);                 

      var index = 'swiper-unique-id-'+initIterator;

      $t.addClass('swiper-'+index+' initialized').attr('id', index);
      $t.find('>.swiper-pagination').addClass('swiper-pagination-'+index);
      $t.parent().find('>.swiper-button-prev').addClass('swiper-button-prev-'+index);
      $t.parent().find('>.swiper-button-next').addClass('swiper-button-next-'+index);

      var slidesPerViewVar = ($t.data('slides-per-view'))?$t.data('slides-per-view'):1;
      if(slidesPerViewVar!='auto') slidesPerViewVar = parseInt(slidesPerViewVar, 10);

      swipers['swiper-'+index] = new Swiper('.swiper-'+index,{
        pagination: '.swiper-pagination-'+index,
            paginationClickable: true,
            nextButton: '.swiper-button-next-'+index,
            prevButton: '.swiper-button-prev-'+index,
            slidesPerView: slidesPerViewVar,
            autoHeight:($t.is('[data-auto-height]'))?parseInt($t.data('auto-height'), 10):0,
            loop: ($t.is('[data-loop]'))?parseInt($t.data('loop'), 10):0,
            autoplay: ($t.is('[data-autoplay]'))?parseInt($t.data('autoplay'), 10):0,
            breakpoints: ($t.is('[data-breakpoints]'))? { 767: { slidesPerView: parseInt($t.attr('data-xs-slides'), 10) }, 991: { slidesPerView: parseInt($t.attr('data-sm-slides'), 10) }, 1199: { slidesPerView: parseInt($t.attr('data-md-slides'), 10) } } : {},
            initialSlide: ($t.is('[data-ini]'))?parseInt($t.data('ini'), 10):0,
            speed: ($t.is('[data-speed]'))?parseInt($t.data('speed'), 10):500,
            keyboardControl: true,
            mousewheelControl: ($t.is('[data-mousewheel]'))?parseInt($t.data('mousewheel'), 10):0,
            mousewheelReleaseOnEdges: true,
            direction: ($t.is('[data-direction]'))?$t.data('direction'):'horizontal',
            centeredSlides: ($t.is('[data-centered]'))?parseInt($t.data('centered'), 10):0,
            spaceBetween: ($t.is('[data-space]'))?parseInt($t.data('space'), 10):0,
            parallax: (_isFF)?($t.data('parallax'), 0): ($t.is('[data-parallax]'))?parseInt($t.data('parallax'), 10):0,
            onTransitionEnd: function(swiper) {
                    if ( $t.hasClass('swiper-control-top') ) {
                        var activeIndex = swiper.activeIndex,
                        slidersWrapper = $t.closest('.swipers-couple-wrapper');
                        swipers['swiper-'+slidersWrapper.find('.swiper-control-bottom').attr('id')].slideTo(activeIndex);
                        slidersWrapper.find('.swiper-control-bottom').find('.bottomActiveSlide').removeClass('bottomActiveSlide');
                        slidersWrapper.find('.swiper-control-bottom').find('.swiper-slide').eq(activeIndex).addClass('bottomActiveSlide');
                    }
                }
      });
      swipers['swiper-'+index].update();
      initIterator++;
    });
    $('.swiper-container.swiper-control-top').each(function(){
      swipers['swiper-'+$(this).attr('id')].params.control = swipers['swiper-'+$(this).closest('.swipers-couple-wrapper').find('.swiper-control-bottom').attr('id')];
    });
    $('.swiper-container.swiper-control-bottom').each(function(){
      swipers['swiper-'+$(this).attr('id')].params.control = swipers['swiper-'+$(this).closest('.swipers-couple-wrapper').find('.swiper-control-top').attr('id')];
    });
  };

  /*==============================*/
  /* 08 - buttons, clicks, hovers */
  /*==============================*/

  //open and close popup
  $(document).on('click', '.open-popup', function(){
    $('.popup-content').removeClass('active');
    $('.popup-wrapper, .popup-content[data-rel="'+$(this).data('rel')+'"]').addClass('active');
    $('html').addClass('overflow-hidden');
    return false;
  });

  $(document).on('click', '.popup-wrapper .button-close, .popup-wrapper .layer-close', function(){
    $('.popup-wrapper, .popup-content').removeClass('active');
    $('html').removeClass('overflow-hidden');
    $('.embed-responsive').html('');
    setTimeout(function(){
      $('.ajax-popup').remove();
    },300);
    return false;
  });

    //Open menu
    $('.hamburger').on('click', function() {
      $(this).toggleClass('hamburgerActive');
      $('.KP-navigation').toggleClass('openMenu');
      $('html, body').toggleClass('stopScrollPage');
      $('.KP-header').toggleClass('headerBg');
      $('#content-block').toggleClass('headerBlackBg');
    });

    //AJax
    $(document).on('click', '.ajaxButton', function(){
      event.preventDefault();
      var url = $(this).attr('href');
      $('.ajaxLoader').fadeIn();
      $.ajax({
        type:"GET",
        async:true,
        url: url,
        success:function(response){
          var responseObject = $($.parseHTML(response));
          setTimeout(function() {
            $('.ajaxWrapper').append(responseObject);
            $('.ajaxContent').animate({opacity: 1, top: 0}, 999);
            $('.ajaxLoader').fadeOut();
            }, 1500);
          }
        });
    });

    //only number for input phone
    $('.KP-phone').keydown(function (e) {
          // Allow: backspace, delete, tab, escape, enter and .
          if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
               // Allow: Ctrl+A, Command+A
              (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) || 
               // Allow: home, end, left, right, down, up
              (e.keyCode >= 35 && e.keyCode <= 40)) {
                   // let it happen, don't do anything
                   return;
          }
          // Ensure that it is a number and stop the keypress
          if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
              e.preventDefault();
          }
      });

    //Responsive masonry filter
    $('.filterWrapper').on('click', function() {
      $('.button-group').slideToggle(350);
    });

    //init reveal animate function
    function revealInit(){
        $('.reveal-animate').each(function(){
            $(this).addClass('no-transition');
            $(this).data('top', $(this).offset().top + $(this).outerHeight());
            $(this).removeClass('no-transition');
        });
    }

    //Controll top slide
    $('.controlTopSlide').on('click', function () {
        var slideIndex = $(this).closest('.swiper-container').find('.swiper-slide').index($(this).parent());
        swipers['swiper-'+$(this).closest('.swipers-couple-wrapper').find('.swiper-control-top').attr('id')].slideTo(slideIndex);
    });

    //FUNCTIONS

    //Video popup
    function videoPopup() {
      $('.openVideo').on('click', function(){
        openPopup($(this).data('rel'));
        $('.popup-content[data-rel="'+$(this).data('rel')+'"]').find('.embed-responsive').html('<iframe class="embed-responsive-item" src="'+$(this).data('src')+'?autoplay=1&amp;controls=1&amp;loop=1&amp;modestbranding=1&amp;rel=0&amp;showinfo=0&amp;autohide=0&amp;color=white&amp;iv_load_policy=3&amp;wmode=transparent"></iframe>');
      });
    }

    //OpenPopup
    function openPopup(foo){
      $('.popup-content').removeClass('active');
      $('.popup-wrapper, .popup-content[data-rel="'+foo+'"]').addClass('active');
      $('html').addClass('overflow-hidden');
      return false;
    }

    // Page scoll
    function pageScroll() {
      if ( winScr >=  headerHeight) {
        $('header').addClass('pageScrolled');
      } else {
        $('header').removeClass('pageScrolled');
      }
    }

});
