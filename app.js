const express = require('express');
const mysql = require('mysql');
const port = process.env.PORT || 3000;
const app = express();
const nodemailer = require('nodemailer')

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.set("view engine", "ejs");

const connection = mysql.createConnection({
    host: 'freedb.tech',
    user: 'freedbtech_dgart',
    password: 'Dilabel010303',
    database: 'freedbtech_DGART'
});

connection.connect(error => {
    if (error) throw error;
    console.log('Database connected!');
})

app.get('/', (req, res) => res.render('pages/inicio'));
app.get('/proyectos', (req, res) => res.render('pages/proyectos'));
app.get('/servicios', (req, res) => res.render('pages/servicios'));
app.get('/mision', (req, res) => res.render('pages/mision'));
app.get('/vision', (req, res) => res.render('pages/vision'));
app.get('/valores', (req, res) => res.render('pages/valores'));
app.get('/nosotros', (req, res) => res.render('pages/nosotros'));
app.get('/contacto', (req, res) => res.render('pages/contacto'));

//Lista de customers
app.get('/clientes', (req, res) => {

    const sql = 'SELECT * FROM DG_ART';

    connection.query(sql, (error, results) => {
        if (error) throw error;

        res.render('pages/resultado', {
            'results': results
        });
    });
});

app.get('/contacto', (req, res) => {
    res.render('pages/contacto');

});
app.post('/contacto', (req, res) => {
    const sql = `SELECT * FROM DG_ART WHERE correo = '${req.body.correo}'`;
    const sql2 = 'INSERT INTO DG_ART SET ?';

    const {
        nombre,
        correo,
        mensaje
    } = req.body;

    contentHTML = `
    <h1>informacion del cliente</h1>
        <ul>
            <li>Nombre: ${nombre}</li>
            <li>Correo electronico: ${correo}</li>
        </ul>
        <p>${mensaje}</p>
    `

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'proyectofinaldilabel@gmail.com',
            pass: 'dg_art_dilabel'
        },
        tls: {
            rejectUnauthorized: false
        },
    })
    
    const info = {
        from: 'proyectofinaldilabel@gmail.com',
        to: 'proyectofinaldilabel@gmail.com',
        subject: 'correo',
        html: contentHTML
    }

    connection.query(sql, (error, results) => {
        if (error) {
            throw error;
        }
        if (!results.length > 0) {
            const modelsObj = {
                nombre: req.body.nombre,
                correo: req.body.correo,
            }

            connection.query(sql2, modelsObj, error => {
                if (error) {
                    throw error;
                }
            });
        }
        transporter.sendMail(info, error => {
            if (error) {
                throw error;
            }
            res.render('pages/inicio')

        })
    })
})


app.listen(port, () => console.log(`Server ready!`))