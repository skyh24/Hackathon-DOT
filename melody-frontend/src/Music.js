import React, {useState } from 'react'
import { Form, Input, Grid} from 'semantic-ui-react'

import { useSubstrateState } from './substrate-lib'
import { TxButton } from './substrate-lib/components'

const argIsOptional = arg => arg.type.toString().startsWith('Option<')
const EXTRINSIC = 'EXTRINSIC'
// const QUERY = 'QUERY'
// const SignTx = 'SIGNED-TX'
const musicModule = 'music'
const createCollection = 'createCollection'

function Main(props) {
  const { api } = useSubstrateState()

  // The transaction submission status
  const [status, setStatus] = useState('')

  // The currently stored value
  // const [currentValue, setCurrentValue] = useState(0)
  const [inputParams, setInputParams] = useState([])

  const getParamFields = (interxType, palletRpc, callable) => {
    if (!api || palletRpc === '' || callable === '') {
      return []
    }

    let paramFields = []

    if (interxType === 'QUERY') {
      const metaType = api.query[palletRpc][callable].meta.type
      if (metaType.isPlain) {
        // Do nothing as `paramFields` is already set to []
      } else if (metaType.isMap) {
        paramFields = [
          {
            name: metaType.asMap.key.toString(),
            type: metaType.asMap.key.toString(),
            optional: false,
          },
        ]
      } else if (metaType.isDoubleMap) {
        paramFields = [
          {
            name: metaType.asDoubleMap.key1.toString(),
            type: metaType.asDoubleMap.key1.toString(),
            optional: false,
          },
          {
            name: metaType.asDoubleMap.key2.toString(),
            type: metaType.asDoubleMap.key2.toString(),
            optional: false,
          },
        ]
      }
    } else if (interxType === 'EXTRINSIC') {
      const metaArgs = api.tx[palletRpc][callable].meta.args

      if (metaArgs && metaArgs.length > 0) {
        paramFields = metaArgs.map(arg => ({
          name: arg.name.toString(),
          type: arg.type.toString(),
          optional: argIsOptional(arg),
        }))
      }
    }
    return paramFields
  }

  const onParamChange = (_, data) => {
    const { state, value } = data
    const {
      ind,
      paramField: { type },
    } = state
    const input = [...inputParams]
    input[ind] = { type, value }
    console.log('onParamChange', input)
    setInputParams(input)
  }

  return (
    <Grid.Column width={8}>
      <h1>Music Collection</h1>
      <Form>
        {getParamFields(EXTRINSIC, musicModule, createCollection).map(
          (paramField, ind) => (
          <Form.Field key={`${paramField.name}-${paramField.type}`}>
            <Input
              placeholder={paramField.type}
              fluid
              type="text"
              label={paramField.name}
              state={{ ind, paramField }}
              value={inputParams[ind] ? inputParams[ind].value : ''}
              onChange={onParamChange}
            />
          </Form.Field>
        ))}
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            label="Create Collection"
            type="SIGNED-TX"
            setStatus={setStatus}
            attrs={{
              palletRpc: musicModule,
              callable: createCollection,
              inputParams: inputParams,
              paramFields: getParamFields(EXTRINSIC, musicModule, createCollection),
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  )
}

export default function Music(props) {
  const { api } = useSubstrateState()
  return api.query.music ? (
    <Main {...props} />
  ) : null
}
