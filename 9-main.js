const AppUi = {

    //#region ControlTab
    controlSwitch() {
        const btns = document.querySelectorAll(El.App.NavigationButtonClass);
        const contents = document.querySelectorAll(El.App.NavigationSectionClass);

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const selected = btn.dataset[El.App.DataAttribute];
                contents.forEach(c => c.classList.toggle('hidden', c.id !== selected));
            });
        });
        if (btns.length > 0) {
            btns[0].classList.add('active');
            contents.forEach((c, idx) => c.classList.toggle('hidden', idx !== 0));
        }
    },

    renderFullPage() {
        MealUI.renderStatus();
        MealUI.renderList();
        FoodUI.renderList();
        WorkoutUI.renderStatus();
        WorkoutUI.renderList();
        ExerciseUI.renderList();
        BodyUI.renderStatus();
        BodyUI.renderInfor();
        BodyUI.renderListOfWeight();
    },

    listen() {

        //#region Export Json
        El.App.ButtonExport.addEventListener('click', () => {
            const stringData = dataTemp.exportJsonString();
            const blob = new Blob([stringData], { type: "application/json"});
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'super-simple-fitness.json';
            a.click();

            URL.revokeObjectURL(url);
        });

        //#region Import Json
        El.App.ButtonImport.addEventListener('click', () => {
            El.App.FileImport.click();
            El.App.FileImport.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = async (event) => {
                    try {
                        const newData = JSON.parse(event.target.result);
                        dataTemp.import(newData);
                        console.log(dataTemp);
                        this.renderFullPage();
                    } catch (err) {
                        alert("Wrong File");
                    }
                };
                reader.readAsText(file);
            });
        });

        //#region Clear Data
        El.App.ButtonClear.addEventListener('click', () => {
            dataTemp.clear();
            this.renderFullPage();
        });
    }
}

//#region DOM
document.addEventListener("DOMContentLoaded", () => {
    AppUi.controlSwitch();
    AppUi.listen();
})