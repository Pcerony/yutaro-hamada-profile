(() => {
  const controls = document.getElementById('audio-controls');
  const button = document.getElementById('speak');
  const label = document.getElementById('speak-label');
  const status = document.getElementById('speech-status');
  const audio = document.getElementById('introduction-audio');
  let active = false;
  let request = 0;
  controls.hidden = false;

  function reset(message) {
    active = false;
    request++;
    label.textContent = '自己紹介を聴く';
    button.setAttribute('aria-pressed', 'false');
    status.textContent = message;
  }

  function stop(message) {
    reset(message);
    audio.pause();
    audio.currentTime = 0;
  }

  button.addEventListener('click', async () => {
    if (active) {
      stop('再生を停止しました。');
      return;
    }
    const current = ++request;
    active = true;
    label.textContent = '音声を停止';
    button.setAttribute('aria-pressed', 'true');
    status.textContent = '自己紹介音声を再生しています。';
    try {
      audio.currentTime = 0;
      await audio.play();
    } catch {
      // An interrupted earlier request must not reset a newer playback.
      if (current === request) reset('音声を再生できませんでした。下の自己紹介をお読みください。');
    }
  });
  audio.addEventListener('ended', () => reset('再生が終了しました。'));
  audio.addEventListener('error', () => reset('音声を再生できませんでした。下の自己紹介をお読みください。'));
  audio.addEventListener('pause', () => {
    if (active) reset('再生を停止しました。');
  });
  window.addEventListener('pagehide', () => stop(''));
})();
