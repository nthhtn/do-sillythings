import Category from '../models/Category';

export async function generateCategories() {
	const categories = await Category.find({}).exec();
	if (categories.length > 0) { return; }
	const list = [
		{ name: 'silly things', displayName: 'Silly things' },
		{ name: 'silly love', displayName: 'Silly love' },
		{ name: 'silly trips', displayName: 'Silly trips' },
		{ name: 'silly gf', displayName: 'Silly gf' },
		{ name: 'silly bf', displayName: 'Silly bf' }
	];
	const result = await Category.insertMany(list);
	console.log(result);
};
