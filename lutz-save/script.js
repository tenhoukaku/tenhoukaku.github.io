convertButton = document.getElementById("convert")
convertText = document.getElementById("text")
convertButton.addEventListener("click", (e) => {
	val = convertText.value.trim()
	console.log(val)
	if (!val) return
	if (val.startsWith("CklfoB")) {
		val = atob(val.replace(/Cklfoa/,"")).replace(/\{|\}/g,"").split(",").join("\n")
	}
	else {
		val = "CklfoB" + btoa("{" + val.split("\n").filter(n => n).join(",") + "}")
	}
	convertText.value = val
})