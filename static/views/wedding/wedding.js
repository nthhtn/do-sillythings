$(document).ready(() => {

	// Build gallery modal

	var loadGalleryModal = function(index){
	}


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
			console.log(data.count);
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
				console.log(data);
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
