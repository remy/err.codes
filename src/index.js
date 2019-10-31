const fetch = require('node-fetch');

exports.handler = async (event, context, callback) => {
  const { path: url } = event;
  const urlParts = url.split('/');

  if (url === '/') {
    callback(null, {
      statusCode: 302,
      headers: { Location: `https://zeit.co/blog/err-sh` },
      body: null,
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
    try {
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
    } catch (e) {
      return callback(e);
    }
  }

  // TODO map repo host to correct paths

  callback(null, {
    statusCode: 302,
    headers: {
      Location: `https://github.com/${user}/${repo}/blob/master/errors/${code}.md`,
    },
  });
};
