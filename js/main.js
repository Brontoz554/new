let host = 'http://noroff.beget.tech/api/';

let f = async (url, method = 'get', data = null, useToken = true, formdata = false) => {
    method = method.toUpperCase();

    let options = {method: method, headers: {}};

    if (useToken) {
        options.headers['Authorization'] = `Bearer ${app.user.token}`;
    }
    if (formdata) {
        var formData = new FormData();
        for (var name in data) {
            formData.append(name, data[name]);
        }
        options.body = formData;
    } else {
        if (['POST', 'PUT', 'PATCH'].includes(method)) {
            if (data) {
                options.body = JSON.stringify(data);
            }
        }
    }

    const res = await fetch(host + url, options);

    if (method == 'DELETE') {
        return true;
    } else {
        return await res.json();
    }
};

let app = new Vue({
    el: '#app',
    data: {
        window: 'registerOVZ',
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
            additional_phone: '',
            invalid_certificate: [],
            disease: '',
            photo_user: [],
            criminal_record: [],
            drug_certificate: [],
            passport: [],
            self_passport: [],
            token: null,
            coins: '',


        },
        cities: [],
        allDisease: [],
        errors: [],
        loginErrors: [],
        tasks: {},
        dis: {},
    },
    methods: {
        async SignUp() {
            let result = await f('v_signup', 'post', this.user, false, true);
            if (result.id) {
                this.window = 'auth';
            } else {
                this.errors = result;
            }
        },

        async SignUpOVZ() {
            let result = await f('ovz_signup', 'post', this.user, false, true);
            if (result.id) {
                this.window = 'auth';
            } else {
                this.errors = result;
            }
        },

        async Login() {
            let result = await f('signin', 'post', this.user, false, true);
            if (result.token) {
                this.user.token = result.token;
                localStorage.setItem('token',this.user.token);
                this.window = 'main';
                this.getAllTasks();
            } else {
                this.loginErrors = result;
            }
        },

        async logout() {
            let result = await f('logout', 'post', null, true, false);
            localStorage.removeItem('token');
            this.user.token = null;
            this.window = 'auth';
        },


        async getCities() {

            let res = await f('cities', 'get', null, false);
            this.cities = res;
        },

        async getAllDisease() {
            this.allDisease = await f('disease', 'get', null, false);

        },

        async getAllTasks() {
            this.tasks = await f('tasks', 'get', null, true);
            console.log(this.tasks);

        },

        uploadPassport(event) {
            this.user.passport = event.target.files[0];
        },
        uploadCriminalRecord(event) {
            this.user.criminal_record = event.target.files[0];
        },

        uploadDrugCertificate(event) {
            this.user.drug_certificate = event.target.files[0];
        },

        uploadSelfPassport(event) {
            this.user.self_passport = event.target.files[0];
        },

        uploadPhotoUser(event) {
            this.user.photo_user = event.target.files[0];

        },

        uploadInvalidCertificate(event) {
            this.user.invalid_certificate = event.target.files[0];
        },

        setEdit() {
            this.edit = 'Редактирование';
            this.home = '';
            this.activeQuests = '';
            this.page = 'Edit';
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

        async getAll(){
            this.user.token = localStorage.getItem('token') || null;
            if(this.user.token){
                this.window = 'main';
            }
            this.getAllTasks();
            this.getAllDisease();
            this.getCities();
        }
    },
});
app.getAll();
