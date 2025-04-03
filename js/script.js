const url = "https://jsonplaceholder.typicode.com/posts";

const loading = document.querySelector("#loading-container");
const postsContainer = document.querySelector("#postsContainer");

const postPage = document.querySelector("#post");
const postContainer = document.querySelector("#post-container");
const commentsContainer = document.querySelector("#comments-container");

const comentForm = document.querySelector("#comment-form");
const emailInput  = document.querySelector("#email");
const bodyInput = document.querySelector("#body");

//Pegar o id pega url
const urlSearchParams = new URLSearchParams(window.location.search);
const postId = urlSearchParams.get("id")

async function getAllPosts() {
    const response = await fetch(url);
    const data = await response.json()

    setTimeout(function() {
        loading.classList.add("hide");

        data.map((post) => {
            const div = document.createElement("div")
            const title = document.createElement("h1")
            const body = document.createElement("p")
            const link = document.createElement("a")
    
            title.innerText = post.title
            body.innerText = post.body
            link.innerText = "Ler"
            link.setAttribute("href", `/post.html?id=${post.id}`);
    
            div.appendChild(title);
            div.appendChild(body);
            div.appendChild(link);
    
            postsContainer.appendChild(div);
        });
    }, 200)
}

async function getPost(id) {
    const [responsePost, responseComments] = await Promise.all([
        fetch(`${url}/${id}`),
        fetch(`${url}/${id}/comments`),
    ]);

    const dataPost = await responsePost.json();
    const dataComments = await responseComments.json();
    

    setTimeout(() => {
        loading.classList.add("hide");
        postPage.classList.remove("hide");
    
        const title = document.createElement("h1");
        const body = document.createElement("p");
    
        title.innerText = dataPost.title;
        body.innerText = dataPost.body;
    
        postContainer.appendChild(title);
        postContainer.appendChild(body);
    
        dataComments.map((comment) => {
            createComment(comment);
        });
    }, 800)

}

async function createComment(comment) {
    const div = document.createElement("div");
    const email = document.createElement("h3");
    const commentBody = document.createElement("p");

    email.innerText = comment.email
    commentBody.innerText = comment.body

    div.appendChild(email);
    div.appendChild(commentBody);
    commentsContainer.appendChild(div)
}

async function postComment(comment) {
    const response = await fetch(url, {
        method: "POST",
        body: comment,
        headers: {
            "content-type": "application/json"
        }
    });

    const data = await response.json();

    createComment(data)
}

if(!postId) {
    getAllPosts();
} else {
    getPost(postId);

    if (comentForm) {
        comentForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const comment = {
                email: emailInput.value,
                body: bodyInput.value,
            };

            postComment(comment);
        });
    }
}
