import React from 'react'
import { Card, Icon, Image } from 'semantic-ui-react'

// const src = 'https://source.unsplash.com/random/266x200?music'

const CardExampleColored = () => (
  <Card.Group itemsPerRow={4}>
    <Card color='red'>
        <Image src='https://source.unsplash.com/random/266x200?music' wrapped ui={false} />
        <Card.Content>
            <Card.Header>Daniel</Card.Header>
            <Card.Meta>Joined in 2016</Card.Meta>
            <Card.Description>
                Daniel is a comedian living in Nashville.
            </Card.Description>
        </Card.Content>
        <Card.Content extra>
            <a>
                <Icon name='bolt' />
                10 ETH
            </a>
        </Card.Content>
    </Card>
    <Card color='orange' image='https://source.unsplash.com/random/266x200?melody' />
    <Card color='yellow' image='https://source.unsplash.com/random/266x200?music=2' />
    <Card color='olive' image='https://source.unsplash.com/random/266x200?music=3' />
    <Card color='green' image='https://source.unsplash.com/random/266x200?music=4' />
    <Card color='teal' image='https://source.unsplash.com/random/266x200?melody=5' />
    <Card color='blue' image='https://source.unsplash.com/random/266x200?melody=6' />
    <Card color='violet' image='https://source.unsplash.com/random/266x200?piano' />
    <Card color='purple' image='https://source.unsplash.com/random/266x200?violin' />
    <Card color='pink' image='https://source.unsplash.com/random/266x200?sing=9' />
    <Card color='brown' image='https://source.unsplash.com/random/266x200?drum' />
    <Card color='grey' image='https://source.unsplash.com/random/266x200?sing' />
  </Card.Group>
)

export default CardExampleColored
