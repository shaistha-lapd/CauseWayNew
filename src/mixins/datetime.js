export const datetime = {
	data() {
		return {
			today: new Date(),
		};
	},

	methods: {
		//DATE functions
		getLongDate(date) {
			var year = date.getFullYear();
			var month = date.getMonth();
			var day = date.getDate();

			month = month + 1;
			if (month < 10) {
				month = "0" + month;
			}

			if (day < 10) {
				day = "0" + day;
			}
			return `${year}-${month}-${day}`;
		},

		formatISODate(date) {
			if (!date) return null;
			const [year, month, day] = date.split("-");

			return `${month}/${day}/${year}`;
		},
		formatDate(date) {
			if (!date) return null;
			const [year, month, day] = date.split("-");
			return `${month}/${day}/${year}`;
		},
		convertToISO(date) {
			console.log(date);
			if (!date) return null;
			const [month, day, year] = date.split("/");
			return `${year}-${month}-${day}`;
		},
		//TIME functions
		currentTime() {
			let date = this.roundToNearest5();
			var hours = date.getHours();
			var mins = date.getMinutes();
			if (mins < 10) {
				mins = "0" + mins;
			}
			if (hours < 10) {
				hours = "0" + hours;
			}
			return `${hours}:${mins}`;
		},
		roundToNearest5(date = new Date()) {
			const minutes = 5;
			const ms = 1000 * 60 * minutes;
			// 👇️ replace Math.round with Math.ceil to always round UP
			return new Date(Math.round(date.getTime() / ms) * ms);
		},
	},
};
