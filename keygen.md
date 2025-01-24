generate private key
```shell
$ openssl genpkey -algorithm EC -pkeyopt ec_paramgen_curve:P-256 > private_key.pem
$ pnpx eckles private_key.pem > private_key.jwk
```
add kid
```json
{
  "kty": "EC",
  "crv": "P-256",
  "d": "...",
  "x": "...",
  "y": "...",
  "kid":"oauth-key1"
}
```