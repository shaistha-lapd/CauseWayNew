import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import PageNotFound from "../views/PageNotFound.vue";
import LoggedOut from "../views/LoggedOut.vue";
import About from "../views/About.vue";
import SignIn from "../views/SignIn.vue";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "Home",
		component: Home,
	},
	{
		path: "/loggedout",
		name: "LoggedOut",
		component: LoggedOut,
	},
	{
		path: "/about",
		name: "About",
		component: About,
	},
	{
		path: "/stops",
		component: () => import(/* webpackChunkName: "afdr" */ "../views/Stops.vue"),
		children: [
			{
				path: "",
				name: "afdr-menu",
				component: () => import("../modules/stops/StopMenu.vue").then((c) => c),
			},
			{
				path: "new",
				name: "new-afdr",
				component: () => import(/* webpackChunkName: "fi/new" */ "../modules/stops/new-afdr/NewAfdr.vue").then((c) => c),
			},
		],
	},
	{
		path: "/fi",
		component: () => import(/* webpackChunkName: "fi" */ "../views/FI.vue"),
		children: [
			{
				path: "",
				name: "fi-menu",
				component: () => import("../modules/fi/FiMenu.vue").then((c) => c),
			},
			{
				path: "new",
				name: "new",
				component: () => import(/* webpackChunkName: "fi/new" */ "../modules/fi/new-fi/NewFi.vue").then((c) => c),
			},
			{
				path: "view/:id",
				name: "view",
				component: () => import(/* webpackChunkName: "fi/view" */ "../modules/fi/ViewFi.vue").then((c) => c),
			},
			{
				path: "search",
				name: "search",
				component: () => import(/* webpackChunkName: "fi/search" */ "../modules/fi/SearchFi.vue").then((c) => c),
			},
			{
				path: "activity/:mode",
				name: "activity",
				component: () => import(/* webpackChunkName: "fi/activity" */ "../modules/fi/FiHistory.vue").then((c) => c),
			},
		],
	},
	{
		path: "/signin",
		component: () => import(/* webpackChunkName: "signin" */ "../views/SignIn.vue"),
		children: [
			{
				path: "",
				name: "sign-in-form",
				component: () => import("../modules/sign-in/Sign-In-Form.vue").then((c) => c),
			},
			// {
			// 	path: "new",
			// 	name: "new-afdr",
			// 	component: () => import(/* webpackChunkName: "fi/new" */ "../modules/stops/new-afdr/NewAfdr.vue").then((c) => c),
			// },
		],
	},

	{
		path: "/:catchAll(.*)*",
		name: "PageNotFound",
		component: PageNotFound,
	},
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
});

export default router;
