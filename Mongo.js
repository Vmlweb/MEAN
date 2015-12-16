//Setup administrator
use admin;
db.createUser({
    user: "admin",
    pwd: "admin",
    roles: [
	    { role: "root", db: "admin" }
	]
});
db.auth("admin", "admin");

//Setup user account
use mean;
db.createUser({
    user: "mean",
    pwd: "mean",
    roles: [
	    { role: "readWrite", db: "mean" }
	]
});
db.auth("mean", "mean");