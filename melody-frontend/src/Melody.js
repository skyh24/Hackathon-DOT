import React, { useEffect, useState } from 'react'
import { Grid, Card, Image, Icon, Button, Message } from 'semantic-ui-react'

import { useSubstrateState } from './substrate-lib'

import ReactJkMusicPlayer from 'react-jinke-music-player'
import 'react-jinke-music-player/assets/index.css'
import { web3FromSource } from '@polkadot/extension-dapp'

function Main(props) {

    
  const { api, currentAccount } = useSubstrateState()

  // The transaction submission status
  // const [status, setStatus] = useState('')

  // The currently stored value
  const [collection, setCollection] = useState({})
  const [nfts, setNfts] = useState([])
  const [txFinished, setTxFinished] = useState(false)
  const [messageBody, setMessageBody] = useState('');
  const [audioList, setAudioList] = useState([
    // {
    //   name: 'Bedtime Stories',
    //   singer: 'Jay Chou',
    //   cover:
    //     'http://res.cloudinary.com/alick/image/upload/v1502375978/bedtime_stories_bywggz.jpg',
    //   musicSrc:
    //   "https://d2i9ybouka0ieh.cloudfront.net/audio-transcoded/5fcda0ac-6570-42cb-860a-8a30070fc792/AUDIO_TRANSCODED/718258-8824763-_Mine__for_Sound.m4a",
    //     // 'http://res.cloudinary.com/alick/video/upload/v1502375674/Bedtime_Stories.mp3',
    // },
  ])

  const options = {
    // audio lists model
    audioLists: audioList,
  }

    const handleListen = (src) => {
        console.log(src)
        setAudioList([{
            musicSrc: src
        }])
    }

    const getFromAcct = async () => {
        const {
          address,
          meta: { source, isInjected },
        } = currentAccount
    
        if (!isInjected) {
          return [currentAccount]
        }
    
        // currentAccount is injected from polkadot-JS extension, need to return the addr and signer object.
        // ref: https://polkadot.js.org/docs/extension/cookbook#sign-and-send-a-transaction
        const injector = await web3FromSource(source)
        return [address, { signer: injector.signer }]
      }

    const handleBuy = (NFTID, amount) => {
        async function buyNFT() {
            console.log("buy 0 ", NFTID)
            const fromAcct = await getFromAcct()
            await api.tx.melody.buy(0, NFTID, amount)
            .signAndSend(...fromAcct, ({ events = [], status }) => {
                console.log('Transaction status:', status.type);
                setMessageBody('Transaction status: ' + status.type);
                if (status.isInBlock) {
                    console.log('Included at block hash', status.asInBlock.toHex());
                    setMessageBody('Included at block hash');
                    console.log('Events:');
            
                    events.forEach(({ event: { data, method, section }, phase }) => {
                        console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
                    });
                } else if (status.isFinalized) {
                    console.log('Finalized block hash', status.asFinalized.toHex());
                    setMessageBody('Finalized block hash');
                    setTxFinished(true)    
                    setTxFinished(false)
                    setMessageBody("")
                    // process.exit(0);
                }
            });
        }
        buyNFT()

    }

  const getCollection = () => {
    async function fetchData() {
      const col = await api.query.music.collections(0)
      const collection = col.toHuman()
      setCollection(collection)
      console.log(collection)

      let nfts = []
      for (let i=0; i<collection.nftsCount; i++) {
        const rs = await api.query.music.nfts(0, i)
        const rsc = await api.query.music.resources(0, i, 0)
        const li = await api.query.melody.listedNfts(0, i)
        const nft = rs.toHuman()
        // console.log(nft.owner.AccountId)
        nft.resource = rsc.toHuman().resource.Basic
        nft.list = li.toHuman()
        nfts.push(nft)
        if (nft.list)  
          console.log(parseFloat(nft.list.amount.replace(/,/g, '')))
      }
      setNfts(nfts)
      console.log(nfts);
    }
    fetchData()
  }

  useEffect(getCollection, [api.query.music, api.query.melody, txFinished])

  return (
    <Grid.Column width={8}>
      <h1>Melody Marketplace</h1>
      <h2>{collection && collection.symbol}: {collection && collection.nftsCount} </h2>
      <Card.Group itemsPerRow={4}>
      {nfts.map((nft, id) => (
        <Card color='red' key={id}>
        <Image src={nft.resource.thumb} wrapped ui={false} />
        <Card.Content>
            <Card.Header>
                {collection.symbol} 
                <a><Icon name='headphones' onClick={() => handleListen(nft.resource.src)}/></a>
            </Card.Header>
            <Card.Meta>{nft.metadata}</Card.Meta>
            <Card.Description>
                owner: {nft.owner.AccountId.substr(0, 8)}
            </Card.Description>
        </Card.Content>
        {nft.list ? (<Card.Content extra>
            
            <Grid columns={2}>
                <Grid.Row>
                <Grid.Column>
                    <a><Icon name='bolt' />{parseFloat(nft.list.amount.replace(/,/g, ''))/10000000000000000} DOT</a>
                </Grid.Column>
                <Grid.Column>                           
                    <Button basic color='red' onClick={() => handleBuy(id)}>Buy</Button>
                </Grid.Column>
                </Grid.Row>
            </Grid>

        </Card.Content>) : null}
        
        </Card>
      ))} 
      </Card.Group>
      {messageBody !== "" && <Grid centered columns={2} padded>
          <Grid.Column>
            <Message
                icon
                positive
                floating
                // header="Error Connecting to Substrate"
                // content={`Connection to websocket failed.`}
            >
                <Icon name='circle notched' loading />
                <Message.Content>
                    <Message.Header>Just one second</Message.Header>
                    {messageBody}
                </Message.Content>
            </Message>
          </Grid.Column>
      </Grid>}
      <ReactJkMusicPlayer 
        clearPriorAudioLists 
        audioLists={audioList}
        {...options}
      />
    </Grid.Column>
  )
}

export default function Melody(props) {
  const { api } = useSubstrateState()
  return api.query.music && api.query.music ? (
    <Main {...props} />
  ) : null
}
