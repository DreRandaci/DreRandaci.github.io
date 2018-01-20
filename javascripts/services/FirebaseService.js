'use strict';

app.service("FirebaseService", function ($http, $q, FIREBASE_CONFIG) {

    const getAllProjects = () => {
        let projects = [];
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE_CONFIG.databaseURL}/projects.json`).then((results) => {
                let fbProjects = results.data;
                if (fbProjects) {
                    Object.keys(fbProjects).forEach((key) => {
                        fbProjects[key].id = key;
                        projects.push(fbProjects[key]);
                    });
                }
                resolve(projects);
            }).catch((err) => {
                console.log('error in getAllProjects:', err);
            });
        });
    };

    return { getAllProjects };
});