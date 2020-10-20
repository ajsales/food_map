const express = require("express");

const app = express();

app.use(express.static("public"));

app.get("/", (request, response) => {
	response.sendFile(`${__dirname}/views/index.html`);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});