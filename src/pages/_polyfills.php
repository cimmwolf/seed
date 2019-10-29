<script>
  (function() {
    if (!('scrollBehavior' in document.documentElement.style)) {
      let script = document.createElement('script');
      script.src = '/node_modules/smoothscroll-polyfill/dist/smoothscroll.min.js';
      document.write(script.outerHTML);
    }
    if (!window.HTMLPictureElement) {
      let script = document.createElement('script');
      script.src = '/node_modules/picturefill/dist/picturefill.min.js';
      document.write(script.outerHTML);
    }
    let features = [];
    if (!('remove' in Element.prototype)) {
      features.push('Element.prototype.remove');
    }
    if (!('IntersectionObserver' in window)) {
      features.push('IntersectionObserver');
    }
    if (features.length > 0) {
      let script = document.createElement('script');
      script.src = 'https://cdn.polyfill.io/v2/polyfill.min.js?features=' + features.join();
      document.write(script.outerHTML);
    }
  })();
</script>
