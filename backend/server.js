import express from 'express';
import mongodb from 'mongodb';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
const dbUrl = 'mongodb://localhost/crudwithredux';

function validate(data) {
  let errors = {};
  if (data.title === '') errors.title =  "Cant be empty";
  if (data.cover === '') errors.cover = 'Cant be empty';
  const isValid = Object.keys(errors).length === 0
  return { errors, isValid };
}

mongodb.MongoClient.connect(dbUrl, function(err, db) {

  app.get('/api/games', (req, res) => {
    db.collection('games').find({}).toArray((err, games) => {
      res.json({ games });
    });
  });

  app.post('/api/games', (req, res) => {
  	const { errors, isValid } = validate(req.body);
  	if (isValid) {
  		const { title, cover } = req.body;
  		db.collection('games').insert({ title, cover }, (err, result ) => {
  			if (err) {
  				res.status(500).json({ errors: { global: "Something went wrong. "}});
  			} else {
  				res.json({ game: result.ops[0] });
  			}
  		})

  	} else {
  		res.status(404).json({ errors });
  	}
 });

 app.get('/api/games/:_id', (req, res) => {
   db.collection('games').findOne({_id: new mongodb.ObjectId(req.params._id) }, (err, game) => {
     res.json({ game });
   })
 });

  app.use((req, res) => {
  	res.status(404).json({
  		errors: {
  			global: "Still working on it. Please try again later."
  		}
  	})
  })

  app.listen(8080, () => console.log('Server is running on localhost:8080'));

});
