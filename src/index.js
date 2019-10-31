const fetch = require('node-fetch');

module.exports = async (request, response) => {
  const { url } = request;
  const urlParts = url.split('/');

  if (url === '/') {
    response.writeHead(302, {
      Location: `https://zeit.co/blog/err-sh`,
    });

    response.end();
    return;
  }

  if (urlParts.length < 3) {
    return {
      error: 'Please specify all the missing data (see the repo)!',
      errorHandle: 'missing_data',
    };
  }

  const lookup = urlParts.length === 3;
  let repo = urlParts[lookup ? 1 : 2];
  let code = urlParts[lookup ? 2 : 3];
  let user = urlParts[1];

  if (user.startsWith('@')) {
    repo = `${user}/${repo}`;
    lookup = true;
  }

  if (lookup) {
    const res = await fetch(`https://registry.npmjs.org/${repo}/`);
    const json = await res.json();
    if (json.repository && json.repository.url) {
      json.repository.url.replace(
        /\/\/.*?\/(.+)\/(.*)(?:.git)/,
        (all, u, r) => {
          user = u;
          repo = r;
        }
      );
    }
  }

  // TODO map repo host to correct paths

  response.writeHead(302, {
    Location: `https://github.com/${user}/${repo}/blob/master/errors/${code}.md`,
  });

  response.end();
};
