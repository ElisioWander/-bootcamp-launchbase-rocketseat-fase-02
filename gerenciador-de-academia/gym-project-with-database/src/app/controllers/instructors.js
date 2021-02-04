const { age, date } = require('../../lib/utils')
const Instructor = require('../models/Instructor')

module.exports = {
    index(req, res) {
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 2
        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(instructors) {
                return res.render("instructors/index.html", { instructors, filter })
            }
        }

        Instructor.paginate(params)
    },
    create(req, res) {
        return res.render("instructors/create.html")
    },
    post(req, res) {
        const keys = Object.keys(req.body)

        for (let key of keys) {
            if (req.body[key] == "") {
                return res.send("please, fill all fields")
            }
        }

        Instructor.create(req.body, function(instructor) {
            return res.redirect(`/instructors/${instructor.id}`)
        })
    },
    show(req, res) {
        Instructor.find(req.params.id, function(instructor) {
            if(!instructor) return res.send("Instructor not found!")

            instructor.age = age(instructor.birth)
            instructor.services = instructor.services.split(",")
            instructor.created_at = date(instructor.created_at).format

            return res.render("instructors/show", { instructor })
        })
    },
    edit(req, res) {
        Instructor.find(req.params.id, function(instructor) {
            if(!instructor) return res.send("Instructor not found!")

            instructor.birth = date(instructor.birth).iso

            return res.render("instructors/edit", { instructor })
        })
    },
    put(req, res) {
        const keys = Object.keys(req.body)

        for (let key of keys) {
            if (req.body[key] == "") {
                return res.send("please, fill all fields")
            }
        }
        
        Instructor.update(req.body, function() {
            return res.redirect(`/instructors/${req.body.id}`)
        })
    },
    delete(req, res) {
        Instructor.delete(req.body.id, function() {
            return res.redirect("/instructors")
        })
    }
}
