var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'sample',
    password: 'Sri@12345',
    database: 'library',
    insecureAuth: true
});

var app = express();
app.set('port', process.env.PORT || 8080);
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
connection.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
});

app.post('/login', function (request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    console.log("req", request.body)
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [username, password], function (error, result, fields) {
            // console.log("res", result) 
            if (error) {
                response.json({ message: 'Error Ocuured in login', statusCode: 500 })
            }
            else {
                if (result.length > 0) {
                    request.session.loggedin = true;
                    request.session.username = username;
                    response.json({ message: 'login success', data: result[0], statusCode: 200 })
                } else {
                    response.json({ message: 'Check userid or password', statusCode: 501 })
                }
            }
        });
    } else {
        // console.log("in chek")
        response.json({ message: 'Invalid userid or password', statusCode: 500 })
    }
});

app.get('/getUsers', function (request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    connection.query('SELECT * FROM users where role=2', function (error, result, fields) {
        // console.log("res", result)
        if (error) {
            response.json({ message: 'Error Ocuured in getUsers', statusCode: 500 })
        }
        else {
            if (result.length > 0) {
                response.json({ data: result, statusCode: 200 })
            }
        }

    });
});

app.post('/deleteUser', function (request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    connection.query('DELETE FROM users WHERE id=?', [request.body.id], function (error, result, fields) {
        if (error) {
            response.json({ message: 'Error Ocuured in getUsers', statusCode: 500 })
        }
        else {
            response.json({ message: 'Deleted succesfully', statusCode: 200 })
        }

    });
});

app.post('/editUser', function (request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    var dt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log(request.body, dt)
    connection.query('UPDATE users set name=?,email=?,phone=?,password=?,updated_date=? where id=?',
        [request.body.name, request.body.email, request.body.phone, request.body.password, dt, request.body.id], function (error, result, fields) {
            if (error) {
                console.log(error)
                response.json({ message: 'Error Ocuured in getUsers', statusCode: 500 })
            }
            else {
                response.json({ message: 'Edited succesfully', statusCode: 200 })
            }

        });
});

app.post('/addUser', function (request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    var dt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log(request.body, dt)
    connection.query('insert into users (id, name, email, phone, password, role, updated_date) values(?,?,?,?,?,?,?)',
        [request.body.id, request.body.name, request.body.email, request.body.phone, request.body.password, request.body.role, dt], function (error, result, fields) {
            if (error) {
                console.log(error)
                response.json({ message: 'Error Ocuured in addUser', statusCode: 500 })
            }
            else {
                response.json({ message: 'Added succesfully', statusCode: 200 })
            }

        });
});

app.get('/getBooks', function (request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    connection.query('SELECT * FROM books', function (error, result, fields) {
        // console.log("res", result)
        if (error) {
            response.json({ message: 'Error Ocuured in getBooks', statusCode: 500 })
        }
        else {
            if (result.length > 0) {
                response.json({ data: result, statusCode: 200 })
            }
        }

    });
});

app.post('/deleteBook', function (request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    connection.query('DELETE FROM books WHERE id=?', [request.body.id], function (error, result, fields) {
        if (error) {
            response.json({ message: 'Error Ocuured in deleteBook', statusCode: 500 })
        }
        else {
            response.json({ message: 'Deleted succesfully', statusCode: 200 })
        }

    });
});

app.post('/editBook', function (request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    var dt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log(request.body, dt)
    connection.query('UPDATE books set name=?,author_name=?,edition=?,updated_date=? where id=?',
        [request.body.name, request.body.author_name, request.body.edition, dt, request.body.id], function (error, result, fields) {
            if (error) {
                console.log(error)
                response.json({ message: 'Error Ocuured in getUsers', statusCode: 500 })
            }
            else {
                response.json({ message: 'Edited succesfully', statusCode: 200 })
            }

        });
});

app.post('/addBook', function (request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    var dt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log(request.body, dt)
    connection.query('insert into books (id, name, author_name, edition, updated_date) values(?,?,?,?,?)',
        [request.body.id, request.body.name, request.body.author_name, request.body.edition, dt], function (error, result, fields) {
            if (error) {
                console.log(error)
                response.json({ message: 'Error Ocuured in addUser', statusCode: 500 })
            }
            else {
                response.json({ message: 'Addded succesfully', statusCode: 200 })
            }

        });
});

app.post('/getBooksOfSpecUser', function (request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    connection.query(`select userbookrelation.id as rid,books.id,books.name,books.author_name,books.edition from userbookrelation
    inner join books on userbookrelation.bookid = books.id
    where userid=? `, [request.body.id], function (error, result, fields) {
        if (error) {
            console.log(error)
            response.json({ message: 'Error Ocuured in getBooksOfSpecUser', statusCode: 500 })
        }
        else {
            response.json({ data: result, statusCode: 200 })
        }

    });
});

app.post('/returnBook', function (request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    connection.query('DELETE FROM userbookrelation WHERE id=?', [request.body.id], function (error, result, fields) {
        if (error) {
            response.json({ message: 'Error Ocuured in deleteBook', statusCode: 500 })
        }
        else {
            response.json({ message: 'Deleted succesfully', statusCode: 200 })
        }

    });
});

app.post('/getNotTakenBooksOfSpecUser', function (request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    connection.query(`select bookid from userbookrelation
    where userid=? `, [request.body.id], function (error, result, fields) {
        if (error) {
            response.json({ message: 'Error Ocuured in getNotTakenBooksOfSpecUser', statusCode: 500 })
        }
        else {
            if (result.length > 0) {
                var idArr = []
                for (var i = 0; i < result.length; i++) {
                    idArr.push(result[i]['bookid'])
                }
                console.log(idArr)
                connection.query('SELECT * FROM books where id NOT IN (?)', [idArr], function (error, result, fields) {
                    // console.log("res", result)
                    if (error) {
                        response.json({ message: 'Error Ocuured in getNotTakenBooksOfSpecUser', statusCode: 500 })
                    }
                    else {
                        if (result.length > 0) {
                            response.json({ data: result, statusCode: 200 })
                        }
                    }

                });
            }
            else if (result.length == 0) {
                connection.query('SELECT * FROM books', function (error, result, fields) {
                    // console.log("res", result)
                    if (error) {
                        response.json({ message: 'Error Ocuured in getNotTakenBooksOfSpecUser', statusCode: 500 })
                    }
                    else {
                        if (result.length > 0) {
                            response.json({ data: result, statusCode: 200 })
                        }
                    }

                });

            }
        }

    });

});

app.post('/takeBook', function (request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    connection.query('insert into userbookrelation (userid,bookid) values(?,?)',
        [request.body.uid, request.body.bid], function (error, result, fields) {
            if (error) {
                console.log(error)
                response.json({ message: 'Error Ocuured in addUser', statusCode: 500 })
            }
            else {
                response.json({ message: 'Inserted succesfully', statusCode: 200 })
            }

        });
});
app.listen(app.get('port'));