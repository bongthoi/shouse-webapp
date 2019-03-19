import express from 'express';
import passport from "passport";
import moment from 'moment';

/** */
import FileUitility from '../utilities/FileUitility';
import User from '../models/UserModel';
import UserService from '../services/UserService';

/** */
let LocalStrategy = require("passport-local").Strategy;
var userService = new UserService();
var fileUitility = new FileUitility();
let router = express.Router();

/**
 * public
*/
router.get("/", (req, res) => {
	res.render("public/index", { title: "Home" });
});

router.get("/users/register", (req, res) => {
	res.render("public/register", { title: "Register" });
});

router.post("/users/register", async (req, res) => {
	let username = req.body.username;
	let password = req.body.password;
	let cfm_password = req.body.cfm_password;
	let firstname = req.body.firstname;
	let lastname = req.body.lastname;
	let birthday = new Date();
	let address = req.body.address;
	let phone = req.body.phone;
	let enabled = 1;
	let registerdate = new Date();

	req.checkBody("username", "Username is required").notEmpty();
	req.checkBody("password", "Password is required").notEmpty();
	req.checkBody("cfm_password", "Conform Password is required").notEmpty();
	req.checkBody("firstname", "Firstname is required").notEmpty();
	req.checkBody("lastname", "Lastname is required").notEmpty();
	req.checkBody("address", "Address is required").notEmpty();
	req.checkBody("phone", "Phone is required").notEmpty();
	req.checkBody('cfm_password', 'Confirm Password Must Matches With Password').equals(password);

	let errors = req.validationErrors();
	if (errors) {
		res.render("public/register", { title: "Register", errors: errors });
	} else {
		let newUser = new User(username, password, firstname, lastname, birthday, address, phone, enabled, registerdate);
		try {
			let temp = await userService.insert(newUser);

			req.flash('success_message', 'You have registered, Now please login');
			res.redirect("/users/login");
		} catch (error) {
			req.flash('success_message', 'You have not register');
			res.redirect("/users/register");
		}
	}
});

router.get("/users/login", function (req, res) {
	res.render("public/login", { title: "Login User" });
});

/**private/user */
router.post("/users/login", passport.authenticate("local", {
	failureRedirect: "/users/login", failureFlash: true
}),
	function (req, res) {
		req.flash("success_message", "You are now Logged in!!");
		res.redirect("/private/dashboard");
	}
);

router.get("/users/logout", function (req, res) {
	req.logout();
	req.flash("success_message", "You are logged out");
	res.redirect("/users/login");
});

router.get("/private/dashboard", isLoggedIn, function (req, res) {
	res.render("dashboard/partials/dashboard");
});

router.get("/private/users/profile", isLoggedIn, (req, res) => {
	res.render("dashboard/users/profile", { title: "User Profile" });
});

router.get("/private/users/editProfile/:username", isLoggedIn, async (req, res) => {
	let theUser = await userService.getByID(req.params.username);
	res.render("dashboard/users/editProfile", { title: "Edit Profile", user: theUser });
});

router.post("/private/users/updateProfile", isLoggedIn, async (req, res) => {
	let username = req.body.username;
	let password = req.body.password;
	let cfm_password = req.body.cfm_password;
	let firstname = req.body.firstname;
	let lastname = req.body.lastname;
	let birthday = new Date();
	let address = req.body.address;
	let phone = req.body.phone;
	let enabled = 1;
	let registerdate = new Date();

	let newUser = new User(username, password, firstname, lastname, birthday, address, phone, enabled, registerdate);
	try {
		let temp = await userService.update(newUser);

		req.flash('success_message', 'You have changed successful');
		res.redirect("/private/users/profile");
	} catch (error) {
		req.flash('error_message', 'You have not changed fail');
		res.redirect("/private/users/profile");
	}
});

/**
 * private/room
 */

 /**
 * private/devices
 */

/**passportjs Auth */
passport.use(new LocalStrategy({
	usernameField: "email",
	passwordField: "password",
	passReqToCallback: true
},
	async function (req, email, password, done) {
		let user = await userService.getByID(email);
		if (!user) {
			return done(null, false, req.flash("error_message", "No email is found"));
		}
		userService.comparePassword(password, user.password, function (err, isMatch) {
			if (err) { return done(err); }
			if (isMatch) {
				req.session.user = user;
				return done(null, user, req.flash("success_message", "You have successfully logged in!!"));
			}
			else {
				return done(null, false, req.flash("error_message", "Incorrect Password"));
			}
		});
	}
));

passport.serializeUser(function (user, done) {
	done(null, user.username);
});

passport.deserializeUser(async function (id, done) {
	let user = await userService.getByID(id);
	if (!user) {
		done(new Error(), undefined);
	} else {
		done(undefined, user);
	}
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	}
	else {
		res.redirect("/users/login");
	}
}

/**export */
module.exports = router;