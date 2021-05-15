// USING CALLBACKS / CALLBACK HELL

console.log("Before");

getUser(1, function (user) {
    console.log(user);
    getRepos(function (repos) {
        console.log(repos);
    });

});


console.log("After");


function getUser(id, callback) {
    setTimeout(() => {
        console.log("Reading from DB...");
        callback({ id: id, name: 'Adesh' });
    }, (2000))

}

function getRepos(callback) {
    const repos = ['repo1', 'repo2', 'repo3', 'repo4'];
    setTimeout(() => {
        callback(repos);
    }, (2000))
}


// USING PROMISES
console.log("Before");

const user = getUser(1);
user.then((result) => {
    console.log(result);


    const r = getRepos();
    r.then((result) => {
        console.log(result);
    }).catch((e) => {
        throw e;
    })
}).catch((e) => {
    throw e;
})


console.log("After");


function getUser(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Reading from DB...");
            resolve({ id: id, name: 'Adesh' });
            reject('error');
        }, (2000))
    });
}

function getRepos() {

    return new Promise((resolve, reject) => {
        const repos = ['repo1', 'repo2', 'repo3', 'repo4'];
        setTimeout(() => {
            console.log("Reading repositories ...");
            resolve(repos);
            reject('error');
        }, (2000))

    });
}

/* Promise ALL, combine multiple promises, theu get executed one after the other,
if even 1 promise fails, all fails */

const p1= new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log("Reading from DB...");
        resolve({ id: 1, name: 'Adesh' });

    }, (2000))
});


const p2= new Promise((resolve, reject) => {
    const repos = ['repo1', 'repo2', 'repo3', 'repo4'];
    setTimeout(() => {
        console.log("Reading repositories ...");
        resolve(repos);

    }, (2000))

});


Promise.all([p1,p2])
.then(result=>console.log(result));

/* shows the result of only the first promise succcessfully executed. */
Promise.race([p1, p2])
    .then(result => console.log(result));





// USING async/await



const user = getUser(1);
user.then((result) => {
    console.log(result);


    const r = getRepos();
    r.then((result) => {
        console.log(result);
    }).catch((e) => {
        throw e;
    })
}).catch((e) => {
    throw e;
})
console.log("Before");
async function getAll() {

    const a1 = await getUser(1);
    console.log(a1);
    const a2 = await getRepos();

    console.log(a2);
}

getAll();

console.log("After");


function getUser(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Reading from DB...");
            resolve({ id: id, name: 'Adesh' });
            reject('error');
        }, (2000))
    });
}

function getRepos() {

    return new Promise((resolve, reject) => {
        const repos = ['repo1', 'repo2', 'repo3', 'repo4'];
        setTimeout(() => {
            console.log("Reading repositories ...");
            resolve(repos);
            reject('error');
        }, (2000))
    });
}