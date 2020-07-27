export class Tutorial {
    modalElement: HTMLDivElement
    closeButton: HTMLButtonElement
    skipButton: HTMLButtonElement
    previousButton: HTMLButtonElement
    nextButton: HTMLButtonElement
    finishButton: HTMLButtonElement
    replayTutorialElement: HTMLDivElement
    bodyContent: HTMLDivElement
    contentImage: HTMLImageElement
    currentPanel: number = 0
    panels = [
        `<h2>What is the traveling salesman problem?</h2>
        <p>How can Amazon deliver toilet paper in 2 days? This isn't a simple problem. At the very last stretch, Amazon loads your toilet paper into a van. But that van has dozens of other deliveries. So Amazon needs to <b>find the shortest route between every house</b>. Finding that shortest route is the traveling salesman problem.</p>`,

        `<h2>Add, move, or remove houses…</h2>
        <ul>
            <li><b>Add houses</b>: Click somewhere empty to add a house</li>
            <li><b>Move houses</b>: Click and drag to move it around</li>
            <li><b>Remove houses</b>: Just click a house and it's gone</li>
        </ul>`,

        `<h2>…and the route updates in real-time!</h2>
        <p>Unlike most traveling salesman visualizers, this one updates in real-time. Explore how <b>minor movements can cause massive changes</b>.</p>`,

        `<h2>Choose your algorithm wisely…</h2>
        <p>Select an algorithm from the dropdown menu.</p>
        <ul>
            <li><b>Brute Force</b>: Checks every possible path, guarantees shortest path</li>
            <li><b>Greedy</b>: Each house connects with the next closest house</li>
            <li><b>Annealing</b>: Gradually improves through random changes, avoids local mins</li>
            <li><b>2-opt</b>: Chooses random path, then uncrosses intersections</li>
            <li><b>Speedy</b>: Custom algorithm, combines greedy, annealing, and 2-opt</li>
            <li><b>BOGO</b>: Chooses random path, odds of finding shortest path is 1:(n - 1)!</li>
        </ul>`,

        `<h2>…because some are just better than others.</h2>
        <p>Some take way too long to finish. Others find paths that are way too long. Choose wisely or you'll have to wait until the heat death of the universe for an answer.</p>`,

        `<h2>Choose your own reality.</h2>
        <p>Find the shortest route through some bustling suburbs, or test the limits of the algorithms on a lifeless, theoretical void. The choice is yours!</p>`,

        `<h2>Explore this simulation in depth</h2>
        <p>Learn the specifics behind each algorithm.</p>
        <p>Check out the code on <a href='https://github.com/Nick-Mazuk/traveling-salesman' target='_blank'>Github</a> (and star the repo).</p>
        <p>Now start exploring! Ready, set, go…</p>`,
    ]

    panelImages = [
        'assets/logo/Logo.svg',
        'assets/addHouses.gif',
        'assets/updateRealTime.gif',
        'assets/chooseAlgorithm.gif',
        'assets/algorithmComparison.gif',
        'assets/cityGrid.gif',
        'assets/more.gif',
    ]

    constructor() {
        this.getHTMLElements()
        this.addEventListeners()
        this.displayPanel()
    }

    getHTMLElements(): void {
        this.modalElement = document.querySelector('#tutorial-modal')
        this.closeButton = document.querySelector('#tutorial-close')
        this.skipButton = document.querySelector('#tutorial-skip')
        this.previousButton = document.querySelector('#tutorial-previous')
        this.nextButton = document.querySelector('#tutorial-next')
        this.finishButton = document.querySelector('#tutorial-finish')
        this.bodyContent = document.querySelector('#tutorial-content')
        this.contentImage = document.querySelector('#tutorial-image')
        this.replayTutorialElement = document.querySelector('#tutorial-replay')
    }

    addEventListeners(): void {
        this.closeButton.addEventListener('click', () => this.closeModal())
        this.skipButton.addEventListener('click', () => this.closeModal())
        this.previousButton.addEventListener('click', () => this.previousPanel())
        this.nextButton.addEventListener('click', () => this.nextPanel())
        this.finishButton.addEventListener('click', () => this.closeModal())
        this.replayTutorialElement.addEventListener('click', () => this.replayTutorial())
    }

    openModal(): void {
        this.modalElement.classList.add('is-active')
    }

    closeModal(): void {
        this.modalElement.classList.remove('is-active')
    }

    ifLastPanel(): void {
        if (this.currentPanel == this.panels.length - 1) {
            this.nextButton.classList.add('is-hidden')
            this.finishButton.classList.remove('is-hidden')
        } else {
            this.nextButton.classList.remove('is-hidden')
            this.finishButton.classList.add('is-hidden')
        }
    }

    ifFirstPanel(): void {
        if (this.currentPanel == 0) {
            this.previousButton.classList.add('is-hidden')
        } else {
            this.previousButton.classList.remove('is-hidden')
        }
    }

    updateButtons(): void {
        this.ifFirstPanel()
        this.ifLastPanel()
    }

    nextPanel(): void {
        this.currentPanel++
        this.displayPanel()
    }

    previousPanel(): void {
        this.currentPanel--
        this.displayPanel()
    }

    preloadImage(): void {
        if (this.panelImages[this.currentPanel + 1]) {
            this.bodyContent.innerHTML += `<link rel="preload" href="${
                this.panelImages[this.currentPanel + 1]
            }" as="image">`
        }
    }

    displayPanel(): void {
        this.bodyContent.innerHTML = this.panels[this.currentPanel]
        this.contentImage.src = this.panelImages[this.currentPanel]
        this.updateButtons()
        this.preloadImage()
    }

    replayTutorial(): void {
        this.currentPanel = 0
        this.displayPanel()
        this.openModal()
    }
}
