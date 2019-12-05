$(function () {

    /* Nav SubMenu */
    $(".nav__menu_item-dropdown").on('click', function () {

        $(".submenu__block").slideToggle(500);

    });

    $(".subMenuClose").on('click', function () {

        $(".submenu__block").removeAttr();
    });


    /* Mobile Menu */
    $(".toggle-btn").on('click', function () {
        showMenu();
    });

    $(".overlay").on('click', function () {
        hideMenu();
    });
    $(".mobile__menu_item-dropdown").on('click', function () {
        showSubMenu();
    });

    $(".mobile__submenu_column-header").on('click', function () {
        hideSubMenu();
    });
    function showMenu() {
        $(".mobile__menu").toggleClass('is_open');
        $(".overlay").toggleClass('is_visible');

    }
    function showSubMenu() {
        $(".mobile__submenu").toggleClass('is_open');
    }

    function hideMenu() {
        $(".mobile__menu").toggleClass('is_open');
        $(".overlay").toggleClass('is_visible');
    }
    function hideSubMenu() {
        $(".mobile__submenu").toggleClass('is_open');
    }

    $(window).on('resize', function () {

        if ($(document).width() > 992) {
            if ($(".mobile__menu").hasClass('is_open')) {
                $(".mobile__menu").removeClass('is_open');
            }
            if ($(".overlay").hasClass('is_visible')) {
                $(".overlay").removeClass('is_visible');
            }
        }
    });

    /* Search form */
    $(".search__button").on('click', function (e) {
        let searchInput = $(".search__input");

        if (searchInput.width() === 0 ){
            let searchInputWidth = searchInput.css({ "width": "auto" }).outerWidth();
            searchInput.css({"width":"0"});
            searchInput.animate({
                "width": searchInputWidth,
                "padding": '0 10px'
            }, 100);
            return false;
        } else {
            searchInput.animate({
                "width": "0",
                "padding": '0'
            }, 100);
            return false;
        }

    })

    /* Banner Slider */
    $('.banner__items').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true,
        autoplay: true,
        autoplaySpeed: 4000,
        fade: false
    });

    /* Partners Slider */
    $('.partners__links').slick({
        dots: false,
        infinite: true,
        arrows: false,
        mobileFirst: true,
        autoplaySpeed: 4000,
        autoplay: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 720,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    infinite: false,
                    dots: false
                }
            }
        ]


    });

    $(".partners__sliderArrow-prev").on("click", function() {
        $('.partners__links').slick("slickPrev");

    });

    $(".partners__sliderArrow-next").on("click", function() {
        $('.partners__links').slick("slickNext");
    });


  /* Animation on Phone link Hover*/
    $(".phone").hover( function () {
        $('.phone__img').toggleClass('swing');
    });



    /* Scroll To Top*/
    let scrl = 0;
    let st = $('.scroll-to-top');
    let umt = $('.user__menu_toggle');
    $(window).scroll(function () {
        if ($(this).scrollTop() > 500) {
            if (scrl === 0) {
                scrl = 1
                st.addClass('vis');
            }
        } else if (scrl === 1) {
            scrl = 0
            st.removeClass('vis');
        }
    })
    st.on('click', function () {
        return $('html, body').animate({scrollTop: 0}, 1000)
    })






});


