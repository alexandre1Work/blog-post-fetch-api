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
            link.setAttribute("href", `post.html?id=${post.id}`);
    
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
    div.classList.add("comment-item");

    const leftCol = document.createElement("div");
    leftCol.classList.add("left-col");

    const email = document.createElement("h3");
    email.innerText = comment.email;

    const commentBody = document.createElement("p");
    commentBody.innerText = comment.body;

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Deletar";
    deleteBtn.classList.add("btnDelete");

    deleteBtn.addEventListener("click", () => {
        deleteComment(comment.id, div);
    });

    leftCol.appendChild(email);
    leftCol.appendChild(commentBody);

    div.appendChild(leftCol);
    div.appendChild(deleteBtn);

    commentsContainer.appendChild(div);
}

async function postComment(comment) {
    const response = await fetch(`${url}/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify(comment),
        headers: {
            "content-type": "application/json"
        }
    });

    const data = await response.json();

    createComment(data)
}

async function deleteComment(commentId, element) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/comments/${commentId}`, {
        method: "DELETE"
    })

    if (response.ok) {
        element.remove();
    } else {
        alert("Erro ao deletar comentário.");
    }
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
