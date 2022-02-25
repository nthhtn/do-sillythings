export function getBriefHtmlContent(text, shortLength = 100) {
	let span = document.createElement('span');
	span.innerHTML = text;
	if (span.innerText.length < shortLength) {
		return span.innerText;
	}
	return span.innerText.substring(0, shortLength);
};
