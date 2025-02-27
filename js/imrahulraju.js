//----------------scroll----------------------//
$(window).scroll(function() {    
    var scroll = $(window).scrollTop();

    if (scroll >= 80) {
        $("section.one").addClass("optimize-top");
    } else {
        $("section.one").removeClass("optimize-top");
    }
});
//-----------------bg-------------------//
var backgroundAnimation = function () {

        var width, height, largeHeader, canvas, ctx, points, target, animateHeader = true;

        // Main
        initHeader();
        initAnimation();
        addListeners();

        function initHeader() {
            width = window.innerWidth;
            height = window.innerHeight;
            target = {x: width / 2, y: height / 2};

            canvas = document.getElementById('bg-animation');
            canvas.width = width;
            canvas.height = height;
            ctx = canvas.getContext('2d');

            // create points
            points = [];
            for (var x = 0; x < width; x = x + width / 13) {
                for (var y = 0; y < height; y = y + height / 12) {
                    var px = x + Math.random() * width / 10;
                    var py = y + Math.random() * height / 10;
                    var p = {x: px, originX: px, y: py, originY: py};
                    points.push(p);
                }
            }

            // for each point find the 5 closest points
            for (var i = 0; i < points.length; i++) {
                var closest = [];
                var p1 = points[i];
                for (var j = 0; j < points.length; j++) {
                    var p2 = points[j]
                    if (!(p1 == p2)) {
                        var placed = false;
                        for (var k = 0; k < 5; k++) {
                            if (!placed) {
                                if (closest[k] == undefined) {
                                    closest[k] = p2;
                                    placed = true;
                                }
                            }
                        }
                        for (var k = 0; k < 5; k++) {
                            if (!placed) {
                                if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                    closest[k] = p2;
                                    placed = true;
                                }
                            }
                        }
                    }
                }
                p1.closest = closest;
            }

            // assign a circle to each point
            for (var i in points) {
                var c = new Circle(points[i], 1 + Math.random() * 1, 'rgba(0,0,0,0.1)');
                points[i].circle = c;
            }
        }

        // Event handling
        function addListeners() {
            if (!('ontouchstart' in window)) {
                window.addEventListener('mousemove', mouseMove);
            }
            window.addEventListener('scroll', scrollCheck);
            window.addEventListener('resize', resize);
        }

        function mouseMove(e) {
            var posx = posy = 0;
            if (e.pageX || e.pageY) {
                posx = e.pageX - (document.body.scrollLeft + document.documentElement.scrollLeft);
                posy = e.pageY - (document.body.scrollTop + document.documentElement.scrollTop);
            }
            else if (e.clientX || e.clientY) {
                posx = e.clientX;
                posy = e.clientY;
            }
            target.x = posx;
            target.y = posy;
        }

        function scrollCheck() {
            if ($(document).scrollTop() > height / 2) animateHeader = true;
            else animateHeader = false;
        }

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }

        // animation
        function initAnimation() {
            animate();
            for (var i in points) {
                shiftPoint(points[i]);
            }
        }

        function animate() {

            if (animateHeader) {
                ctx.clearRect(0, 0, width, height);

                for (var i in points) {
                    // detect points in range
                    if (Math.abs(getDistance(target, points[i])) < 4000) {
                        points[i].active = 0.3;
                        points[i].circle.active = 0.6;
                    } else if (Math.abs(getDistance(target, points[i])) < 120000) {
                        points[i].active = 0.1;
                        points[i].circle.active = 0.3;
                    } else if (Math.abs(getDistance(target, points[i])) < 40000) {
                        points[i].active = 0.02;
                        points[i].circle.active = 0.1;
                    } else {
                        points[i].active = 0;
                        points[i].circle.active = 0;
                    }

                    drawLines(points[i]);
                    points[i].circle.draw();
                }
            }
            requestAnimationFrame(animate);
        }

        function shiftPoint(p) {
            TweenLite.to(p, 1 + 1 * Math.random(), {
                x: p.originX - 50 + Math.random() * 100,
                y: p.originY - 50 + Math.random() * 100, ease: Circ.easeInOut,
                onComplete: function () {
                    shiftPoint(p);
                }
            });
        }

        // Canvas manipulation
        function drawLines(p) {
            if (!p.active) return;
            for (var i in p.closest) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.closest[i].x, p.closest[i].y);
                ctx.strokeStyle = 'rgba(164,164,164,' + p.active + ')';
                ctx.stroke();
            }
        }

        function Circle(pos, rad, color) {
            var _this = this;

            // constructor
            (function () {
                _this.pos = pos || null;
                _this.radius = rad || null;
                _this.color = color || null;
            })();

            this.draw = function () {
                if (!_this.active) return;
                ctx.beginPath();
                ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
                ctx.fillStyle = 'rgba(164,164,164,' + _this.active + ')';
                ctx.fill();
            };
        }

        // Util
        function getDistance(p1, p2) {
            return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
        }
    }

    $(document).ready(function(){
        backgroundAnimation();
    });

//--------------------------------------------text slider------------------------------------------------//
$(function(){
			
			var $slogans = $("p.slogan").find("strong");
			var $holder = $("#holder");
			
			//set via JS so they're visible if JS disabled
			$slogans.parent().css({position : "absolute", top:"0px", left:"0px"});
			
			//settings
			var transitionTime = 0.4;
			var slogansDelayTime = 2;
			
			//internal
			var totalSlogans = $slogans.length;
			
			var oldSlogan = 0;
			var currentSlogan = -1;
			
			//initialize	
			switchSlogan();
			
			function switchSlogan(){
				
				oldSlogan = currentSlogan;
				
				if(currentSlogan < totalSlogans-1){
					currentSlogan ++
				} else {
					currentSlogan = 0;
				}
				
				TweenLite.to($slogans.eq(oldSlogan), transitionTime, {top:-20, alpha:0, rotationX: 90});
				TweenLite.fromTo($slogans.eq(currentSlogan), transitionTime, {top:20, alpha:0, rotationX: -90 }, {top:0, alpha:1, rotationX:0});
				
				TweenLite.delayedCall(slogansDelayTime, switchSlogan);
			}
			
		});

