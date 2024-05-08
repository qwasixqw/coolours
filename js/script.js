'use strict';

const wrapper = document.querySelector('.wrapper');
const cols = document.querySelectorAll('.wrapper__col');

document.addEventListener('keydown', (e) => {
	if (e.code.toLowerCase() === 'space') {
		e.preventDefault();
		setRandomColor();
	}
});

wrapper.addEventListener('click', (e) => {
	const type = e.target.dataset.type;

	if (type === 'lock') {
		const node = e.target.tagName.toLowerCase() === 'i' ? e.target : e.target.children[0];

		node.classList.toggle('fa-lock-open');
		node.classList.toggle('fa-lock');
	} else if (type === 'copy') {
		console.log(copyToClipboard(e.target.textContent));
	}
});

/**
 * Копирует указанный текст в буфер обмена.
 *
 * @param {string} text - Текст, который нужно скопировать в буфер обмена.
 * @return {Promise<void>} Промис, который разрешается, когда текст успешно скопирован в буфер обмена.
 */
function copyToClipboard(text) {
	return navigator.clipboard.writeText(text);
}

/**
 * Генерирует случайные цвета для элементов на странице на основе флага initial.
 *
 * @param {boolean} isInitial - Указывает, является ли это первая генерация цветов.
 * @return {void} Эта функция не возвращает значения.
 */
function setRandomColor(isInitial) {
	const colors = isInitial ? getColorsFromHash() : [];

	cols.forEach((col, index) => {
		const isLocked = col.querySelector('i').classList.contains('fa-lock');
		const text = col.querySelector('.wrapper__col h2');
		const button = col.querySelector('.wrapper__col button');

		if (isLocked) {
			colors.push(text.textContent);
			return;
		}

		let color;
		if (isInitial) {
			if (colors[index]) {
				color = colors[index];
			} else {
				color = chroma.random();
			}
		} else {
			color = chroma.random();
		}

		if (!isInitial) {
			colors.push(color);
		}

		text.textContent = color;
		col.style.backgroundColor = color;

		setTextColor(text, color);
		setTextColor(button, color);
	});

	updateColorsHash(colors);
}
setRandomColor(true);

/**
 * Устанавливает цвет текста элемента на основе оттенка предоставленного цвета.
 *
 * @param {HTMLElement} text - Элемент, цвет текста которого будет установлен.
 * @param {string} color - Цвет, на основе которого будет установлен цвет текста.
 * @return {void} Эта функция не возвращает значения.
 */
function setTextColor(text, color) {
	const luminance = chroma(color).luminance();
	text.style.color = luminance > 0.5 ? 'black' : 'white';
}

/**
 * Обновляет хэш текущего местоположения документа с строковой представлением массива цветов.
 *
 * @param {Array} colors - Массив цветов. Каждый цвет должен быть допустимым значением CSS цветового значения.
 * @return {void} Эта функция не возвращает значения.
 */
function updateColorsHash(colors = []) {
	document.location.hash = colors.map((color) => color.toString().slice(1)).join('-');
}

/**
 * Получает массив цветов из хэш-части текущего URL.
 *
 * @return {Array<string>} Массив строк цветов в формате "#RRGGBB".
 * Если хэш пустой или содержит только один символ, возвращается пустой массив.
 */
function getColorsFromHash() {
	if (document.location.hash.length > 1) {
		return document.location.hash
			.split('-')
			.slice(1)
			.map((color) => '#' + color);
	}
	return [];
}
