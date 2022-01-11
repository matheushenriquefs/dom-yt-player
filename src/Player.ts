import classes from './player.module.css';
import styles from './player.module.css?inline';

type DefaultProps = {
    title: string,
    allow: string,
    allowFullscreen: string,
    ratio: string,
}

export default class Player extends HTMLElement {
    #default = <DefaultProps>{
        title: 'DOM Youtube Video Player',
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
        ratio: '16x9',
        allowFullscreen: '',
    }

    constructor() {
        super();
        this.bootstrap();
    }

    private async bootstrap(): Promise<void> {
        this.attachShadow({ mode: 'open' });

        const [ container, player, styles ] = await Promise.all([this.createContainer(), this.createPlayer(), this.createStyles()]);
        
        container.appendChild(player);
        this.shadowRoot?.appendChild(styles);
        this.shadowRoot?.appendChild(container);
    }

    private async createPlayer(): Promise<HTMLIFrameElement> {

        const src = this.getAttribute('data-src');

        if (!src) throw new Error('The data-src attribute is required.');

        const element = document.createElement('iframe');
        const id = new URL(src).searchParams.get('v');
        const title = this.getAttribute('data-title');
        const allow = this.getAttribute('data-allow');
        const ratio = this.getAttribute('data-ratio');
        const isFullscreen = this.getAttribute('data-is-fullscreen');

        element.setAttribute('frameborder', '0');
        element.setAttribute('src', `https://www.youtube.com/embed/${id}`);
        element.setAttribute('title',  title ? title : this.#default.title);
        element.setAttribute('allow',  allow ? allow : this.#default.allow);
        element.setAttribute('allowfullscreen',  isFullscreen ? isFullscreen : this.#default.allowFullscreen);

        element.classList.add(classes['player']);
        element.classList.add(classes[`ratio-${ratio ? ratio : this.#default.ratio}`]);

        return element;
    }

    private async createContainer(): Promise<HTMLElement> {
        const element = document.createElement('section');
        element.classList.add(classes['container']);

        return element;
    }

    private async createStyles(): Promise<HTMLStyleElement> {
        const element = document.createElement('style');
        element.textContent = styles;

        return element;
    }
}

customElements.define('dom-yt-player', Player);
