<script>
	(function() {
		if (!('scrollBehavior' in document.documentElement.style)) {
			let script = document.createElement('script');
			script.src = '/node_modules/smoothscroll-polyfill/dist/smoothscroll.min.js';
			document.write(script.outerHTML);
		}
		let features = [];
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
<script src="/node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js" defer></script>
<script type="module">
	window.WebComponents = window.WebComponents || {
		waitFor(cb) {
			addEventListener('WebComponentsReady', cb);
		},
	};
</script>
