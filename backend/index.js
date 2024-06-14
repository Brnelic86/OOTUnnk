// ovo treba biti pokrenuto kako bi Axios radio
// pokreće se sa: node index.js

const mysql = require('mysql');
const express = require('express');
const app = express();
var cors = require('cors')
var bodyParser = require('body-parser');
//const conn=require('./connection')

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true})); 
app.use(express.json());
const dbConfig = require("./dbConfig");

app.use(cors());
//const cors = require('cors');
app.use(cors({ origin: "*" }));




var dbConn = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

//spajanje s bazom
dbConn.connect();





// Ovo riješava problem: 
// Origin <origin> is not allowed by Access-Control-Allow-Origin
// from origin 'http://localhost:4200' has been blocked by CORS policy
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// kraj fix-a




//uzimanje podataka o korisnicima
app.get("/mobilnosti", function (request, response) {
  dbConn.query("SELECT * FROM KategorizacijaRada", function (error, results, fields) {
      if (error) throw error;
      return response.send({
          error: false,
          data: results,
          message: "lista KategorizacijaRada.",
      });
  });
});
app.get("/vrstaMobilnosti", function (request, response) {
  dbConn.query("SELECT * FROM VrstaMobilnosti", function (error, results, fields) {
      if (error) throw error;
      return response.send({
          error: false,
          data: results,
          message: "lista vrstaMobilnosti.",
      });
  });
});

//uzimanje podataka o korisnicima
app.get("/vrstaRecenzije", function (request, response) {
  dbConn.query("SELECT * FROM VrstaRecenzije", function (error, results, fields) {
      if (error) throw error;
      return response.send({
          error: false,
          data: results,
          message: "lista vrstRecenzije.",
      });
  });
});

//uzimanje podataka o korisnicima
app.get("/vrstaUsavrsavanja", function (request, response) {
  dbConn.query("SELECT * FROM VrstaUsavrsavanja", function (error, results, fields) {
      if (error) throw error;
      return response.send({
          error: false,
          data: results,
          message: "lista vrstUsavrsavanja.",
      });
  });
});

app.post('/dodajVrstuMobilnosti', function (request, response)  {
    const data = request.body;

    const VrstaMobilnosti = [
        [
          data.naziv
        ]
      ];

      dbConn.query('INSERT INTO KategorizacijaRada (Naziv) VALUES ?',
    [VrstaMobilnosti], function (error, results) {
      if (error) throw error;
      console.log('data', data)
      return response.send({ error: false, data: results, message: 'Predmet je dodan.' });
    });

      
    }) ;

    app.post('/prijavi', function (req, res)  {
      const data =req.body;

        const Profesor=[
          [data.korisnicko_ime,
            data.lozinka
          ]
        ]


      dbConn.get("SELECT * FROM Profesor WHERE Korisnicko_ime = ? AND Lozinka = ?", [Profesor], function(err, res)  {
        if (err) {
          res.status(500).json({ success: false, message: 'Database error' });
        } else if (err) {
          res.json({ success: true });
        } else {
          res.json({ success: false });
        }
      });
    });
  
      app.post('/dodajProfesora', function (request, response)  {
      const data = request.body;
  
      const Profesor = [
          [
            data.Ime,
            data.DatumRodjenja,
            data.OIB,
            data.KorisnickoIme,
            data.Lozinka
          ]
        ];
  
        dbConn.query('INSERT INTO Profesor (Ime_Prezime, Datum_rodenja, OIB, Korisnicko_ime, Lozinka) VALUES ?',
      [Profesor], function (error, results) {
        if (error) throw error;
        console.log('data', data)
        return response.send({ error: false, data: results, message: 'Predmet je dodan.' });
      });
        
      }) ;
  
      app.post('/dodajUsavrsavanje', function (request, response)  {
        const data = request.body;
    
        const Usavrsavanje = [
            [
              data.Naziv,
              data.Odobritelj,
              data.Organizator,
              data.DatumPocetka,
              data.DatumZavrsetka,
              data.vrstaUsavrsavanja,
              data.profesor,
              '-'
            ]
          ];
    
          dbConn.query('INSERT INTO Strucno_Usavrsavanje (Naziv, Odobritelj, Organizator, DatumPocetka, DatumZavrsetka, UsavrsavanjeVrstaUsavrsavanja, UsavrsavanjeProfesor, Vidljivost) VALUES ?',
        [Usavrsavanje], function (error, results) {
          if (error) throw error;
          console.log('data', data)
          return response.send({ error: false, data: results, message: 'Predmet je dodan.' });
        });
          
        }) ;

        app.post('/dodajErasmus', function (request, response)  {
          const data = request.body;
      
          const Erasmus = [
              [
                data.naziv,
                data.datumPocetka,
                data.datumZavrsetka,
                data.profesor,
                data.mobilnost
              ]
            ];
      
            dbConn.query('INSERT INTO Erasmus (Naziv_Institucije, DatumPocetka, DatumZavrsetka, ErasmusProfesor, ErasmusMobilnost) VALUES ?',
          [Erasmus], function (error, results) {
            if (error) throw error;
            console.log('data', data)
            return response.send({ error: false, data: results, message: 'Predmet je dodan.' });
          });
            
          }) ;

          app.post('/dodajRad', function (request, response) {
            const data = request.body;
          
            const Rad = [
              [
                data.naziv,
                data.opis,
                data.godina,
                data.sifra_kategorije,
                data.studenti,
                data.vrstaRecenzije,
                data.profesor
              ]
            ];
          
            dbConn.query('INSERT INTO Radovi (Naziv, Opis, Godina, RadoviKategorizacijaRada, Studenti, RadoviVrstaRecenzije, RadoviProfesor) VALUES ?',
              [Rad], function (error, results) {
                if (error) throw error;
                console.log('data', data)
                return response.send({ error: false, data: results, message: 'Predmet je dodan.' });
              });
          });
          

//uzimanje podataka o korisnicima
app.get("/erasmus", function (request, response) {
    dbConn.query("SELECT * FROM Erasmus", function (error, results, fields) {
        if (error) throw error;
        return response.send({
            error: false,
            data: results,
            message: "lista Erasmus.",
        });
    });
  });

  //uzimanje podataka o korisnicima
app.get("/profesori", function (request, response) {
    dbConn.query("SELECT * FROM Profesor", function (error, results, fields) {
        if (error) throw error;
        return response.send({
            error: false,
            data: results,
            message: "lista Profesori.",
        });
    });
  });

  //uzimanje podataka o korisnicima
app.get("/radovi", function (request, response) {
    dbConn.query("SELECT * FROM Radovi", function (error, results, fields) {
        if (error) throw error;
        return response.send({
            error: false,
            data: results,
            message: "lista Radovi.",
        });
    });
  });

  //uzimanje podataka o korisnicima
app.get("/strucnoUsavrsavanje", function (request, response) {
    dbConn.query("SELECT * FROM Strucno_Usavrsavanje", function (error, results, fields) {
        if (error) throw error;
        return response.send({
            error: false,
            data: results,
            message: "lista strucno usavrsavanje.",
        });
    });
  });

// Endpoint za ažuriranje podataka
app.put('/updateRad/:ID', function (request, response) {
  const { ID } = request.params;
  const { Naziv, Opis, Godina, sifra_kategorije, Studenti, vrstaRecenzije, profesor } = request.body;
  console.log({ ID, Naziv, Opis, Godina, sifra_kategorije, Studenti, vrstaRecenzije, profesor });
  dbConn.query('UPDATE Radovi SET Naziv = ?, Opis = ?, Godina = ?, RadoviKategorizacijaRada = ?, Studenti = ?, RadoviVrstaRecenzije = ?, RadoviProfesor = ? WHERE ID = ?',
    [Naziv, Opis, Godina, sifra_kategorije, Studenti, vrstaRecenzije, profesor, ID], function (error, results, fields) {
      if (error) {
        console.error(error);
        return response.status(500).send({ error: true, message: 'Greška prilikom ažuriranja rada.' });
      }
      return response.send({ error: false, data: results, message: 'Rad ažuriran.' });
    });
});

// Endpoint za brisanje rada
app.delete('/deleteRad/:ID', function (request, response) {
  const { ID } = request.params;
  console.log(`Deleting Rad with ID: ${ID}`);
  
  dbConn.query('DELETE FROM Radovi WHERE ID = ?', [ID], function (error, results, fields) {
    if (error) {
      console.error(error);
      return response.status(500).send({ error: true, message: 'Greška prilikom brisanja rada.' });
    }
    if (results.affectedRows === 0) {
      return response.status(404).send({ error: true, message: 'Rad nije pronađen.' });
    }
    return response.send({ error: false, data: results, message: 'Rad uspješno obrisan.' });
  });
});

// Endpoint za ažuriranje stručnog usavršavanja
app.put('/updateUsavrsavanje/:ID', function (request, response) {
  const { ID } = request.params;
  const { Naziv, Odobritelj, Organizator, DatumPocetka, DatumZavrsetka, vrstaUsavrsavanja, profesor } = request.body;
  console.log({ ID, Naziv, Odobritelj, Organizator, DatumPocetka, DatumZavrsetka, vrstaUsavrsavanja, profesor });
  dbConn.query(
    'UPDATE Strucno_Usavrsavanje SET Naziv = ?, Odobritelj = ?, Organizator = ?, DatumPocetka = ?, DatumZavrsetka = ?, UsavrsavanjeVrstaUsavrsavanja = ?, UsavrsavanjeProfesor = ? WHERE ID = ?',
    [Naziv, Odobritelj, Organizator, DatumPocetka, DatumZavrsetka, vrstaUsavrsavanja, profesor,ID],
    function (error, results, fields) {
      if (error) {
        console.error(error);
        return response.status(500).send({ error: true, message: 'Greška prilikom ažuriranja stručnog usavršavanja.' });
      }
      return response.send({ error: false, data: results, message: 'Stručno usavršavanje ažurirano.' });
    }
  );
});

// Endpoint za brisanje stručnog usavršavanja
app.delete('/deleteUsavrsavanje/:ID', function (request, response) {
  const { ID } = request.params;
  console.log(`Deleting StrucnoUsavrsavanje with ID: ${ID}`);
  
  dbConn.query('DELETE FROM Strucno_Usavrsavanje WHERE ID = ?', [ID], function (error, results, fields) {
    if (error) {
      console.error(error);
      return response.status(500).send({ error: true, message: 'Greška prilikom brisanja stručnog usavršavanja.' });
    }
    if (results.affectedRows === 0) {
      return response.status(404).send({ error: true, message: 'Stručno usavršavanje nije pronađeno.' });
    }
    return response.send({ error: false, data: results, message: 'Stručno usavršavanje uspješno obrisano.' });
  });
});

// Endpoint za ažuriranje Erasmus posta
app.put('/updateErasmus/:ID', function (request, response) {
  const { ID } = request.params;
  const { Naziv_Institucije, DatumPocetka, DatumZavrsetka, profesor, mobilnost } = request.body;
  console.log({ ID, Naziv_Institucije, DatumPocetka, DatumZavrsetka, profesor, mobilnost });
  dbConn.query(
    'UPDATE Erasmus SET Naziv_Institucije = ?, DatumPocetka = ?, DatumZavrsetka = ?, ErasmusProfesor = ?, ErasmusMobilnost = ?  WHERE ID = ?',
    [Naziv_Institucije, DatumPocetka, DatumZavrsetka, profesor, mobilnost, ID],
    function (error, results, fields) {
      if (error) {
        console.error(error);
        return response.status(500).send({ error: true, message: 'Greška prilikom ažuriranja Erasmus posta.' });
      }
      return response.send({ error: false, data: results, message: 'Erasmus post ažuriran.' });
    }
  );
});

// Endpoint za brisanje Erasmus posta
app.delete('/deleteErasmus/:ID', function (request, response) {
  const { ID } = request.params;
  console.log(`Deleting Erasmus post with ID: ${ID}`);
  
  dbConn.query('DELETE FROM Erasmus WHERE ID = ?', [ID], function (error, results, fields) {
    if (error) {
      console.error(error);
      return response.status(500).send({ error: true, message: 'Greška prilikom brisanja Erasmus posta.' });
    }
    if (results.affectedRows === 0) {
      return response.status(404).send({ error: true, message: 'Erasmus post nije pronađen.' });
    }
    return response.send({ error: false, data: results, message: 'Erasmus post uspješno obrisan.' });
  });
});

app.put('/updateVrstuMobilnosti/:ID', function (request, response) {
  const { ID } = request.params;
  const { naziv } = request.body;
  console.log({ ID, naziv });
  dbConn.query(
    'UPDATE KategorizacijaRada SET Naziv = ? WHERE ID = ?',
    [naziv, ID],
    function (error, results, fields) {
      if (error) {
        console.error(error);
        return response.status(500).send({ error: true, message: 'Greška prilikom ažuriranja vrste mobilnosti.' });
      }
      return response.send({ error: false, data: results, message: 'Vrsta mobilnosti ažurirana.' });
    }
  );
});

app.delete('/deleteVrstuMobilnosti/:ID', function (request, response) {
  const { ID } = request.params;
  console.log(`Deleting Vrsta_Mobilnosti with ID: ${ID}`);
  
  dbConn.query('DELETE FROM KategorizacijaRada WHERE ID = ?', [ID], function (error, results, fields) {
    if (error) {
      console.error(error);
      return response.status(500).send({ error: true, message: 'Greška prilikom brisanja vrste mobilnosti.' });
    }
    if (results.affectedRows === 0) {
      return response.status(404).send({ error: true, message: 'Vrsta mobilnosti nije pronađena.' });
    }
    return response.send({ error: false, data: results, message: 'Vrsta mobilnosti uspješno obrisana.' });
  });
});

// Endpoint za ažuriranje podataka profesora
app.put('/updateProfessor/:ID', function (request, response) {
  const { ID } = request.params;
  const { Ime, DatumRodjenja, OIB, KorisnickoIme, Lozinka } = request.body;
  console.log({ ID, Ime, DatumRodjenja, OIB, KorisnickoIme, Lozinka });
  
  dbConn.query('UPDATE Profesor SET Ime_Prezime = ?, Datum_rodenja = ?, OIB = ?, Korisnicko_ime = ?, Lozinka = ? WHERE ID = ?',
    [Ime, DatumRodjenja, OIB, KorisnickoIme, Lozinka, ID], function (error, results, fields) {
      if (error) {
        console.error(error);
        return response.status(500).send({ error: true, message: 'Greška prilikom ažuriranja profesora.' });
      }
      return response.send({ error: false, data: results, message: 'Profesor ažuriran.' });
    });
});

app.delete('/deleteProfessor/:ID', function (request, response) {
  const { ID } = request.params;
  console.log(`Deleting Profesor with ID: ${ID}`);
  
  dbConn.query('DELETE FROM Profesor WHERE ID = ?', [ID], function (error, results, fields) {
    if (error) {
      console.error(error);
      return response.status(500).send({ error: true, message: 'Greška prilikom brisanja profesora.' });
    }
    if (results.affectedRows === 0) {
      return response.status(404).send({ error: true, message: 'Profesor nije pronađen.' });
    }
    return response.send({ error: false, data: results, message: 'Profesor uspješno obrisan.' });
  });
});


/*
app.delete('/atrakcije/id', function (request, response) {
    let id_atrakcije = request.params.id;
    if (!id_atrakcije) {
    return response.status(400).send({ error: true, message:
    'nedostaje id atrakcije' });
    }
    dbConn.query("DELETE * FROM atrakcije WHERE id_atrakcije = ?",[id_atrakcije],
    function (error, results) {
    if (error) throw error;
    return response.send({ error: false, data: results, message:
    'atrakcija je obrisana.' });
    });
});*/


 // Dodavanje ocjene za atrakciju
 

//port na kojem je app
app.listen(4200, function () {
console.log('Node app is running on port 4200');
});
//module.exports = app;


