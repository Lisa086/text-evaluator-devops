export default async function sendData(file, showError) {
    const textInput = document.getElementById("textInput");
    const fileInput = document.getElementById("fileInput");
    const words = document.getElementById("result-words");
    const sentences = document.getElementById("result-sentences");
    const index = document.getElementById("result-indexR");
    const topicContainer = document.getElementById("result-topics")
    var data, headers, address;

    if (file) {
        data = new FormData()
        address = "http://localhost:8080/api/documents"
        data.append("file", fileInput.files[0], 'text.txt')
    } else {
        headers = {
            "Content-Type": "application/json"
        }
        address = "http://localhost:8080/api/analysis"
        data = JSON.stringify({ text: textInput.value })
    }

    try {
        const response = await fetch(address, {
            method: "POST",
            headers: headers,
            body: data,
        })

        if (!response.ok) {
            switch (response.status) {
                case 413:
                    showError("Файл не должен превышать 1мб");
                    break;
            }
            throw err;
        }
            const responseData = await response.json()
            words.textContent = JSON.stringify(responseData.word_count)
            sentences.textContent = JSON.stringify(responseData.sentence_count)
            index.textContent = JSON.stringify(responseData.readability_score)

            topicContainer.innerHTML = ""
            responseData.keywords.forEach(element => {
                const tab = document.createElement("div")
                tab.className = "uploader__result-tab"
                tab.textContent = element
                topicContainer.appendChild(tab)
            });
    } catch (err) {
        throw err;
    }
}