import React, { useEffect, useState } from 'react'
import { Grid, Card, Image, Icon } from 'semantic-ui-react'

import { useSubstrateState } from './substrate-lib'

function Main(props) {
  const { api } = useSubstrateState()

  // The transaction submission status
  // const [status, setStatus] = useState('')

  // The currently stored value
  const [collection, setCollection] = useState({})
  const [nfts, setNfts] = useState([])

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

  useEffect(getCollection, [api.query.music, api.query.melody])

  return (
    <Grid.Column width={8}>
      <h1>Melody Marketplace</h1>
      <h2>{collection.symbol}: {collection.nftsCount} </h2>
      <Card.Group itemsPerRow={4}>
      {nfts.map((nft, id) => (
        <Card color='red' key={id}>
        <Image src={nft.resource.thumb} wrapped ui={false} />
        <Card.Content>
            <Card.Header>{collection.symbol}</Card.Header>
            <Card.Meta>{nft.metadata}</Card.Meta>
            <Card.Description>
                {nft.owner.AccountId.substr(0, 8)}
            </Card.Description>
        </Card.Content>
        {nft.list ? (<Card.Content extra>
            <a><Icon name='bolt' />{parseFloat(nft.list.amount.replace(/,/g, ''))/10000000000000000} DOT</a>
        </Card.Content>) : null}
        
        </Card>
      ))} 
      </Card.Group>
    </Grid.Column>
  )
}

export default function Melody(props) {
  const { api } = useSubstrateState()
  return api.query.music && api.query.music ? (
    <Main {...props} />
  ) : null
}
