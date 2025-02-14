document.addEventListener("DOMContentLoaded", () => {
    const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
    const majorScale = ["C", "D", "E", "F", "G", "A", "B"]
    const sections = ["intro", "verse", "pre-chorus", "chorus", "passing-chords", "bridge", "outro"]
    let currentSection = "intro"
    const sectionData = {}
  
    sections.forEach((section) => {
      sectionData[section] = { nashville: "", converted: "" }
    })
  
    function convertNashvilleToChords(key, nashvilleNumbers) {
      const keyIndex = majorScale.indexOf(key[0].toUpperCase())
      if (keyIndex === -1) return "Invalid key"
  
      const numbers = nashvilleNumbers.split(/\s+/)
      const chords = numbers.map((num) => {
        const parsedNum = Number.parseInt(num)
        if (isNaN(parsedNum) || parsedNum < 1 || parsedNum > 7) {
          return num // Return the original input if it's not a valid number
        }
        const index = (parsedNum - 1 + keyIndex) % 7
        const noteName = majorScale[index]
        // 2, 3, and 6 are minor chords
        const isMinor = [2, 3, 6].includes(parsedNum)
        return `${noteName}${isMinor ? "m" : ""}`
      })
  
      return chords.join(" ")
    }
  
    function updateConvertedChords() {
      const key = document.getElementById("key").value
      const nashville = document.getElementById("nashville").value
      const converted = document.getElementById("converted")
  
      if (key && nashville) {
        const result = convertNashvilleToChords(key, nashville)
        converted.value = result
        sectionData[currentSection] = { nashville, converted: result }
      } else {
        converted.value = ""
        sectionData[currentSection] = { nashville, converted: "" }
      }
  
      updateSummary()
    }
  
    function updateSummary() {
      const key = document.getElementById("key").value
      const summaryContent = document.querySelector(".summary-content")
      let summaryHTML = `<h3>Key: ${key}</h3>`
  
      for (const [section, data] of Object.entries(sectionData)) {
        if (data.converted) {
          summaryHTML += `
                      <h3>${section.charAt(0).toUpperCase() + section.slice(1)}:</h3>
                      <p>${data.converted}</p>
                  `
        }
      }
  
      summaryContent.innerHTML = summaryHTML
    }
  
    // Event listeners
    document.getElementById("key").addEventListener("change", updateConvertedChords)
    document.getElementById("nashville").addEventListener("input", updateConvertedChords)
  
    document.getElementById("convert-all").addEventListener("click", () => {
      const key = document.getElementById("key").value
      if (key) {
        for (const section of sections) {
          if (sectionData[section].nashville) {
            sectionData[section].converted = convertNashvilleToChords(key, sectionData[section].nashville)
          }
        }
        updateSummary()
      }
    })
  
    document.querySelectorAll(".section-tab").forEach((tab) => {
      tab.addEventListener("click", function () {
        const section = this.dataset.section
        document.querySelectorAll(".section-tab").forEach((t) => t.classList.remove("active"))
        this.classList.add("active")
        currentSection = section
        document.getElementById("nashville").value = sectionData[section].nashville
        document.getElementById("converted").value = sectionData[section].converted
      })
    })
  
    document.querySelectorAll(".tab-button").forEach((button) => {
        button.addEventListener("click", function () {
          document.querySelectorAll(".tab-button").forEach((b) => b.classList.remove("active"));
          document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
      
          this.classList.add("active");
      
          if (this.innerText === "Manual Input") {
            document.getElementById("manual-input").classList.add("active");
          } else if (this.innerText === "Image Upload") {
            document.getElementById("image-upload").classList.add("active");
          }
        });
      });
      
  
    document.getElementById("full-screen-toggle").addEventListener("click", function () {
      document.getElementById("summary").classList.toggle("full-screen")
      this.textContent = this.textContent === "Full Screen" ? "Exit Full Screen" : "Full Screen"
    })
  })
  
  function setActive(button) {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

    // Determine which tab was clicked and show the corresponding content
    if (button.innerText === "Manual Input") {
        document.getElementById('manual-input').classList.add('active');
    } else if (button.innerText === "Image Upload") {
        document.getElementById('image-upload').classList.add('active');
    }
}


//Key first
document.addEventListener("DOMContentLoaded", function () {
    const keySelector = document.getElementById("key");
    const nashvilleInput = document.getElementById("nashville");
    
    // Create a message element
    const message = document.createElement("p");
    message.textContent = "Please select a key first.";
    message.style.color = "red";
    message.style.fontSize = "14px";
    message.style.display = "none"; // Initially hidden
    nashvilleInput.parentNode.appendChild(message);

    // Disable input initially
    nashvilleInput.disabled = true;

    keySelector.addEventListener("change", function () {
        if (keySelector.value) {
            nashvilleInput.disabled = false;
            message.style.display = "none"; // Hide message when key is selected
        } else {
            nashvilleInput.disabled = true;
        }
    });

    nashvilleInput.addEventListener("click", function () {
        if (!keySelector.value) {
            message.style.display = "block"; // Show message
            setTimeout(() => {
                message.style.display = "none"; // Hide after 3 seconds
            }, 3000);
        }
    });
});


//image upload
document.getElementById("imageInput").addEventListener("change", function (event) {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
        const reader = new FileReader(); // Read the file
        reader.onload = function (e) {
            const uploadedImage = document.getElementById("uploadedImage");
            uploadedImage.src = e.target.result; // Set image source
            uploadedImage.style.display = "block"; // Show the image
        };
        reader.readAsDataURL(file); // Convert file to Base64 URL
    }
});


//ai
document.getElementById("imageInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const uploadedImage = document.getElementById("uploadedImage");
            uploadedImage.src = e.target.result;
            uploadedImage.style.display = "block";

            // Perform OCR to extract text (chords)
            Tesseract.recognize(
                e.target.result,
                'eng',
                { logger: (m) => console.log(m) } // Logs OCR process
            ).then(({ data: { text } }) => {
                console.log("Extracted Text:", text);
                const detectedChords = extractChords(text);
                displayConvertedChords(detectedChords);
            });
        };
        reader.readAsDataURL(file);
    }
});

function extractChords(text) {
    const chordPattern = /\b[A-G][#b]?m?(maj7|m7|7|dim|aug)?\b/g;
    return text.match(chordPattern) || [];
}

function displayConvertedChords(chords) {
    const key = document.getElementById("key").value;
    const convertedChords = chords.map(chord => convertToNashville(key, chord));

    // Display the results in the new section
    document.getElementById("chord-results").style.display = "block";
    document.getElementById("detectedChords").textContent = chords.length > 0 ? chords.join(", ") : "No chords detected.";
    document.getElementById("convertedChords").textContent = convertedChords.length > 0 ? convertedChords.join(", ") : "No converted chords available.";
}

function convertToNashville(key, chord) {
    const nashvilleMap = {
        "C": { "C": "1", "Dm": "2m", "Em": "3m", "F": "4", "G": "5", "Am": "6m", "Bdim": "7dim" },
        "G": { "G": "1", "Am": "2m", "Bm": "3m", "C": "4", "D": "5", "Em": "6m", "F#dim": "7dim" }
        // Add more keys as needed...
    };
    
    return nashvilleMap[key]?.[chord] || chord; // Default to the same chord if not found
}
