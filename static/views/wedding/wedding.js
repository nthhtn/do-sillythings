$(document).ready(() => {

	// First element
	function goToByScroll(id) {
		$("html,body").animate({ scrollTop: $("#" + id).offset().top }, "smooth");
	}

	goToByScroll('fh5co-header');

	$('.fh5co-nav .menu-button-scroll').on('click',function(e){
		e.preventDefault();
		var targetId=$(this).attr('href').split('#')[1];
		console.log(targetId);
		goToByScroll(targetId);
		return false;
	});

	// Autoplay video

	document.getElementById("wedding-video").addEventListener('loadeddata', function(e) {
		var videoElement = this;
		setTimeout(()=>{
			$(videoElement).get(0).play();
		}, 5000);
	 }, false);

	// Build gallery modal

	// var loadGalleryModal = function (index) {};

	// $("#gallery-modal").on("show.bs.modal", function(){
	// 	console.log(1);
	// });

	// $("#gallery-modal").on("loaded.bs.modal", function(){
	// 	console.log(3);
	// });

	// $("#gallery-modal").on("shown.bs.modal", function () {
	// 	console.log(2);
	// 	$.ajax({
	// 		type: "GET",
	// 		url: "/wedding/gallery/3",
	// 		success: function (html) {
	// 			$("#gallery-modal").find("ul.gallery-items").html(html);
	// 		},
	// 	});
	// });

	// Count Attendance

	var counter = function () {
		$(".js-counter").countTo({
			formatter: function (value, options) {
				console.log(value);
				return value.toFixed(options.decimals);
			},
		});
	};

	var counterWayPoint = function () {
		if ($("#fh5co-counter").length > 0) {
			$("#fh5co-counter").waypoint(
				function (direction) {
					if (
						direction === "down" &&
						!$(this.element).hasClass("animated")
					) {
						setTimeout(counter, 400);
						$(this.element).addClass("animated");
					}
				},
				{ offset: "90%" }
			);
		}
	};

	$.ajax({
		type: "GET",
		url: "/wedding/attendance",
		success: function (data) {
			// console.log(data.count);
			// counter();
			// counterWayPoint();
		},
	});

	// Submit Attendance

	$("#submit-attendance").on("click", () => {
		var form = $("#form-attendance");
		var name = $(form).find("#name").val();
		var email = $(form).find("#email").val();
		var quantity = parseInt($(form).find("#quantity").val());
		var venue = parseInt($(form).find("#venue").val());

		if (!name || !email || quantity == -1 || venue == -1) {
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Some required fields are not entered!",
			});
			return;
		}
		$.ajax({
			type: "POST",
			data: {
				name: name,
				email: email,
				quantity: quantity,
				venue: venue,
			},
			dataType: "json",
			url: "/wedding/attendance",
			success: function (data) {
				// console.log(data);
				var Toast = Swal.mixin({
					toast: true,
					position: "top-end",
					showConfirmButton: false,
					timer: 3000,
					timerProgressBar: true,
					didOpen: (toast) => {
						toast.addEventListener("mouseenter", Swal.stopTimer);
						toast.addEventListener("mouseleave", Swal.resumeTimer);
					},
				});
				Toast.fire({
					icon: "success",
					title: "Attendance saved successfully!",
				});
			},
		});
	});
});
