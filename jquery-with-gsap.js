/*
* "GreenSock | TweenMax"(http://greensock.com/tweenmax) with jQuery.
* by @psyonline (http://www.psyonline.kr/, majorartist@gmail.com)
* https://github.com/psyonline/jquery-with-gsap
* License - http://creativecommons.org/licenses/by-sa/2.0/kr/
*/

/*

	* ._animate(properties [, duration] [, easing] [, complete]) 함수
		- .animate() 함수와 사용 방법 동일. 추가된 속성은 하단 참조
		- 적용 가능한 케이스
			$()._animate(properties, options);
			$()._animate(properties, duration);
			$()._animate(properties, easing);
			$()._animate(properties, complete);
			$()._animate(properties, duration, complete);
			$()._animate(properties, easing, complete);
			$()._animate(properties, duration, easing, complete);
		* 위 함수가 실행되면 해당 jQuery 객체에 .data('TweenMax', TweenMax 객체)가 지정됨

	* ._css(properties [, value]) 함수
		- .css() 함수와 사용 방법 동일. 추가된 속성은 하단 참조

	* ._stop([vars] [, target]) 함수
		- ._animate()를 정지 시키기 위한 함수
		- vars 파라미터로 특정 속성만 지정하여 정지. ex) $()._stop({width: true});
		- target 파라미터로 특정 엘리먼트만 지정하여 정지. ex) $().stop({width: true}, $().eq(1));

	----------------------------------------

	* Easings(참조: http://greensock.com/get-started-js#easing):
		- Linear, Power0, Power1, Power2, Power3, Power4, Circ, Sine, Quad, Cubic, Quart, Quint, Expo, Strong, Back, Bounce, Elastic with (In | Out | InOut)

	* 사용 가능한 추가 CSS 속성(참조: http://greensock.com/get-started-js#css):
		- transforms(rotation, scaleX, scaleY, skewX, skewY, x, y, xPercent, yPercent, rotationX, rotationY)
		- colors(color, borderColor, backgroundColor)
		- backgroundPosition, opacity, boxShadow, textShadow, borderRadius, clip
		* 브라우저에 따라 지원되지 않을 수 있음

	* 사용 가능한 주요 옵션(참조: http://greensock.com/docs/#/HTML5/GSAP/TweenMax/to/)
		- delay: 딜레이(number, ms)
		- repeat: 반복 플레이(number(반복 횟수), -1 = 무한)
		- repeatDelay: 반복 플레이 딜레이(number, ms)
		- yoyo: 반복 플레이 될 때 역방향으로 플레이 할 것인지 여부(boolean)
			ex)
			true 지정시 순서 예시 = 1-2-3-3-2-1
			false 지정시 순서 예시 = 1-2-3-1-2-3
		- startAt: 시작 속성 값(object)
		- useFrames: 시간 기준이 아닌 프레임 기준으로 플레이할 것인지 여부(boolean)
		- force3D: CSS Transform을 3d 형식으로 지정할 것이지 여부(boolean)

	* Events
		- start: function(tween)
		- step 또는 progress: function(tween)
		- repeatStep: function(tween)
		- complete: function(tween)
		* 이벤트 콜백 함수의 this 참조는 해당 jQuery 객체, tween 파라미터로 해당 Tween 객체 전달

	* Tween 객체의 유용한 속성
		- .progress(): 현재 진행 퍼센트(float, 0~1)
		- .ratio: 전체 범위에 대한 현재 값의 비율(float, 0~1)

*/


(function($){

 	var isobject = $.isPlainObject,
 		cssplugingettransform = CSSPlugin._internals.getTransform,
 		transformProperties = 'scale,scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,rotationZ,perspective,xPercent,yPercent,zOrigin,',
 		eventParam = ['{self}'];


 	$.fn._css = function(property, value) {
		var p;
		if (isobject(property)) { // multiple set
			TweenMax.set(this, property);
		} else if (value !== undefined) { // set
			p = {};
			p[property] = value;
			TweenMax.set(this, p);
		} else { // get
			if (istransform(property)) { // transforms
				return gettransform(this[0], property);
			} else {
				return this.css(property);
			}
		}
		return this;
	}

 	$.fn._animate = function(properties, d, e, c) {
 		var options = assignoptions(this, properties, d, e, c),
 			duration = options.duration;
 		delete options.duration;
		this.data('TweenMax', TweenMax.to(this, duration, options));
 		return this;
 	}

 	$.fn._stop = function(vars, target) {
 		var tm = this.data('TweenMax');
 		tm && tm.kill(vars, target);
 		return this;
 	}

 	function gettransform(element, property) {
 		var gsTransform = element._gsTransform || cssplugingettransform(element);
		if (property == 'rotationZ') {
			property = 'rotation';
		} else if (property == 'scale') {
 			property = 'scaleX';
 		}
 		return gsTransform[property];
 	}

	function assignoptions(elements, properties, d, e, c) {

		var options = {}, key;

		for (key in properties) {
			options[key] = properties[key];
		}

		if (isobject(d)) {
			for (key in d) {
				options[key] = d[key];
			}
		} else if (typeof(c) == 'function') {
			options.duration = d;
			options.easing = e;
			options.complete = c;
		} else if (typeof(e) == 'function') {
			if (typeof(d) == 'number') {
				options.duration = d;
			} else {
				options.easing = d;
			}
			options.complete = e;
		} else {
			if (typeof(d) == 'number') {
				options.duration = d;
			} else if (typeof(d) == 'string') {
				options.easing = d;
			} else if (typeof(d) == 'function') {
				options.complete = d;
			}
		}

		// times
		options.duration = (options.duration !== undefined ? options.duration : 400)/1000; // 400 is jquery default time
		if (options.delay !== undefined) {
			options.delay /= 1000;
		}
		if (options.repeatDelay !== undefined) {
			options.repeatDelay /= 1000;
		}

		// events
		if (options.start) {
			options.onStart = createcallback(elements, options.start);
			options.onStartParams = eventParam;
			delete options.start;
		}
		if (options.step || options.progress) {
			options.onUpdate = createcallback(elements, options.step || options.progress);
			options.onUpdateParams = eventParam;
			delete options.step;
			delete options.progress;
		}
		if (options.repeatStep) {
			options.onRepeat = createcallback(elements, options.repeatStep);
			options.onRepeatParams = eventParam;
			delete options.repeatStep;
		}
		if (options.complete) {
			options.onComplete = createcallback(elements, options.complete);
			options.onCompleteParams = eventParam;
			delete options.complete;
		}
		
		if (options.easing) {
			options.ease = options.easing;
			delete options.easing;
		}

		delete options.queue;

		return options;

	}

 	function createcallback(elements, callback) {
 		return function(tween) {
 			callback.call(elements, tween);
 		}
 	}

	function istransform(property) {
		return transformProperties.indexOf(property +',') !== -1;
	}

	// Add easing functions to jquery
	// Based on "GreenSock | jquery.gsap.js"(http://greensock.com/jquery-gsap-plugin)
 	(function() {

		var names, types, map, name, i, j;

 		if ($.easing && window.GreenSockGlobals && window.GreenSockGlobals.Ease && window.GreenSockGlobals.Ease.map) {
			names = 'Quad, Cubic, Quart, Quint, Sine, Expo, Circ, Elastic, Back, Bounce'.split(', ');
			types = 'In, Out, InOut'.split(', ');
 			map = window.GreenSockGlobals.Ease.map;
 			for (i = 0; i < names.length; i++) {
 				for (j = 0; j < types.length; j++) {
 					name = 'ease'+ types[j] + names[i];
 					if (map[name] && !$.easing[name]) {
 						$.easing[name] = createEase(map[name]);
 					}
 				}
 			}
 		}

 		function createEase(ease) {
			return function(p) {
				return ease.getRatio(p);
			}
		}

	})();

 })(window.jQuery);