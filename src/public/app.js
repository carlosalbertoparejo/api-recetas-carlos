console.log("Frontend cargado");
const API_URL = "http://localhost:3000/recipes";
const container = document.getElementById("recipes-container");
const formContainer = document.getElementById("form-container")

async function loadRecipes() {
    const res = await fetch(API_URL);
    const recipes = await res.json();
    container.innerHTML = "";

    recipes.forEach(r => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
        <h3>${r.nombre}</h3>
        <p>${r.descripcion}</p>
        <p>${r.ingredientes}</p>
        <p>${r.tiempo_min}</p>
        <p>${r.dificultad}</p>
        `;
        container.appendChild(card);
    });
}
