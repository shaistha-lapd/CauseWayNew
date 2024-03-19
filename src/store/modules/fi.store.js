import Person from "../../modules/fi/classes/person";
import Vehicle from "../../modules/fi/classes/vehicle";
import IncidentDetails from "../../modules/fi/classes/incidentDetails";
import FiDetails from "../../modules/fi/classes/fiDetails";
import db from "../../storage";
import { datetime } from "../../mixins/datetime";

export default {
	namespaced: true,
	state: {
		fi: {
			data: new FiDetails(),
			person: new Person(),
			vehicle: new Vehicle(),
			incident: new IncidentDetails(),
		},

		showSuccess: false,
		showError: false,
		rdMap: null,
		lookups: {},
		STATUSES: {
			ABANDONED: "ABANDONED",
			NEW: "NEW",
			READY: "READY",
			SUBMITTED: "SUBMITTED",
			ACCEPTED: "ACCEPTED",
			REJECTED: "REJECTED",
			EDIT: "EDIT",
		},
	},
	getters: {
		fi(state) {
			return state.fi;
		},
		lookups(state) {
			return state.lookups;
		},
		rdMap(state) {
			return state.rdMap;
		},

		showSuccess(state) {
			return state.showSuccess;
		},
		statuses(state) {
			return state.STATUSES;
		},
	},
	setters: {},
	mutations: {
		CREATE_FI(state, user) {
			state.fi.data.creator = user;
			state.fi.data.status = state.STATUSES.NEW;
			state.fi.data.percentComplete = 0;
			state.fi.vehicle.vehSeatedPosition = "ped";
			let date = new Date().toLocaleDateString("sv", { timeZone: "America/Los_Angeles" });
			let tempDate = date.split("-");
			state.fi.incident.incNumber = `${tempDate[0].substring(2)}${tempDate[1]}${tempDate[2]}00`;
			state.fi.incident.incDate = date;
			state.fi.incident.incDateFormatted = datetime.methods.formatDate(date);
			state.fi.incident.incTime = datetime.methods.currentTime();
		},
		RESET(state) {
			state.fi = {
				data: new FiDetails(),
				person: new Person(),
				vehicle: new Vehicle(),
				incident: new IncidentDetails(),
			};
		},
		RESET_VEH(state) {
			state.fi.vehicle = new Vehicle();
			state.fi.vehicle.vehSeatedPosition = "ped";
		},
		ASSIGN_FI(state, payload) {
			state.fi = payload;
		},
		UPDATE_STATUS(state, status) {
			state.fi.data.status = status;
		},

		ADD_ADDRESS(state, address) {
			state.fi.person.addresses.push(address);
		},
		REMOVE_ADDRESS(state, index) {
			state.fi.person.addresses.splice(index, 1);
		},
		ADD_PHONE(state, phone) {
			state.fi.person.phones.push(phone);
		},
		REMOVE_PHONE(state, index) {
			state.fi.person.phones.splice(index, 1);
		},
		ADD_ASSOCIATE(state, assoc) {
			state.fi.person.associates.push(assoc);
		},
		REMOVE_ASSOCIATE(state, index) {
			state.fi.person.associates.splice(index, 1);
		},

		ADD_OFFICER(state, ofcr) {
			if (!state.fi.incident.incOfficers.find((o) => o.serial == ofcr.serial) && ofcr.serial != null) {
				state.fi.incident.incOfficers.push(ofcr);
			} else console.log(`${ofcr.serial} already added`);
		},
		REMOVE_OFFICER(state, index) {
			state.fi.incident.incOfficers.splice(index, 1);
		},
		UPDATE_LOOKUPS(state, data) {
			let l = {};
			data.forEach((x) => {
				l[x.name] = [...x.data];
			});
			state.lookups = { ...l };
		},

		SAVE_RDMAP(state, data) {
			state.rdMap = { ...data };
		},
		TOGGLE_SUCCESS_DIALOG(state) {
			state.showSuccess = !state.showSuccess;
		},
		UPDATE_NARRATIVE(state) {
			if (!!state.fi.person.homelessRationale && !state.fi.incident.incNarrative.includes("HR:")) {
				state.fi.incident.incNarrative += "\nHR: " + state.fi.person.homelessRationale + "\n";
			}
			if (!!state.fi.person.caJustification && !state.fi.incident.incNarrative.includes("CA:")) {
				state.fi.incident.incNarrative += "CA: " + state.fi.person.caJustification + "\n";
			}
		},
	},
	actions: {
		async newFi({ commit }) {
			commit("RESET");
			commit("CREATE_FI");
		},
		resetFi({ commit }) {
			commit("RESET");
		},
		cancelFi({ commit }, id) {
			db.FIs.update(id, { "fi.data.status": "ABANDONED" });
			commit("RESET");
		},
		editFi({ commit }, fi) {
			fi.data.status = "EDIT";
			commit("ASSIGN_FI", fi);
		},
		clonePerson() {},
		addAssociate({ commit }, person) {},

		async getLookups({ commit }) {
			if ((await db.Lookups.count()) > 0) {
				let data = await db.Lookups.toArray();
				commit("UPDATE_LOOKUPS", data);
			} else {
				fetch("https://lapd-cdnjs.azurewebsites.us/api/getLookups")
					.then((res) => res.json())
					.then((data) => {
						commit("UPDATE_LOOKUPS", data);
						data.forEach((x) => {
							db.Lookups.put({
								id: x.id,
								name: x.name,
								data: [...x.data],
							});
						});
					});
			}
		},
		async getCarMakes({ commit, dispatch }) {
			let makes = await db.Lookups.get({ id: "car_makes" });
			if (!!makes) {
				dispatch("getLookups");
			} else {
				fetch("https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json")
					.then((res) => res.json())
					.then((data) => {
						let obj = { id: "car_makes", name: "car_makes", data: [...data.Results] };
						db.Lookups.put(obj).then(() => {
							dispatch("getLookups");
						});
					});
			}
		},
		async getRdMap({ commit }) {
			let arr = await db.rdMap.toArray();

			if (arr.length > 0) {
				db.rdMap.get(1).then((data) => {
					commit("SAVE_RDMAP", data.map);
					console.log("RD map loaded from storage");
				});
			} else {
				console.log("Downloading RD Map...");
				fetch(
					"https://services5.arcgis.com/7nsPwEMP38bSkCjy/arcgis/rest/services/LAPD_Reporting_District/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson"
				)
					// fetch("https://opendata.arcgis.com/datasets/4398360b1a0242b78904f46b3786ae73_0.geojson")
					.then((res) => res.json())
					.then((data) => {
						// for (let x = 0; x < data.features.length; x++) {
						// 	if (!data.features[x].geometry) {
						// 		data.features[x].geometry = data.features[x - 1].geometry;
						// 	}
						// }

						db.rdMap.put({ id: 1, map: data }).then(() => {
							console.log("RD Map downloaded");
							commit("SAVE_RDMAP", data);
						});
					});
			}
		},

		async saveProgress({ commit, dispatch }, fi) {
			if (!fi.data.creator || !fi.data.creator.serial) {
				let user = await dispatch("getUser");
				commit("CREATE_FI", user);
			}
			db.FIs.put({ id: fi.data.id, fi }).catch((err) => {
				console.log("Save failed: ", err.message);
			});
		},
		async getFiFromDb({}, id) {
			let fi = await db.FIs.get(id);
			if (!!fi) {
				fi = fi.fi;
			}
			if (!fi) {
				fi = await fetch(`https://lapd-cdnjs.azurewebsites.us/api/getById?id=${id}`)
					.then((response) => response.json())
					.then((data) => {
						fi = data.fi;
						return fi;
					});
			}
			return fi;
		},
		async getUserFis({}, user) {
			let list = await fetch(`https://lapd-cdnjs.azurewebsites.us/api/getFisByOfficerId?serialNum=${user.serial}`)
				.then((response) => response.json())
				.then((data) => {
					return data;
				});
			return list;
		},

		async getIncompleteFiFromDb({}, user) {
			let incs = await db.FIs.where("[fi.data.status+fi.data.creator.serial]").equals(["ABANDONED", user.serial]).reverse().toArray();
			return incs;
		},
		async getRejectedFiFromDb({}, user) {
			let incs = await db.FIs.where("[fi.data.status+fi.data.creator.serial]").equals(["REJECTED", user.serial]).reverse().toArray();
			return incs;
		},

		async submit({ commit, dispatch }, fi) {
			if (navigator.onLine) {
				let asyncForEach = async (array, callback) => {
					for (let index = 0; index < array.length; index++) {
						await callback(array[index], index, array);
					}
				};

				var count = 0;
				var failures = 0;
				let fiList = await db.FIs.where("fi.data.status").equals("READY").toArray();

				await asyncForEach(fiList, async (fi) => {
					let postStatus = await dispatch("postFi", fi);
					if (postStatus.ok) {
						await db.FIs.update(fi.id, { "fi.data.status": "SUBMITTED" });
						count += 1;
						dispatch("purgeFromDex");
						commit("TOGGLE_SUCCESS_DIALOG");
					} else {
						failures++;
					}
				});
			} else {
				let msg = "Currently there is no network signal. Your FI's will be stored and sent when your network returns.";

				// navigator.serviceWorker.ready.then((registration) => {
				// 	registration.sync.register("report-submitted");
				// });
				alert(msg);
			}
		},
		deleteFromDex({}, id) {
			db.FIs.where("id")
				.equals(id)
				.delete()
				.then((count) => console.log(`${count} items successfully deleted`))
				.catch((e) => console.log(`There was a problem deleting the record with ID: ${id} \n ${e}`));
		},

		purgeFromDex({}) {
			db.FIs.where("fi.data.status")
				.equals("SUBMITTED")
				.delete()
				.then((count) => {
					console.log(count + " items were submitted succcessfully");
				})
				.catch((e) => {
					console.error(e.failures.length + " items were not accepted by the server. Please try again.");
				});
		},
		async postFi({ commit, state }, tempFi) {
			const res = await fetch("https://lapd-cdnjs.azurewebsites.us/api/postFi", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(tempFi),
			});
			return res;
		},
		async editFi({ commit, dispatch }, id) {
			let fi = await dispatch("getFiFromDb", id);
			commit("ASSIGN_FI", fi);
		},

		notify({}, count) {
			Notification.requestPermission().then((permission) => {
				if (permission !== "granted") {
					alert("Notification failed");
					return;
				}
				navigator.serviceWorker.ready.then((registration) => {
					registration.showNotification("Success!", {
						body: "Browser Notification - " + count + " FI(s) sent successfully",
					});
				});
			});
		},
		async getDashboardStats({}, serial) {
			const code = "kse1rx8UoizMMNh3QHlG7mNuS_1DfcF5ILW6Lq60QJijAzFuraYjrw==";
			let stats = await fetch(`https://lapd-cdnjs.azurewebsites.us/api/getDashboardStats?code=${code}&serial=${serial}`)
				.then((res) => res.json())
				.then((data) => {
					return data;
				});
			return stats;
		},
		getUser({ dispatch, commit, getters, rootGetters }) {
			let user = rootGetters["User/appUser"];
			return user;
		},
		async getEmpsByDiv({ commit }, div) {
			const authCode = "jMRG-BPQh7oCmxzR9tioRdbtjen4jDnbHzDclreitrVaAzFu85P4wA==";
			return fetch(`https://lapd-cdnjs.azurewebsites.us/api/getEmpByDiv?code=${authCode}&div=${div}`)
				.then((res) => res.json())
				.then((data) => {
					return data;
				});
		},
		async checkUpdates({ dispatch, commit }) {
			let lookups = fetch(`https://lapd-cdnjs.azurewebsites.us/api/getLookups`)
				.then((res) => res.json())
				.then((data) => {
					return data;
				});
		},
	},
};
