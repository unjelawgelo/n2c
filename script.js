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
        const tab = this.dataset.tab
        document.querySelectorAll(".tab-button").forEach((b) => b.classList.remove("active"))
        document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"))
        this.classList.add("active")
        document.getElementById(`${tab}-input`).classList.add("active")
      })
    })
  
    document.getElementById("full-screen-toggle").addEventListener("click", function () {
      document.getElementById("summary").classList.toggle("full-screen")
      this.textContent = this.textContent === "Full Screen" ? "Exit Full Screen" : "Full Screen"
    })
  })
  
  function setActive(button) {
  document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
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
