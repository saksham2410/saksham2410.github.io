$(function() {
  "use strict";

  //calendar


  function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
      // XHR for Chrome/Firefox/Opera/Safari.
      xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
      // XDomainRequest for IE.
      xhr = new XDomainRequest();
      xhr.open(method, url);
    } else {
      // CORS not supported.
      xhr = null;
    }
    return xhr;
  }

  // Helper method to parse the title tag from the response.
  function getTitle(text) {
    return text.match("<title>(.*)?</title>")[1];
  }

  // Make the actual CORS request.
  function makeCorsRequest(phone) {
    // This is a sample server that supports CORS.
    var url = "http://www.socialhubtechnology.in/api/smsapi?";

    var xhr = createCORSRequest("GET", url);
    if (!xhr) {
      alert("CORS not supported");
      return;
    }

    // Response handlers.
    xhr.onload = function() {
      var text = xhr.responseText;
      var title = getTitle(text);
      alert("Response from CORS request to " + url + ": " + title);
    };

    xhr.onerror = function() {
      alert("Woops, there was an error making the request.");
    };

    xhr.send(
      `key=b71a2f6d69bcb51bc7bcd4ffd9c33db0&route=1&sender=EKOLOT&number=${phone}8&sms=Test`
    );
  }
  //===== Prealoder

  $(window).on("load", function(event) {
    $(".preloader")
      .delay(500)
      .fadeOut(500);
  });

  //===== Sticky

  // grab an element
  var myElement = document.querySelector(".headroom");
  // construct an instance of Headroom, passing the element
  var headroom = new Headroom(myElement);
  // initialise
  headroom.init();

  $("#nav").onePageNav({
    currentClass: "active",
    changeHash: true,
    scrollSpeed: 800,
    scrollThreshold: 0.5,
    filter: "",
    easing: "swing",
    begin: function() {
      //I get fired when the animation is starting
    },
    end: function() {
      //I get fired when the animation is ending
    },
    scrollChange: function($currentListItem) {
      //I get fired when you enter a section and I pass the list item of the section
    }
  });

  $.scrollIt({
    scrollTime: 800
  });

  //===== close navbar-collapse when a  clicked

  $(".navbar-nav a").on("click", function() {
    $(".navbar-collapse").removeClass("show");
  });

  $(".main-btn").on("click", function() {
    var phone = document.getElementById("phone").value;
    if (phone.length == 13) phone.slice(3, 13);
    if (phone.length == 12) phone.slice(2, 12);
    if (phone.length == 11) phone.slice(1, 11);
    makeCorsRequest(phone);
    // Create the XHR object.
    
    // console.log(phone)
    // var xhr = new XMLHttpRequest();
    // xhr.open("POST", "http://www.socialhubtechnology.in/api/smsapi?", true);
    // xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // xhr.onload = function() {
    //   // do something to response
    //   console.log(this.responseText);
    // };
    // xhr.send(
    //   `key=b71a2f6d69bcb51bc7bcd4ffd9c33db0&route=1&sender=EKOLOT&number=${phone}8&sms=Test`
    // );
  });

  //===== Mobile Menu

  $(".navbar-toggler").on("click", function() {
    $(this).toggleClass("active");
  });

  $(".navbar-nav a").on("click", function() {
    $(".navbar-toggler").removeClass("active");
  });

  var subMenu = $(".sub-menu-bar .navbar-nav .sub-menu");

  if (subMenu.length) {
    subMenu
      .parent("li")
      .children("a")
      .append(function() {
        return '<button class="sub-nav-toggler"> <span></span> </button>';
      });

    var subMenuToggler = $(".sub-menu-bar .navbar-nav .sub-nav-toggler");

    subMenuToggler.on("click", function() {
      $(this)
        .parent()
        .parent()
        .children(".sub-menu")
        .slideToggle();
      return false;
    });
  }

  //===== Counter Up

  $(".counter").counterUp({
    delay: 10,
    time: 3000
  });

  //===== Isotope Project 1

  $(".container").imagesLoaded(function() {
    var $grid = $(".grid").isotope({
      // options
      transitionDuration: "1s",
      itemSelector: ".grid-item",
      percentPosition: true,
      masonry: {}
    });

    // filter items on button click
    $(".project-menu ul").on("click", "li", function() {
      var filterValue = $(this).attr("data-filter");
      $grid.isotope({ filter: filterValue });
    });

    //for menu active class
    $(".project-menu ul li").on("click", function(event) {
      $(this)
        .siblings(".active")
        .removeClass("active");
      $(this).addClass("active");
      event.preventDefault();
    });
  });

  //===== Back to top

  // Show or hide the sticky footer button
  $(window).on("scroll", function(event) {
    if ($(this).scrollTop() > 600) {
      $(".back-to-top").fadeIn(200);
    } else {
      $(".back-to-top").fadeOut(200);
    }
  });

  //Animate the scroll to yop
  $(".back-to-top").on("click", function(event) {
    event.preventDefault();

    $("html, body").animate(
      {
        scrollTop: 0
      },
      1500
    );
  });

  //=====  services progress

  if ($(".our-services-progress").length) {
    $(".our-services-progress").appear(function() {
      Circles.create({
        id: "circles-1",
        radius: 50,
        value: 100,
        maxValue: 100,
        width: 3,
        text: function(value) {
          return value + "%";
        },
        colors: ["#f0f0f0", "#f14836"],
        duration: 1000,
        wrpClass: "circles-wrp",
        textClass: "circles-text",
        styleWrapper: true,
        styleText: true
      });
    });
  }

  if ($(".our-services-progress").length) {
    $(".our-services-progress").appear(function() {
      Circles.create({
        id: "circles-2",
        radius: 50,
        value: 0,
        maxValue: 100,
        width: 3,
        text: function(value) {
          return value + "%";
        },
        colors: ["#f0f0f0", "#f14836"],
        duration: 1000,
        wrpClass: "circles-wrp",
        textClass: "circles-text",
        styleWrapper: true,
        styleText: true
      });
    });
  }

  if ($(".our-services-progress").length) {
    $(".our-services-progress").appear(function() {
      Circles.create({
        id: "circles-3",
        radius: 50,
        value: 100,
        maxValue: 100,
        width: 3,
        text: function(value) {
          return value + "%";
        },
        colors: ["#f0f0f0", "#f14836"],
        duration: 1000,
        wrpClass: "circles-wrp",
        textClass: "circles-text",
        styleWrapper: true,
        styleText: true
      });
    });
  }

  if ($(".our-services-progress").length) {
    $(".our-services-progress").appear(function() {
      Circles.create({
        id: "circles-4",
        radius: 50,
        value: 70,
        maxValue: 100,
        width: 3,
        text: function(value) {
          return value + "%";
        },
        colors: ["#f0f0f0", "#f14836"],
        duration: 1000,
        wrpClass: "circles-wrp",
        textClass: "circles-text",
        styleWrapper: true,
        styleText: true
      });
    });
  }

  //===== slick Testimonial

  $(".testimonial-active").slick({
    dots: false,
    arrows: true,
    prevArrow: '<span class="prev"><i class="lni-arrow-left"></i></span>',
    nextArrow: '<span class="next"><i class="lni-arrow-right"></i></span>',
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 800,
    slidesToShow: 1
  });

  //===== Magnific Popup

  $(".image-popup").magnificPopup({
    type: "image",
    gallery: {
      enabled: true
    }
  });

  //=====  WOW active

  new WOW().init();
});
