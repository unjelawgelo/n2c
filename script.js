document.addEventListener("DOMContentLoaded", () => {
    const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const majorScales = {
        "C":  ["C", "D", "E", "F", "G", "A", "B"],
        "C#": ["C#", "D#", "F", "F#", "G#", "A#", "C"],
        "D":  ["D", "E", "F#", "G", "A", "B", "C#"],
        "D#": ["D#", "F", "G", "G#", "A#", "C", "D"],
        "E":  ["E", "F#", "G#", "A", "B", "C#", "D#"],
        "F":  ["F", "G", "A", "A#", "C", "D", "E"],
        "F#": ["F#", "G#", "A#", "B", "C#", "D#", "F"],
        "G":  ["G", "A", "B", "C", "D", "E", "F#"],
        "G#": ["G#", "A#", "C", "C#", "D#", "F", "G"],
        "A":  ["A", "B", "C#", "D", "E", "F#", "G#"],
        "A#": ["A#", "C", "D", "D#", "F", "G", "A"],
        "B":  ["B", "C#", "D#", "E", "F#", "G#", "A#"]
    };
        
    const sections = ["intro", "verse", "pre-chorus", "chorus", "passing-chords", "bridge", "outro"]
    let currentSection = "intro"
    const sectionData = {}
  
    sections.forEach((section) => {
      sectionData[section] = { nashville: "", converted: "" }
    })
  
    function convertNashvilleToChords(key, nashvilleNumbers) {
        if (!majorScales[key]) return "Invalid key";

        const scale = majorScales[key];
        const numbers = nashvilleNumbers.split(/\s+/);
        
        return numbers.map(num => {
            const parsedNum = parseInt(num, 10);
            if (isNaN(parsedNum) || parsedNum < 1 || parsedNum > 7) return num; 
            const note = scale[parsedNum - 1];
            const isMinor = [2, 3, 6].includes(parsedNum);
            return `${note}${isMinor ? "m" : ""}`;
        }).join(" ");
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

    document.querySelectorAll(".key-tab").forEach(tab => {
        tab.addEventListener("click", function () {
            // Remove 'active' class from all tabs
            document.querySelectorAll(".key-tab").forEach(btn => btn.classList.remove("active"));
    
            // Set clicked tab as active
            this.classList.add("active");
    
            // Update the hidden input's value to match selected key
            document.getElementById("key").value = this.dataset.value;
    
            // Trigger the existing change event to update chords
            document.getElementById("key").dispatchEvent(new Event("change"));
        });
    });
    
  
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





document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        document.getElementById("loading-screen").style.display = "none";
        document.querySelector(".container").style.display = "block";
    }, 3000); // 3-second delay
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
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const uploadedImage = document.getElementById("uploadedImage");
        uploadedImage.src = e.target.result;
        uploadedImage.style.display = "block";

        // OCR processing
        Tesseract.recognize(e.target.result, 'eng', { logger: (m) => console.log(m) })
            .then(({ data: { text } }) => {
                console.log("Extracted Text:", text);
                const detectedChords = extractChords(text);
                displayDetectedChords(detectedChords);
            });
    };
    reader.readAsDataURL(file);
});

function extractChords(text) {
    const chordPattern = /\b[A-G][#b]?m?(maj7|m7|7|dim|aug)?\b/g;
    return text.match(chordPattern) || [];
}

function displayDetectedChords(chords) {
    document.getElementById("chord-results").style.display = "block";
    document.getElementById("detectedChords").textContent = chords.length > 0 ? chords.join(", ") : "No chords detected.";
}



document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        document.getElementById("loading-screen").style.display = "none";
        document.querySelector(".container").style.display = "block";
    }, 3000); // 3-second delay
});
