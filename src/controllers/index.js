import express from 'express';
import passport from "passport";
import moment from 'moment';

/** */
import FileUitility from '../utilities/FileUitility';
import User from '../models/UserModel';
import UserService from '../services/UserService';
import Area from '../models/AreaModel';
import AreaService from '../services/AreaService';
import DeviceService from '../services/DeviceService';

/** */
let LocalStrategy = require("passport-local").Strategy;
let userService = new UserService();
let fileUitility = new FileUitility();
let areaService=new AreaService();
let deviceService =new DeviceService();


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
 * private/area
 */
router.get("/private/area/get_all_by_user_id", isLoggedIn, async (req, res) => {
	let list = await areaService.getAllByUserID((req.session.user).username);
	//console.log("xxxxxxx="+JSON.stringify(list));
	res.render("dashboard/areas/area_list", { title: "Area List", areas: list });
});

router.post("/private/area/insert", isLoggedIn, async (req, res) => {
	let flag = req.files.image;
	if (!flag) {
		let name = req.body.name;
		let description = req.body.description;
		let created_date = new Date();
		let user_id = (req.session.user).username;
		let enabled = req.body.enabled;
		let image = "no_image.jpg";
		let priority = req.body.priority;

		/**validation errors */
		req.checkBody('name',"Name is required.").notEmpty();
		let errors=req.validationErrors();
		if(errors){
			req.flash('error_message', 'Data input is invalid!!!');
			res.redirect("/private/area/get_all_by_user_id");
		}else{

			let newArea = new Area(null,name,description,image,created_date,user_id,enabled,priority);
			try {
				let result = await areaService.insert(newArea);
				res.redirect("/private/area/get_all_by_user_id");
			} catch (error) {
				req.flash('error_message', 'You have not changed fail');
				res.redirect("/private/area/get_all_by_user_id");
			}
		}
		
	} else {
		let name = req.body.name;
		let description = req.body.description;
		let created_date = new Date();
		let user_id = (req.session.user).username;
		let enabled = req.body.enabled;
		let fileUpload = req.files.image;
		let image_name = Date.now() + fileUpload.name;
		let image = image_name
		let priority = req.body.priority;

		/**validation errors */
		req.checkBody('name',"Name is required.").notEmpty();
		let errors=req.validationErrors();
		if(errors){
			req.flash('error_message', 'Data input is invalid!!!');
			res.redirect("/private/area/get_all_by_user_id");
		}else{
			let newArea = new Area(null,name,description,image,created_date,user_id,enabled,priority);
			try {
				await fileUitility.uploadFile(fileUpload, image);
				let result = await areaService.insert(newArea);
				res.redirect("/private/area/get_all_by_user_id");
			} catch (error) {
				req.flash('error_message', 'You have not changed fail');
				res.redirect("/private/area/get_all_by_user_id");
			}
		}		
	}

});

router.get("/private/area/delete/:area_id", isLoggedIn, async (req, res) => {
	try {
		let cate = await areaService.delete(req.params.area_id);
		res.redirect("/private/area/get_all_by_user_id");
	} catch (error) {
		req.flash('error_message', 'Delete fail');
		res.redirect("/private/area/get_all_by_user_id");
	}

});

router.get("/private/area/update/:area_id", isLoggedIn, async (req, res) => {
	try {
		let area = await areaService.getByID(req.params.area_id);
		res.render("dashboard/areas/area_update", { title: "Update Area", area: area[0] });
	} catch (error) {
		req.flash('error_message', 'update fail');
		res.redirect("/private/area/get_all_by_user_id");
	}
});

router.post("/private/area/update/:area_id", isLoggedIn, async (req, res) => {
	let flag = req.files.image;
	if (!flag) {
		let name = req.body.name;
		let description = req.body.description;
		let created_date = new Date();		
		let user_id = (req.session.user).username;		
		let enabled = req.body.enabled;
		let priority = req.body.priority;

		try {
			let oldArea = await areaService.getByID(req.params.area_id);
			let newArea = new Area(oldArea[0].id,name,description,oldArea[0].image,created_date,user_id,enabled,priority);
			let result = areaService.update(newArea);
			res.redirect("/private/area/get_all_by_user_id");
		} catch (error) {
			req.flash('error_message', 'You have not changed fail');
			res.redirect("/private/area/get_all_by_user_id");
		}
	} else {
		let name = req.body.name;
		let description = req.body.description;
		let created_date = new Date();		
		let user_id = (req.session.user).username;		
		let enabled = req.body.enabled;
		let priority = req.body.priority;
		let fileUpload = req.files.image;
		let image_name = Date.now() + fileUpload.name;
		//let image_extension = fileUpload.mimetype.split('/')[1];
		let image = image_name;	

		let newArea = new Area(req.params.area_id,name,description,image,created_date,user_id,enabled,priority);
		try {
			await fileUitility.uploadFile(fileUpload, image);
			let result = areaService.update(newArea);
			res.redirect("/private/area/get_all_by_user_id");
		} catch (error) {
			req.flash('error_message', 'You have not changed fail');
			res.redirect("/private/area/get_all_by_user_id");
		}
	}

});

router.get("/private/device/get_all_by_area_id/:area_id", isLoggedIn, async (req, res) => {
	let list = await deviceService.getAllByAreaIDAndUserID(req.params.area_id,(req.session.user).username);
	let area = await areaService.getByID(req.params.area_id);
	/* console.log("xxxxxxx="+JSON.stringify(list)); */
	res.render("dashboard/devices/device_list", { title: "Device List", devices: list ,area:area});
});

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