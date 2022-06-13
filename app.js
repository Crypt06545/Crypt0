const express = require("express");
const path = require("path");
const hbs = require("hbs");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

// console.log(process.env.SMPT_MAIL);

const app = express();
const PORT = process.env.PORT || 3000;

const staticPath = path.join(__dirname, "./public");
const viewsPath = path.join(__dirname, "./templates/views");
const partialsPath = path.join(__dirname, "./templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(staticPath));
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.get("/", (req, res) => {
    res.render("index");
});


app.post("/contact", (req, res) => {
    const { name, email, message } = req.body;

    const tranporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMPT_MAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: process.env.USER_EMAIL,
        subject: `✉ Cypt0 Mail- for ${name}`,
        html: `<h2><b>Name: </b> ${name}</h2>
                   <h3><b>Email: </b> <a href="mailto: ${email}"> ${email} </h3>
                   </br>
                   <b>Message:</b></br>
                   ${message} 
           `
    };

    tranporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            res.redirect("/");
        }
    });
    res.redirect("/");

});

app.listen(PORT, () => console.log(`listening to the port ${PORT}`));