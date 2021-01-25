const fs = require('fs')
const youtubedl = require('youtube-dl')
const express = require('express')
const ffmpeg = require('fluent-ffmpeg')
const bodyParse = require('body-parser')
const app = express()
const port = 80

app.use(bodyParse.json())

app.get('/download/:id', (req, res) => {

  let videoid
  
  // const video = youtubedl(videoid)
  const video = youtubedl(req.params.id)
  
  // Will be called when the download starts.
  video.on('info', (info) => {
    console.log('Download started')
    console.log('filename: ' + info._filename)
    console.log('size: ' + info.size)

    // console.log(info)

    const title = info._filename.substring(0, 40)

    res.attachment(`${title}.mp3`);
  
    ffmpeg(video)
      .inputFormat('mp4')
      .format('mp3')
      .output(res)
      .on('end', function() {
        console.log('Finished processing');
        res.status(200).send()
      })
      .run();
  })
  

})

app.post('/info', (req, res) => {
  youtubedl.getInfo(req.body.url, function(err, info) {
    if (err) {
      console.log(err)
      res.status(500).json({error: 'Error retrieving info'})
    }


    console.log(info)

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
