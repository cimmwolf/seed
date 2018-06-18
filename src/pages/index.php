<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <script>
        (function() {
            if ('registerElement' in document
                && 'import' in document.createElement('link')
                && 'content' in document.createElement('template')) {
                // platform is good!
            } else
                document.write('<script src="/bower_components/webcomponentsjs/webcomponents-lite.min.js"><\/script>');

            if (!('scrollBehavior' in document.documentElement.style))
                document.write('<script src="/node_modules/smoothscroll-polyfill/dist/smoothscroll.min.js"><\/script>');

            if (!window.HTMLPictureElement)
                document.write('<script src="/node_modules/picturefill/dist/picturefill.min.js" async><\/script>');

            var features = [];
            if (!('remove' in Element.prototype))
                features.push('Element.prototype.remove');

            if (!('IntersectionObserver' in window))
                features.push('IntersectionObserver');

            if (features.length > 0)
                document.write('<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=' + features.join() + '"><\/script>')
        })();
    </script>

    <link href="/dist/css/style.css" rel="stylesheet">

    <title>Site Template</title>
</head>
<body>

</body>
</html>