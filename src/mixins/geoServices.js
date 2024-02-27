import GeoJsonGeometriesLookup from "geojson-geometries-lookup";
// import GoogleMap from "@/components/core/GoogleMap.vue";
// import { gmapApi } from "vue2-google-maps";

import db from "../storage.js";
// import Axios from "axios";

export const geoServices = {
	data() {
		return {};
	},
	mounted() {
		// google: gmapApi;
	},
	methods: {
		async getAddressFromCoords(latLng) {
			// var address = await this.revGeocode(latLng);
			var address = await this.tomtomRevGeocode(latLng);
			var point = [latLng.lng, latLng.lat];
			var incRD = await this.rdLookup(point);

			let incLoc = {
				location: address.freeformAddress,
				lat: latLng.lat,
				lng: latLng.lng,
				rd: incRD,
			};

			return incLoc;
		},

		revGeocode(location) {
			var geocoder = new google.maps.Geocoder();
			return new Promise(function (resolve) {
				geocoder.geocode({ location: location }, function (results, status) {
					if (status === "OK") {
						resolve([results[0].formatted_address]);
					}
				});
			});
		},
		async rdLookup(lngLat) {
			//The gelocated coordinates for the RD lookup need to be in lng,lat  form - NOT lat,lng
			//This is different from the Google Maps api which uses lat,lng

			var incRD = 9999;
			const glookup = new GeoJsonGeometriesLookup(this.rdMap);

			var point = { type: "Point", coordinates: lngLat };

			this.rdMap.features.forEach((rd) => {
				let poly = {
					type: "Polygon",
					coordinates: rd.geometry.coordinates[0],
				};
				if (glookup.hasContainers(point)) {
					incRD = glookup.getContainers(point).features[0].properties.REPDIST;
				} else console.log("failed at containers");
			});

			return incRD;
		},
		locationIQrevGeocode(location) {
			const key = "d5f68c0a8ef1a7";
			const url = `https://us1.locationiq.com/v1/reverse.php?lat=${location.lat}&lon=${location.lng}&key=${key}&format=json&source=v3&layers=address,street,coarse`;
			var params = {
				q: location,
				api_key: key,
			};
			fetch(url)
				.then((res) => res.json())
				.then((data) => {
					console.log("IQ: ", data);
				});
		},

		tomtomRevGeocode(location) {
			const key = "61p0GxqDYGl0pljlNLLb0f2Y9fDMDUhJ";
			return fetch(`https://api.tomtom.com/search/2/reverseGeocode/${location.lat},${location.lng}.json?key=${key}`)
				.then((response) => response.json())
				.then((data) => {
					return data.addresses[0].address;
				});
		},
		//TOM TOM rev geocode
	},
};
