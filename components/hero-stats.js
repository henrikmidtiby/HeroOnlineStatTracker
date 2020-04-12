// Copyright Henrik Skov Midtiby 2019.
import { LitElement, html } from '../node_modules/lit-element/lit-element.js';

class HeroStats extends LitElement {
  render() {
    return html`
    <div id="container">
      <h1>${this.hero_name}</h1>
      <img src="${this.image_src}" />
      <div>
        <div class="slidecontainer">
          <p id="stamina_value">0</p>
          <input class="vranger" type="range" min="0" max="${this.max_stamina}" value="${this.stamina}" id="stamina_slider" />
          <input class="max_value" type="number" id="max_stamina" min="1" max="7" value="${this.max_stamina}"/>
        </div>
        <div class="slidecontainer">
          <p id="wounds_value">0</p>
          <input class="vranger" type="range" min="0" max="${this.max_wounds}" value="${this.wounds}" id="wounds_slider" />
          <input class="max_value" type="number" id="max_wounds" min="1" max="30" value="${this.max_wounds}"/>
        </div>
      </div>
    </div>

    <style>
      #container { 
        position: relative; 
        display: inline-block;
        width: 200px;
      }
      #container img {
        height: 150px;
      }
      .slidecontainer { 
        display: inline-block;
        position: relative;
        width: 50px; 
        height: 280px; 
      }
      div.slidecontainer p {
        margin-top: 5px;
        margin-left: 20px;
      }
      .max_value {
        margin-top: 60px;
      }
      .vranger {
        margin-top: 50px;
        margin-left: -76px;
        width: 200px;
        height: 100px;
        transform: rotate(90deg);
        -moz-transform: rotate(90deg); /*do same for other browsers if required*/
      }
    </style>
    `;
  }

  static get properties() {
    return {
      id: {
        type: String
      },
      hero_name: {
        type: String
      },
      image_src: {
        type: String
      },
      max_stamina: {
        type: Number
      },
      max_wounds: {
        type: Number
      },
    };
  }

  constructor() {
    super();
    this.max_stamina = 4;
    this.stamina = 0;
    this.max_wounds = 16;
    this.wounds = 0;
    this.hero_name = "";
    this.image_src = "";
  }

  firstUpdated(changedParameters) {
    this.stamina_slider = this.shadowRoot.querySelector("#stamina_slider");
    this.stamina_value = this.shadowRoot.querySelector("#stamina_value");
    this.wounds_slider = this.shadowRoot.querySelector("#wounds_slider");
    this.wounds_value = this.shadowRoot.querySelector("#wounds_value");

    this.wounds_slider.addEventListener("change", () => {this.wounds_slider_changed()}, false);
    this.stamina_slider.addEventListener("change", () => {this.stamina_slider_changed()}, false);
  }

  event_handler(e) {
    console.log(e.bubbles);
  }

  debug(message) {
    let event = new CustomEvent('debug_message', {
      bubbles: true,
      detail: message
    });
    this.dispatchEvent(event);
  } // Dispatch an event, that should be caught by the main web app, 
  // which then forwards it to the socketio connection with the server.
  
  set_stamina(new_stamina) {
    this.stamina = parseInt(new_stamina);
    this.stamina_slider.value = this.stamina;
    this.stamina_value.innerHTML = this.stamina;
  }

  set_wounds(new_wounds) {
    this.wounds = parseInt(new_wounds);
    this.wounds_slider.value = this.wounds;
    this.wounds_value.innerHTML = this.wounds;
  }

  stamina_slider_changed() {
    console.log("Stamina was: ", this.stamina);
    this.set_stamina(this.stamina_slider.value);
    console.log("Stamina changed to: ", this.stamina);
    this.emit_state_changed();
  }

  wounds_slider_changed() {
    console.log("Wounds was: ", this.wounds);
    this.set_wounds(this.wounds_slider.value);
    console.log("Wounds changed to: ", this.wounds);
    this.emit_state_changed();
  }

  emit_state_changed() {
    const wounds_changed = {
      hero_id: this.id,
      stamina: this.stamina,
      wounds: this.wounds
    };
    let event = new CustomEvent('hero_state_changed', {
      detail: wounds_changed
    });
    this.dispatchEvent(event);
  }
}


customElements.define('hero-stats', HeroStats);

