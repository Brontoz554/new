let host = 'http://noroff.beget.tech/api/';

let f = async(url, method = 'get', data = null, useToken = true, formdata = false) =>{
    method = method.toUpperCase();

    let options = {method:method, headers : {}};

    if(useToken){
        options.headers['Authorization'] = `Bearer ${app.auth_user.token}`;
    }
    if(formdata){
        var formData = new FormData();
        for (var name in data){
            formData.append(name, data[name] );
        }
        options.body = formData;
    } else {
        if(['POST', 'PUT', 'PATCH'].includes(method)){
            options.body = JSON.stringify(data);
        }
    }

    const res = await fetch(host + url, options);

    if(method == 'DELETE') {
        return true;
    } else {
        return await res.json();
    }
};

let app = new Vue({
    el: '#app',
    data: {
        window: 'registerVolunteer',
        home: '',
        edit: '',
        activeQuests: '',
        page: '',
        user: {
            name: '',
            login: '',
            password: '',
            phone: '',
            address: '',
            photo_user: [],
            criminal_record: [],
            drug_certificate: [],
            passport: [],
            self_passport: [],
            coins: '',
        },
        cities:[],
        errors:[],
    },
    methods: {
        async Auth() { //Авторизация
            let result = await f('v_signup', 'post', this.user, false,true);
            if(result.id){
                this.window = 'main';
            } else {
                this.errors = result;
            }
        },
        uploadPassport(event){
            this.user.passport = event.target.files[0];
        },
        uploadCriminalRecord(event){
            this.user.criminal_record = event.target.files[0];
        },

        uploadDrugCertificate(event){
            this.user.drug_certificate = event.target.files[0];
        },

        uploadSelfPassport(event){
            this.user.self_passport = event.target.files[0];
        },

        uploadPhotoUser(event){
            this.user.photo_user = event.target.files[0];

        },

        setEdit() {
            this.edit = 'Редактирование';
            this.home = '';
            this.activeQuests = '';
            this.page = 'Edit';
        },

        async getCities(){

            let res = await f('cities','get',null,false);
            this.cities = res;
        },
        setHome() {
            this.home = 'Главная';
            this.edit = '';
            this.activeQuests = '';
            this.page = 'Home';
        },

        setActiveQuests() {
            this.activeQuests = 'Ваши задания';
            this.edit = '';
            this.home = '';
            this.page = 'ActiveQuests';
        },
        logout() {
            this.window = 'auth';
        },


    },
});
app.getCities();