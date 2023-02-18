import mailgun from "mailgun-js";

const sendMail = async (email, {subject, content}) => {
  if (!email) return
  const DOMAIN = 'sandbox017daf20fa7c44e6822213dad290098d.mailgun.org';
  const mg = mailgun({ apiKey: '0c383897f491133a4214319c69f5bf84-07e2c238-74745c14', domain: DOMAIN });

  try {
    const data = {
      from: 'KanMusic <no-reply@Kanmusic.com>',
      to: email,
      subject: subject,
      html: content
    };
    mg.messages().send(data, function (error, body) {
      console.log('error', error);
      console.log('mailgun', body);
    });
  } catch (e) {
    console.log('email failed', e);
  }
}

export default sendMail