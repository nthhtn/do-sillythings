export function scrollToElement(elementId) {
	const yOffset = -50;
	const element = document.getElementById(elementId);
	const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
	window.scrollTo({ top: y, behavior: 'smooth' });
};

export function getBriefHtmlContent(text, shortLength = 150) {
	let span = document.createElement('span');
	span.innerHTML = text;
	if (span.innerText.length < shortLength) {
		return span.innerText;
	}
	return span.innerText.substring(0, shortLength) + '...';
};
