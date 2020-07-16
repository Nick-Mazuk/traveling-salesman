export class Tutorial {
    modalElement: HTMLDivElement;
    closeButton: HTMLButtonElement;
    skipButton: HTMLButtonElement;
    previousButton: HTMLButtonElement;
    nextButton: HTMLButtonElement;
    finishButton: HTMLButtonElement;
    replayTutorialElement: HTMLDivElement;
    bodyContent: HTMLDivElement;
    currentPanel: number = 0;
    panels = [
        `<h2>Welcome!</h2>
        <p>This short tutorial will walk you through all the features of this application.</p>
        <p>Let's get started!</p>`,
        `Panel 2`,
    ]

    constructor () {
        this.getHTMLElements();
        this.addEventListeners();
        this.displayPanel();
    }

    getHTMLElements(): void {
        this.modalElement = document.querySelector('#tutorial-modal');
        this.closeButton = document.querySelector('#tutorial-close');
        this.skipButton = document.querySelector('#tutorial-skip');
        this.previousButton = document.querySelector('#tutorial-previous');
        this.nextButton = document.querySelector('#tutorial-next');
        this.finishButton = document.querySelector('#tutorial-finish');
        this.bodyContent = document.querySelector('#tutorial-content');
        this.replayTutorialElement = document.querySelector('#tutorial-replay');
    }

    addEventListeners(): void {
        this.closeButton.addEventListener('click', () => this.closeModal());
        this.skipButton.addEventListener('click', () => this.closeModal());
        this.previousButton.addEventListener('click', () => this.previousPanel());
        this.nextButton.addEventListener('click', () => this.nextPanel());
        this.finishButton.addEventListener('click', () => this.closeModal());
        this.replayTutorialElement.addEventListener('click', () => this.replayTutorial());
    }

    openModal(): void {
        this.modalElement.classList.add('is-active');
    }

    closeModal(): void {
        this.modalElement.classList.remove('is-active');
    }

    ifLastPanel(): void {
        if (this.currentPanel == this.panels.length - 1) {
            this.nextButton.classList.add('is-hidden');
            this.finishButton.classList.remove('is-hidden');
        } else {
            this.nextButton.classList.remove('is-hidden');
            this.finishButton.classList.add('is-hidden');
        }
    }

    ifFirstPanel(): void {
        if (this.currentPanel == 0) {
            this.previousButton.classList.add('is-hidden');
        } else {
            this.previousButton.classList.remove('is-hidden');
        }
    }

    updateButtons(): void {
        this.ifFirstPanel();
        this.ifLastPanel();
    }

    nextPanel(): void {
        this.currentPanel++;
        this.displayPanel();
    }

    previousPanel(): void {
        this.currentPanel--;
        this.displayPanel();
    }

    displayPanel(): void {
        this.bodyContent.innerHTML = this.panels[this.currentPanel];
        this.updateButtons();
    }

    replayTutorial(): void {
        this.currentPanel = 0;
        this.displayPanel();
        this.openModal();
    }
}