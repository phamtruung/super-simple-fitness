const El = Object.freeze({
    App: {
        NavigationButtonClass: '.nav-btn',
        NavigationSectionClass: '.nav-sec',
        DataAttribute: 'nav',
        ButtonExport: document.getElementById('export-json'),
        ButtonImport: document.getElementById('import-json'),
        FileImport: document.getElementById('import-file-json'),
        ButtonClear: document.getElementById('clear-data'),
    },

    //#region Element Meal
    Meal: {
        Status: document.getElementById('meal-status'),
        ButtonAdd: document.getElementById('meal-button-add'),
        InputDate: document.getElementById('meal-input-date'),
        List: document.getElementById('meals-list'),

        Modal: document.getElementById('meal-modal'),
        ModalSearchFoods: document.getElementById('modal-search-foods'),
        InputFoodSearch: document.getElementById('meal-input-food-search'),
        InputId: document.getElementById('meal-input-id'),
        InputCategory: document.getElementById('meal-input-category'),
        InputFood: document.getElementById('meal-input-food'),
        InputAmount: document.getElementById('meal-input-amout'),
        ModalMarco: document.getElementById('meal-modal-marco'),
        ModalCancel: document.getElementById('meal-modal-cancel'),
        ModalDelete: document.getElementById('meal-modal-delete'),
        ModalUpdate: document.getElementById('meal-modal-update'),
        ModalTake: document.getElementById('meal-modal-take'),
    },

    //#region Element Food
    Food: {
        ButtonAdd: document.getElementById('food-button-add'),
        NumberFoods: document.getElementById('number-of-foods'),
        ButtonCategory: document.getElementById('food-button-category'),
        List: document.getElementById('foods-list'),

        Modal: document.getElementById('food-modal'),
        InputId: document.getElementById('food-input-id'),
        InputCategory: document.getElementById('food-input-category'),
        InputName: document.getElementById('food-input-name'),
        InputAmount: document.getElementById('food-input-amout'),
        InputUnit: document.getElementById('food-input-unit'),
        InputProtein: document.getElementById('food-input-protein'),
        InputCarb: document.getElementById('food-input-carb'),
        InputFat: document.getElementById('food-input-fat'),
        InputFiber: document.getElementById('food-input-fiber'),
        ShowKcal: document.getElementById('food-modal-kcal'),
        ModalCancel: document.getElementById('food-modal-cancel'),
        ModalDelete: document.getElementById('food-modal-delete'),
        ModalUpdate: document.getElementById('food-modal-update'),
        ModalAdd: document.getElementById('food-modal-add'),

        CategoryModal: document.getElementById('food-category-modal'),
        CategoryInputName: document.getElementById('category-input-name'),
        CategoryModalAdd: document.getElementById('category-modal-add'),
        CategoryModalList: document.getElementById('category-modal-list'),
        CategoryModalClose: document.getElementById('category-modal-close'),
    },

    //#region Element Workout
    Workout: {
        Status: document.getElementById('workout-status'),
        ButtonAdd: document.getElementById('workout-button-add'),
        InputDate: document.getElementById('workout-input-date'),
        List: document.getElementById('workouts-list'),

        Modal: document.getElementById('workout-modal'),
        ModalSearchExercises: document.getElementById('modal-search-exercises'),
        InputExerciseSearch: document.getElementById('workout-input-exercise-search'),
        InputId: document.getElementById('workout-input-id'),
        InputCategory: document.getElementById('workout-input-category'),
        InputExercise: document.getElementById('workout-input-exercise'),
        InputDuration: document.getElementById('workout-input-duration'),

        ButtonAddSet: document.getElementById('workout-modal-add-set'),
        SetsList: document.getElementById('workout-modal-sets-list'),

        ModalCancel: document.getElementById('workout-modal-cancel'),
        ModalDelete: document.getElementById('workout-modal-delete'),
        ModalUpdate: document.getElementById('workout-modal-update'),
        ModalAction: document.getElementById('workout-modal-action'),
    },

    //#region Element Exercise
    Exercise: {
        ButtonAdd: document.getElementById('exercise-button-add'),
        NumberExercises: document.getElementById('number-of-exercises'),
        ButtonCategory: document.getElementById('exercise-button-category'),
        List: document.getElementById('exercises-list'),

        Modal: document.getElementById('exercise-modal'),
        InputId: document.getElementById('exercise-input-id'),
        InputCategory: document.getElementById('exercise-input-category'),
        InputName: document.getElementById('exercise-input-name'),
        InputKcalPerHour: document.getElementById('exercise-input-kcalPerHour'),
        ModalCancel: document.getElementById('exercise-modal-cancel'),
        ModalDelete: document.getElementById('exercise-modal-delete'),
        ModalUpdate: document.getElementById('exercise-modal-update'),
        ModalAdd: document.getElementById('exercise-modal-add'),

        CategoryModal: document.getElementById('exercise-category-modal'),
        CategoryInputName: document.getElementById('exercise-category-input-name'),
        CategoryModalAdd: document.getElementById('exercise-category-modal-add'),
        CategoryModalList: document.getElementById('exercise-category-modal-list'),
        CategoryModalClose: document.getElementById('exercise-category-modal-close'),
    },

    //#region Body
    Body: {
        Status: document.getElementById('body-status'),
        InforList: document.getElementById('infor-list'),
        InputGender: document.getElementById('body-input-gender'),
        InputBirth: document.getElementById('body-input-birth'),
        InputHeight: document.getElementById('body-input-height'),
        InputWeight: document.getElementById('body-input-weight'),
        InputTargetWeight: document.getElementById('body-input-target-weight'),
        InputTargetWorkout: document.getElementById('body-input-target-workout'),
        WeightList: document.getElementById('weight-list'),
    },

    //#region Chart
    Chart: {
        KcalInputWeek: document.getElementById('chart-kcal-input-week'),
        KcalChart: document.getElementById('chart-kcal'),
        TargetKcal: document.getElementById('chart-kcal-target'),
        WeightInputYear: document.getElementById('chart-weight-input-year'),
        WeightChart: document.getElementById('chart-weight'),
        TargerWeight: document.getElementById('chart-weight-target'),
    }
});


const UI = {
    calcPercent(protein, carb, fat) {
        // Calc
        const kcal = protein * 4 + carb * 4 + fat * 9;
        const proteinPercent = protein * 4 * 100 / kcal;
        const carbPercent = carb * 4 * 100 / kcal;
        const fatPercent = fat * 9 * 100 / kcal;

        return { proteinPercent, carbPercent, fatPercent };
    },
    RatioBarMacro(protein, carb, fat) {
        // Calc
        const { proteinPercent, carbPercent, fatPercent } = this.calcPercent(protein, carb, fat);
        const elDiv = document.createElement('div');

        // Div
        elDiv.className = 'ratio-bar';

        // Protein
        const elSpanProtein = document.createElement('span');
        elSpanProtein.className = 'protein';
        elSpanProtein.style.width = `${proteinPercent}%`;
        elDiv.appendChild(elSpanProtein);

        // Carb
        const elSpanCarb = document.createElement('span');
        elSpanCarb.className = 'carb';
        elSpanCarb.style.left = `${proteinPercent}%`;
        elSpanCarb.style.width = `${carbPercent}%`;
        elDiv.appendChild(elSpanCarb);

        // Fat
        const elSpanFat = document.createElement('span');
        elSpanFat.className = 'fat';
        elSpanFat.style.left = `${proteinPercent + carbPercent}%`;
        elSpanFat.style.width = `${fatPercent}%`;
        elDiv.appendChild(elSpanFat);

        return elDiv;
    },
    ProgressBar(className, label, percent) {
        // Div
        const elDiv = document.createElement('div');
        elDiv.className = 'flex-row';

        // Text
        const elText = document.createElement('p');
        elText.className = 'label';
        elText.textContent = label;
        elDiv.appendChild(elText);

        // Progress
        const elProgess = document.createElement('progress');
        elProgess.className = className;
        elProgess.value = percent || 0;
        elProgess.max = 100;
        elDiv.appendChild(elProgess);

        return elDiv;
    },
    Label(labelText, contentText) {
        // Div
        const elDiv = document.createElement('div');
        elDiv.className = 'flex-row';
        
        // Label
        const elLabel = document.createElement('p');
        elLabel.className = 'label';
        elLabel.textContent = labelText;
        elDiv.appendChild(elLabel);

        // Content
        const elContent = document.createElement('p');
        elContent.textContent = contentText;
        elDiv.appendChild(elContent);

        return elDiv;
    },
    MacroStatus(mealInfo) {

        // Div
        const elDiv = document.createElement('div');
        elDiv.className = 'flex-col';

        // Div Unit
        const elUnitValue = this.Label(`${mealInfo.amount} ${mealInfo.unit}:`, `${mealInfo.kcal}kcal`);
        elDiv.appendChild(elUnitValue);

        // Div Protein
        const elProtein = this.ProgressBar('progress-protein', `${mealInfo.protein}g protein`, mealInfo.proteinPercent);
        elDiv.appendChild(elProtein);

        // Div Carb
        const elCarb = this.ProgressBar('progress-carb', `${mealInfo.carb}g carb`, mealInfo.carbPercent);
        elDiv.appendChild(elCarb);

        // Div Carb
        const elFat = this.ProgressBar('progress-fat', `${mealInfo.fat}g fat`, mealInfo.fatPercent);
        elDiv.appendChild(elFat);

        // Div Fiber
        const elFiber = this.Label(`${mealInfo.fiber}g fiber`)
        elDiv.appendChild(elFiber);

        return elDiv
    }
}