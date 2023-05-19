import Veterinario from "../models/Veterinario.js"
import { generarJWT } from "../helpers/generarJWT.js"
import { generarId } from "../helpers/generarId.js"
import { emailRegistro } from "../helpers/emailRegstro.js"
import { emailOlvidePassword } from "../helpers/emailOlvidePassword.js"

export const registrar = async (req, res) => {
    const { email, nombre } = req.body

    //revisar si un usuario está registrado
    const existeUsuario = await Veterinario.findOne({ email })
    if (existeUsuario) {
        const error = new Error("Usuario ya registrado")
        return res.status(400).json({ msg: error.message })
    }

    try {
        //guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body)
        const veterinarioGuardado = await veterinario.save()
        // enviar el email
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        })
        res.json(veterinarioGuardado)
    } catch (error) {
        console.log(error)
    }
}

export const perfil = (req, res) => {
    const { veterinario } = req
    res.json(veterinario)
}

export const confirmar = async (req, res) => {
    const { token } = req.params

    const usuarioConfirmar = await Veterinario.findOne({ token })

    if (!usuarioConfirmar) {
        const error = new Error("Token Inválido")
        return res.status(404).json({ msg: error.message })
    }

    try {
        usuarioConfirmar.token = null
        usuarioConfirmar.confirmado = true
        await usuarioConfirmar.save()
        res.json({ msg: "Usuario confirmado correctamente" })
    } catch (error) {
        console.log(error)
    }

}

export const autenticar = async (req, res) => {
    const { email, password } = req.body

    //comprobar si el usuario existe
    const usuario = await Veterinario.findOne({ email })

    if (!usuario) {
        const error = new Error("El usuario no existe")
        return res.status(403).json({ msg: error.message })
    }

    //comprobar si el usuario esta confirmado
    if (!usuario.confirmado) {
        const error = new Error("El usuario no está confirmado")
        return res.status(403).json({ msg: error.message })
    }

    //revisar el password
    if (await usuario.comprobarPassword(password)) {
        //autenticando con JWT
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        })
    } else {
        const error = new Error("Password incorrecto")
        return res.status(403).json({ msg: error.message })
    }
}

export const olvidePassword = async (req, res) => {
    const { email } = req.body
    const existeVeterinario = await Veterinario.findOne({ email })
    if (!existeVeterinario) {
        const error = new Error("El usuario no existe")
        return res.status(400).json({ msg: error.message })
    }

    try {
        existeVeterinario.token = generarId()
        await existeVeterinario.save()

        //enviar email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })

        res.json({ msg: "Hemos enviado un email con las instrucciones" })
    } catch (error) {
        console.log(error)
    }

}

export const comprobarToken = async (req, res) => {
    const { token } = req.params
    const tokenValido = await Veterinario.findOne({ token })

    if (tokenValido) {
        res.json({ msg: "Hemos enviado un email con las instrucciones" })
    } else {
        const error = new Error("Token inválido")
        return res.status(400).json({ msg: error.message })
    }
}

export const nuevoPassword = async (req, res) => {
    const { token } = req.params
    const { password } = req.body

    const veterinario = await Veterinario.findOne({ token })

    if (!veterinario) {
        const error = new Error("Hubo un error")
        return res.status(400).json({ msg: error.message })
    }

    try {
        veterinario.token = null
        veterinario.password = password
        await veterinario.save()
        res.json({ msg: "password modificado correctamente" })
        console.log("password modificado correctamente")
    } catch (error) {
        console.log(error)
    }
}
export const actualizarPerfil = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id)
    if (!veterinario) {
        const error = new Error("Hubo un error")
        return res.status(400).json({ msg: error.message })
    }

    const { email } = req.body
    if (veterinario.email !== req.body.email) {
        const existeEmail = veterinario.findOne({ email })
        if (existeEmail) {
            const error = new Error("Ese email ya existe")
            return res.status(400).json({ msg: error.message })
        }
    }

    try {
        veterinario.nombre = req.body.nombre
        veterinario.email = req.body.email
        veterinario.web = req.body.web
        veterinario.telefono = req.body.telefono

        const veterinarioActualizado = await veterinario.save()
        res.json(veterinarioActualizado)
    } catch (error) {
        console.log(error)
    }
    console.log(req.params.id)
    console.log(req.body)
}

export const actualizarPassword = async (req, res) => {
    const { id } = req.veterinario
    const { pwd_actual, pwd_nuevo } = req.body

    const veterinario = await Veterinario.findById(id)
    if (!veterinario) {
        const error = new Error("Hubo un error")
        return res.status(400).json({ msg: error.message })
    }

    if (await veterinario.comprobarPassword(pwd_actual)) {
        veterinario.password = pwd_nuevo
        await veterinario.save()
        res.json({msg: 'Password almacenado correctamente'})
    } else {
        const error = new Error("Password actual incorrecto")
        return res.status(400).json({ msg: error.message })
    }
}