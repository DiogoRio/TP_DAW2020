function deleteRes(id){
    console.log('OLA')
    axios.delete('/resources/delete/' + id)
        .then(response => window.location.assign('/myaccount'))
        .catch(error => console.log(error));
}