<script>
    (function() {
        if (!('scrollBehavior' in document.documentElement.style)) {
            let script = document.createElement('script');
            script.src = '/node_modules/smoothscroll-polyfill/dist/smoothscroll.min.js';
            document.write(script.outerHTML);
        }
    })();
</script>
<script src="/node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
