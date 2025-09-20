const ImageKit = require("imagekit");

const imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLICKEY,
    privateKey : process.env.IMAGEKIT_PRIVATEKEY,
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
});

function uploadImage(file, fileName){
    return new Promise((res,rej) => {
        imagekit.upload({
            file:file.buffer,
            fileName: fileName,
            folder: "profileImage"
        },(error,result) => {
            if(error){
                rej(error)
            }
            else{
                res(result);
            }
        })
    })
}

module.exports = uploadImage