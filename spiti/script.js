window.addEventListener("scroll", function(){
  var parallax = function() {
    var top = this.pageYOffset;

    var layers = document.getElementsByClassName("parallax");
    var layer, speed, yPos;
    for (var i = 0; i < layers.length; i++) {
      layer = layers[i];
      speed = layer.getAttribute('data-speed');
      var yPos = Math.round(-(top * speed / 100));
      layer.setAttribute('style', 'transform: translateY(' + yPos + 'px)');

    }
  }
  window.requestAnimationFrame(parallax);
});