export default class IncidentDetails {
	constructor() {
		this.incNumber = null;
		this.incTime = null;
		this.incDateFormatted = null;
		this.incDate = "";
		this.incNarrative = "";
		this.incLocation = {};
		this.unit = "";
		this.incOfficers = [];
	}

	getIncNumber() {
		let date = new Date();
		var year = date.getFullYear().toString().substring(-2);
		var month = date.getMonth();
		var day = date.getDate().toString();

		month = month + 1;

		if (month < 10) {
			month = "0" + month.toString();
		}

		if (day < 10) {
			day = "0" + day;
		}
		var firstEight = year + month + day + "00";
		return parseInt(firstEight);
	}
	currentTime() {
		let date = new Date();
		var hours = date.getHours();
		var mins = date.getMinutes();
		if (mins < 10) {
			mins = "0" + mins;
		}
		if (hours < 10) {
			hours = "0" + hours;
		}
		return `${hours}:${mins}`;
	}
}
