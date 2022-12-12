
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtPayload } from '../../auth/JwtPayload'

const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJGBHhbjWa78iVMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi0xZGctODc1Zi51cy5hdXRoMC5jb20wHhcNMjIwNDIyMTQwNTU1WhcN
MzUxMjMwMTQwNTU1WjAkMSIwIAYDVQQDExlkZXYtMWRnLTg3NWYudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwLuF4eZFx+h/tgKO
aZK7qxPi79s4FPNr8Auiot/MeY7rJ802jMIGzMvlhkd9m/JmTZtA2lyQ1+iujQCI
oqcDXQn5Ny6y66KYiSwBmOVifp/66qps7tsK2rYxT80ood/LHeh1e1fUJXzfisfR
a7ZkBog2fDTFsyiPjgEpIgRzzdWKwqCs4YoonfoV+mmJyjrefoY1p6va3NY7PaEU
Ha34zgl2fHLAsUMQaaHyMlnrLiztqi64zEdUNOWoRDENnmpK0aO99ZEEighsd6T7
jJkfT0URLBPYi5BW4P3fw02yFsl3rXgPg8q98b9W2pv4JbPsu7UpnH2r1cIc3S5R
dK+lhwIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTQP3VMmpNg
gh+X4S8znh/uhSAJHDAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AKUdYhAtqFIjycBJkLqXvbeb9PTTppvURHHPIIhxOG6+zxt3tj27MKNQL06H04FI
5rffsPMlUT/lWPHqy1plxFMoY504LaEaGXW8B6NKMRwl1HICzh0hixY25CbwaPm4
szBXEiNyjx6GyGZwJ4frrNtLqIP+92eFVfhLFp9RvO6oX53SiAEc+WNrfSEJWxcg
irZeV0VeYVoDgQ1i/QTb2GMGOgW3yuqI+O+qmDTQi5wwRQsp73aePyZeVrh0Qteq
sOmYVzE6iPPwSGPsvzavaVix0j+5XbGjVhdQxX9oluYMnoAzosYkvTO2mxXwxWYA
2OAu+uaPp+iAgTASehnX2cM=
-----END CERTIFICATE-----`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authHeader: string): JwtPayload {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}
