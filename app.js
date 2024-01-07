const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// Créez une connexion à votre base de données
const db = mysql.createConnection({
    host: '82.165.56.139',
    user: 'root',
    password: 'mdpbdlinux',
    database: 'medoPlante'
});

// Connectez-vous à votre base de données
db.connect((err) => {
    if (err) throw err;
    console.log('Connecté à la base de données');
});

app.get('/', (req, res) => {
    res.send('Bonjour, monde !');
});  

app.get('/demoe', (req, res) => {
    res.send('Bonjour, ICI !');
}); 

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Récupérez le mot de passe haché de l'utilisateur de la base de données
    const query = 'SELECT * FROM utilisateurs WHERE username = ? AND password = ?';
    db.query(query, [username,password], (err, result) => {
        if (err) throw err;
        if (result.length > 0 && result[0].role_id == '12') {
            const hashedPassword = result[0].password;
            //res.send( result[0].id);
            res.send(result[0].id.toString());
        } else {
            res.send('-1');
        }
    });
});

// Récupérer les informations d'un utilisateur par ID
app.get('/getUser/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM utilisateurs WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) throw err;
        res.send(result[0]);
    });
});

//route pour recuperer les utilisateurs apartir d'un id
app.get('/utilisateurs/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM utilisateurs WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});


// RÃ©cupÃ©rer les interactions
app.get('/medicaments', (req, res) => {
    const query = 'SELECT * FROM medicaments';
    db.query(query, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// RÃ©cupÃ©rer les interactions
app.get('/plantes', (req, res) => {
    const query = 'SELECT * FROM plantes';
    db.query(query, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// RÃ©cupÃ©rer les interactions
app.get('/interactions', (req, res) => {
    const query = 'SELECT * FROM interactions';
    db.query(query, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// recuperer les categories de medicaments
app.get('/categoriesMedicaments', (req, res) => {
    const query = 'SELECT * FROM categories_medicaments';
    db.query(query, (err, result) => {

        if (err) throw err;
        res.send(result);
    });
});

// recuperer les categories de medicaments en fonction de l'id
app.get('/categoriesMedicaments/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT nom_categorie FROM categories_medicaments WHERE id_categorie = ?';
    db.query(query, [id], (err, result) => {

        if (err) throw err;
        res.send(result);

    });

});




// recuperer les categories de plantes
app.get('/categoriesPlantes', (req, res) => {
    const query = 'SELECT * FROM categories_plantes';
    db.query(query, (err, result) => {

        if (err) throw err;
        res.send(result);
    });
});




// RÃ©cupÃ©rer les interactions
app.get('/interactionsNames', (req, res) => {
    const query = `
    SELECT interactions.id, medicaments.nom AS medicament, plantes.nom AS plante, interactions.description
    FROM interactions
    INNER JOIN medicaments ON interactions.medicament_id = medicaments.id
    INNER JOIN plantes ON interactions.plante_id = plantes.id    
    `;
    db.query(query, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});



module.exports = app;