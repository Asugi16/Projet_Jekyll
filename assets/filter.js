const urlParams = new URLSearchParams(window.location.search);
const search = urlParams.get('search');

function isRelevant(elt){
    return hasCategory(elt) || hasTags(elt) || hasTitle(elt) || hasAuthor(elt);
}
function hasCategory(elt){
    return elt.categorie == search;
}
function hasTags(elt){
    return (elt.tags || []).indexOf(search) >= 0;
}
function hasTitle(elt){
    return elt.title.indexOf(search) >= 0;
}
function hasAuthor(elt){
    return elt.author == search;
}


// Récupération asynchrone des données json
fetch('/search.json')
    .then(res => res.json())
    .then((data) => {
        console.log(data)
        const allPosts = data.posts.concat(data.codes);
        const filtered = allPosts.filter(isRelevant);
        console.log(filtered)

        // Le reste du code va ici
        // ...

        
    })