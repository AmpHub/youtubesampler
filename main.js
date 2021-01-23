const fs = require('fs')
const youtubedl = require('youtube-dl')
const express = require('express')
const ffmpeg = require('fluent-ffmpeg')
const bodyParse = require('body-parser')
const app = express()
const port = 80

app.use(bodyParse.json())

app.post('/download', (req, res) => {

  const videoid = req.body.url.match(/watch\?v=.{1,11}/)[0].substring(8)
  const video = youtubedl(videoid)
  
  // Will be called when the download starts.
  video.on('info', (info) => {
    console.log('Download started')
    console.log('filename: ' + info._filename)
    console.log('size: ' + info.size)

    const title = info._filename.substring(0, 20)

    res.attachment(`${title} - ${videoid}.mp3`);
  
    ffmpeg(video)
      .inputFormat('mp4')
      .format('mp3')
      .output(res)
      .on('end', function() {
        console.log('Finished processing');
      })
      .run();
  })
  

})

app.use(express.static('static'))

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})
