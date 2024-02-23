const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send(`
    <form>
    Username <input>
    <br>
    Password <input>
    <br>
    <button type='submit'>Register</button>
    </form>
  `);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
