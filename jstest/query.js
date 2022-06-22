const { ApiPromise } = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');

const BOB = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';

async function main () {
  // Instantiate the API
  const api = await ApiPromise.create({
    types: {
        BasicResource: {
            src: "Option<Text>",
            metadata: "Option<Text>",
            license: "Option<Text>",
            thumb: "Option<Text>",
        }
    }
  });

  // Construct the keyring after the API (crypto has an async init)
  const keyring = new Keyring({ type: 'sr25519' });

  // Add Alice to our keyring with a hard-derivation path (empty phrase, so uses dev)
  const alice = keyring.addFromUri('//Alice');
    result = await api.query.music.collections(0)
    console.log(result.toHuman());
    // const result = await api.query.music.properties(0, null, "cover")
    // console.log(result.toHuman());

    result = await api.query.music.nfts(0, 0)
    console.log(result.toHuman());

    result = await api.query.music.resources(0, 0, 0)
    console.log(result.toHuman());

    result = await api.query.music.nfts(0, 1)
    console.log(result.toHuman());

    result = await api.query.music.resources(0, 1, 0)
    console.log(result.toHuman());

    result = await api.query.melody.listedNfts(0, 0)
    console.log(result.toHuman());

    result = await api.query.melody.listedNfts(0, 1)
    console.log(result.toHuman());

    result = await api.query.melody.listedNfts(0, 2)
    console.log(result.toHuman());

}

main().catch(console.error).finally(() => process.exit());