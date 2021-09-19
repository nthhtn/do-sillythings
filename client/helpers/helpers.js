module.exports.toDateString = (milliseconds) => {
	const datetime = new Date(milliseconds);
	const date = datetime.getDate() < 10 ? '0' + datetime.getDate().toString() : datetime.getDate().toString();
	const month = (datetime.getMonth() + 1 < 10) ? '0' + (datetime.getMonth() + 1).toString() : (datetime.getMonth() + 1).toString();
	const year = datetime.getFullYear();
	const hour = datetime.getHours() < 10 ? '0' + datetime.getHours().toString() : datetime.getHours().toString();
	const min = datetime.getMinutes() < 10 ? '0' + datetime.getMinutes().toString() : datetime.getMinutes().toString();
	return `${date}/${month}/${year} ${hour}:${min}`;
};
