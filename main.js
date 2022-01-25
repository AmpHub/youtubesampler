const fs = require('fs')
const youtubedl = require('youtube-dl')
const express = require('express')
const ffmpeg = require('fluent-ffmpeg')
const bodyParse = require('body-parser')
const compression = require('compression')
const app = express()
const port = process.env.PORT || 8080

app.use(bodyParse.json())

app.use(compression())


app.get('/download/:id', (req, res) => {

  let videoid
  
  // const video = youtubedl(videoid)
  const video = youtubedl(req.params.id)
  
  // Will be called when the download starts.
  video.on('info', (info) => {
    // console.log('Download started')
    // console.log('filename: ' + info._filename)
    // console.log('size: ' + info.size)

    // console.log(info)

    const title = info._filename.substring(0, 40).replace(/ /g, '')

    res.attachment(`${title}.mp3`);
  
    ffmpeg(video)
      .inputFormat('mp4')
      .format('mp3')
      .output(res)
      .on('end', function() {
        // console.log('Finished processing');
        res.status(200).send()
      })
      .run();
  })
  

})

// app.get('/downloadwav/:id', (req, res) => {

//   let videoid
  
//   // const video = youtubedl(videoid)
//   const video = youtubedl(req.params.id)
  
//   // Will be called when the download starts.
//   video.on('info', (info) => {

//     const title = info._filename.substring(0, 40).replace(/ /g, '')

//     res.attachment(`${title}.aac`);
    
  
//     ffmpeg(video)
//       .inputFormat('mp4')
//       .outputOptions(['-c:a aac', '-b:a 128k'])
//       .format('aac')
//       .output(res)
//       .on('end', ()=> {
//         // console.log('Finished processing');
//         res.status(200).send()
//       })
//       .on('error', err => {
//         console.log(err)
//       })
//       .run();
//   })
  

// })

app.post('/info', (req, res) => {
  youtubedl.getInfo(req.body.url, function(err, info) {
    if (err) {
      console.log(err)
      res.status(500).json({error: 'Error retrieving info'})
    }


    // console.log(info)

    const {title, thumbnail, id} = info;
  
    // console.log('title:', title)
    // console.log('thumbnail:', thumbnail)

    res.status(200).json({title, thumbnail, id})
  })
})

app.use(express.static('static'))

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})
