// Import the API & Provider and some utility functions
const { ApiPromise } = require('@polkadot/api');

const { Keyring } = require('@polkadot/keyring');

const sleep = require('sleep');

// Import the test keyring (already has dev keys for Alice, Bob, Charlie, Eve & Ferdie)
const testKeyring = require('@polkadot/keyring/testing');

// Utility function for random values
const { randomAsU8a } = require('@polkadot/util-crypto');

// Some constants we are using in this sample
const ALICE = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
const BOB = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
const AMOUNT = 10000;

async function main () {
  // Create the API and wait until ready
  const api = await ApiPromise.create({
    types: {
        BasicResource: {
            src: "Option<Text>",
            metadata: "Option<Text>",
            license: "Option<Text>",
            thumb: "Option<Text>",
        },
        CollectionId: "u32"
    }
  });

  // Get the nonce for the admin key
  const { nonce } = await api.query.system.account(ALICE);
  const { nonce1 } = await api.query.system.account(BOB);


  const keyring = new Keyring({ type: 'sr25519' });
  const alice = keyring.addFromUri('//Alice');
  const bob = keyring.addFromUri('//Bob');

  // Create a new random recipient
//   const recipient = keyring.addFromSeed(randomAsU8a(32)).address;

const resource0 = api.createType("BasicResource", {
  src:  "https://d2i9ybouka0ieh.cloudfront.net/audio-transcoded/5fcda0ac-6570-42cb-860a-8a30070fc792/AUDIO_TRANSCODED/718258-8824763-_Mine__for_Sound.m4a",
  metadata: null, 
  license: "Melody",
  thumb: "https://www.sound.xyz/_next/image?url=https%3A%2F%2Fd2i9ybouka0ieh.cloudfront.net%2Fartist-uploads%2F5a31ceab-599c-4262-b67e-49c3ecddf322%2FRELEASE_COVER_IMAGE%2F1320272-default&w=3840&q=75"
})

const resource1 = api.createType("BasicResource", {
  src:  "https://d2i9ybouka0ieh.cloudfront.net/audio-transcoded/df058afe-27dd-4f76-8ff7-49d6238fd247/AUDIO_TRANSCODED/15026-3521472-ILOVEDUILOVEDUILOVEDU_-_FINAL.m4a",
  metadata: null, 
  license: "Melody",
  thumb: "https://www.sound.xyz/_next/image?url=https%3A%2F%2Fd2i9ybouka0ieh.cloudfront.net%2Fartist-uploads%2Fea244c7a-1aa3-42bd-8462-da7dc2b180d8%2FRELEASE_COVER_IMAGE%2F1433068-default&w=3840&q=75"
})

const resource2 = api.createType("BasicResource", {
  src:  "https://d2i9ybouka0ieh.cloudfront.net/audio-transcoded/51cb01b2-d47f-4888-a546-c7675783fa8b/AUDIO_TRANSCODED/8449608-8354422-SLOE_JACK_-_Renegade__LabozV5.1_.m4a",
  metadata: null, 
  license: "Melody",
  thumb: "https://www.sound.xyz/_next/image?url=https%3A%2F%2Fd2i9ybouka0ieh.cloudfront.net%2Fartist-uploads%2Fca001c82-e4c1-4e80-95cb-cb4af293c079%2FRELEASE_COVER_IMAGE%2F7253614-default&w=3840&q=75"
});

const txs = [
  api.tx.music.createCollection("http://p2.music.126.net/TbkjRpR0Y7jZ2JMMSkxOgA==/109951167571601381.jpg?param=140y140", 100, "MyMusic"),
  api.tx.music.mintNft(ALICE, 0, "NFT0"),
  api.tx.music.mintNft(ALICE, 0, "NFT1"),
  api.tx.music.mintNft(ALICE, 0, "NFT2"),
  api.tx.music.addBasicResource(0,0, resource0),
  api.tx.music.addBasicResource(0,1, resource1),
  api.tx.music.addBasicResource(0,2, resource2),
  api.tx.melody.list(0,0, 100000000000, 1000),
  api.tx.melody.list(0,1, 200000000000, 2000),
]

const args = process.argv.slice(2)

if (args[0] == "1") {
  console.log("buy 0 0")
  await api.tx.melody.buy(0,0, 100000000000)
.signAndSend(bob, ({ events = [], status }) => {
      console.log('Transaction status:', status.type);

      if (status.isInBlock) {
        console.log('Included at block hash', status.asInBlock.toHex());
        console.log('Events:');

        events.forEach(({ event: { data, method, section }, phase }) => {
          console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
        });
      } else if (status.isFinalized) {
        console.log('Finalized block hash', status.asFinalized.toHex());

        process.exit(0);
      }
    });
} else {
  await api.tx.utility
    .batch(txs)
    .signAndSend(alice, ({ events = [], status }) => {
      if (status.isInBlock) {
        console.log('Included at block hash', status.asInBlock.toHex());
        console.log('Events:');

        events.forEach(({ event: { data, method, section }, phase }) => {
          console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
        });
    } else if (status.isFinalized) {
      console.log('Finalized block hash', status.asFinalized.toHex());
      process.exit(0);
    }
  });
}

}

main().catch(console.error);