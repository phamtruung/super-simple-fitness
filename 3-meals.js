const MealUI = {

    //#region MealStatus
    renderStatus() {
        El.Meal.Status.innerHTML = '';

        // Input Meal Date
        if (!El.Meal.InputDate.value) {
            El.Meal.InputDate.value = Helper.dateToString(new Date());
        }

        // Get Macro Data By Date and Macro Target
        const macroByDate = dataTemp.getNutritionMacroByDate(El.Meal.InputDate.value);  
        const marcoTarget = dataTemp.getMacroTarget(El.Meal.InputDate.value);

        // Render Macro Status
        Object.keys(macroByDate).forEach(key => {
            // Calc
            const percent = parseInt(macroByDate[key]*100/marcoTarget[key])

            // Div Row Macro
            const elDivRow = document.createElement('div');
            elDivRow.className = 'flex-row';

            // Label
            const elLabel = UI.Label(key, `${macroByDate[key].toFixed(0)}/${marcoTarget[key]}`)
            elDivRow.appendChild(elLabel);

            // Macro
            const elProgess = UI.ProgressBar(`progress-${key}`, null, percent)
            elDivRow.appendChild(elProgess);

            // Append
            El.Meal.Status.appendChild(elDivRow);
        })
    },

    //#region MealList
    renderList() {
        El.Meal.List.innerHTML = '';

        // Meal List By Date
        const viewdate = El.Meal.InputDate.value;
        const mealsFilter = dataTemp.meals.getMealsByDate(viewdate)

        // Render Meal List
        mealsFilter.forEach(meal => {

            // Add To List
            const elDivItem = this.createMealItem(meal);
            El.Meal.List.appendChild(elDivItem);
        });
    },

    //#region MealItem
    createMealItem(meal) {
        // Data of Meal
        const mealInfo = dataTemp.getMealInfo(meal.foodId, meal.amount);
        const macroByDate = dataTemp.getNutritionMacroByDate(El.Meal.InputDate.value);  
        const kcalPercent = mealInfo.kcal * 100 / macroByDate.kcal;

        // Div Item
        const elDiv = document.createElement('div');
        elDiv.className = 'flex-col underline';

        // Div Header
        const elHeader = document.createElement('div');
        elHeader.className = 'flex-row';

        // Button Edit
        const elButtonEdit = document.createElement('button');
        elButtonEdit.className = 'button-icon';
        elButtonEdit.textContent = '≡';
        elHeader.appendChild(elButtonEdit);

        // Name
        const elName = document.createElement('p');
        elName.className = 'label';
        elName.textContent = `${mealInfo.foodName} (${mealInfo.amount} ${mealInfo.unit})`;
        elHeader.appendChild(elName);

        // Kcal
        const elKcal = document.createElement('p');
        elKcal.textContent = `${mealInfo.kcal.toFixed(0)} kcal`;
        elHeader.appendChild(elKcal);

        // Append Header
        elDiv.appendChild(elHeader);

        // Div Detail
        const elDivDetail = document.createElement('div');
        elDivDetail.className = 'flex-row';

        // Div Detail Macro
        const elDivDetailMacro = UI.RatioBarMacro(
            mealInfo.protein, mealInfo.carb, mealInfo.fat
        );
        elDivDetail.appendChild(elDivDetailMacro);

        // Div Detail Kcal Percent
        const elDivDetailKcalPercent = UI.ProgressBar("progress-kcal", null, kcalPercent)
        elDivDetail.appendChild(elDivDetailKcalPercent);

        // Add Div Detail To Div
        elDiv.appendChild(elDivDetail);

        // Click Edit Button
        elButtonEdit.addEventListener('click', () => {
            this.showModal(meal);
        })

        return elDiv;
    },

    //#region SelectCategory
    renderSelectCategory() {
        El.Meal.InputCategory.innerHTML = '';

        // Category List
        const categoryList = dataTemp.foods.categories;
        categoryList.forEach(category => {
            const elOption = document.createElement('option');
            elOption.value = category.id;
            elOption.textContent = category.name;
            El.Meal.InputCategory.appendChild(elOption);
        })
    },

    //#region SelectFood
    renderSelectFood(categoryId) {
        El.Meal.InputFood.innerHTML = '';

        // Food Filter List By Category
        const foodFilter = dataTemp.foods.getFoodsByCategoryId(categoryId);
        foodFilter.forEach(food => {
            const elOption = document.createElement('option');
            elOption.value = food.id;
            elOption.textContent = food.name;
            El.Meal.InputFood.appendChild(elOption);
        });
    },

    //#region ModalMacro
    renderModalMacro() {
        El.Meal.ModalMarco.innerHTML = '';

        // Calc
        const foodId = El.Meal.InputFood.value;
        const amount = El.Meal.InputAmount.value;
        const mealInfo = dataTemp.getMealInfo(foodId, amount);

        // Div Macro
        const elMarco = UI.MacroStatus(mealInfo);
        El.Meal.ModalMarco.appendChild(elMarco);
    },

    //#region MealModal
    showModal(meal) {
        El.Meal.Modal.style.display = 'block';

        // Search Food
        El.Meal.ModalSearchFoods.value = '';
        El.Meal.InputFoodSearch.innerHTML = '';

        // Select Food Category
        this.renderSelectCategory();

        if(meal) {
            // Meal Id Hidden
            El.Meal.InputId.value = meal.id;

            // Select Category
            const categoryId = dataTemp.getCategoryIdByMeal(meal);
            El.Meal.InputCategory.value = categoryId;

            // Select Food
            this.renderSelectFood(categoryId);
            El.Meal.InputFood.value = meal.foodId;

            // Meal Amount
            El.Meal.InputAmount.value = meal.amount;

            // Show Macro in Modal
            this.renderModalMacro();

            // Button
            El.Meal.ModalTake.style.display = 'none';
            El.Meal.ModalDelete.style.display = 'block';
            El.Meal.ModalUpdate.style.display = 'block';

        } else {
            // Meal Id Default
            El.Meal.InputId.value = 'id';

            // Select Category Unknown
            El.Meal.InputCategory.value = 'id';

            // Select Food Unknown
            this.renderSelectFood('id');
            El.Meal.InputFood.value = 'id';

            // Show Macro in Modal
            this.renderModalMacro();

            // Meal Amount
            El.Meal.InputAmount.value = 1;

            // Button
            El.Meal.ModalTake.style.display = 'block';
            El.Meal.ModalDelete.style.display = 'none';
            El.Meal.ModalUpdate.style.display = 'none';
        }
    },

    //#region MealListen
    listen() {
        // Input Date
        El.Meal.InputDate.addEventListener('change', () => {
            this.renderStatus();
            this.renderList();
        });
        
        // Add Meal
        El.Meal.ButtonAdd.addEventListener('click', () => {
            this.showModal(null);
        });

        // Select Category
        El.Meal.InputCategory.addEventListener('change', (e) => {
            this.renderSelectFood(e.target.value);
            this.renderModalMacro();
        });

        // Select Food
        El.Meal.InputFood.addEventListener('change', () => {
            this.renderModalMacro();
        });

        // Change Input Amount
        El.Meal.InputAmount.addEventListener('change', () => {
            this.renderModalMacro();
        })

        // Click Take Button
        El.Meal.ModalTake.addEventListener('click', () => {
            const foodId = El.Meal.InputFood.value;
            const amount = El.Meal.InputAmount.value;
            const newMeal = new Meal(Helper.UUID(), foodId, amount, new Date());
            dataTemp.meals.addMeal(newMeal)
            dataTemp.save();
            this.renderList();
            this.renderStatus();
            ChartUI.renderChartKcal();
            El.Meal.Modal.style.display = 'none';
        });

        // Click Update Button
        El.Meal.ModalUpdate.addEventListener('click', () => {
            const mealId = El.Meal.InputId.value;
            const foodId = El.Meal.InputFood.value;
            const amount = El.Meal.InputAmount.value;
            dataTemp.meals.updateMeal(mealId, foodId, amount)
            dataTemp.save();
            this.renderList();
            this.renderStatus();
            ChartUI.renderChartKcal();
            El.Meal.Modal.style.display = 'none'
        });

        // Click Delete Button
        El.Meal.ModalDelete.addEventListener('click', () => {
            if (!confirm("Delete This Meal")) return;
            const mealId = El.Meal.InputId.value;
            dataTemp.meals.deleteMealById(mealId);
            dataTemp.save();
            this.renderList();
            this.renderStatus();
            ChartUI.renderChartKcal();
            El.Meal.Modal.style.display = 'none';
        });

        // Click Cancel Button
        El.Meal.ModalCancel.addEventListener('click', () => {
            El.Meal.Modal.style.display = 'none'
        });

        // Modal Search Foods
        El.Meal.ModalSearchFoods.addEventListener('change', (e) => {
            const foodsFindList = dataTemp.foods.getFoodsByName(e.target.value);
            El.Meal.InputFoodSearch.innerHTML = '';
            foodsFindList.forEach(food => {
                const elOption = document.createElement('option');
                elOption.value = food.id;
                elOption.textContent = food.name;
                El.Meal.InputFoodSearch.appendChild(elOption);
            });

            const foodFind = foodsFindList[0] || null;

            if (!foodFind) return;
            El.Meal.InputCategory.value = foodFind.categoryId;
            this.renderSelectFood(foodFind.categoryId);
            El.Meal.InputFood.value = foodFind.id;
            this.renderModalMacro();
            
            El.Meal.ModalSearchFoods.value = '';
        })

        // Modal Result Food
        El.Meal.InputFoodSearch.addEventListener('change', (e) => {
            const foodId = e.target.value;
            const foodFind = dataTemp.foods.getFoodById(foodId);
            El.Meal.InputCategory.value = foodFind.categoryId;
            this.renderSelectFood(foodFind.categoryId);
            El.Meal.InputFood.value = foodFind.id;
            this.renderModalMacro();
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    MealUI.renderStatus();
    MealUI.renderList();
    MealUI.listen();
})
