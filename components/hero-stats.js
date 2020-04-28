// Copyright Henrik Skov Midtiby 2019.
import { LitElement, html } from '../node_modules/lit-element/lit-element.js';

class HeroStats extends LitElement {
  render() {
    return html`
    <div id="container">
      <h1>${this.hero_name}</h1>
      <img class="hero" src="${this.image_src}" />
      <div>
        <div class="slidecontainer">
          <span id="stamina_value">0</span>
          <img id="stat_img" src="https://vignette.wikia.nocookie.net/descent2e/images/b/b4/Fatigue.png/revision/latest/scale-to-width-down/10?cb=20121016005054" />
          <input class="vranger" type="range" min="0" max="${this.max_stamina}" value="${this.stamina}" id="stamina_slider" />
          <input class="max_value" type="number" id="max_stamina" min="1" max="7" value="${this.max_stamina}"/>
          <p id="stamina_increase">inc</p>
          <p id="stamina_decrease">dec</p>
        </div>
        <div class="slidecontainer">
          <span id="wounds_value">0</span>
          <img id="stat_img" src="https://vignette.wikia.nocookie.net/descent2e/images/d/d9/Heart.png/revision/latest/scale-to-width-down/15?cb=20121016005115" />
          <input class="vranger" type="range" min="0" max="${this.max_wounds}" value="${this.wounds}" id="wounds_slider" />
          <input class="max_value" type="number" id="max_wounds" min="1" max="30" value="${this.max_wounds}"/>
          <p id="wounds_increase">inc</p>
          <p id="wounds_decrease">dec</p>
        </div>
      </div>
    </div>

    <style>
      #container { 
        position: relative; 
        display: inline-block;
        width: 180px;
      }
      #stat_img { 
        width: 10px;
        height: 10px;
      }
      #container img.hero {
        height: 150px;
      }
      .slidecontainer { 
        display: inline-block;
        position: relative;
        width: 50px; 
        height: 360px; 
      }
      div.slidecontainer p {
        margin-top: 5px;
        margin-bottom: 5px;
        margin-left: 10px;
        font-size: 120%;
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
    this.stamina_increase = this.shadowRoot.querySelector("#stamina_increase");
    this.stamina_decrease = this.shadowRoot.querySelector("#stamina_decrease");
    this.wounds_increase = this.shadowRoot.querySelector("#wounds_increase");
    this.wounds_decrease = this.shadowRoot.querySelector("#wounds_decrease");

    this.wounds_slider.addEventListener("change", () => {this.wounds_slider_changed()}, false);
    this.stamina_slider.addEventListener("change", () => {this.stamina_slider_changed()}, false);
    this.stamina_increase.addEventListener("click", () => {this.stamina_increase_callback()}, false);
    this.stamina_decrease.addEventListener("click", () => {this.stamina_decrease_callback()}, false);
    this.wounds_increase.addEventListener("click", () => {this.wounds_increase_callback()}, false);
    this.wounds_decrease.addEventListener("click", () => {this.wounds_decrease_callback()}, false);
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
    var temp_stamina = parseInt(new_stamina);
    if(temp_stamina != this.stamina)
    {
      this.emit_change_in_value_detected("stamina", this.stamina, temp_stamina);
    }
    this.stamina = temp_stamina;
    this.stamina_slider.value = this.stamina;
    this.stamina_value.innerHTML = this.stamina;
  }

  set_wounds(new_wounds) {
    var temp_wounds = parseInt(new_wounds);
    if(temp_wounds != this.wounds)
    {
      this.emit_change_in_value_detected("wounds", this.wounds, temp_wounds);
    }
    this.wounds = temp_wounds;
    this.wounds_slider.value = this.wounds;
    this.wounds_value.innerHTML = this.wounds;
  }

  stamina_increase_callback() {
    this.set_stamina(this.stamina + 1);
    this.emit_state_changed();
  }

  stamina_decrease_callback() {
    this.set_stamina(this.stamina - 1);
    this.emit_state_changed();
  }

  wounds_increase_callback() {
    this.set_wounds(this.wounds + 1);
    this.emit_state_changed();
  }

  wounds_decrease_callback() {
    this.set_wounds(this.wounds - 1);
    this.emit_state_changed();
  }

  stamina_slider_changed() {
    this.set_stamina(this.stamina_slider.value);
    this.emit_state_changed();
  }

  wounds_slider_changed() {
    this.set_wounds(this.wounds_slider.value);
    this.emit_state_changed();
  }

  emit_change_in_value_detected(stat, old_value, new_value) {
    const value_change_detected = {
      hero_id: this.id,
      stat: stat, 
      old_value: old_value, 
      new_value: new_value 
    };
    let event = new CustomEvent('change_in_value_detected', {
      detail: value_change_detected
    });
    this.dispatchEvent(event);
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

