const convertButton = document.getElementById("convert")
const convertText = document.getElementById("text")
const regexSave = /Cklfo(B|Z)(.+)/

var lastSuffix = "B"

async function gdecompress(base64String) {
  try {
    const bytes = Uint8Array.from(base64String, c => c.charCodeAt(0))

    const cs = new DecompressionStream('gzip')
    const writer = cs.writable.getWriter()
    writer.write(bytes)
    writer.close()

    const arrayBuffer = await new Response(cs.readable).arrayBuffer()
    return new TextDecoder().decode(arrayBuffer)
  } catch (error) {
    console.error("Decompression failed:", error)
    throw error
  }
}   

async function gcompress(string) {
  const byteArray = new TextEncoder().encode(string)
  const cs = new CompressionStream('gzip')
  const writer = cs.writable.getWriter()
  
  writer.write(byteArray)
  writer.close()
  
  // Convert the compressed stream to a Blob, then to Base64
  const blob = await new Response(cs.readable).blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result.split(',')[1]) // Remove data URI prefix
    reader.onerror = reject
    reader.readAsDataURL(blob)
    
  });
};


convertButton.addEventListener("click", async (e) => {
	val = convertText.value.trim()
	if (!val) return
	try {
		match = val.match(regexSave)
	    if (match) {
		    val = await gdecompress(atob(match[2]))
		    lastSuffix = match[1]
            val = val.replace(/\{|\}/g,"").split(",").join("\n")
	    }
	    else {
	    	val = "Cklfo" + lastSuffix + await gcompress("{" + val.split("\n").filter(n => n).join(",") + "}")
    	}
    }
    catch (error) {
    	alert("Error processing save file.")
        throw error
    }
	convertText.value = val
})

