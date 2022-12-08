import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
// import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
// import * as uuid from 'uuid'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('S3 Attachment')
// TODO: Implement the fileStogare logic
const S3Bucket      = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const s3 = new XAWS.S3({ signatureVersion: 'v4' })

export class AttachmentUtils {

    constructor(
        // private readonly docClient: DocumentClient = createDynamoDBClient(),
        // private readonly todosTable = process.env.TODOS_TABLE
        private readonly s3         = new AWS.S3({ signatureVersion: 'v4' })
    ) {
    }

    getAttachmentUrl(todoID: string){
        const AttachmentURL = `https://${S3Bucket}.s3.amazonaws.com/${todoID}`
        return AttachmentURL as string
    }

    getUploadUrl(imageId: string) {
        const url = this.s3.getSignedUrl('putObject', {
            Bucket: S3Bucket,
            Key: imageId,
            Expires: Number(urlExpiration)
        })
        return url as string
    }
}

// Presigned URL
export function createAttachmentPresignedUrl(todoId: string): string {
    return s3.getSignedUrl('putObject', {
      Bucket: S3Bucket,
      Key: todoId,
      Expires: parseInt(urlExpiration)
    })
  }


// Remove Presign Attachment  
export async function removeAttachment(id: string): Promise<void> {
    const params = {
      Bucket: S3Bucket,
      Key: id
    }
    try {
      await s3.headObject(params).promise()
      try {
        await s3.deleteObject(params).promise()
      }
      catch (err) {
        logger.error("Deleting Error: " + JSON.stringify(err))
      }
    } catch (err) {
      logger.error("File not Found: " + err.code)
    }
  }