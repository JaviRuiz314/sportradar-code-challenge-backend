'use strict';

const
	_ = require('lodash'),
	utils = require('../shared/utils');

function mergeCollection(a, b, fieldToSort, order) {
	const
		mergedArray = [],
		condition = order === utils.ORDER_DESC ?
			_.get(a[0], fieldToSort) < _.get(b[0], fieldToSort) :
			_.get(a[0], fieldToSort) > _.get(b[0], fieldToSort);

	while (a.length && b.length) {
		if (condition) {
			mergedArray.push(a.shift());
		} else {
			mergedArray.push(b.shift());
		}
	}

	return [...mergedArray, ...a, ...b];
}

function sortCollectionWithMergeAlgorithm(collection, fieldToSort, order) {
	const half = collection.length / 2;

	if (collection.length < 2) return collection;

	const left = collection.splice(0, half);
	return mergeCollection(
		sortCollectionWithMergeAlgorithm(left, fieldToSort, order),
		sortCollectionWithMergeAlgorithm(collection, fieldToSort, order),
		fieldToSort,
		order
	);
}

module.exports = { sortCollectionWithMergeAlgorithm }