/*
    SETUP
*/
// MySQL
var db = require('./db-connector')

// Express
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 9353;                 // Set a port number at the top so it's easy to change in the future
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
//app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}))
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters an *.hbs file.

// Make public directory (CSS, etc,.) available to client (user's browser)
app.use(express.static('public'));


/*
    ROUTES/functions
*/

app.get('/', function(req, res)
{  
  
      context = {};
        console.log("Rendering page");        
        console.log(context);
        // Render the users.handlebars file with the context
     
  res.status(200).render('index', context);
});


app.get('/pokemon', function(req, res)
{  
    // Define the SQL queries needed to populate data on the page
    let evs = ['HP','Atk','SP Atk','Def','SP Def','Spd']
    let evs2 = [1,2,3]
    let generation = [1,2,3,4,5,6,7,8]
    let get_pokemons = `Select p.pokedex_num, p.pokname, p.ev_yield, p.ability,  t.types, t.generation from (SELECT pokedex_num, pokname, ev_yield, ability FROM Pokemon) p Left join (SELECT pokedex_num, GROUP_CONCAT(typename) as types, generation FROM Pokemon_Types group by pokedex_num) t on (p.pokedex_num = t.pokedex_num);`;
    let get_types = "SELECT typename FROM Types;"
    db.pool.query(get_pokemons, function(error, pokemons_rows, fields) {
        db.pool.query(get_types, function(error, types_rows, fields) {

                // Finally, use the data to render the HTML page
                res.render('pokemon', {Pokemon:pokemons_rows, Types:types_rows, Effort:evs, Effort2:evs2, Generation:generation});
      })     
    })
});

app.get('/types', function(req, res)
{
    let get_types = 'SELECT * FROM Types';
    db.pool.query(get_types, function(error, types_rows, fields) {

                // Finally, use the data to render the HTML page
                res.render('types', {Types:types_rows});
    })
});


app.get('/cities', function(req, res)
{
    let get_cities = 'SELECT * FROM Cities';
    db.pool.query(get_cities, function(error, cities_rows, fields) {

                // Finally, use the data to render the HTML page
                res.render('cities', {Cities:cities_rows});
    })
});

app.get('/gymleaders', function(req, res)
{

    // Define the SQL queries needed to populate data on the page
    let evs = ['HP','Atk','SP Atk','Def','SP Def','Spd']
    let get_gymls = "SELECT * FROM GymLeaders;"
    let get_gymps = "SELECT GP.gymleaderno, gymleadername, P.pokedex_num ,P.pokname, levelcap FROM GymLeaders_Pokemon GP join GymLeaders G on GP.gymleaderno = G.gymleaderno join Pokemon P on GP.pokedex_num = P.pokedex_num;"; //"SELECT  gymleadername, pokedex_num, levelcap FROM GymLeaders_Pokemon left join GymLeaders on GymLeaders_Pokemon.gymleaderno = GymLeaders.gymleaderno;";
    let get_types = "SELECT typename FROM Types;"
    let get_pokemons = `Select p.pokedex_num, p.pokname, p.ev_yield, p.ability,  t.types, t.generation from (SELECT pokedex_num, pokname, ev_yield, ability FROM Pokemon) p Left join (SELECT pokedex_num, GROUP_CONCAT(typename) as types, generation FROM Pokemon_Types group by pokedex_num) t on (p.pokedex_num = t.pokedex_num);`;

    db.pool.query(get_gymls, function(error, gymls_rows, fields) {
        db.pool.query(get_gymps, function(error, gymps_rows, fields) {
            db.pool.query(get_types, function(error, type_rows, fields) {
                db.pool.query(get_pokemons, function(error, pokemons_rows, fields) {
                // Finally, use the data to render the HTML page
                res.render('gymleaders', {GymLeaders:gymls_rows, GymLeaders_Pokemon:gymps_rows, Types:type_rows, Pokemon:pokemons_rows});
                })
            })     
        })
    })

});

app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});

// Adding --------------------------------------------------------------------------------------------------------------------------------------------------------

// Adding to Pokemon
app.post('/add_new_pok', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let form_input = req.body;
    let inputEv =form_input['input-evya'] + " " + form_input['input-evyb'];
    // Create the query and run it on the database
    insert_pokemon = `INSERT INTO Pokemon (pokedex_num, pokname, ev_yield, ability) VALUES(?, ?, ?, ?)`;
    parameters = [form_input['input-pnum'], form_input['input-pname'], inputEv ,form_input['input-ability']]
    db.pool.query(insert_pokemon, parameters, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/pokemon');
        }
    })
})

app.post('/search_pok', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let form_input = req.body;
    let spokname =form_input['input-pname'];
    // Create the query and run it on the database
    let search_pokemon = `Select * from Pokemon where pokname like ?`;
    let evs = ['HP','Atk','SP Atk','Def','SP Def','Spd']
    let evs2 = [1,2,3]
    let generation = [1,2,3,4,5,6,7,8]
    let get_pokemons = `Select p.pokedex_num, p.pokname, p.ev_yield, p.ability,  t.types, t.generation from (SELECT pokedex_num, pokname, ev_yield, ability FROM Pokemon) p Left join (SELECT pokedex_num, GROUP_CONCAT(typename) as types, generation FROM Pokemon_Types group by pokedex_num) t on (p.pokedex_num = t.pokedex_num) where p.pokname like ?;`;
    let get_types = "SELECT typename FROM Types;"
    parameters = [spokname]
    
    db.pool.query(get_pokemons, parameters ,function(error, pokemons_rows, fields) {
        db.pool.query(get_types, function(error, types_rows, fields) {

                // Finally, use the data to render the HTML page
                res.render('pokemon', {Pokemon:pokemons_rows, Types:types_rows, Effort:evs, Effort2:evs2, Generation:generation});
      })     
    })
    
})


// Adding to Pokemon_Types
app.post('/add_new_pokt', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let form_input = req.body;
//(Select pokedex_num from Pokemon where ? = pokname)
    // Do input checking
    let inputType = form_input['input-type'];

    // Create the query and run it on the database
    insert_pokt = `INSERT INTO Pokemon_Types(pokedex_num, typename, generation) VALUES ((Select pokedex_num from Pokemon where ? = pokname), ?, ?)`; //Select pokedex_num From Pokemon where pokname = 
    parameters = [form_input['input-pname'], inputType, form_input['input-gen']]
    db.pool.query(insert_pokt, parameters, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/pokemon');
        }
    })
})

// Adding Cities
app.post('/add_new_city', function(req, res) {
    let form_input = req.body;

    let addCities = 'INSERT INTO Cities(cityname, attractions) VALUES (?, ?)';
    parameters = [form_input['input-cityname'], form_input['input-attractions']]
    db.pool.query(addCities, parameters, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/cities');
        }
    })
})

// Adding Types
app.post('/add_new_type', function(req, res) {
    let form_input = req.body;
       
    let addTypes = 'INSERT INTO Types(typename, color, description) VALUES (?, ?, ?)';
    parameters = [form_input['input-typename'], form_input['input-color'], form_input['input-desc']]
    db.pool.query(addTypes, parameters, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/types');
        }
    })
})

// Adding to Gymleader
app.post('/add_new_gl', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let form_input = req.body;
    let inputTypeGl =form_input['input-type'];
    // Create the query and run it on the database
    insert_GL = `INSERT INTO GymLeaders (gymleadername, cityname, typename) VALUES( ?, ?, ?)`;
    parameters = [form_input['input-gl'], form_input['input-cname'], inputTypeGl]
    db.pool.query(insert_GL, parameters, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/gymleaders');
        }
    })
})


// Adding to Gymleaders_Pokemon
app.post('/add_glp_city', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let form_input = req.body;
    
    // Create the query and run it on the database
    insert_glp = `INSERT INTO GymLeaders_Pokemon(pokedex_num, gymleaderno, levelcap) VALUES ((Select pokedex_num from Pokemon where ? = pokname), (Select gymleaderno from GymLeaders where ? = gymleadername), ?)`;  
    parameters = [form_input['input-pnum'], form_input['input-gnum'], form_input['input-lcap']]
    db.pool.query(insert_glp, parameters, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/gymleaders');
        }
    })
})

// Deleting --------------------------------------------------------------------------------------------------------------------

// Delete Pokemon and Pokemon_Types
app.post('/del_pok', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let form_input = req.body;


    // Create the query and run it on the database
    del_pok ='DELETE FROM Pokemon WHERE pokedex_num = (Select pokedex_num from Pokemon where ? = pokname)' 
    del_pokt = `DELETE FROM Pokemon_Types WHERE pokedex_num = (Select pokedex_num from Pokemon where ? = pokname)`; //Select pokedex_num From Pokemon where pokname = 
    parameters = [form_input['del-pnum']]
    db.pool.query(del_pokt, parameters, function(error, rows, fields){
       db.pool.query(del_pok, parameters, function(error, rows, fields){
        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/pokemon');
        }
      })
    })
})

// Deleting Cities
app.post('/delete_city', function(req,res) {
    let form_input = req.body;

    del_city = 'DELETE FROM Cities WHERE cityname = ?';
    parameters = [form_input['delete-cityname']];

    db.pool.query(del_city, parameters, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/cities');
        }
    })
})

// Deleting Types

app.post('/del_type', function(req, res) {
    let form_input = req.body;

    del_type = 'DELETE FROM Types WHERE typename = ?'
    parameters = [form_input['del-type']];

    db.pool.query(del_type, parameters, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/types');
        }
    })
})

// Delete Gymleader/Gymleaders_Pokemon
app.post('/del_gl', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let form_input = req.body;


    // Create the query and run it on the database
    del_gl ='DELETE FROM GymLeaders WHERE gymleaderno = (Select gymleaderno from GymLeaders where ? = gymleadername)' 
    del_glp = `DELETE FROM GymLeaders_Pokemon WHERE gymleaderno = (Select gymleaderno from GymLeaders where ? = gymleadername)`; //Select pokedex_num From Pokemon where pokname = 
    parameters = [form_input['del-gl']]
    db.pool.query(del_glp, parameters, function(error, rows, fields){
       db.pool.query(del_gl, parameters, function(error, rows, fields){
        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/gymleaders');
        }
      })
    })
})

// Delete Gymleaders_Pokemon
app.post('/delete_glp_city', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let form_input = req.body;


    // Create the query and run it on the database
    del_glp2 = `DELETE FROM GymLeaders_Pokemon WHERE gymleaderno = (Select gymleaderno from GymLeaders where ? = gymleadername) and pokedex_num = (Select pokedex_num from Pokemon where ? = pokname);`; //Select pokedex_num From Pokemon where pokname = 
    parameters = [form_input['delete-gname'], form_input['delete-pname']]
    
    db.pool.query(del_glp2, parameters, function(error, rows, fields){      
        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/gymleaders');
        }
    })
})

// Updating ----------------------------------------------------------------------------------------------------------------------------

// Update Pokemon
app.post('/update_pok', function(req, res) {
    // 
    let form_input = req.body;
    let upEv = form_input['update-evyna'] + " " + form_input['update-evynb'];
    let updatePokemon = 'UPDATE Pokemon SET pokname = ?, ev_yield = ?, ability = ? WHERE pokedex_num = (Select pokedex_num from Pokemon where ? = pokname)';
    let parameters = [
        form_input['update-pnamen'],upEv,form_input['update-abilityn'],form_input['update-pnumo']]

    db.pool.query(updatePokemon, parameters, function(error, rows, fields) {
        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/pokemon');
        }
    })
})


// Update Pokemon_Types
app.post('/update_pokt', function(req, res) {
    // 
    let form_input = req.body;

    let updatePokemon = 'UPDATE Pokemon_Types SET typename = ?, generation = ? WHERE pokedex_num = (Select pokedex_num from Pokemon where ? = pokname)';
    let parameters = [
        form_input['update-typeo'],
        form_input['update-geno'],
        form_input['update-pnumo'],
        form_input['update-typeo']
    ]

    db.pool.query(updatePokemon, parameters, function(error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/pokemon');
        }
    })
})

// Update Cities
app.post('/update_city', function(req, res) {
    let form_input = req.body;
    let updateCity = 'UPDATE Cities SET cityname = ?, attractions = ? WHERE cityname = ?';
    let parameters = [
        form_input['update-ncityname'],
        form_input['update-nattractions'],
        form_input['update-ocityname']
    ]

    db.pool.query(updateCity, parameters, function(error, rows, fields) {

    // Check to see if there was an error
    if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error)
        res.sendStatus(400);
    }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/cities');
        }
    })
})

// Update Types
app.post('/update_type', function(req, res) {
    let form_input = req.body;
    let updateTypes = 'UPDATE Types SET color = ?, description = ? WHERE typename = ?';
    let parameters = [
        form_input['update-color'],
        form_input['update-desc'],
        form_input['update-type']
    ]

    db.pool.query(updateTypes, parameters, function(error, rows, fields) {

    // Check to see if there was an error
    if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error)
        res.sendStatus(400);
    }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/types');
        }
    })
})

// Update Gym Leader
app.post('/update_gl', function(req, res) {
    // 
    let form_input = req.body;
    let updateTypeGl =form_input['update-typen'];
    let updateGL = 'UPDATE GymLeaders SET cityname = ?, typename = ? WHERE gymleaderno = (Select gymleaderno from GymLeaders where ? = gymleadername)';
    let parameters = [form_input['update-cnamen'],updateTypeGl,form_input['update-gl']]

    db.pool.query(updateGL, parameters, function(error, rows, fields) {
        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/gymleaders');
        }
    })
})


// Update GymLeaders_Pokemon
app.post('/update_glp_city', function(req, res) {
    // 
    let form_input = req.body;

    let updatePokemon = 'UPDATE GymLeaders_Pokemon SET pokedex_num = (Select pokedex_num from Pokemon where ? = pokname), levelcap = ? WHERE gymleaderno = (Select gymleaderno from GymLeaders where ? = gymleadername) and pokedex_num = (Select pokedex_num from Pokemon where ? = pokname)';
    let parameters = [form_input['update-pnamen'],form_input['update-lcapn'],form_input['update-gnamen'],form_input['uptext-pnameo']]

    db.pool.query(updatePokemon, parameters, function(error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/gymleaders');
        }
    })
})