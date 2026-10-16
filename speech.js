(() => {
  const controls = document.getElementById('audio-controls');
  const button = document.getElementById('speak');
  const label = document.getElementById('speak-label');
  const status = document.getElementById('speech-status');
  const audio = document.getElementById('introduction-audio');
  let active = false;
  let request = 0;
  const playbackError = '音声を再生できませんでした。下の自己紹介をお読みください。';

  function reset(message) {
    active = false;
    request++;
    label.textContent = '自己紹介を聴く';
    status.textContent = message;
  }

  function rewind() {
    try {
      audio.currentTime = 0;
    } catch {
      // Some browsers cannot seek media before its metadata is available.
    }
  }

  function stop() {
    reset('');
    audio.pause();
    rewind();
  }

  button.addEventListener('click', async () => {
    if (active) {
      stop();
      return;
    }
    const current = ++request;
    active = true;
    label.textContent = '音声を停止';
    status.textContent = '';
    try {
      rewind();
      await audio.play();
    } catch {
      // An interrupted earlier request must not reset a newer playback.
      if (current === request) reset(playbackError);
    }
  });
  audio.addEventListener('play', () => {
    if (!audio.paused && !audio.ended) {
      active = true;
      label.textContent = '音声を停止';
      status.textContent = '';
    }
  });
  audio.addEventListener('ended', () => {
    if (audio.ended) reset('再生が終了しました。');
  });
  audio.addEventListener('error', () => {
    if (audio.error) reset(playbackError);
  });
  audio.addEventListener('pause', () => {
    // A queued pause from an earlier stop must not reset a new playback.
    if (audio.paused && !audio.ended && active) reset('');
  });
  window.addEventListener('pagehide', stop);

  // Leave native controls usable if the script fails to load or initialize.
  audio.hidden = true;
  controls.hidden = false;
})();
