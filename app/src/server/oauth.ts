import { NodeOAuthClient, NodeSavedSession, NodeSavedState, type Session } from '@atproto/oauth-client-node'
import { JoseKey } from '@atproto/jwk-jose'
import { Agent } from '@atproto/api'
import { Hono } from 'hono'

const client = new NodeOAuthClient({
  // This object will be used to build the payload of the /client-metadata.json
  // endpoint metadata, exposing the client metadata to the OAuth server.
  clientMetadata: {
    // Must be a URL that will be exposing this metadata
    client_id: 'https://my-app.com/client-metadata.json',
    client_name: 'My App',
    client_uri: 'https://my-app.com',
    logo_uri: 'https://my-app.com/logo.png',
    tos_uri: 'https://my-app.com/tos',
    policy_uri: 'https://my-app.com/policy',
    redirect_uris: ['https://my-app.com/callback'],
    grant_types: ['authorization_code', 'refresh_token'],
    response_types: ['code'],
    application_type: 'web',
    token_endpoint_auth_method: 'private_key_jwt',
    dpop_bound_access_tokens: true,
    jwks_uri: 'https://my-app.com/jwks.json',
  },

  keyset: await Promise.all([
    JoseKey.fromImportable(process.env.OAUTH_PRIVATE_KEY??''),
  ]),

  // Interface to store authorization state data (during authorization flows)
  stateStore: {
    async set(key: string, internalState: NodeSavedState): Promise<void> {},
    async get(key: string): Promise<NodeSavedState | undefined> {return await fetch("").then(r=>r.json())},
    async del(key: string): Promise<void> {},
  },

  // Interface to store authenticated session data
  sessionStore: {
    async set(sub: string, session: NodeSavedSession): Promise<void> {},
    async get(sub: string): Promise<NodeSavedSession | undefined> {return await fetch("").then(r=>r.json())},
    async del(sub: string): Promise<void> {},
  },

  // A lock to prevent concurrent access to the session store. Optional if only one instance is running.
  // requestLock:{},
})

const app = new Hono()

// Expose the metadata and jwks
app.get('client-metadata.json', (c) => c.json(client.clientMetadata))
app.get('jwks.json', (c) => c.json(client.jwks))

// Create an endpoint to initiate the OAuth flow
app.get('/login', async (c) => {
  try {
    const handle = 'some-handle.bsky.social' // eg. from query string
    const state = crypto.getRandomValues(new Uint8Array(32)).toString()

    const url = await client.authorize(handle, {
      state,
      // Only supported if OAuth server is openid-compliant
      ui_locales: 'ja en',
    })

    c.redirect(url)
  } catch (err) {
    console.error(err)
    return c.status(500);
  }
})

// Create an endpoint to handle the OAuth callback
app.get('/callback', async (c) => {
  try {
    const params = new URLSearchParams(c.req.url.split('?')[1])

    const { session, state } = await client.callback(params)

    // Process successful authentication here
    console.log('authorize() was called with state:', state)

    console.log('User authenticated as:', session.did)
    c.json({ ok: true })
  } catch (err) {
    console.error(err)
    c.status(500)
    c.json({ ok: false })
  }
})

// Whenever needed, restore a user's session
async function worker() {
  const userDid = 'did:plc:123'

  const oauthSession = await client.restore(userDid)

  // Note: If the current access_token is expired, the session will automatically
  // (and transparently) refresh it. The new token set will be saved though
  // the client's session store.

  const agent = new Agent(oauthSession)

  // Make Authenticated API calls
  const profile = await agent.getProfile({ actor: agent.assertDid })
  console.log('Bsky profile:', profile.data)
}