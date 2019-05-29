<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <script>
        (function () {
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
    <script src="/bower_components/webcomponentsjs/webcomponents-loader.js"></script>


    <link href="/dist/css/style.css" rel="stylesheet">

    <title>Site Template</title>
</head>
<body>

</body>
</html>
