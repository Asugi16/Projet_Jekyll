/** constante qui prend comme valeur la fonction URLSearchParams (fonction de JS permettant de récupérer l'URL d'une page),
 * elle contient les paramètres de recherche de l'url fournie, au format JS.
 * ex: Pour une url: http://monsite.com/page.html?key=value&search=css
 *  urlParams.get('key') => value
 *  urlParams.get('search') => css
 *  */ 
const urlParams = new URLSearchParams(window.location.search);
/** search est la variable qui représente le terme actuellement recherché. On le récupère depuis la valeur de urlParams */
let search;

/** 
 * Fonctions:  
 * */

/** isRelevant prend elt en paramètre et return le résultat des fonction hasTags, hasTitle, hasAuthor,hasCategory */
function isRelevant(elt){
    return hasCategory(elt) || hasTags(elt) || hasTitle(elt) || hasAuthor(elt);
}

/**
 * Retourne si oui ou non l'élément fourni a la catégorie recherchée (variable globale search)
 * @param {Object} elt 
 * @return {boolean} True si elt a la catégorie demandée
 */
function hasCategory(elt){
    /** "elt" est un argument qui prend un paramètre de comparaison comme par exemple "elt.tags ou elt.title" et il le compare a search avant de returner un résultat*/
    return elt.categorie == search;
}

/**
 * Retourne si oui ou non l'élément fourni a le tag recherché parmi sa liste de tags (variable globale search)
 * @param {Object} elt 
 * @return {boolean} True si elt a le tag demandé
 */
function hasTags(elt){
    /** ici indexOf permet de faire une boucle sur les éléments d'un tableau et de comparer chaque élément avec "search" via l'index de ce tableau*/
    return (elt.tags || []).indexOf(search) >= 0;
}
function hasTitle(elt){
    return elt.title.indexOf(search) >= 0;
}
function hasAuthor(elt){
    return elt.author == search;
}

/**
 * Génère le code html représentant la liste des éléments à afficher dans notre document, à partir de données fournies
 * @param {Array} data Le tableau des données à afficher
 * @returns {string} Le code html généré pour les données fournies
 */
function generateHtml(data){
    // html sera notre variable de stockage, et représente l'ensemble du code html généré
    let html = "";
    
    // On commence par mettre en place un titre, reprenant le terme de recherche
    html += `<h1>Recherche par : "${ search }"</h1><br/>`

    // Création de la liste
    for(let datum of data){
        // Pour chaque élément de la liste de nos données, on créé le code html correspondant
        html += ` 
        <div class="col-12 postlist alternative">
            <a href="${ datum.url }" class="url-title"><h2>${ datum.title }</h2></a>
            <p class="row ">
                <div class="col text-center">
                 <img class=" w-25 " src="${ datum.image }" alt="${ datum.title }"> 
                </div>
            </p>
            <br/>
            ${ datum.content }
            <br/>
            <div class="row">
                <div class="col author p-1 ">
                    ${ datum.author }
                </div>
                <div class="tag raw">`;
                    // Pour chaque tag, on créé un badge et un lien correspondant au tag en question
                    // post.tags étant un string, représentant possiblement plusieurs valeurs (plusieurs tags), séparées par des virgules,
                    // on utilise la fonction String.split() pour les transformer en un tableau de ces mêmes tags
                    // eg:
                    // "apple,banana,pineapple".split(',') => ["apple", "banana", "pineapple"]
                    // "helloworld".split("") => ["h", "e", "l", "l", ...]
                    for(let tag of datum.tags.split(',')){
                        // Constitution du code html pour un tag, ajout dans notre variable de stockage (html)
                        html += `  
                        <a class=" p-1 badge-secondary ${ tag == search ? "nav-active" : "" }" href="/Projet_Jekyll/tag.html?tag=${ tag }">
                            ${ tag }
                        </a>
                        `;
                    }
        // On n'oublie pas (ON PENSE À) de fermer toutes les divs "ouvertes"
        html += `</div>
            </div>
        </div>`;
    }

    // On finit par retourner le code html généré
    return html;
}

/**
 * Point d'entrée de notre système d'affichage dynamique
 * @param {"search"|"tag"} mode Mode de fonctionnement du système de "recherche": 
 *                              - search => recherche générale (catégorie, tags, titre, auteur)
 *                              - tag => recherche seulement par tag
 */
function generateResults(mode){
    // Récupération asynchrone des données json, en les demandant au serveur
    fetch('/Projet_Jekyll/search.json')
        // On parse ces données en utilisant le format JSON
        .then(res => res.json())
        // data représente l'ensemble de nos données telles que présentes dans le JSON téléchargé, au format JS
        .then((data) => {
            // On commence par réunir les deux tableaux de nos articles principaux (à savoir posts et codes) en un seul tableau
            const allPosts = data.posts.concat(data.codes);
            // On déclare la fonction qui sera utilisée pour filtrer ces articles, 
            // on associera sa valeur ensuite (en fonction du mode)
            let filterFunction;
            
            if(mode == "search"){
                filterFunction = isRelevant;
                search = urlParams.get('search');
            }else{
                filterFunction = hasTags;
                search = urlParams.get('tag');
            }
            // Le filtrage des articles est réellement réalisé ici
            // filtered est un nouveau tableau contenant uniquement les éléments de `allPosts`
            // gardés par notre fonction de filtrage
            const filtered = allPosts.filter(filterFunction);

            // On cible l'élément qui recevra notre html généré
            const $content = document.getElementById("dynamic-content");
            // Enfin, on génère le code html correspondant à nos données avec la fonction generateHtml
            // puis on assigne ce contenu à l'élément ciblé $content, ce qui met à jour la page.
            $content.innerHTML = generateHtml(filtered);
        })
}