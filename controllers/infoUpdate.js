const Join = require("path").join;
const infoRoute = require("express").Router();
const _ = require("lodash");

const Auth = require("../lib/authcallback.js");
const signToken = require("../lib/signToken.js");
const CRUD = require("../lib/CRUD.js");

const { "token-timeout": expiredIn } = require("../config/config.json");

module.exports = function() {

   infoRoute.put("/api/*", Auth);

   // need to move to a different router 
   infoRoute.put("/api/user", function(req, res) {
      console.log(req.body); // client handles invalid input
      console.log(res.locals);
      const { locals } = res;

		if (locals.error) {
			const { code, message } = locals.error;
			return res.status(code).send(message);
		}
		
		const { _id: uid } = req.user;

      CRUD
         .update(uid, req.body)
         .then(data => {
            return signToken(req, data, expiredIn);
         })
         .then(refId => {
            res.status(200).json({
               message: "awesome",
               newRef: refId
            });
         })
         .catch(console.log.bind(console));
   });


   return infoRoute;
}