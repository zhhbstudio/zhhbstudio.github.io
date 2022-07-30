let gardenCtx,
	gardenCanvas,
	$garden,
	garden;
const clientWidth = $(window).width();
const clientHeight = $(window).height();

$(function () {
	// setup garden
	$garden = $("#garden");
	gardenCanvas = $garden[0];
	gardenCanvas.width = 700;
	gardenCanvas.height = 700;
	gardenCtx = gardenCanvas.getContext("2d");
	gardenCtx.globalCompositeOperation = "lighter";
	garden = new Garden(gardenCtx, gardenCanvas);

	// renderLoop
	setInterval(function () {
		garden.render();
	}, Garden.options.growSpeed);
});

$(window).resize(function () {
	const newWidth = $(window).width();
	const newHeight = $(window).height();
	if (newWidth !== clientWidth && newHeight !== clientHeight) {
		location.replace(location.href);
	}
});

function getHeartPoint(angle) {
	let t = angle / Math.PI;
	let x = 19.5 * (16 * Math.pow(Math.sin(t), 3));
	let y =
		-20 *
		(13 * Math.cos(t) -
			5 * Math.cos(2 * t) -
			2 * Math.cos(3 * t) -
			Math.cos(4 * t));
	return [
		gardenCanvas.width / 2 + x,
		gardenCanvas.height / 2 - 55 + y
	];
}

function startHeartAnimation() {
	let interval = 50;
	let angle = 10;
	let heart = [];
	let animationTimer = setInterval(function () {
		let bloom = getHeartPoint(angle);
		let draw = true;
		for (let i = 0; i < heart.length; i++) {
			let p = heart[i];
			let distance = Math.sqrt(
				Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2)
			);
			if (distance < Garden.options.bloomRadius.max * 1.3) {
				draw = false;
				break;
			}
		}
		if (draw) {
			heart.push(bloom);
			garden.createRandomBloom(bloom[0], bloom[1]);
		}
		if (angle >= 30) {
			clearInterval(animationTimer);
			showMessages();
			timeElapse(together);
			setInterval(function () {
				timeElapse(together);
			}, 1000);
		} else {
			angle += 0.2;
		}
	}, interval);
}

(function ($) {
	$.fn.typewriter = function () {
		this.each(function () {
			let $ele = $(this),
				str = $ele.html(),
				progress = 0;
			$ele.html("");
			$ele.css("opacity", "1");
			const timer = setInterval(function () {
				const current = str[progress];
				if (current === "<") {
					progress = str.indexOf(">", progress) + 1;
				} else {
					progress++;
				}
				$ele.html(str.substring(0, progress) + (progress & 1 ? "_" : "&nbsp;"));
				if (progress >= str.length) {
					clearInterval(timer);
				}
			}, 70);
		});
		return this;
	};
})(jQuery);

function timeElapse(date) {
	let current = Date();
	let seconds = (Date.parse(current) - Date.parse(date)) / 1000;
	let days = Math.floor(seconds / (3600 * 24));
	seconds = seconds % (3600 * 24);
	let hours = Math.floor(seconds / 3600);
	if (hours < 10) {
		hours = "0" + hours;
	}
	seconds = seconds % 3600;
	let minutes = Math.floor(seconds / 60);
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	seconds = seconds % 60;
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	let result =
		'<span class="digit">' +
		days +
		'</span> 天 <span class="digit">' +
		hours +
		'</span> 小时 <span class="digit">' +
		minutes +
		'</span> 分 <span class="digit">' +
		seconds +
		"</span> 秒";
	$("#elapseClock").html(result);
}

function showMessages() {
	$("#messages").fadeIn(2000, function () {
		$("#loveU").fadeIn(3000);
	});
}
