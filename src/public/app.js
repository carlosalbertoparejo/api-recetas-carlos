console.log("Frontend cargado");
const API_URL = "http://localhost:3000/recipes";
const container = document.getElementById("recipes-container");
const formContainer = document.getElementById("form-container");

async function loadRecipes() {
    const res = await fetch(API_URL);
    const recipes = await res.json();
    container.innerHTML = "";

    recipes.forEach(r => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
        <h3>    ${r.nombre}</h3>
        <p>${r.descripcion}</p>
        <p>${r.ingredientes}</p>
        <p>${r.tiempo_min} minutos</p>
        <p>${r.dificultad}</p>
        `;
        container.appendChild(card);
    });
}

function showCreateForm() {
    formContainer.innerHTML = `
    <form id="recipe-form">
        <input id="nombre" placeholder="Título" required>
        <input id="descripcion" placeholder="Descripción">
        <input id="ingredientes" placeholder="Ingredientes">

        <label for="tiempo_min">Tiempo (minutos): 
            <span id="tiempo_valor">5</span>
        </label>
        <input 
            type="range" 
            id="tiempo_min" 
            min="5" 
            max="90" 
            step="5" 
            value="5"
        >

        <select id="dificultad" required>
            <option value="">Selecciona dificultad</option>
            <option value="facil">Fácil</option>
            <option value="media">Media</option>
            <option value="dificil">Difícil</option>
        </select>

        <button type="submit">Subir receta</button>
    </form>
    `;

    const slider = document.getElementById("tiempo_min");
    const label = document.getElementById("tiempo_valor");

    label.textContent = slider.value;

    slider.oninput = () => {
        label.textContent = slider.value;
    };

    const form = document.getElementById("recipe-form");

    form.onsubmit = async (e) => {
        e.preventDefault();

        const newRecipe = {
            nombre: document.getElementById("nombre").value,
            descripcion: document.getElementById("descripcion").value,
            ingredientes: document.getElementById("ingredientes").value,
            tiempo_min: parseInt(slider.value),
            dificultad: document.getElementById("dificultad").value
        };

        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newRecipe)
        });

        loadRecipes();
        formContainer.innerHTML = "";
    };
}

