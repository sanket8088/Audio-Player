var songsList = new XMLHttpRequest()
var audioDiv = document.getElementById("audiomp3")
var playlistDiv = document.getElementById("playlist-section")
var thumbnailDiv = document.getElementById("thumbnail-icon")
var titleDiv = document.getElementById("song-title-artist")
var durationPlayed = document.getElementById("duration-played")
var totalDuration = document.getElementById("total-duration")
var progressBar = document.getElementById("progress-bar")
var allSongsList = []
currentSong = 0
repeat = false
shuffle = false
isMuted = false
volumeOutput = audioDiv.volume

var speakerOn = document.getElementById("speaker")
var muteOn = document.getElementById("speaker-mute")
var volumeRange = document.getElementById("volume-range")


var songAudio = document.getElementById("audiomp3")
var setFlag = false
var buttonPlayPause = document.getElementById("play-pause")
var playButton = document.getElementById("play")
var pauseButton = document.getElementById("pause")
var nextButton = document.getElementById("forward")
var prevButton = document.getElementById("backward")
var durationPlayed = document.getElementById("duration-played")
var repeatButton = document.getElementById("repeat")
var shuffleButton = document.getElementById("shuffle")
var speakerContainer = document.getElementById("speaker-container")

songsList.open("GET", "https://5dd1894f15bbc2001448d28e.mockapi.io/playlist", true)
songsList.send();
songsList.onreadystatechange = function () {

    if (songsList.readyState === 4) {
        response = JSON.parse(songsList.responseText)
        for (i = 0; i < response.length - 1; i++) {
            imgUrl = response[i]["albumCover"]
            songTitle = response[i]["track"]
            artistTitle = response[i]["artist"]
            songUrl = response[i]["file"]
            var songDetailsDic = { "imgUrl": imgUrl, "songTitle": songTitle, "artistTitle": artistTitle, "songUrl": songUrl }
            allSongsList.push(songDetailsDic)
            createSongCard(i, imgUrl, songTitle, artistTitle, songUrl)

        }
    }
}

function createSongCard(i, imgUrl, songTitle, artistTitle, songUrl) {
    var songCard = document.createElement("div");
    songCard.classList.add("song-cover")
    songCard.id = i
    var thumbnailImg = document.createElement("img")
    thumbnailImg.classList.add("thumbnail-icon-side-bar")
    thumbnailImg.src = imgUrl
    var songDetails = document.createElement("div")
    songDetails.classList.add("songs-detail")
    var songName = document.createElement("h3")
    songName.classList.add("songName")

    songName.innerText = songTitle
    var artistName = document.createElement("i")
    artistName.classList.add("artistName")
    artistName.innerText = artistTitle
    songDetails.appendChild(songName)
    songDetails.appendChild(artistName)
    songCard.appendChild(thumbnailImg)
    songCard.appendChild(songDetails)
    songCard.addEventListener("click", function () {
        audioDiv.src = songUrl
        currentSong = parseInt(i)
        setTimeout(function () {
            totalDuration.innerText = generateTotalDuration(audioDiv.duration)
            thumbnailDiv.src = imgUrl
            titleDiv.innerHTML = "<h1>" + artistTitle + " - " + songTitle + "</h1>"

            durationPlayed.innerText = "00:00"
            audioDiv.play()
            playButton.style.display = "none"
            pauseButton.style.display = "block"
            setFlag = true


        }, 1000);
    })

    playlistDiv.appendChild(songCard)

}


// Controller function



buttonPlayPause.addEventListener("click", function () {
    if (setFlag) {
        setFlag = false
        songAudio.pause()
        playButton.style.display = "block"
        pauseButton.style.display = "none"
    }
    else {
        setFlag = true
        songAudio.play()
        playButton.style.display = "none"
        pauseButton.style.display = "block"

    }
})

prevButton.addEventListener("click", function () {
    if (shuffle) {
        generateShuffledSong()

    }
    else {
        if (currentSong == 0) {
            currentSong = allSongsList.length - 1
        }
        else {
            currentSong -= 1
        }

        audioDiv.src = allSongsList[currentSong]["songUrl"]
        thumbnailDiv.src = allSongsList[currentSong]["imgUrl"]
        titleDiv.innerHTML = "<h1>" + allSongsList[currentSong]["artistTitle"] + " - " + allSongsList[currentSong]["songTitle"] + "</h1>"
        setTimeout(function () {
            progressBar.value = 0
            durationPlayed.innerText = "00:00"
            totalDuration.innerText = generateTotalDuration(audioDiv.duration)
            audioDiv.play()
            playButton.style.display = "none"
            pauseButton.style.display = "block"
            setFlag = true
        }, 1000);
    }

})

nextButton.addEventListener("click", function () {
    if (shuffle) {
        generateShuffledSong()

    }
    else {
        if (currentSong == allSongsList.length - 1) {
            currentSong = 0
        }
        else {
            currentSong += 1
        }
        progressBar.value = 0
        audioDiv.src = allSongsList[currentSong]["songUrl"]
        thumbnailDiv.src = allSongsList[currentSong]["imgUrl"]
        titleDiv.innerHTML = "<h1>" + allSongsList[currentSong]["artistTitle"] + " - " + allSongsList[currentSong]["songTitle"] + "</h1>"
        setTimeout(function () {
            totalDuration.innerText = generateTotalDuration(audioDiv.duration)
            durationPlayed.innerText = "00:00"
            audioDiv.play()
            playButton.style.display = "none"
            pauseButton.style.display = "block"
            setFlag = true
        }, 1000);
    }

})

audioDiv.addEventListener("timeupdate", function () {
    var current = audioDiv.currentTime
    setTimeout(function () {
        if (Math.floor(audioDiv.currentTime) < Math.floor(audioDiv.duration)) {
            if (current > 0) {
                totalGrowth = Math.floor(current) / Math.floor(audioDiv.duration)
                progressBar.value = totalGrowth * 100

                current = Math.floor(current)
                var min = current / 60
                // current = Math.floor(current)
                current = current < 10 ? "0" + current : current
                if (min > 1) {
                    current = current - (Math.floor(min) * 60)
                    current = current < 10 ? "0" + current : current
                    current = "0" + Math.floor(min) + ":" + current
                }
                else {
                    current = "00:" + current
                }
                durationPlayed.innerText = current
            }
        }
        else {
            if (repeat) {
                audioDiv.currentTime = 0
            }
            else if (shuffle) {
                generateShuffledSong()
            }
            else {
                nextButton.click()
            }
        }

    }, 1000)


})

// function to generate total duration
function generateTotalDuration(time) {
    time = Math.floor(time)
    min = Math.floor(time / 60)
    seconds = time - (min * 60)
    seconds = seconds < 10 ? "0" + seconds : seconds
    min = min < 10 ? "0" + min : min
    return min + ":" + seconds
}

// Determine click on percentage of progress bar
progressBar.addEventListener("click", function (e) {
    var value_clicked = e.offsetX * this.max / this.offsetWidth;
    var valueClicked = (value_clicked / 100) * audioDiv.duration
    audioDiv.currentTime = valueClicked

})

//Adding repeat and shuffle click

repeatButton.addEventListener("click", function () {
    if (repeat) {
        repeat = false
        repeatButton.style.color = "white"
    }
    else {
        repeat = true
        repeatButton.style.color = "dodgerblue"
    }

})

shuffleButton.addEventListener("click", function () {
    if (shuffle) {
        shuffle = false
        shuffleButton.style.color = "white"
    }
    else {
        shuffle = true
        shuffleButton.style.color = "dodgerblue"
    }

})


function generateShuffledSong() {
    min = 0
    max = allSongsList.length - 1
    songNumber = getRandomInt(min, max)
    currentSong = songNumber
    allSongsList[currentSong]
    audioDiv.src = allSongsList[currentSong]["songUrl"]
    setTimeout(function () {
        totalDuration.innerText = generateTotalDuration(audioDiv.duration)
        thumbnailDiv.src = allSongsList[currentSong]["imgUrl"]
        titleDiv.innerHTML = "<h1>" + allSongsList[currentSong]["artistTitle"] + " - " + allSongsList[currentSong]["songTitle"] + "</h1>"

        durationPlayed.innerText = "00:00"
        audioDiv.play()
        playButton.style.display = "none"
        pauseButton.style.display = "block"
        setFlag = true


    }, 1000);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Spaeker container

speakerContainer.addEventListener("click", function () {
    if (isMuted) {
        volumeRange.value = volumeOutput * 100
        isMuted = false
        audioDiv.muted = false
        speakerOn.style.display = "block"
        muteOn.style.display = "none"

    }
    else {
        volumeOutput = audioDiv.volume
        volumeRange.value = 0
        isMuted = true
        audioDiv.muted = true
        speakerOn.style.display = "none"
        muteOn.style.display = "block"


    }

})

volumeRange.addEventListener("input", function () {
    var vRange = volumeRange.value
    audioDiv.volume = vRange / 100
})
