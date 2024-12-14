/* global $ */
// ==UserScript==
// @name         Mercado Livre - Click on the use coupon buttons
// @namespace    https://www.mercadolivre.com.br/cupons/*
// @version      0.1
// @description  Click on the use coupon buttons and navigate through pages
// @author       Newerton Vargas de Araujo
// @match        https://www.mercadolivre.com.br/cupons/*
// @icon         https://www.google.com/s2/favicons?domain=mercadolivre.com.br&sz=128
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==

(function() {
    'use strict';

    async function scrollToBottom() {
        return new Promise((resolve) => {
            const scrollHeight = document.documentElement.scrollHeight;
            const scrollOptions = {
                top: scrollHeight,
                behavior: 'smooth'
            };

            // Faz a página rolar até o final
            window.scrollTo(scrollOptions);

            // Aguardar até que a rolagem seja concluída
            const checkIfScrolledToBottom = setInterval(() => {
                const windowHeight = window.innerHeight + window.scrollY;
                if (windowHeight >= scrollHeight) {
                    clearInterval(checkIfScrolledToBottom);
                    resolve(); // Resolva a promessa quando chegar ao final da página
                }
            }, 200); // Verifica a cada 200ms
        });
    }

    async function clickButtons() {
        // Aguarda 5 segundos antes de continuar para a próxima página
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Seleciona todos os botões com o texto "Aplicar"
        const buttons = document.querySelectorAll('button.andes-button span.andes-button__content');
        const buttonsArray = Array.from(buttons);

        // Filtra os botões que contêm o texto "Aplicar"
        const applyButtons = buttonsArray.filter(button => button.textContent.trim() === 'Aplicar');

        if (applyButtons.length > 0) {
            for (const button of applyButtons) {
                const parentButton = button.closest('button'); // Encontra o elemento pai <button>
                if (parentButton) {
                    parentButton.click(); // Clica no botão
                    // Opcional: Adicionar um atraso entre cliques, se necessário
                    await new Promise(resolve => setTimeout(resolve, 100)); // Atraso de 100ms entre cliques
                }
            }
        }

        // Aguarda 5 segundos antes de continuar para a próxima página
        await new Promise(resolve => setTimeout(resolve, 3000));
    }

    async function clickButtonsAndNext() {
        // Clica nos botões e aguarda que todos os cliques sejam executados
        await clickButtons();

        // Faz a rolagem até o final da página antes de clicar no botão "Seguinte"
        await scrollToBottom();

        // Verifica se há um botão de "Seguinte"
        const nextPageButton = document.querySelector('.andes-pagination__link[title="Seguinte"]');
        if (nextPageButton) {
            console.log('Clicou no botão de próxima página');
            nextPageButton.click();

            // Chama a função novamente para a próxima página
            clickButtonsAndNext();
        } else {
            console.log('Botão de próxima página não encontrado ou não existem mais páginas.');
        }
    }

    // Inicializa o processo
    clickButtonsAndNext();

})();
