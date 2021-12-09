
const functions = require("firebase-functions");
const app = require("express")();
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore().collection("IOT");

app.get("/dados", (request,response) => {
    db.get()
    .then(function (docs) {
      let dados = [];
      docs.forEach(function (doc) {
        dados.push({
          id: doc.id,
          dados: doc.data().dados,
          idAparelho: doc.data().id,
          data: new Date(doc.data().data.toDate())
        })
      })
      response.json(dados);
    }); 
});

app.post("/dados", (request,response) => {    
    request.body.data = new Date();
    db.add(request.body).then((res) =>{
        response.status(200).json(null);
    });
});


exports.api = functions.https.onRequest(app);