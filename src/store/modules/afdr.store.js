import Person from "../../modules/stops/classes/person";
import Officer from "../../modules/stops/classes/officer";
import AfdrDetails from "../../modules/stops/classes/afdrDetails";
import { datetime } from "../../mixins/datetime";
export default {
  namespaced: true,
  state: {
    afdr: {
      data: new AfdrDetails(),
      stops: [],
      persons: [],
      officer: new Officer(),
    },
    lookups: {},
    violations: [], //lookups
    schools: [], //lookups
    incidents: [],
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
    persons(state) {
      return state.persons;
    },
    afdr(state) {
      return state;
    },
  },
  mutations: {
    CREATE_AFDR(state, user) {
      state.afdr.data.creator = user;
      state.afdr.data.creator = user;
      state.afdr.data.status = state.STATUSES.NEW;
      state.afdr.data.percentComplete = 0;
      let date = new Date().toLocaleDateString("sv", {
        timeZone: "America/Los_Angeles",
      });
      state.afdr.incident.incDate = date;
      state.afdr.incident.incDateFormatted = datetime.methods.formatDate(date);
      state.afdr.incident.incTime = datetime.methods.currentTime();
    },
    ADD_PERSON(state) {
      state.afdr.persons.push(new Person());
    },
    REMOVE_PERSON(state, index) {
      state.afdr.persons.splice(index, 1);
    },
    ADD_STOP(state, index) {
      let stop = {
        fdrInfo: { ...state.fdrInfo },
        stopInfo: { ...state.stopInfo },
        watchInfo: { ...state.watchInfo },
        person: { ...state.persons[index] },
      };
      state.stops.push(stop);
    },
    removeStop(state, index) {
      state.stops.splice(index, 1);
    },
    addOfficer(state, ofcr) {
      state.watchInfo.additionalOfficers.push(ofcr);
    },
    removeOfficer(state, index) {
      state.watchInfo.additionalOfficers.splice(index, 1);
    },
    // changeCadIncident(state, inc) {
    // 	state.stopInfo.date = inc.IncidentTime.substr(0, 10);
    // 	state.incidentNum = inc.id;
    // 	state.stopInfo.location.address = inc.DispatchAddress[0].FullAddress;
    // 	state.stopInfo.location.lat = inc.DispatchAddress[0].Latitude;
    // 	state.stopInfo.location.lng = inc.DispatchAddress[0].Longitude;
    // },

    getOfficerOne(state, ofcr) {
      if (ofcr.length) {
        state.watchInfo.officer1 = ofcr[0];
      } else {
        return ofcr;
      }
    },
    // setViolations(state, viols) {
    // 	state.violations = viols;
    // },
    // setSchools(state, schools) {
    // 	state.schools = schools;
    // },
    // setIncForOfcr(state, incidents) {
    // 	state.incidents = incidents;
    // },
  },

  actions: {
    addStop({ commit }, person) {
      commit("addStop", person);
    },
    getAllEmployees({ commit }) {
      if (localStorage.employees) {
        console.log("Employees loaded from cache");
        commit("setAllEmps", JSON.parse(localStorage.employees));
      } else {
        console.log("Retrieving employees...");
        fetch(
          "https://lapd-cdnjs.azurewebsites.us/api/getAllEmployess?code=pB9NkbF9EERxLtfSSqLfm6CbvdcsTiNwjhjrmxZa8ZorkZUHazq1EQ=="
        )
          .then((res) => res.json())
          .then((data) => {
            commit("setAllEmps", data);
            localStorage.setItem("employees", JSON.stringify(data));
            console.log("Employee list loaded");
          });
      }
    },
    getEmpBySerial({ commit }, serial) {
      fetch(
        `https://lapd-cdnjs.azurewebsites.us/api/getEmpBySerial?code=Yuuj/bSaQZ0YQzc4EizIJJR37ajPXoVRKR9AQLoOHeGv/tf4p3vKIA==&serial=${serial}`
      )
        .then((res) => res.json())
        .then((data) => commit("getOfficerOne", data));
    },
    getViolations({ commit }) {
      if (localStorage.violations) {
        console.log("Violations loaded from cache");
        commit("setViolations", JSON.parse(localStorage.violations));
      } else {
        console.log("Retrieving violations...");
        fetch(
          "https://lapd-cdnjs.azurewebsites.us/api/getViolations?code=uJfipuFhanfZegR6iu6ut0YtWqaWjtxjD67zN1WC3Dn8g7gXc6OMig=="
        )
          .then((res) => res.json())
          .then((data) => {
            commit("setViolations", data);
            localStorage.setItem("violations", JSON.stringify(data));
            console.log("Violations loaded");
          });
      }
    },
    getSchools({ commit }) {
      if (localStorage.schools) {
        console.log("Schools loaded from cache");
        commit("setSchools", JSON.parse(localStorage.schools));
      } else {
        console.log("Retrieving schools...");
        fetch(
          "https://lapd-cdnjs.azurewebsites.us/api/getSchools?code=WYpZ839XB2uGLaCAV2XMZwrkJH5za6qGmOSUjC2Da8bEv8POzUsnWg=="
        )
          .then((res) => res.json())
          .then((data) => {
            commit("setSchools", data);
            localStorage.setItem("schools", JSON.stringify(data));
            console.log("Schools loaded");
          });
      }
    },
    getIncForOfcr({ commit }, serial) {
      if (localStorage.incidents) {
        console.log("Incidents loaded from cache");
        commit("setIncForOfcr", JSON.parse(localStorage.incidents));
      } else {
        console.log(`Retrieving incidents for ${serial}`);
        fetch(
          `https://lapd-cdnjs.azurewebsites.us/api/getOfficerIncs?serial=${serial}`
        )
          .then((res) => res.json())
          .then((data) => {
            commit("setIncForOfcr", data);
            localStorage.setItem("incidents", JSON.stringify(data));
            console.log(`Incidents for ${serial} loaded`);
          });
      }
    },
    getPartnerInfo({ state }) {
      let today = datetime.methods.getLongDate(new Date());
      if (state.incidents) {
        let def = state.incidents[0];
        let day = def.IncidentTime.substring(0, def.IncidentTime.indexOf("T"));
        if (day === today) {
          def.Units.forEach((u) => {
            u.Officers.forEach((o) => {
              if (o.OfficerId === state.watchInfo.officer1.SerialNumber) {
                u.Officers.filter(
                  (p) => p.OfficerId !== state.watchInfo.officer1.SerialNumber
                );
              }
            });
          });
        }
      }
    },
  },
};
