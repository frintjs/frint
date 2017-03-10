const request = require('request');
const yaml = require('js-yaml');

const ORG = 'Travix-International';
const REPO = 'frint';
const TOKEN = process.env.GITHUB_API_TOKEN;

function fetchContributors() {
  return new Promise(function (resolve, reject) {
    const url = 'https://api.github.com/repos/' + ORG + '/' + REPO + '/contributors';
    console.log('requesting: ' + url);

    request.get({
      headers: {
        'User-Agent': 'request'
      },
      json: true,
      url: url + '?token=' + TOKEN,
    }, function (error, response, body) {
      if (error) {
        return reject(error);
      }

      return resolve(body);
    });
  });
}

function fetchUser(username) {
  return new Promise(function (resolve, reject) {
    const url = 'https://api.github.com/users/' + username;
    console.log('reuqesting: ' + url);

    request.get({
      headers: {
        'User-Agent': 'request'
      },
      json: true,
      url: url + '?token=' + TOKEN,
    }, function (error, response, body) {
      if (error) {
        return reject(error);
      }

      return resolve(body);
    });
  });
}

fetchContributors()
  .then(function (contributors) {
    console.log(JSON.stringify(contributors, null, 2));

    const userPromises = [];
    contributors.forEach(function (contributor) {
      const username = contributor.login;
      userPromises.push(fetchUser(username));
    });

    return Promise.all(userPromises);
  })
  .then(function (users) {
    console.log(users.map(function (u) { return u.name }));
  })
  .catch(function (error) {
    console.log(error);
    console.log('Could not fetch contributors list');
  });
