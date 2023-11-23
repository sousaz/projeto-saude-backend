const express = require("express")
const router = express.Router()
const auth = require("../api/auth")
const schedule = require("../api/schedule")
const options = require("../api/options")
const doctor = require("../api/doctor")
const ubs = require("../api/ubs")
const queries = require("../api/queries")



router.route('/consultas/:page/:id').get(auth.checkAdmin, schedule.loadAllSchedules)

router.route("/auth/register").post(auth.registerUser)

router.route("/auth/login").post(auth.loginUser)

router.route("/auth/consulta/:page/:ubs/:tipo").get(auth.checkToken, schedule.loadSchedule)

router.route("/consulta/:id").put(auth.checkToken, schedule.makeSchedule)

router.route("/auth/validateToken").post(auth.validateToken)

router.route("/options").get(options.loadOptionsSchedule)
router.route("/options/:id").get(options.loadOptions)

router.route("/doctor").post(auth.checkAdmin, doctor.createDoctor)

router.route("/ubs").post(ubs.createUbs)

router.route("/query").post(auth.checkAdmin, queries.createQuery)

router.route("/consulta/:id/:page").get(auth.checkToken, schedule.loadUserSchedule)

router.route("/cancel/:id").put(auth.checkToken, schedule.cancelSchedule)

router.route("/delete/:id").delete(auth.checkAdmin, schedule.deleteSchedule)

router.route("/auth/admin").post(auth.validateAdmin)

// router.route("/teste").get(schedule.teste)


module.exports = router