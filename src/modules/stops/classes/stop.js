export default class Stop {
	constructor() {
		this.incidentNum = "";
		this.duration = null;
		this.date = "";
		this.time = "";
		this.location = {
			address: null,
			lat: null,
			lng: null,
			rd: null,
		};
		this.radioCall = false;
		this.publicSchool = false;
		this.publicSchoolName = null;
		this.k12 = false;
	}
}
