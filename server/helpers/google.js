import { google } from "googleapis";
import {
	GOOGLECLOUD_APIKEY,
	GOOGLECLOUD_OAUTH_CLIENTID,
	GOOGLECLOUD_OAUTH_CLIENTSECRET,
} from "../../config/google";

// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = ["https://www.googleapis.com/auth/calendar"];

// const calendar = google.calendar({
// 	version: "v3",
// 	auth: GOOGLECLOUD_APIKEY,
// });

// // console.log(calendar);
// console.log(GOOGLECLOUD_APIKEY);

// calendar.calendarList.get({ calendarId: "primary" }).then((response) => {
// 	// console.log(response);
// });

const oauth2Client = new google.auth.OAuth2(
	GOOGLECLOUD_OAUTH_CLIENTID,
	GOOGLECLOUD_OAUTH_CLIENTSECRET,
	"/wedding/oauth2callback"
);

google.options({ auth: oauth2Client });

async function authenticate(scopes) {
	return new Promise((resolve, reject) => {
		// grab the url that will be used for authorization
		const authorizeUrl = oauth2Client.generateAuthUrl({
			access_type: "offline",
			scope: scopes.join(" "),
		});
		const server = http
			.createServer(async (req, res) => {
				try {
					if (req.url.indexOf("/oauth2callback") > -1) {
						const qs = new url.URL(req.url, "http://localhost:3000")
							.searchParams;
						res.end(
							"Authentication successful! Please return to the console."
						);
						server.destroy();
						const { tokens } = await oauth2Client.getToken(
							qs.get("code")
						);
						oauth2Client.credentials = tokens; // eslint-disable-line require-atomic-updates
						resolve(oauth2Client);
					}
				} catch (e) {
					reject(e);
				}
			})
			.listen(3000, () => {
				// open the browser to the authorize url to start the workflow
				opn(authorizeUrl, { wait: false }).then((cp) => cp.unref());
			});
		destroyer(server);
	});
}

async function runSample() {
	// retrieve user profile
	const res = await people.people.get({
		resourceName: "people/me",
		personFields: "emailAddresses",
	});
	console.log(res.data);
}

const url = oauth2Client.generateAuthUrl({
	// 'online' (default) or 'offline' (gets refresh_token)
	access_type: "offline",

	// If you only need one scope you can pass it as a string
	scope: scopes,
});

module.exports.googleClient = oauth2Client;
