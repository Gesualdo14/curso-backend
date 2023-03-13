const { BlobServiceClient } = require("@azure/storage-blob")

const getBlobContainerClient = (containerName = "tuturno") => {
  const connectionString = `DefaultEndpointsProtocol=https;AccountName=tuturno;AccountKey=${AZURE_BLOB_KEY};EndpointSuffix=core.windows.net`
  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString)
  const containerClient = blobServiceClient.getContainerClient(containerName)
  return containerClient
}

module.exports = getBlobContainerClient
