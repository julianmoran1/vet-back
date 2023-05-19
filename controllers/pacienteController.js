import Paciente from "../models/Paciente.js"

export const agregarPaciente = async (req, res) => {
    const paciente = new Paciente(req.body)
    paciente.veterinario = req.veterinario._id

    try {
        const pacienteGuardado = await paciente.save()
        res.json(pacienteGuardado)
    } catch (error) {
        console.log(error)
    }
}

export const obtenerPacientes = async (req, res) => {
    const pacientes = await Paciente.find().where("veterinario").equals(req.veterinario)
    res.json(pacientes)
}

export const obtenerPaciente = async (req, res) => {
    const { id } = req.params
    const paciente = await Paciente.findById(id)

    if (!paciente) {
        return res.status(404).json({ msg: "No encontrado" })
    }

    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({ msg: "Acción no válida" })
    }

    // mostrar paciente
    res.json(paciente)

}

export const actualizarPaciente = async (req, res) => {
    const { id } = req.params
    const paciente = await Paciente.findById(id)

    if (!paciente) {
        return res.status(404).json({ msg: "No encontrado" })
    }

    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({ msg: "Acción no válida" })
    }

    // actualizar paciente
    paciente.nombre = req.body.nombre || paciente.nombre
    paciente.propietario = req.body.propietario || paciente.propietario
    paciente.email = req.body.email || paciente.email
    paciente.fecha = req.body.fecha || paciente.fecha
    paciente.sintomas = req.body.sintomas || paciente.sintomas

    try {
        const pacienteActualizado = await paciente.save()
        res.json(pacienteActualizado)
    } catch (error) {
        console.log(error)
    }

}

export const eliminarPaciente = async (req, res) => {
    const { id } = req.params
    const paciente = await Paciente.findById(id)

    if (!paciente) {
        return res.status(404).json({ msg: "No encontrado" })
    }

    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({ msg: "Acción no válida" })
    }

    try {
        await paciente.deleteOne()
        return res.json({ msg: "Paciente eliminado" })
    } catch (error) {
        console.log(error)
    }
}