function createCourse(depid,designation){
    axios.post(`/administration/depart/${depid}/add`,{
        designation:designation
    })
    .then(() => window.location.assign('/administration/departs'))
    .catch(error => console.log(error));
}