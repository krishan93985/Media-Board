window.onload = () => {
    const warningEl = document.getElementById('warning');
    const vidRecordBtn = document.getElementById('record-video');
    // const startBtn = document.getElementById('startBtn');
    // const stopBtn = document.getElementById('stopBtn');
    const audioToggle = document.getElementById('audioToggle');
    const micAudioToggle = document.getElementById('micAudioToggle');
    let recordState = false;

    if ('getDisplayMedia' in navigator.mediaDevices) warningEl.style.display = 'none';

    let blobs;
    let blob;
    let rec;
    let stream;
    let voiceStream;
    let desktopStream;

    const mergeAudioStreams = (desktopStream, voiceStream) => {
        const context = new AudioContext();
        const destination = context.createMediaStreamDestination();
        let hasDesktop = false;
        let hasVoice = false;
        if (desktopStream && desktopStream.getAudioTracks().length > 0) {
            // If you don't want to share Audio from the desktop it should still work with just the voice.
            const source1 = context.createMediaStreamSource(desktopStream);
            const desktopGain = context.createGain();
            desktopGain.gain.value = 0.7;
            source1.connect(desktopGain).connect(destination);
            hasDesktop = true;
        }

        if (voiceStream && voiceStream.getAudioTracks().length > 0) {
            const source2 = context.createMediaStreamSource(voiceStream);
            const voiceGain = context.createGain();
            voiceGain.gain.value = 0.7;
            source2.connect(voiceGain).connect(destination);
            hasVoice = true;
        }

        return (hasDesktop || hasVoice) ? destination.stream.getAudioTracks() : [];
    };

    vidRecordBtn.onclick = async () => {
            if (recordState == false) {
            const audio = audioToggle.checked || false;
            const mic = micAudioToggle.checked || false;

            desktopStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: audio });

            if (mic === true) {
                voiceStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: mic });
            }

            const tracks = [
                ...desktopStream.getVideoTracks(),
                ...mergeAudioStreams(desktopStream, voiceStream)
            ];

            console.log('Tracks to add to stream', tracks);
            stream = new MediaStream(tracks);
            console.log('Stream', stream)

            blobs = [];

            rec = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp8,opus' });
            rec.ondataavailable = (e) => blobs.push(e.data);
            rec.onstop = async () => {
                //blobs.push(MediaRecorder.requestData());
                blob = new Blob(blobs, { type: 'video/mp4' });
                //let url = URL.createObjectURL(blob);
                if(db){
                    addMediaToGallery(blob, "video");
                }
            };
            vidRecordBtn.disabled = true;
            audioToggle.disabled = true;
            micAudioToggle.disabled = true;
            vidRecordBtn.src = "./NewIcons/screen-recording.png";
            vidRecordBtn.classList.add("recording-animation");
            rec.start();
            startCounting();
            recordState=!recordState;
        } else {
            vidRecordBtn.disabled = false;
            audioToggle.disabled = false;
            micAudioToggle.disabled = false;
            vidRecordBtn.src = "./NewIcons/screen-recording-off.png";
            vidRecordBtn.classList.remove("recording-animation");
            stopCounting();
            rec.stop();
            recordState=!recordState;

            stream.getTracks().forEach(s => s.stop())
            stream = null;
        }
    }
    };


