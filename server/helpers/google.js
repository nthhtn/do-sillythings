import { google } from "googleapis";
import {
	GOOGLECLOUD_APIKEY,
	GOOGLECLOUD_OAUTH_CLIENTID,
} from "../../config/google";

// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
	"https://www.googleapis.com/auth/calendar",
];

const calendar = google.calendar({
	version: "v3",
	auth: GOOGLECLOUD_APIKEY
});

