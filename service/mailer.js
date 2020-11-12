import nodemailer from 'nodemailer'

const mailTo = async (email, message) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.eu",
    port: 465,
    auth: {
      user: "mikalaum@zohomail.eu",
      pass: "Loxiuxas0.it"
    }
  });

  const data = {
    from: 'mikalaum@zohomail.eu',
    to: 'mantas.codes@gmail.com',
    subject: 'Empty Subject here',
    text: 'Plain text version',
    html: '<p>Hello from mantas </p>'
  }

  transporter.sendMail(data, (err, info) => {
    console.log('ERROR: ', err)
    console.log('Info:', JSON.stringify(info))
  })
}

export default mailTo