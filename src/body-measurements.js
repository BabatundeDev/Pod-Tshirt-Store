import { LitElement, html, css } from "lit";
import "./tshirt-viewer.js";

class BodyMeasurements extends LitElement {
  static styles = css`
    :host {
      display: block;
      max-width: 400px;
      margin: 20px auto;
      padding: 20px;
      border: 2px solid #ccc;
      border-radius: 10px;
      font-family: Arial, sans-serif;
      background: #f9f9f9;
    }
    label {
      display: block;
      margin-top: 10px;
      font-weight: bold;
    }
    input,
    select {
      width: 100%;
      padding: 8px;
      margin-top: 5px;
      box-sizing: border-box;
      font-size: 1rem;
      border: 1px solid #bbb;
      border-radius: 5px;
    }
    input[type="file"] {
      margin-top: 15px;
      padding: 3px;
    }
    textarea {
      width: 100%;
      height: 80px;
      margin-top: 5px;
      padding: 8px;
      font-size: 1rem;
      border: 1px solid #bbb;
      border-radius: 5px;
      resize: none;
    }
    label {
      font-size: 1rem;
      color: #333;
    }

    .flat-preview {
      position: relative;
      background: #fff;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 8px;
      max-width: 350px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }

    .flat-preview .tshirt {
      width: 100%;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .flat-preview img {
      max-width: 100%;
      height: auto;
      object-fit: contain;
    }

    .flat-preview .overlay-text {
  position: absolute;
  top: 40%;
  left: 40%;
  transform: translate(-50%, -50%);
  text-align: center;
  padding: 0; /* Remove padding */
  margin: 0;
  font-weight: bold;
  font-size: 1.1rem;
  color: white !important; /* Enforce white */
  background: transparent !important; /* Remove background */
  word-break: break-word;
  max-width: 90%;
}

    .layout-container {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      justify-content: center;
      margin-top: 20px;
    }

    .layout-container.side-by-side {
      flex-direction: row;
    }

    @media (max-width: 768px) {
      .layout-container.side-by-side {
        flex-direction: column;
        align-items: center;
      }
    }
  `;

  static properties = {
    layout: { type: String },
    height: { type: Number },
    weight: { type: Number },
    build: { type: String },
    productType: { type: String },
    uploadedImage: { type: String },
    printText: { type: String },
  };

  constructor() {
    super();
    this.layout = "side-by-side"; // default layout
    this.height = 180; // default 180 cm
    this.weight = 80; // default 80 kg
    this.build = "athletic"; // default
    this.productType = "tshirt"; // default product
    this.uploadedImage = ""; // initially no image
    this.printText = "";
  }

  handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.uploadedImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  handlePrintTextChange(e) {
    const value = e.target.value;
    // Limit to 3 lines max
    const lines = value.split("\n").slice(0, 3).join("\n");
    this.printText = lines;
  }

  handleLayoutChange(e) {
    this.layout = e.target.value;
  }

  render() {
    return html`
      <label for="height">Height (cm)</label>
      <input
        id="height"
        type="number"
        .value=${this.height}
        @input=${(e) => (this.height = e.target.valueAsNumber)}
        min="100"
        max="250"
      />

      <label for="weight">Weight (kg)</label>
      <input
        id="weight"
        type="number"
        .value=${this.weight}
        @input=${(e) => (this.weight = e.target.valueAsNumber)}
        min="30"
        max="200"
      />

      <label for="build">Build</label>
      <select
        id="build"
        .value=${this.build}
        @change=${(e) => (this.build = e.target.value)}
      >
        <option value="lean">Lean</option>
        <option value="reg">Reg</option>
        <option value="athletic">Athletic</option>
        <option value="big">Big</option>
      </select>

      <label for="product">Product Type</label>
      <select
        id="product"
        .value=${this.productType ?? "tshirt"}
        @change=${(e) => (this.productType = e.target.value)}
      >
        <option value="tshirt">T-shirt</option>
        <option value="hoodie">Hoodie</option>
        <option value="sleevie">Sleeve</option>
        <option value="cap">Cap</option>
      </select>

      <label for="upload">Upload Image to Print</label>
      <input
        id="upload"
        type="file"
        accept="image/*"
        @change=${this.handleImageUpload}
      />

      <label for="print-text">Print Text (max 3 lines)</label>
      <textarea
        id="print-text"
        .value=${this.printText}
        @input=${this.handlePrintTextChange}
        placeholder="Type your print text here..."
      ></textarea>

      <label for="layout">Select Layout:</label>
      <select id="layout" @change=${this.handleLayoutChange}>
        <option value="3d" ?selected=${this.layout === "3d"}>
          3D View Only
        </option>
        <option value="preview" ?selected=${this.layout === "preview"}>
          Preview Only
        </option>
        <option
          value="side-by-side"
          ?selected=${this.layout === "side-by-side"}
        >
          Side-by-Side
        </option>
      </select>

      <div class="layout-container ${this.layout}">
        ${this.layout === "3d" || this.layout === "side-by-side"
        ? html`
              <tshirt-viewer
                .imageUrl=${this.uploadedImage}
                .printText=${this.printText}
                .productType=${this.productType}
                .height=${this.height}
                .weight=${this.weight}
                .build=${this.build}
              ></tshirt-viewer>
            `
        : ""}
        ${this.layout === "preview" || this.layout === "side-by-side"
        ? html`
              <div class="flat-preview">
                <div class="tshirt">
                  ${this.uploadedImage
            ? html`<img
                        src="${this.uploadedImage}"
                        alt="Uploaded Image"
                      />`
            : html`<p>No image selected</p>`}
                  <div class="overlay-text">${this.printText}</div>
                </div>
              </div>
            `
        : ""}
      </div>

      <p>Selected product: ${this.productType ?? "tshirt"}</p>
    `;
  }
}

customElements.define("body-measurements", BodyMeasurements);
