import Vue from "vue";
import Vuex from "vuex";
import db from "../storage";

// import the auto exporter
import modules from "./modules";

Vue.use(Vuex);

export default new Vuex.Store({
	modules,
	state: {
		loading: false,
		employees: [],
		links: [
			{
				name: "Home",
				icon: "mdi-home",
				path: "/",
			},
			{
				name: "Field Interview",
				icon: "mdi-car-emergency",
				path: "/fi",
			},
			{
				name: "AFDR",
				icon: "mdi-octagon",
				path: "/stops",
			},
			{
				name: "Administration",
				icon: "mdi-tune",
				path: "/admin",
			},
		],
	},
	getters: {
		allLinks(state) {
			return state.links;
		},
		employees(state) {
			return state.employees;
		},
	},

	mutations: {
		SAVE_EMPS(state, empList) {
			state.employees = empList;
		},
	},
	actions: {
		resetAll({ commit }) {
			// resets state of all the modules
			Object.keys(modules).forEach((moduleName) => {
				commit(`${moduleName}/RESET`);
			});
		},
		async getAllEmps({ commit }) {
			let arr = await db.Employees.toArray();
			if (arr.length) {
				commit("SAVE_EMPS", arr);
			} else {
				console.log("fetching emps");
				const authCode = "pB9NkbF9EERxLtfSSqLfm6CbvdcsTiNwjhjrmxZa8ZorkZUHazq1EQ==";
				fetch(`https://lapd-cdnjs.azurewebsites.us/api/getAllEmployess?code=${authCode}`)
					.then((res) => res.json())
					.then((data) => {
						db.Employees.bulkPut(data)
							.then(() => {
								commit("SAVE_EMPS", data);
							})
							.catch(db.BulkError, function (e) {
								console.error("Some officer adds did not succeed. However, " + data.length - e.failures.length + " officers were added successfully");
							});
					});
			}
		},
	},
});
