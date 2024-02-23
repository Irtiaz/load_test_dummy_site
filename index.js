const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const Datastore = require('nedb');
const db = new Datastore({ filename: 'db', autoload: true });

app.get('/', (req, res) => {
  res.send(`
    <a href='/login'>Login</a>
    <br>
    <a href='/register'>Register</a>
  `);
});

app.get('/register', (req, res) => {
  res.send(`
    <div>Register Form</div>
    <form onsubmit='handleSubmit(event)'>
    Username <input id='username-input'>
    <br>
    Password <input id='password-input' type='password'>
    <br>
    <button type='submit'>Register</button>
    </form>
    <a href='/login'>Or Login</a>

    <script>
      const usernameInput = document.getElementById('username-input');
      const passwordInput = document.getElementById('password-input');

      async function handleSubmit(event) {
        event.preventDefault();
        const data = {
          username: usernameInput.value,
          password: passwordInput.value
        };
        const response = await fetch('register_submit', {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
        const responseData = await response.json();
        if (!responseData.success) window.location.href = '/failure';
        else {
          localStorage.setItem('id', responseData.id);
          window.location.href= '/';
        }
      };
    </script>
  `);
});

app.post('/register_submit', (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  db.find({ username }, (err, docs) => {
    if (docs.length == 0) {
      db.insert(req.body, (err, newDocs) => {
        console.log(newDocs);
        res.send({ success: true, id: newDocs._id });
      });
    } else {
      console.log('already existed');
      res.send({ success: false });
    }
  });
});

app.get('/login', (req, res) => {
  res.send(`
    <div>Login Form</div>
    <form onsubmit='handleSubmit(event)'>
    Username <input id='username-input'>
    <br>
    Password <input id='password-input' type='password'>
    <br>
    <button type='submit'>Login</button>
    </form>
    <a href='/register'>Or Register</a>

    <script>
      const usernameInput = document.getElementById('username-input');
      const passwordInput = document.getElementById('password-input');

      async function handleSubmit(event) {
        event.preventDefault();
        const data = {
          username: usernameInput.value,
          password: passwordInput.value,
          id: localStorage.getItem('id')
        };
        const response = await fetch('login_submit', {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
        const responseData = await response.json();
        if (!responseData.success) window.location.href = '/failure';
        else window.location.href = 'welcome';
      };
    </script>
  `);
});

app.post('/login_submit', (req, res) => {
  const { username, password, id } = req.body;
  console.log(req.body);
  db.find({ _id: id }, (err, docs) => {
    if (docs.length == 0) res.send({ success: false });
    else {
      const entry = docs[0];
      if (entry.username != username || entry.password != password) {
        res.send({ success: false });
      } else {
        res.send({ success: true });
      }
    }
  });
});

app.get('/welcome', (req, res) => {
  res.send('welcome user');
});

app.get('/failure', (req, res) => {
  res.send(`<h>Failed</h><br><a href='/'>Home page</a>`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
