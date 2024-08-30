   require('dotenv').config();
   const express = require('express');
   const app = express();
   const port = process.env.PORT || 5001;

   app.use(express.json());

<<<<<<< Updated upstream
// Miiiiiiiiiddleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
=======
   app.get('/', (req, res) => {
     res.send('Autopark server is running');
   });
>>>>>>> Stashed changes

 app.listen(5001, '0.0.0.0', () => console.log('Autopark server is running on port 5001'));
