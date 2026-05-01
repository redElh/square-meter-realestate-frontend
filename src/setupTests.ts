// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import './i18n/config';

jest.mock('axios', () => ({
	__esModule: true,
	default: {
		get: jest.fn(),
		post: jest.fn(),
		put: jest.fn(),
		delete: jest.fn(),
		create: jest.fn(() => ({
			get: jest.fn(),
			post: jest.fn(),
			put: jest.fn(),
			delete: jest.fn(),
		})),
	},
}));

Object.defineProperty(window, 'scrollTo', {
	value: jest.fn(),
	writable: true,
});

class MockIntersectionObserver {
	root = null;
	rootMargin = '';
	thresholds = [];

	constructor() {}

	observe() {}
	unobserve() {}
	disconnect() {}
	takeRecords() {
		return [];
	}
}

Object.defineProperty(window, 'IntersectionObserver', {
	value: MockIntersectionObserver,
	writable: true,
});

Object.defineProperty(global, 'IntersectionObserver', {
	value: MockIntersectionObserver,
	writable: true,
});
