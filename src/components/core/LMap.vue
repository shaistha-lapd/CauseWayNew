<template>
	<div id="map">
		<l-map ref="lmap" :center="currLocation" @click="setPlace($event.latlng)" :options="mapOptions" v-resize="onResize">
			<l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
			<l-geo-json v-if="!!rdMap" :geojson="rdMap.features" :options="overlayOptions" />
			<l-marker
				class="marker"
				ref="marker"
				:lat-lng="currLocation"
				:options="markerOptions"
				@update:latLng="setPlace($event)"
				@dragend="$nextTick(() => $event.target.openPopup().preventDefault)"
				@add="$nextTick(() => $event.target.openPopup())"
				@zoom="$event.target.setZoomAround(`${marker}`)"
			>
				<l-popup ref="popup" :options="popupOptions">
					<v-container>
						<v-row justify="center">
							<h4>
								<u>Current Location:</u>
							</h4>
						</v-row>
						<v-row justify="center">
							<span class="body-2">{{ loc }}</span>
						</v-row>
						<v-row justify="center">
							<v-chip small v-bind:color="inCity ? 'primary' : 'grey'">
								<v-avatar v-if="inCity">
									<img src="../../../public/img/lapd-badge-192x192.png" alt="avatar" />
								</v-avatar>
								<strong class="white--text">RD: {{ incLocation.rd }}</strong>
							</v-chip>
						</v-row>
					</v-container>
				</l-popup>
			</l-marker>
		</l-map>
	</div>
</template>

<script>
const script = document.createElement("script");
script.async = true;
script.defer = true;
script.src = "https://unpkg.com/default-passive-events";
document.querySelector("head").appendChild(script);

import { LMap, LTileLayer, LMarker, LPopup, LGeoJson } from "vue2-leaflet";

export default {
	components: { LMap, LTileLayer, LMarker, LPopup, LGeoJson },
	props: ["currLocation", "incLocation", "rdMap"],
	data() {
		return {
			markers: [],
			loadMap: false,
			marker: LMarker,
			infoWinOpen: true,
			inCity: false,
			url: "https://{s}.tile.osm.org/{z}/{x}/{y}.png",
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
			mapOptions: {
				closePopupOnClick: false,
				zoom: 18,
				maxZoom: 18,
				keyboard: true,
				scrollWheelZoom: "center",
				doubleClickZoom: "center",
				touchZoom: "center",
			},
			overlayOptions: {
				stroke: true,
				color: "black",
				weight: 2,
				fill: false,
			},
			popupOptions: {
				autoPan: true,
				closeButton: false,
				closeOnClick: false,
			},
			markerOptions: {
				draggable: true,
				autoPan: true,
				keyboard: true,
				riseOnHover: true,
			},
		};
	},
	methods: {
		onResize() {
			this.$refs.lmap.mapObject.invalidateSize();
		},
		isEmpty(obj) {
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) return false;
			}
			return true;
		},
		setPlace(movedMarker) {
			this.$refs.marker.setLatLng(movedMarker);
			this.$refs.lmap.mapObject.panTo(movedMarker);
			this.$emit("movemarker", movedMarker);
		},
	},
	computed: {
		loc() {
			if (!this.isEmpty(this.incLocation.location)) {
				return this.incLocation.location.substring(0, this.incLocation.location.indexOf(","));
			}
		},
	},
	mounted() {
		this.onResize();
		this.$vuetify.goTo("#map");
		// if (!!this.rdMap) {
		// 	this.loadMap = true;
		// }
	},
	watch: {
		currLocation() {
			this.marker = this.currLocation;
		},
		incLocation(val) {
			this.inCity = val.rd !== 9999;
		},
		// rdMap(val) {
		// 	if (!!val) {
		// 		this.loadMap = true;
		// 	}
		// },
	},
};
</script>

<style scoped>
@import "~leaflet/dist/leaflet.css";
#map {
	height: 500px;
	display: flex;
	justify-content: center;
	touch-action: none;
	margin: 16px -16px 16px -16px;
}
l-map {
	touch-action: none;
}
</style>
