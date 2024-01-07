const http = require('http');
const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// CrÃ©ez une connexion Ã  votre base de donnÃ©es
const db = mysql.createConnection({
    host: '82.165.56.139',
    user: 'root',
    password: 'mdpbdlinux',
    database: 'medoPlante'
});

// Connectez-vous Ã  votre base de donnÃ©es
db.connect((err) => {
    if (err) throw err;
    console.log('ConnectÃ© Ã  la base de donnÃ©es');
});

app.get('/', (req, res) => {
    res.send('Bonjour, monde !');
  });  

app.get('/demoe', (req, res) => {
    res.send('Bonjour, ICI !');
  }); 

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // RÃ©cupÃ©rez le mot de passe hachÃ© de l'utilisateur de la base de donnÃ©es
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


// RÃ©cupÃ©rer les informations d'un utilisateur par ID
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

// RÃ©cupÃ©rer les interactions
app.get('/interactionsNamesID', (req, res) => {
    const query = `
    SELECT interactions.id, interactions.medicament_id AS medicament, interactions.plante_id, interactions.description, medicaments.nom AS medicamentNom, plantes.nom AS planteNom
    FROM interactions
    INNER JOIN medicaments ON interactions.medicament_id = medicaments.id
    INNER JOIN plantes ON interactions.plante_id = plantes.id    
    `;
    db.query(query, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});


// Ajouter une interaction
app.post('/interactions', (req, res) => {
    const { medicament_id, plante_id, description } = req.body;
    const query = 'INSERT INTO interactions (medicament_id, plante_id, description) VALUES (?, ?, ?)';
    db.query(query, [medicament_id, plante_id, description], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});


// Ajouter un medicament
app.post('/medicament', (req, res) => {
    const { nom, categorie_id } = req.body;
    const query = 'INSERT INTO medicaments (nom, categorie_id) VALUES (?, ?)';
    db.query(query, [nom, categorie_id], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});


// Ajouter une plante
app.post('/plante', (req, res) => {
    const { nom, categorie_id } = req.body;
    const query = 'INSERT INTO plantes (nom, categorie_id) VALUES (?, ?)';
    db.query(query, [nom, categorie_id], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// Modifier une interaction
app.put('/interactions/:id', (req, res) => {
    const { id } = req.params;
    const { medicament_id, plante_id, description } = req.body;
    const query = 'UPDATE interactions SET medicament_id = ?, plante_id = ?, description = ? WHERE id = ?';
    db.query(query, [medicament_id, plante_id, description, id], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// Modifier un medicament
app.put('/medicaments/:id', (req, res) => {
    const { id } = req.params;
    const { nom, categorie_id } = req.body;
    const query = 'UPDATE medicaments SET nom = ?, categorie_id = ? WHERE id = ?';
    db.query(query, [nom, categorie_id, id], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// Modifier une plante
app.put('/plantes/:id', (req, res) => {
    const { id } = req.params;
    const { nom, categorie_id } = req.body;
    const query = 'UPDATE plantes SET nom = ?, categorie_id = ? WHERE id = ?';
    db.query(query, [nom, categorie_id, id], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// Supprimer une interaction
app.delete('/interactions/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM interactions WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// Supprimer un medicament
app.delete('/medicaments/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM medicaments WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// Supprimer une plante
app.delete('/plantes/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM plantes WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});




const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);