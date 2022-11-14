const { sendEmail } = require("./sendgrid.js");
const data = require("./data.js");
require("dotenv").config();

function checkAssymetric(result, target) {
  let existing;
  result.forEach((user) => {
    if (user.email === target) {
      existing = user;
    }
  });
  if (!existing) return true;
  return existing.giftTo !== target;
}

function choose(data) {
  const people = data.map(({ name, email }) => {
    return { name, email };
  });

  const result = [];
  let count = 0;
  while (people.length > 0) {
    const randomNumber = Math.floor(Math.random() * people.length);
    const lastIndex = people.length - 1;
    if (
      people[lastIndex].email !== data[randomNumber].email &&
      !data[randomNumber].exclude.includes(people[lastIndex].email)
    ) {
      if (checkAssymetric(result, people[lastIndex].email)) {
        data[randomNumber].giftTo = people[lastIndex].name;
        result.push(data[randomNumber]);
        people.pop();
        data.splice(randomNumber, 1);
      }
    }
    count++;
    if (count > 50) {
      return choose(data);
    }
  }
  return result;
}

async function runSecretSanta() {
  const result = choose(data);

  console.log(result); //comment this
  try {
    await Promise.all(
      result.map(async (participant) => {
        await sendEmail({
          to: participant.email,
          giftTo: participant.giftTo,
        });
      })
    );
    console.log('Emails sent successfully');
  } catch (e) {
    console.error(e.response.body);
  }
  return;
}

runSecretSanta();
