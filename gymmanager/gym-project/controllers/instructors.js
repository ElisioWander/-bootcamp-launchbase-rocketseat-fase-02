const fs = require('fs')
const data = require('../data.json')
const { age, date } = require('../utils')
const Intl = require('intl')

exports.index = function (req, res) {
    return res.render("instructors/index.html", { instructors: data.instructors })
}
exports.create = function (req, res) {
    return res.render("instructors/create.html")
}
exports.post = function(req, res) {
    const keys = Object.keys(req.body)

    for (let key of keys) {
        if (req.body[key] == "") {
            return res.send("please, fill all fields")
        }
    }
    
    let { avatar_url, name, birth, gender, services } = req.body

    birth = Date.parse(birth)
    const created_at = Date.now()
    const id = Number(data.instructors.length +1)

    //enviar os dados do body para dentro do array no data.json
    data.instructors.push({ 
        id,
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at
     })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("Write file error")

        return res.redirect("/instructors")
    })

    
}
exports.show = function(req, res) {
    const { id } = req.params

    const foundInstructor = data.instructors.find(function(instructor) {
        return instructor.id == id
    })

    if (!foundInstructor) return res.send("Instructor not found!")

    const instructor = {
        //espalhar os elementos que já estão dentro do foundInstructor que não serão alterados
        ...foundInstructor,
        age: age(foundInstructor.birth),
        services: foundInstructor.services.split(","), //split vai colocar cada elemento dentro de uma posição, mesmo que esses elementos não estejam dentro de um array.
        created_at: new Intl.DateTimeFormat('pt-BR').format(foundInstructor.created_at),
    }

    return res.render('instructors/show', { instructor })
}
exports.edit = function(req, res) {
    const { id } = req.params

    const foundInstructor = data.instructors.find(function(instructor) {
        return instructor.id == id
    })

    if(!foundInstructor) return res.send("Instructor not found!")

    const instructor = {
        ...foundInstructor,
        birth: date(foundInstructor.birth).iso
    }

    return res.render("instructors/edit", { instructor })
}
exports.put = function(req, res) {
    const { id } = req.body

    let index = 0

    const foundInstructor = data.instructors.find(function(instructor, foundIndex) {
        if(id == instructor.id) {
            index = foundIndex
            return true
        }
    })

    if(!foundInstructor) return res.send("instructor not found!")

    const instructor = {
        ...foundInstructor,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.instructors[index] = instructor

    fs.writeFileSync("data.json", JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send("write error!")
    })

    return res.redirect(`/instructors/${id}`)
}
exports.delete = function(req, res) {
    const { id } = req.body

    const filteredInstructors = data.instructors.filter(function(instructor) {
        return instructor.id != id
    })

    data.instructors = filteredInstructors

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send("Writefile error!")

        return res.redirect("/instructors")
    })
}
