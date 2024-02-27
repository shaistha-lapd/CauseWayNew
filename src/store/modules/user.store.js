import db from "../../storage";
const initialState = () => ({
	graphInfo: {},
	profile: {},
	dpsInfo: {},
	settings: {},
});

export default {
	namespaced: true,
	state: {
		graphInfo: {},
		profile: {},
		dpsInfo: {},
		settings: {},
	},

	getters: {
		user(state) {
			return state;
		},
		appUser(state) {
			var dps = state.dpsInfo ? state.dpsInfo : false;
			let ms = state.profile;
			let user = {
				fullName: dps ? `${dps.firstName} ${dps.lastName}` : ms.displayName,
				lastName: dps ? dps.lastName : ms.surname,
				firstName: dps ? dps.firstName : ms.givenName,
				serial: dps ? dps.serial : ms.mail.substring(0, ms.mail.indexOf("@")),
				rank: dps ? dps.rank : ms.jobTitle,
				assignment: dps ? dps.division : ms.officeLocation,
				email: ms.mail,
				dateOfHire: dps ? dps.hireDate : "",
				dateOfBirth: dps ? dps.dob : "",
			};

			return user;
		},
		settings(state) {
			return state.settings;
		},
	},
	mutations: {
		RESET(state) {
			const newState = initialState;
			Object.keys(newState).forEach((key) => {
				state[key] = newState[key];
			});
			if (localStorage.preferences) {
				state["settings"] = localStorage.preferences;
			} else state["settings"] = {};
		},
		UPDATE_USER(state, payload) {
			state.graphInfo = payload.graphInfo;
			state.profile = payload.profile;
			state.dpsInfo = payload.dpsInfo;
			// state.image = payload.image;
			// state.mail = payload.mail.value;
			// state.calendar = payload.calendar.value;
		},
		SAVE_USER_PREFS(state, prefs) {
			state.settings = prefs;
		},
	},
	actions: {
		resetUser({ commit }) {
			commit("RESET");
		},

		async buildUser({ commit }, msal) {
			let tempUser = {
				graphInfo: { ...msal.user },
				profile: { ...msal.graph.profile },
			};

			let uname = msal.user.userName;
			let serial = uname.substring(0, uname.indexOf("@"));

			const authCode = "Yuuj/bSaQZ0YQzc4EizIJJR37ajPXoVRKR9AQLoOHeGv/tf4p3vKIA==";
			await fetch(`https://lapd-cdnjs.azurewebsites.us/api/getEmpBySerial?code=${authCode}&serial=${serial}`)
				.then((res) => res.json())
				.then((data) => {
					tempUser["dpsInfo"] = data[0];
				});

			commit("UPDATE_USER", tempUser);
		},
		async getUserSettings({ commit }, serial) {
			let settings = await db.User.get(serial);
			if (!settings) {
				settings = await db.User.get(0);
			}
			if (!settings) {
				//if nothing comes back from the db
				settings = {
					serial: 0,
					outlined: false,
					dense: true,
					dark: true,
				};
				db.User.add(settings);
			}
			commit("SAVE_USER_PREFS", settings);
			return settings;
		},
		saveSettings({ commit }, settings) {
			commit("SAVE_USER_PREFS", settings);
			db.User.put(settings);
		},
	},
};
