require('dotenv').config();

const express = require("express");
const nodemailer = require("nodemailer");

const app = express();

// body parser middleware
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(express.json());

//routes
app.get('/', (req, res)=>{
    res.render('index')
});

app.post("/", (req, res)=> {
	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: process.env.GMAIL, 
			pass: process.env.GMAILPW 
		}
	});

	var textBody = `FROM: ${req.body.name} EMAIL: ${req.body.email} MESSAGE: ${req.body.message}`;
	var htmlBody = `<h2>Mail From Contact Form</h2><p>from: ${req.body.name} <a href="mailto:${req.body.email}">${req.body.email}</a></p><p>${req.body.message}</p>`;
	var mail = {
		from: process.env.GMAIL, 
		to: process.env.GMAIL, 
		subject: `Mail From Contact Form(Subject - ${req.body.subject})`,
		text: textBody,
		html: htmlBody
	};
	transporter.sendMail(mail, function (err, info) {
		if(err) {
			console.log(err);
			res.send(err);
			res.json({ message: "message not sent: an error occured; check the server's console log" });
		}
		else {
			res.json({ message: `message sent: ${info.messageId}` });
			res.send("message sent");
		}
	});
});


const PORT = process.env.PORT || 8080;
const IP = process.env.IP || "0.0.0.0";

app.listen(PORT, IP, () => 
	console.log(`listening on port ${PORT}`)
);
