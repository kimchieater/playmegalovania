document.addEventListener("DOMContentLoaded", function () {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const gainNode = audioContext.createGain();
  gainNode.connect(audioContext.destination);

  // Load all the audio samples
  const audioBuffers = {};

  const fileNames = [
    "a",
    "d",
    "e",
    "f",
    "g",
    "h",
    "j",
    "k",
    "l",
    "o",
    "p",
    "s",
    "t",
    "u",
    "w",
    "y",
    ";",
  ];
  fileNames.forEach((fileName) => {
    fetch(`tunes/${fileName}.wav`)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        audioBuffers[fileName] = audioBuffer;
      });
  });

  // Function to play a note
  function playSound(note) {
    note = note.toLowerCase();

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffers[note];
    source.connect(gainNode);

    source.start();
  }

  // Add event listeners to piano keys
  document.querySelectorAll(".piano-keys .key").forEach((keyElement) => {
    keyElement.addEventListener("click", function () {
      const note = this.querySelector("span").innerText;
      playSound(note);
    });

    // Touch functionality
    keyElement.addEventListener("touchstart", function (event) {
      // Prevent multiple touches from triggering multiple sounds simultaneously
      if (event.touches.length > 1) return;

      const note = this.querySelector("span").innerText;
      playSound(note);
      this.classList.add("pressed");
    });

    keyElement.addEventListener("touchend", function () {
      this.classList.remove("pressed");
    });
  });

  // Add event listeners for keyboard keys
  document.addEventListener("keydown", function (event) {
    const key = event.key.toLowerCase();
    if (audioBuffers[key]) {
      playSound(key);

      // Find the corresponding piano key element
      const keyElements = document.querySelectorAll(`.piano-keys .key span`);
      keyElements.forEach((el) => {
        if (el.textContent === key) {
          el.parentElement.classList.add("pressed");
        }
      });
    }
  });

  const showKeysCheckbox = document.getElementById("show-key-change");
  const keyLabels = document.querySelectorAll(".piano-keys .key span");

  showKeysCheckbox.addEventListener("change", function () {
    if (this.checked) {
      // If checkbox is checked, show the letters
      keyLabels.forEach((label) => {
        label.style.visibility = "visible";
      });
    } else {
      // If checkbox is not checked, hide the letters
      keyLabels.forEach((label) => {
        label.style.visibility = "hidden";
      });
    }
    showKeysCheckbox.dispatchEvent(new Event("change"));
  });

  const volumeSlider = document.querySelector(".volume-slider input");
  volumeSlider.addEventListener("input", function () {
    const volume = this.value / 100; // Assuming the slider range is 0-100
    gainNode.gain.value = volume;
  });

  const desiredSequence = ["s", "s", "l", "h", "y", "g", "f", "s", "f", "g"];
  let playedNotes = [];

  function checkSequence() {
    const lastNotes = playedNotes.slice(-desiredSequence.length);
    if (JSON.stringify(lastNotes) === JSON.stringify(desiredSequence)) {
      document.body.style.backgroundImage = "url('img/sands1.png')";
    }
  }

  function playSound(note) {
    note = note.toLowerCase();

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffers[note];
    source.connect(gainNode);
    source.start();

    // Record the played note and check the sequence
    playedNotes.push(note);
    checkSequence();
  }

  // Remove the 'pressed' class when the key is released
  document.addEventListener("keyup", function (event) {
    const key = event.key.toLowerCase();
    const keyElements = document.querySelectorAll(`.piano-keys .key span`);
    keyElements.forEach((el) => {
      if (el.textContent === key) {
        el.parentElement.classList.remove("pressed");
      }
    });
  });
});
