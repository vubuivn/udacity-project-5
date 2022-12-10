import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { createDynamoDBClient } from '../dataLayer/todosAcess'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('S3 Attachment')
// TODO: Implement the fileStogare logic
const S3Bucket      = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const s3 = new XAWS.S3({ signatureVersion: 'v4' })

export class AttachmentUtils {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
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

    async updateAttachmentUrl(todoId: string, userId: string, url: string): Promise<string> {
      logger.info('Update attachment url of todo')
  
      await this.docClient.update({
        TableName: this.todosTable,
        Key: {
          todoId: todoId,
          userId: userId
        },
        UpdateExpression: "set attachmentUrl = :url",
        ExpressionAttributeValues: {
          ":url": url,
        }
      }).promise()
    
      return url
    }

}

// Presigned URL
const AttachmentUtil =  new AttachmentUtils()
export async function createAttachmentPresignedUrl(todoId: string,userId: string): Promise<string> {
    const imageId = uuid.v4()
    const url = `https://${S3Bucket}.s3.amazonaws.com/${imageId}`
    await AttachmentUtil.updateAttachmentUrl(todoId, userId, url)

    return getUploadUrl(imageId)
  }

  export async function getUploadUrl(imageId: string) {
    return s3.getSignedUrl('putObject', {
      Bucket: S3Bucket,
      Key: imageId,
      Expires: Number(urlExpiration)
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