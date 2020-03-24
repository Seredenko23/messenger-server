const extract = require('meta-extractor')

async function getMetadata(req, res) {
  const metadata = await extract({uri: req.body.url})

  const formattedMetadata = {
    imgURL: metadata.ogImage ? metadata.ogImage : metadata.image,
    title: metadata.ogTitle ? metadata.ogTitle : metadata.title,
    host: metadata.ogHost ? metadata.ogHost : metadata.host
  };

  res.status(200).send(formattedMetadata)
}

module.exports.getMetadata = getMetadata;
